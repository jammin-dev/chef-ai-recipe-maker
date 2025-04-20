import json
from typing import Dict

import requests
from sqlmodel import Session

from app.core.config import settings
from app.models import Direction, Ingredient, Recipe, User
from app.schemas.recipe_schemas import RecipeCreate

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_API_KEY = settings.OPENAI_API_KEY


class RecipeAIService:
    """
    All things recipe <-> AI.
    Handles:
      • prompt building
      • language handling (input + output)
      • OpenAI calls
      • persisting the returned JSON
    """

    LANGUAGE_META = {
        "en": {"name": "English", "units": "imperial"},
        "fr-FR": {"name": "French", "units": "metric"},
        "fr": {"name": "French", "units": "metric"},
        "es": {"name": "Spanish", "units": "metric"},
        # Extend freely
    }

    _PROMPT_TEMPLATES = {
        "english": (
            "Generate a detailed cooking recipe in valid JSON format. "
            "Use {units} units for measurements. "
            "The request is: {request}"
        ),
        "french": (
            "Génère une recette de cuisine détaillée au format JSON valide. "
            "Utilise des unités {units} pour les quantités. "
            "La demande est : {request}"
        ),
    }

    _PRE_PROMPT_TEMPLATES = {
        "english": (
            "You’re a cheerful and friendly assistant—think of yourself as the user’s upbeat cooking buddy! 😄 "
            "Use a warm, casual tone with a dash of humor in everything you say. Keep it fun and approachable, like chatting with a friend. "
            "Always return your response using the function call format, making sure to fill in all the required text fields. "
            "Let’s cook up something delightful together!"
        ),
        "french": (
            "Tu es un assistant joyeux et bienveillant — le super copain de cuisine de l’utilisateur ! 😄 "
            "Adopte toujours un ton chaleureux, détendu et plein d’humour, comme si tu parlais à un ami. "
            "Réponds toujours en utilisant l’appel de fonction, en remplissant toutes les valeurs textuelles requises. "
            "Allez, on va cuisiner des merveilles ensemble !"
        ),
    }

    _recipe_function = {
        "name": "create_recipe",
        "description": "Generate a detailed recipe in JSON format",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "description": {"type": "string"},
                "preparation_time": {"type": "integer"},
                "cook_time": {"type": "integer"},
                "serves": {"type": "integer"},
                "ingredients": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "content": {"type": "string"},
                            "index": {"type": "integer"},
                        },
                        "required": ["content", "index"],
                    },
                },
                "directions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "content": {"type": "string"},
                            "index": {"type": "integer"},
                        },
                        "required": ["content", "index"],
                    },
                },
            },
            "required": [
                "title",
                "description",
                "preparation_time",
                "cook_time",
                "serves",
                "ingredients",
                "directions",
            ],
        },
    }

    def generate_recipe(
        self,
        *,
        session: Session,
        current_user: User,
        user_input: str,
        user_lang: str = "en",
    ) -> Recipe:
        """
        Create a recipe via OpenAI, store and return it.
        """
        meta = self.LANGUAGE_META.get(user_lang, {"name": "English", "units": "imperial"})
        pre_prompt = self._build_pre_prompt(user_input, meta["name"])
        final_prompt = self._build_prompt(user_input, meta["name"], meta["units"])

        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system",
                    "content": pre_prompt,
                },
                {"role": "user", "content": final_prompt},
            ],
            "functions": [self._recipe_function],
            "function_call": {"name": "create_recipe"},
        }

        arguments = self._call_openai(payload)
        recipe_create = RecipeCreate(**arguments)
        return self._persist_recipe(session, current_user, recipe_create)


    @classmethod
    def _build_prompt(cls, request: str, output_lang: str, unit_system: str) -> str:
        lang_key = output_lang.lower()
        prompt_template = cls._PROMPT_TEMPLATES.get(lang_key, cls._PROMPT_TEMPLATES["english"])
        return prompt_template.format(request=request, units=unit_system)

    @classmethod
    def _build_pre_prompt(cls, request: str, output_lang: str) -> str:
        lang_key = output_lang.lower()
        return cls._PRE_PROMPT_TEMPLATES.get(lang_key, cls._PRE_PROMPT_TEMPLATES["english"])

    @staticmethod
    def _headers() -> Dict[str, str]:
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}",
        }

    def _call_openai(self, payload: Dict) -> Dict:
        resp = requests.post(OPENAI_URL, json=payload, headers=self._headers())
        resp.raise_for_status()
        try:
            fn_call = resp.json()["choices"][0]["message"]["function_call"]
            print(f"OpenAI response: {fn_call}")
            return json.loads(fn_call["arguments"])
        except Exception:
            raise RuntimeError("Failed to extract recipe JSON from OpenAI response")

    @staticmethod
    def _persist_recipe(
        session: Session, current_user: User, recipe_create: RecipeCreate
    ) -> Recipe:
        recipe_data = recipe_create.model_dump(exclude={"ingredients", "directions"})
        recipe = Recipe.model_validate(recipe_data, update={"user_id": current_user.id})

        try:
            session.add(recipe)
            session.commit()
            session.refresh(recipe)

            for ing in recipe_create.ingredients:
                session.add(
                    Ingredient.model_validate(ing, update={"recipe_id": recipe.id})
                )
            for direc in recipe_create.directions:
                session.add(
                    Direction.model_validate(direc, update={"recipe_id": recipe.id})
                )

            session.commit()
            session.refresh(recipe)
            return recipe
        except Exception as exc:
            session.rollback()
            raise RuntimeError(f"Recipe creation failed: {exc}") from exc

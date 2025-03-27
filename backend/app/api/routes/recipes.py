#test
import json
import uuid
import requests
from typing import Any, Annotated

from fastapi import Body, APIRouter, HTTPException
from sqlmodel import func, select, delete

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.models import (
    Direction,
    DirectionCreate,
    Ingredient,
    IngredientCreate,
    Recipe,
    RecipeCreate,
    RecipePublic,
    RecipesPublic,
    RecipeUpdate,
    Message,
    User,
)

# Define your OpenAI constants (consider storing these securely)
OPENAI_API_KEY = settings.OPENAI_API_KEY
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/", response_model=RecipesPublic)
def read_recipes(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve recipes.
    """
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Recipe)
        count = session.exec(count_statement).one()
        statement = select(Recipe).offset(skip).limit(limit)
        recipes = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Recipe)
            .where(Recipe.user_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Recipe)
            .where(Recipe.user_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        recipes = session.exec(statement).all()

    return RecipesPublic(data=recipes, count=count)


@router.get("/{id}", response_model=RecipePublic)
def read_recipe(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get recipe by ID.
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and (recipe.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return recipe


@router.post("/", response_model=RecipePublic)
def create_recipe(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    recipe_in: Annotated[
        RecipeCreate,
        Body(
            openapi_examples={
                "simple_recipe": {
                    "summary": "A basic recipe",
                    "description": "A simple recipe with minimal ingredients and directions.",
                    "value": {
                        "title": "Pancakes",
                        "description": "Fluffy homemade pancakes",
                        "preparation_time": 10,
                        "cook_time": 5,
                        "serves": 2,
                        "is_favorite": False,
                        "ingredients": [
                            {"index": 1, "content": "1 cup flour"},
                            {"index": 2, "content": "1 cup milk"},
                            {"index": 3, "content": "1 egg"},
                        ],
                        "directions": [
                            {"index": 1, "content": "Mix ingredients"},
                            {"index": 2, "content": "Cook on a pan until golden"},
                        ],
                    },
                }
            },
        ),
    ],
) -> Any:
    """
    Create new item.
    """
    # 1. Exclude nested lists not present in the DB model
    recipe_in_dict = recipe_in.model_dump(exclude={"ingredients", "directions"})

    # 2. Create the main Recipe, injecting user_id
    recipe = Recipe.model_validate(recipe_in_dict, update={"user_id": current_user.id})
    try:
        session.add(recipe)
        session.commit()
        session.refresh(recipe)

        if recipe_in.ingredients:
            for ingredient_in in recipe_in.ingredients:
                ingredient = Ingredient.model_validate(ingredient_in, update={"recipe_id": recipe.id})
                session.add(ingredient)

        if recipe_in.directions:
            for direction_in in recipe_in.directions:
                direction = Direction.model_validate(direction_in, update={"recipe_id": recipe.id})
                session.add(direction)

        session.commit()  # Commit everything only if all inserts succeed
        session.refresh(recipe)
        return recipe
    except Exception as e:
        session.rollback()  # Roll back everything if an error occurs
        raise e  # Rethrow the exception for debugging


@router.put("/{id}", response_model=RecipePublic)
def update_recipe(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    recipe_in: RecipeUpdate,
) -> RecipePublic:
    """
    Update a recipe and its ingredients/directions with transaction safety.
    """
    try:
        # 1. Fetch the existing recipe
        recipe = session.get(Recipe, id)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")

        # 2. Ensure user has permission
        if not current_user.is_superuser and recipe.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        # 3. Convert input to a dictionary and exclude unset values (partial update)
        update_data = recipe_in.model_dump(exclude_unset=True)
        ingredients_data = update_data.pop("ingredients", None)
        directions_data = update_data.pop("directions", None)

        # Update simple fields on the recipe
        for key, value in update_data.items():
            setattr(recipe, key, value)
        session.add(recipe)
        session.flush()  # Ensure changes are applied before updating relationships

        # 4. Update related Ingredients if provided
        if ingredients_data is not None:
            # Delete existing ingredients using a delete statement
            stmt = delete(Ingredient).where(Ingredient.recipe_id == recipe.id)
            session.exec(stmt)
            session.commit()  # Ensure deletion before inserting new ones

            # Insert new ingredients
            for ingredient_in in ingredients_data:
                ingredient = Ingredient.model_validate(ingredient_in, update={"recipe_id": recipe.id})
                session.add(ingredient)

        # 5. Update related Directions if provided
        if directions_data is not None:
            # Delete existing directions using a delete statement
            stmt = delete(Direction).where(Direction.recipe_id == recipe.id)
            session.exec(stmt)
            session.commit()

            # Insert new directions
            for direction_in in directions_data:
                direction = Direction.model_validate(direction_in, update={"recipe_id": recipe.id})
                session.add(direction)

        # 6. Commit all changes
        session.commit()
        session.refresh(recipe)

        # Return the updated recipe in the public schema
        return RecipePublic.model_validate(recipe)

    except Exception as e:
        session.rollback()  # Prevent partial commits if an error occurs
        raise e  # Logs the error for debugging


@router.delete("/{id}")
def delete_recipe(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an recipe.
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and (recipe.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(recipe)
    session.commit()
    return Message(message="Recipe deleted successfully")


def build_prompt(user_input: str) -> str:
    """
    Replicates the front-end buildPrompt function in Python.
    """
    return f"""
        Créez une recette de cuisine très détaillée au format JSON si et seulement si elle est en rapport avec la cuisine. 
        Sinon, renvoyez `null`.

        La recette doit être : {user_input}

        Structure JSON attendue :

        {{
        "title": "Titre de la recette (str)",
        "description": "Description de la recette (str, max 200 caractères)",
        "preparation_time": "Temps de préparation en minutes (int)",
        "cook_time": "Temps de cuisson en minutes (int, 0 if not applicable)",
        "serves": "Nombre de portions (int)",
        "ingredients": [
            {{ "content": "Nom de l'ingrédient + quantité", "index": 0 }},
            ...
        ],
        "directions": [
            {{ "content": "Instruction détaillée + quantité", "index": 0 }},
            ...
        ]
        }}

        Renvoyez uniquement le JSON sans aucun texte additionnel.
    """

# To apply rate limite https://chatgpt.com/c/67e587c2-a084-8003-a59e-84f0c7329d6b
@router.post("/generate", response_model=RecipePublic)
def generate_recipe(
    *,
    session: SessionDep,
    user_input: str = Body(..., embed=True)
) -> RecipePublic:
    """
    Generate a recipe using OpenAI and create it in the DB.
    The frontend sends a prompt; the backend calls OpenAI,
    parses the JSON, creates the recipe using the same logic as create_recipe,
    and returns a RecipePublic.
    """
    stmt = select(User).where(User.email == "guest@jammin-dev.com")
    current_user = session.exec(stmt).first()
    # Use the build_prompt function to construct the detailed prompt
    final_prompt = build_prompt(user_input)
    
    # Build the OpenAI payload with the adapted prompt
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": final_prompt},
        ],
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}",
    }
    
    # 2. Call the OpenAI API
    response = requests.post(OPENAI_URL, json=payload, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="OpenAI API call failed")
    
    data = response.json()
    ai_response = data["choices"][0]["message"]["content"].strip()
    
    # 3. Clean and parse the JSON from the AI response
    cleaned_response = ai_response.replace("```json", "").replace("```", "")
    try:
        recipe_data = json.loads(cleaned_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to parse recipe JSON from OpenAI")
    
    # 4. Validate and create a RecipeCreate instance
    try:
        recipe_create = RecipeCreate(**recipe_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Invalid recipe data format")
    
    # 5. Use the same logic as in your create_recipe endpoint to store the recipe.
    # Exclude nested lists not present in the DB model.
    recipe_in_dict = recipe_create.model_dump(exclude={"ingredients", "directions"})
    recipe = Recipe.model_validate(recipe_in_dict, update={"user_id": current_user.id})
    
    try:
        session.add(recipe)
        session.commit()
        session.refresh(recipe)
        
        # Add ingredients if any
        if recipe_create.ingredients:
            for ingredient_in in recipe_create.ingredients:
                ingredient = Ingredient.model_validate(
                    ingredient_in, update={"recipe_id": recipe.id}
                )
                session.add(ingredient)
        
        # Add directions if any
        if recipe_create.directions:
            for direction_in in recipe_create.directions:
                direction = Direction.model_validate(
                    direction_in, update={"recipe_id": recipe.id}
                )
                session.add(direction)
        
        session.commit()  # Commit all inserts together
        session.refresh(recipe)
        return recipe
    
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Recipe creation failed: {str(e)}")


def build_improvement_prompt(user_input: str, original_recipe: Recipe) -> str:
    """
    Replicates your front-end prompt to improve a given recipe.
    We embed the original recipe and user instructions.
    """
    return f"""
    Améliore la recette suivante au format JSON

    La recette originale est : {json.dumps({
        "title": original_recipe.title,
        "description": original_recipe.description,
        "preparation_time": original_recipe.preparation_time,
        "cook_time": original_recipe.cook_time,
        "serves": original_recipe.serves,
        "ingredients": [{"content": ing.content, "index": ing.index} for ing in original_recipe.ingredients],
        "directions": [{"content": dir.content, "index": dir.index} for dir in original_recipe.directions],
    }, ensure_ascii=False)}

    L'amélioration doit être : {user_input}

    Exemple de structure JSON attendue :

    {{
      "title": "Titre de la recette (str)",
      "description": "Description de la recette (str, max 200 caractères)",
      "preparation_time": "Temps de préparation en minutes (int)",
      "cook_time": "Temps de cuisson en minutes (int, 0 if not applicable)",
      "serves": "Nombre de portions (int)",
      "ingredients": [
        {{ "content": "Nom de l'ingrédient, quantité", "index": 0 }},
        ...
      ],
      "directions": [
        {{ "content": "Instruction détaillée, quantité", "index": 0 }},
        ...
      ]
    }}

    Renvoie exactement les mêmes champs que la recette originale,
    mais avec les modifications apportées, au format JSON.

    Renvoyez uniquement le JSON brut.
    """


@router.post("/{id}/improve",)
def improve_recipe(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    user_input: str = Body(..., embed=True),
):
    """
    Improve (modify) an existing recipe with user instructions and AI assistance.
    1. Fetch the original recipe.
    2. Build a prompt with the original recipe + user instructions.
    3. Send prompt to OpenAI, parse the improved recipe JSON.
    4. Update the recipe in the DB.
    5. Return the updated recipe in the public schema.
    """
    # 1. Fetch the existing recipe
    original_recipe = session.get(Recipe, id)
    if not original_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # Make sure the user has permission
    if not current_user.is_superuser and original_recipe.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # 2. Build the improvement prompt
    prompt = build_improvement_prompt(user_input, original_recipe)

    # 3. Prepare and send to OpenAI
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}",
    }
    response = requests.post(OPENAI_URL, json=payload, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="OpenAI API call failed")

    data = response.json()
    ai_response = data["choices"][0]["message"]["content"].strip()
    
    # 4. Parse the returned JSON (the improved recipe)
    cleaned_response = ai_response.replace("```json", "").replace("```", "")
    try:
        improved_data = json.loads(cleaned_response)
        improved_data["id"] = original_recipe.id
        improved_data["is_favorite"] = original_recipe.is_favorite
        improved_data["is_improved"] = True
        return improved_data
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse improved recipe JSON from OpenAI response."
        )

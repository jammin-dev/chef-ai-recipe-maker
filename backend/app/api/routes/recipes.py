# api/routers/recipes.py
from typing import Any, Annotated
import uuid

from fastapi import APIRouter, Body, HTTPException, Request
from sqlmodel import Session, delete, func, select

from app.api.deps import CurrentUser, SessionDep
from app.core.rate_limit import limiter
from app.models import Direction, Ingredient, Recipe, User
from app.schemas.recipe_schemas import (
    RecipeCreate,
    RecipePublic,
    RecipeUpdate,
    RecipesPublic,
)
from app.schemas.schemas import Message
from app.services.recipe_services import RecipeAIService

router = APIRouter(prefix="/recipes", tags=["recipes"])
ai_service = RecipeAIService()  # can be reused across requests


# --------------------------------------------------------------------------- #
#                                 CRUD routes                                 #
# --------------------------------------------------------------------------- #
@router.get("/", response_model=RecipesPublic)
def read_recipes(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve recipes (owns only, unless superuser).
    """
    base_stmt = select(Recipe)
    if not current_user.is_superuser:
        base_stmt = base_stmt.where(Recipe.user_id == current_user.id)

    count = session.exec(
        select(func.count()).select_from(base_stmt.subquery())
    ).one()

    recipes = session.exec(base_stmt.offset(skip).limit(limit)).all()
    return RecipesPublic(data=recipes, count=count)


@router.get("/{id}", response_model=RecipePublic)
def read_recipe(
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
) -> Any:
    """
    Get a recipe by UUID.
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and recipe.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
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
                    "value": {
                        "title": "Pancakes",
                        "description": "Fluffy homemade pancakes",
                        "preparation_time": 10,
                        "cook_time": 5,
                        "serves": 2,
                        "is_favorite": False,
                        "ingredients": [
                            {"index": 1, "content": "1 cup flour"},
                            {"index": 2, "content": "1 cup milk"},
                            {"index": 3, "content": "1 egg"},
                        ],
                        "directions": [
                            {"index": 1, "content": "Mix ingredients"},
                            {"index": 2, "content": "Cook until golden"},
                        ],
                    },
                }
            }
        ),
    ],
) -> Any:
    """
    Create a recipe (manual, not AI).
    """
    recipe_data = recipe_in.model_dump(exclude={"ingredients", "directions"})
    recipe = Recipe.model_validate(recipe_data, update={"user_id": current_user.id})

    try:
        session.add(recipe)
        session.commit()
        session.refresh(recipe)

        for ing in recipe_in.ingredients or []:
            session.add(
                Ingredient.model_validate(ing, update={"recipe_id": recipe.id})
            )
        for direc in recipe_in.directions or []:
            session.add(
                Direction.model_validate(direc, update={"recipe_id": recipe.id})
            )

        session.commit()
        session.refresh(recipe)
        return recipe
    except Exception:
        session.rollback()
        raise


@router.put("/{id}", response_model=RecipePublic)
def update_recipe(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    recipe_in: RecipeUpdate,
) -> RecipePublic:
    """
    Update an existing recipe (ingredients & directions fully replaced when provided).
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and recipe.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    data = recipe_in.model_dump(exclude_unset=True)
    ingredients_data = data.pop("ingredients", None)
    directions_data = data.pop("directions", None)

    for field, value in data.items():
        setattr(recipe, field, value)
    session.flush()

    if ingredients_data is not None:
        session.exec(delete(Ingredient).where(Ingredient.recipe_id == recipe.id))
        for ing in ingredients_data:
            session.add(
                Ingredient.model_validate(ing, update={"recipe_id": recipe.id})
            )

    if directions_data is not None:
        session.exec(delete(Direction).where(Direction.recipe_id == recipe.id))
        for dir_ in directions_data:
            session.add(
                Direction.model_validate(dir_, update={"recipe_id": recipe.id})
            )

    session.commit()
    session.refresh(recipe)
    return recipe


@router.delete("/{id}", response_model=Message)
def delete_recipe(
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
) -> Message:
    """
    Delete a recipe.
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and recipe.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(recipe)
    session.commit()
    return Message(message="Recipe deleted successfully")


# --------------------------------------------------------------------------- #
#                              AI‑generated recipe                            #
# --------------------------------------------------------------------------- #
@router.post("/generate", response_model=RecipePublic)
def generate_recipe(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    user_input: str = Body(..., embed=True),
    language: str =  Body(..., embed=True),
) -> RecipePublic:
    """
    Generate a recipe via OpenAI, storing the result.
    """
    return ai_service.generate_recipe(
        session=session,
        current_user=current_user,
        user_input=user_input,
        user_lang=language,
    )


@router.post("/generate-public", response_model=RecipePublic)
@limiter.limit("100/day")
def generate_recipe_public(
    *,
    request: Request,
    session: SessionDep,
    user_input: str = Body(..., embed=True),
    language: str = Body("fr", embed=True),
) -> RecipePublic:
    """
    Same as /generate but always under the guest account.
    """
    guest = session.exec(
        select(User).where(User.email == "guest@jammin-dev.com")
    ).first()
    return ai_service.generate_recipe(
        session=session,
        current_user=guest,
        user_input=user_input,
        user_lang=language,
    )

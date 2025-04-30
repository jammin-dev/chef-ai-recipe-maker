import datetime
import uuid

from sqlmodel import Field, Relationship, SQLModel  # noqa: F401

from app.schemas.recipe_schemas import DirectionBase, IngredientBase, RecipeBase
from app.schemas.user_schemas import UserBase


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    deleted_at: datetime.datetime | None = Field(default=None, nullable=True)

    recipes: list["Recipe"] = Relationship(back_populates="user", cascade_delete=True)


class Ingredient(IngredientBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    index: int
    content: str | None = None

    recipe_id: uuid.UUID = Field(
        foreign_key="recipe.id", nullable=False, ondelete="CASCADE"
    )
    recipe: "Recipe" = Relationship(back_populates="ingredients")


class Direction(DirectionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    index: int
    content: str | None = None

    recipe_id: uuid.UUID = Field(
        foreign_key="recipe.id", nullable=False, ondelete="CASCADE"
    )
    recipe: "Recipe" = Relationship(back_populates="directions")


class Recipe(RecipeBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    user: User = Relationship(back_populates="recipes")

    ingredients: list[Ingredient] = Relationship(
        back_populates="recipe", cascade_delete=True
    )
    directions: list[Direction] = Relationship(
        back_populates="recipe", cascade_delete=True
    )

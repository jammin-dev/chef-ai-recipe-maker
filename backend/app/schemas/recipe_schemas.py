import datetime
import uuid

from app.schemas.user_schemas import UserPublic
from sqlmodel import Field, SQLModel

class IngredientBase(SQLModel):
    index: int
    content: str | None = None


class IngredientCreate(IngredientBase):
    index: int
    content: str | None = None


class IngredientPublic(IngredientBase):
    id: uuid.UUID
    index: int
    content: str | None = None


class DirectionBase(SQLModel):
    index: int
    content: str | None = None


class DirectionCreate(DirectionBase):
    index: int
    content: str | None = None


class DirectionPublic(DirectionBase):
    id: uuid.UUID
    index: int
    content: str | None = None

# Shared properties
class RecipeBase(SQLModel):
    title: str = Field(max_length=255)
    description: str = Field(max_length=500)
    preparation_time: int
    cook_time: int | None = None
    serves: int
    is_favorite: bool = False

# Properties to receive on item creation
class RecipeCreate(RecipeBase):
    ingredients: list[IngredientCreate] = []
    directions: list[DirectionCreate] = []

# Properties to receive on item update
class RecipeUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=500)
    preparation_time: int | None  = None
    cook_time: int | None = None
    serves: int | None = None
    is_favorite: bool | None = None
    ingredients: list[IngredientCreate] | None = None
    directions: list[DirectionCreate] | None = None

# Properties to return via API, id is always required
class RecipePublic(RecipeBase):
    id: uuid.UUID
    ingredients: list[IngredientPublic] = []
    directions: list[DirectionPublic] = []
    created_at: datetime.datetime
    updated_at: datetime.datetime
    user: UserPublic | None = None

class RecipesPublic(SQLModel):
    data: list[RecipePublic]
    count: int
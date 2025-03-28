// src/contexts/RecipeContext.tsx
import { createContext } from "react";
// import { Recipe } from "@/interfaces";
import {
  RecipeCreate,
  RecipeUpdate,
  RecipesPublic,
  RecipePublic,
} from "@/client";

interface RecipeContextValue {
  recipes: RecipesPublic | [];
  setRecipes: (recipes: RecipesPublic) => void;
  loading: boolean;
  addRecipe: (recipe: RecipeCreate) => RecipePublic;
  updateRecipe: (recipe: RecipeUpdate) => RecipePublic;
  toggleFavorite: (id: string) => void;
  deleteRecipe: (id: string) => void;
}

// Create the context with default values and throw an error if the consumer doesn't provide a value
const RecipeContext = createContext<RecipeContextValue>({
  recipes: [],
  setRecipes: () => {
    throw new Error("setRecipes function not implemented");
  },
  loading: false,
  addRecipe: (_recipe: RecipeCreate) => {
    throw new Error("addRecipe function not implemented");
  },
  updateRecipe: (_recipe: RecipeUpdate) => {
    throw new Error("updateRecipe function not implemented");
  },
  toggleFavorite: (_id: string) => {
    throw new Error("toggleFavorite function not implemented");
  },
  deleteRecipe: (_id: string) => {
    throw new Error("deleteRecipe function not implemented");
  },
});

export default RecipeContext;

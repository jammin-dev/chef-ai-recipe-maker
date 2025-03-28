// src/hooks/use-recipe.ts
import { useContext } from "react";

import RecipeContext from "@/contexts/RecipeContext";

export function useRecipe() {
  return useContext(RecipeContext);
}

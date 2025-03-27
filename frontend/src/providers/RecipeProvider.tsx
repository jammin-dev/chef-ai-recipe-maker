// src/providers/RecipeProvider.tsx
import { useState, useEffect, ReactNode } from "react";

import RecipeContext from "@/contexts/RecipeContext";
import { Recipe } from "@/interfaces";
import {
  RecipeCreate,
  RecipePublic,
  RecipesPublic,
  RecipesService,
  RecipeUpdate,
  RecipesUpdateRecipeData,
} from "@/client";
import { useAuth } from "@/hooks/use-auth";

// --------------------------------------
// 1) Define the shape of our context
// --------------------------------------
interface RecipeContextType {
  recipes: RecipePublic[];
  loading: boolean;
  addRecipe: (recipe: RecipeCreate) => RecipePublic;
  updateRecipe: (recipe: RecipesUpdateRecipeData) => RecipePublic;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

interface RecipeProviderProps {
  children: ReactNode;
}

export function RecipeProvider({ children }: RecipeProviderProps): JSX.Element {
  // --------------------------------------
  // 2) State (with lazy initializer)
  // --------------------------------------
  const [recipes, setRecipes] = useState<RecipePublic[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { isAuthenticated } = useAuth();

  // --------------------------------------
  // 3) Load recipes on mount
  // --------------------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await RecipesService.readRecipes();
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchRecipes();
  }, []);

  // --------------------------------------
  // 5) Context methods
  // --------------------------------------
  const addRecipe = async (recipe: RecipeCreate): Promise<RecipePublic> => {
    const recipeToAdd = await RecipesService.createRecipe({
      requestBody: recipe,
    });
    setRecipes((prev) => [...prev, recipeToAdd]);
    return recipeToAdd;
  };

  const updateRecipe = async (
    recipe: RecipesUpdateRecipeData
  ): Promise<RecipePublic> => {
    const updatedRecipe = await RecipesService.updateRecipe({
      id: recipe.id,
      requestBody: recipe,
    });
    setRecipes((prev) => {
      const index = prev.findIndex((r) => r.id === recipe.id);
      if (index === -1) return prev;
      return [...prev.slice(0, index), recipe, ...prev.slice(index + 1)];
    });
    return updatedRecipe;
  };

  const deleteRecipe = async (id: string): Promise<void> => {
    try {
      await RecipesService.deleteRecipe({ id });
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    try {
      // Find the recipe in the current list
      const recipeToToggle = recipes.find((r) => r.id === id);
      if (!recipeToToggle) return;

      const updatedFavorite = !recipeToToggle.is_favorite;

      const updatedRecipe = await RecipesService.updateRecipe({
        id,
        requestBody: { is_favorite: updatedFavorite },
      });

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id
            ? { ...recipe, is_favorite: updatedRecipe.is_favorite }
            : recipe
        )
      );
    } catch (error) {
      console.error("Error toggling favorite recipe:", error);
    }
  };

  // --------------------------------------
  // 6) Provide the context
  // --------------------------------------
  const contextValue: RecipeContextType = {
    recipes,
    setRecipes,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
  };

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  );
}

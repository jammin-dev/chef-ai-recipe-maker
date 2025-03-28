// src/pages/RecipePage/ImproveRecipeDialog.tsx
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Recipe } from "@/interfaces";
import { useState } from "react";

import { RecipesService } from "@/client";

interface ImproveRecipeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipe: Recipe;
  setImprovedRecipe: () => void;
}

const ImproveRecipeDialog: React.FC<ImproveRecipeDialogProps> = ({
  open,
  setOpen,
  recipe,
  setImprovedRecipe,
  setImprove,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");

  const handleSend = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const improvedRecipe = await RecipesService.improveRecipe({
        id: recipe.id,
        requestBody: { user_input: userInput },
      });
      improvedRecipe.id = uuidv4();
      improvedRecipe.ingredients?.forEach((ing) => {
        ing.id = uuidv4();
      });
      improvedRecipe.directions?.forEach((ing) => {
        ing.id = uuidv4();
      });
      setUserInput("");
      setOpen(false);
      setIsLoading(false);
      setImprove(true);
      setImprovedRecipe(improvedRecipe);
    } catch (err: unknown) {
      console.error(err);
      // Try to parse known Axios error shape
      if (axios.isAxiosError(err)) {
        setError(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        console.error(String(err));
        setError("An error occurred, please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-1/2 h-1/2 sm:h-1/2 flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle>Improve Your Recipe</DialogTitle>
          <DialogDescription>
            Take your recipe to the next level by refining, adding, or reworking
            instructions, ingredients, and more.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center flex-1">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Textarea
                placeholder="e.g., 'Adjust the cooking time, add seasoning, or incorporate fresh herbs for extra flavor.'"
                className="h-full"
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>
          </>
        )}
        <DialogFooter>
          <Button type="button" onClick={handleSend} disabled={isLoading}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImproveRecipeDialog;

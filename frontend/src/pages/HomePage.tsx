// src/pages/HomePage.tsx
import { useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import TypingEffectTitle from "@/components/TypingEffectTitle";
import promptExamples from "@/prompt-example";
import { useNavigateTo } from "@/hooks/use-navigate-to";
import { useRecipe } from "@/hooks/use-recipe";
import { RecipesService } from "@/client";

function HomePage(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");

  const { t } = useTranslation();
  const { toRecipe } = useNavigateTo();
  const { setRecipes } = useRecipe();

  const handleSend = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const newRecipe = await RecipesService.generateRecipe({
        requestBody: { user_input: userInput },
      });
      setRecipes((recipes) => [...recipes, newRecipe]);
      toRecipe(newRecipe.id);
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

  const memorizedPromptExamples = useMemo(() => {
    return promptExamples.slice().sort(() => Math.random() - 0.5);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 flex-grow h-full w-full">
      <div className="flex flex-col flex-grow flex-1 justify-between w-full h-full px-8 md:min-w-md">
        <Label
          className={`flex flex-col items-center justify-center flex-grow ${
            isLoading ? "hidden" : ""
          }`}
        >
          <TypingEffectTitle promptExamples={memorizedPromptExamples} />
        </Label>
        {isLoading && (
          <Label className="flex flex-col items-center justify-center flex-grow">
            <TypingEffectTitle
              promptExamples={[
                t("We're preparing your recipe!"),
                t("Hang tight!"),
              ]}
            />
          </Label>
        )}
        <div className="flex flex-col gap-4">
          <Textarea
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t("input.placeholder.recipe_prompt")}
            className="resize-none min-h-[150px]"
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-500">
              {t("an error occurred, please try again.")}
            </p>
          )}
          <Button
            className="mx-auto flex justify-center items-center gap-2"
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {t("send")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

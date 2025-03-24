// src/pages/HomePage.tsx
import { useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import TypingEffectTitle from "@/components/TypingEffectTitle";

import { useNavigateTo } from "@/hooks/use-navigate-to";
import { useRecipe } from "@/hooks/use-recipe";
import { RecipesService } from "@/client";

import { promptExemples } from "@/prompt-examples";

function HomePage(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");

  const { i18n, t } = useTranslation();
  const { toRecipe } = useNavigateTo();
  const { setRecipes } = useRecipe();

  const lang = i18n.language || "en";

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
        setError(t("an error occurred, please try again."));
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const memorizedPromptExamples = useMemo(() => {
    return promptExemples[lang].slice().sort(() => Math.random() - 0.5);
  }, [lang]);

  return (
    <div className="flex flex-col items-center gap-5 flex-grow h-full w-full">
      <div className="flex flex-col flex-grow flex-1 w-full h-full md:min-w-md px-8">
        <Label
          className={`flex flex-col items-center justify-center flex-grow mt-[-50px] ${
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
            className="resize-none min-h-[100px]"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
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

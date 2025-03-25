// src/pages/RecipePage.tsx
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CircleX, Cross, GripVertical, LoaderCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypoH2, TypoH3 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DragAndDropList from "@/components/DragAndDrop";
import RecipeActions from "@/pages/RecipePage/RecipeActions";

import { useParams } from "react-router-dom";
import { useRecipe } from "@/hooks/use-recipe";
import { Direction, Ingredient, Recipe } from "@/interfaces";
import { useNavigateTo } from "@/hooks/use-navigate-to";
import ImproveRecipeDialog from "./ImproveRecipeDialog";

const RecipePage: React.FC = () => {
  const [edit, setEdit] = useState<boolean>(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [dirtyRecipe, setDirtyRecipe] = useState<Partial<Recipe>>({});
  const [improvedRecipe, setImprovedRecipe] = useState<Recipe | null>(null);

  let recipeToDisplay = currentRecipe;
  if (improvedRecipe) {
    recipeToDisplay = improvedRecipe;
  }
  const [openImproveRecipeDialog, setOpenImproveRecipeDialog] =
    useState<boolean>(false);

  // State for new ingredient/direction text input
  const [addIngredient, setAddIngredient] = useState<string>("");
  const [addDirection, setAddDirection] = useState<string>("");

  const { recipes } = useRecipe();
  const { toHome } = useNavigateTo();

  // React Router hook to get the passed-in recipe from location state
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const foundRecipe = recipes.find((r) => r.id === id);
    if (foundRecipe) {
      setCurrentRecipe(foundRecipe);
    } else {
      toHome();
    }
  }, [id, recipes, toHome]);

  // ------------------------------------------------------------------
  // Handlers for updating local "dirtyRecipe"
  // ------------------------------------------------------------------
  /**
   * Update entire ingredients array in the "dirtyRecipe".
   */
  const handleChangeIngredients = (ingredients: Ingredient[]) => {
    setDirtyRecipe((prev) => ({ ...prev, ingredients }));
  };

  /**
   * Update entire directions array in the "dirtyRecipe".
   */
  const handleChangeInstructions = (directions: Direction[]) => {
    setDirtyRecipe((prev) => ({ ...prev, directions }));
  };

  /**
   * Generic change handler for single fields (e.g., title, description, etc.).
   */
  const handleChange = (key: string, value: string | number) => {
    setDirtyRecipe((prev) => ({ ...prev, [key]: value }));
  };

  // ------------------------------------------------------------------
  // "Add Ingredient" and "Add Direction" logic
  // ------------------------------------------------------------------
  const onAddIngredient = (): void => {
    if (!addIngredient.trim()) return;

    const newIngredient: Ingredient = {
      content: addIngredient,
      id: uuidv4(),
      index: dirtyRecipe.ingredients ? dirtyRecipe.ingredients.length : 0,
    };

    setAddIngredient("");
    setDirtyRecipe((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients ?? []), newIngredient],
    }));
  };

  const onAddDirection = (): void => {
    if (!addDirection.trim()) return;

    const newDirection: Direction = {
      content: addDirection,
      id: uuidv4(),
      index: dirtyRecipe.directions ? dirtyRecipe.directions.length : 0,
    };

    setAddDirection("");
    setDirtyRecipe((prev) => ({
      ...prev,
      directions: [...(prev.directions ?? []), newDirection],
    }));
  };

  // CSS for the UL used in "DragAndDropList"
  const listStyle = `list-disc ${edit ? "flex flex-col gap-1" : "ml-6"}`;

  if (!currentRecipe) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin">
          <LoaderCircle />
        </span>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full max-w-6xl border-none ">
        <CardHeader className="flex flex-col gap-2">
          <RecipeActions
            recipe={recipeToDisplay}
            setRecipe={setCurrentRecipe}
            setEdit={setEdit}
            edit={edit}
            setDirtyRecipe={setDirtyRecipe}
            setOpenImproveRecipeDialog={setOpenImproveRecipeDialog}
            setImprovedRecipe={setImprovedRecipe}
            dirtyRecipe={dirtyRecipe}
          />
          <CardTitle>
            {edit ? (
              <Textarea
                className="text-2xl max-w-[500px]"
                value={dirtyRecipe.title ?? ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            ) : (
              <TypoH2>{recipeToDisplay?.title}</TypoH2>
            )}
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            {edit ? (
              <Textarea
                className="h-40"
                value={dirtyRecipe.description ?? ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            ) : (
              recipeToDisplay?.description
            )}

            {edit ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {"Preparation: "}
                  <Input
                    className="w-16"
                    value={dirtyRecipe.preparation_time ?? ""}
                    onChange={(e) =>
                      handleChange("preparation_time", e.target.value)
                    }
                  />
                  {"min"}
                </div>
                <div className="flex items-center gap-2">
                  {"Cooking: "}
                  <Input
                    className="w-16"
                    value={dirtyRecipe.cook_time ?? ""}
                    onChange={(e) => handleChange("cook_time", e.target.value)}
                  />
                  {"min"}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-16"
                    value={dirtyRecipe.serves ?? ""}
                    onChange={(e) => handleChange("serves", e.target.value)}
                  />
                  {"portions"}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <span>
                  Préparation : {recipeToDisplay?.preparation_time} min /
                  Cuisson : {recipeToDisplay?.cook_time} min
                </span>
                <span>Portions : {recipeToDisplay?.serves}</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-2 flex flex-col gap-3">
          <Separator className="my-1" />

          {/* ------------------ Ingredients Section ------------------ */}
          <div className="flex flex-col gap-3">
            <TypoH3>Ingrédients</TypoH3>
            {edit ? (
              <>
                <DragAndDropList
                  items={dirtyRecipe.ingredients ?? []}
                  setItems={handleChangeIngredients}
                  renderItem={(ingredient: Ingredient, index: number) => (
                    <div className="flex items-center gap-3 justify-center">
                      <GripVertical strokeWidth={1} />
                      <Textarea
                        value={ingredient.content}
                        onChange={(e) => {
                          const updatedIngredients = [
                            ...(dirtyRecipe.ingredients ?? []),
                          ];
                          updatedIngredients[index].content = e.target.value;
                          handleChangeIngredients(updatedIngredients);
                        }}
                        className="w-3/4"
                      />
                      <CircleX
                        strokeWidth={1}
                        className="cursor-pointer"
                        onClick={() => {
                          const updatedIngredients = (
                            dirtyRecipe.ingredients ?? []
                          ).filter((_, i) => i !== index);
                          handleChangeIngredients(updatedIngredients);
                        }}
                      />
                    </div>
                  )}
                />
                <div className="flex items-center justify-center gap-3">
                  <Cross
                    onClick={onAddIngredient}
                    strokeWidth={1}
                    className="cursor-pointer"
                  />
                  <Textarea
                    placeholder="Ajouter un ingrédient"
                    value={addIngredient}
                    onChange={(e) => setAddIngredient(e.target.value)}
                    className="w-3/4 h-32"
                  />
                </div>
              </>
            ) : (
              <ul className={listStyle}>
                {(recipeToDisplay?.ingredients ?? []).map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.content}</li>
                ))}
              </ul>
            )}
          </div>

          <Separator className="my-4" />

          {/* ------------------ Directions Section ------------------ */}
          <div className="flex flex-col gap-3">
            <TypoH3>Instructions</TypoH3>
            {edit ? (
              <>
                <DragAndDropList
                  items={dirtyRecipe.directions ?? []}
                  setItems={handleChangeInstructions}
                  renderItem={(direction: Direction, index: number) => (
                    <div className="flex items-center justify-center gap-3">
                      <GripVertical strokeWidth={1} />
                      <Textarea
                        value={direction.content}
                        onChange={(e) => {
                          const updatedDirections = [
                            ...(dirtyRecipe.directions ?? []),
                          ];
                          updatedDirections[index].content = e.target.value;
                          handleChangeInstructions(updatedDirections);
                        }}
                        className="w-3/4 h-48"
                      />
                      <CircleX
                        strokeWidth={1}
                        className="cursor-pointer"
                        onClick={() => {
                          const updatedInstructions = (
                            dirtyRecipe.directions ?? []
                          ).filter((_, i) => i !== index);
                          handleChangeInstructions(updatedInstructions);
                        }}
                      />
                    </div>
                  )}
                />
                <div className="flex items-center justify-center gap-3">
                  <Cross
                    onClick={onAddDirection}
                    strokeWidth={1}
                    className="cursor-pointer"
                  />
                  <Textarea
                    placeholder="Ajouter une instruction"
                    value={addDirection}
                    onChange={(e) => setAddDirection(e.target.value)}
                    className="w-3/4 h-60"
                  />
                </div>
              </>
            ) : (
              <ol className="flex flex-col gap-3">
                {(recipeToDisplay?.directions ?? []).map((direction, index) => (
                  <li key={direction.id}>
                    {index + 1}. {direction.content}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          {!edit && <p>Bon Appétit !</p>}
        </CardFooter>
      </Card>
      <ImproveRecipeDialog
        open={openImproveRecipeDialog}
        setOpen={setOpenImproveRecipeDialog}
        recipe={recipeToDisplay}
      />
    </>
  );
};

export default RecipePage;

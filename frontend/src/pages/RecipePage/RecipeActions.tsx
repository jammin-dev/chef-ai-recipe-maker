import {
  Star,
  ArrowLeft,
  Pencil,
  WandSparkles,
  Save,
  Trash2,
  Undo2,
} from "lucide-react";

import ActionButton from "@/pages/RecipePage/ActionButton";
import { useNavigateTo } from "@/hooks/use-navigate-to";
import { useRecipe } from "@/hooks/use-recipe";

import { Recipe } from "@/interfaces";

interface RecipeActionsProps {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
  setEdit: (value: boolean) => void;
  edit: boolean;
  setDirtyRecipe: (recipe: Recipe) => void;
  dirtyRecipe?: Recipe;
  setOpenImproveRecipeDialog: (value: boolean) => void;
}

const RecipeActions: React.FC<RecipeActionsProps> = ({
  recipe,
  setRecipe,
  setEdit,
  edit,
  setDirtyRecipe,
  dirtyRecipe,
  setOpenImproveRecipeDialog,
}) => {
  const { toHome } = useNavigateTo();
  const { toggleFavorite, deleteRecipe, updateRecipe } = useRecipe();

  // --- Handlers ---
  const handleDeleteRecipe = (id: string) => {
    deleteRecipe(id);
    toHome();
  };

  const handleUpdateRecipe = async () => {
    console.log(dirtyRecipe);
    if (dirtyRecipe) {
      setRecipe(dirtyRecipe);
      await updateRecipe(dirtyRecipe);
    }
    setEdit(false);
  };

  // --- Action Configs ---
  const editActions = [
    {
      icon: <Save strokeWidth={1.5} size={24} />,
      action: handleUpdateRecipe,
    },
    {
      icon: <Undo2 strokeWidth={1.5} size={24} />,
      action: () => setEdit(false),
    },
  ];

  const improveActions = [
    {
      icon: <Pencil strokeWidth={1.5} size={24} />,
      action: () => {
        setEdit(true);
        setDirtyRecipe(recipe);
      },
    },
    {
      icon: <Save strokeWidth={1.5} size={24} />,
      action: handleUpdateRecipe,
    },
    {
      icon: <Undo2 strokeWidth={1.5} size={24} />,
      action: () => setEdit(false),
    },
  ];

  const defaultActions = [
    {
      icon: recipe.is_favorite ? (
        <Star style={{ fill: "currentColor" }} />
      ) : (
        <Star strokeWidth={1.5} size={24} />
      ),
      action: () => toggleFavorite(recipe.id),
    },
    {
      icon: <WandSparkles strokeWidth={1.5} size={24} />,
      action: () => setOpenImproveRecipeDialog(true),
    },
    {
      icon: <Pencil strokeWidth={1.5} size={24} />,
      action: () => {
        setEdit(true);
        setDirtyRecipe(recipe);
      },
    },
    {
      icon: <Trash2 strokeWidth={1.5} size={24} />,
      action: () => handleDeleteRecipe(recipe.id),
    },
    {
      icon: <ArrowLeft strokeWidth={1.5} size={24} />,
      action: () => toHome(),
    },
  ];

  let actionsToRender = edit ? editActions : defaultActions;
  if (recipe.is_improved) actionsToRender = improveActions;

  // --- Rendering ---
  return (
    <div className="flex gap-2 justify-end mb-5 ">
      {actionsToRender.map(({ icon, action }, index) => (
        <ActionButton key={index} icon={icon} action={action} />
      ))}
    </div>
  );
};

export default RecipeActions;

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
  currentRecipe,
  setCurrentRecipe,
  improve,
  setImprove,
  setImprovedRecipe,
}) => {
  const { toHome, toRecipe } = useNavigateTo();
  const { toggleFavorite, deleteRecipe, updateRecipe, addRecipe } = useRecipe();

  // --- Handlers ---
  const handleDeleteRecipe = (id: string) => {
    deleteRecipe(id);
    toHome();
  };

  const handleUpdateRecipe = async () => {
    if (dirtyRecipe) {
      setRecipe(dirtyRecipe);
      await updateRecipe(dirtyRecipe);
    }
    setEdit(false);
  };

  const handleUndoImprove = () => {
    setImprove(false);
    setImprovedRecipe(null);
  };

  const handleSaveImprove = async () => {
    const newRecipe = await addRecipe(recipe);
    if (newRecipe) {
      await deleteRecipe(currentRecipe.id);
      setImprove(false);
      setImprovedRecipe(null);
      toRecipe(newRecipe.id);
    }
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(currentRecipe.id);
    setCurrentRecipe((prev) =>
      prev ? { ...prev, is_favorite: !prev.is_favorite } : prev
    );
  };

  // --- Action Configs ---
  const editActions = [
    {
      icon: <Save strokeWidth={1.5} size={24} className="transition-all" />,
      action: handleUpdateRecipe,
    },
    {
      icon: <Undo2 strokeWidth={1.5} size={24} className="transition-all" />,
      action: () => setEdit(false),
    },
  ];

  const improveActions = [
    {
      icon: <Save strokeWidth={1.5} size={24} className="transition-all" />,
      action: handleSaveImprove,
    },
    {
      icon: <Undo2 strokeWidth={1.5} size={24} className="transition-all" />,
      action: handleUndoImprove,
    },
  ];

  const defaultActions = [
    {
      icon: recipe.is_favorite ? (
        <Star style={{ fill: "currentColor" }} className="transition-all" />
      ) : (
        <Star strokeWidth={1.5} size={24} className="transition-all" />
      ),
      action: handleToggleFavorite,
    },
    {
      icon: (
        <WandSparkles strokeWidth={1.5} size={24} className="transition-all" />
      ),
      action: () => setOpenImproveRecipeDialog(true),
    },
    {
      icon: <Pencil strokeWidth={1.5} size={24} className="transition-all" />,
      action: () => {
        setEdit(true);
        setDirtyRecipe(recipe);
      },
    },
    {
      icon: <Trash2 strokeWidth={1.5} size={24} className="transition-all" />,
      action: () => handleDeleteRecipe(recipe.id),
    },
    {
      icon: (
        <ArrowLeft strokeWidth={1.5} size={24} className="transition-all" />
      ),
      action: () => toHome(),
    },
  ];

  let actionsToRender = edit
    ? editActions
    : improve
    ? improveActions
    : defaultActions;

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

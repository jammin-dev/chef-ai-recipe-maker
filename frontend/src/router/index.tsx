import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import AuthLayout from "@/layouts/AuthLayout";
import { AuthPage } from "@/pages/AuthPage";
import AppLayout from "@/layouts/AppLayout";
import { RecipeProvider } from "@/providers/RecipeProvider";
import RecipePage from "@/pages/RecipePage/RecipePage";
import { AuthProvider } from "@/providers/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <AuthPage isLogin={true} />,
      },
      {
        path: "register",
        element: <AuthPage isRegister={true} />,
      },
    ],
  },
  {
    // All routes that need to be wrapped in RecipeProvider and AppLayout
    element: (
      <AuthProvider>
        <RecipeProvider>
          <AppLayout />
        </RecipeProvider>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <HomePage />, // Now "/" renders HomePage directly
      },
      {
        path: "recipe/guest",
        element: <RecipePage />,
      },
      {
        path: "recipe/:id",
        element: <RecipePage />,
      },
    ],
  },
]);

export default router;

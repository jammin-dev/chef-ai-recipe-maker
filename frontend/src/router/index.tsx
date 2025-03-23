import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import HomePage from "@/pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "@/layouts/AuthLayout";
import { AuthPage } from "@/pages/AuthPage";
import AppLayout from "@/layouts/AppLayout";
import { RecipeProvider } from "@/providers/RecipeProvider";
import RecipePage from "@/pages/RecipePage/RecipePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
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
    path: "/app",
    element: (
      <RecipeProvider>
        <AppLayout>
          <ProtectedRoute />
        </AppLayout>
      </RecipeProvider>
    ),
    children: [
      {
        index: true, // Redirects "/app" to "/app/home"
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "recipe/new",
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

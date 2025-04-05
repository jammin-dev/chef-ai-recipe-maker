import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import AuthLayout from "@/layouts/AuthLayout";
import { AuthPage } from "@/pages/AuthPage";
import AppLayout from "@/layouts/AppLayout";
import { RecipeProvider } from "@/providers/RecipeProvider";
import RecipePage from "@/pages/RecipePage/RecipePage";
import { AuthProvider } from "@/providers/AuthProvider";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { RecoverPasswordPage } from "@/pages/RecoverPasswordPage";

const router = createBrowserRouter([
	{
		element: (
			<AuthProvider>
				<Outlet />
			</AuthProvider>
		),
		children: [
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
					{
						path: "reset-password",
						element: <ResetPasswordPage />,
					},
					{
						path: "recover-password",
						element: <RecoverPasswordPage />,
					},
				],
			},
			{
				element: (
					<RecipeProvider>
						<AppLayout />
					</RecipeProvider>
				),
				children: [
					{
						index: true,
						element: <HomePage />,
					},
					{
						path: "recipe/guest",
						element: <RecipePage guest />,
					},
					{
						path: "recipe/:id",
						element: <RecipePage />,
					},
					{
						path: "*",
						element: <Navigate to="/" replace />,
					},
				],
			},
		],
	},
]);

export default router;

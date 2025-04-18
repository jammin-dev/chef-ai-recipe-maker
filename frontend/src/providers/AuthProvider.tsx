// src/providers/AuthProvider.tsx
import { useState, useEffect, type ReactNode } from "react";
import AuthContext from "../contexts/AuthContext";
import { LoginService, UsersService, type UserPublic } from "@/client";
import LoginDialog from "@/components/LoginDialog";
import { useNavigateTo } from "@/hooks/use-navigate-to";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserPublic | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
	const { toHome } = useNavigateTo();

	const isAuthenticated = Boolean(user);
	const isGuest = !user;

	useEffect(() => {
		// On initial load, check if there's a token in localStorage
		const token = localStorage.getItem("access_token");
		if (token) {
			// If a token exists, fetch the current user's data
			UsersService.readUserMe()
				.then((userData) => {
					setUser(userData);
				})
				.catch((error) => {
					console.error("Failed to fetch user:", error);
					// If fetching fails, remove the token and clear the user state
					localStorage.removeItem("access_token");
					setUser(null);
				})
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	// Call the login API, store the token, and fetch the user profile
	const signIn = async (username: string, password: string) => {
		try {
			setLoading(true);
			const response = await LoginService.loginAccessToken({
				formData: { username, password },
			});
			localStorage.setItem("access_token", response.access_token);
			// After login, fetch the current user's data
			const userData = await UsersService.readUserMe();
			setUser(userData);
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
			// Optionally, you could set an error state or show a notification here
		} finally {
			setLoading(false);
		}
	};

	const signUp = async (email: string, password: string) => {
		try {
			setLoading(true);
			await UsersService.registerUser({
				requestBody: { email, password },
			});
		} catch (error) {
			console.error("Register failed:", error);
			throw error; // 🚀 Re-throw the error so onSubmit can catch it
		} finally {
			setLoading(false);
		}
	};

	const signOut = () => {
		localStorage.removeItem("access_token");
		setUser(null);
		toHome();
	};

	const openLoginDialogIfGuest = () => {
		if (isGuest) {
			setOpenLoginDialog(true);
			return false;
		}
		return true;
	};

	const resetPassword = async (token: string, new_password: string) => {
		try {
			setLoading(true);
			await LoginService.resetPassword({
				requestBody: {
					token,
					new_password,
				},
			});
		} catch (error) {
			console.error("Register failed:", error);
			throw error; // 🚀 Re-throw the error so onSubmit can catch it
		} finally {
			setLoading(false);
		}
	};

	const recoverPassword = async (email: string) => {
		try {
			setLoading(true);
			await LoginService.recoverPassword({
				email,
			});
		} catch (error) {
			console.error("Register failed:", error);
			throw error; // 🚀 Re-throw the error so onSubmit can catch it
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				loading,
				signIn,
				signUp,
				signOut,
				openLoginDialogIfGuest,
				resetPassword,
				recoverPassword,
			}}
		>
			{children}
			<LoginDialog open={openLoginDialog} setOpen={setOpenLoginDialog} />
		</AuthContext.Provider>
	);
}

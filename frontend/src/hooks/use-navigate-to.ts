import { useNavigate } from "react-router-dom";

export function useNavigateTo() {
	const navigate = useNavigate();

	return {
		toLogin: (email?: string) => navigate("/auth/login", { state: { email } }),
		toRegister: () => navigate("/auth/register"),
		toHome: () => navigate("/"),
		toLanding: () => navigate("/"),
		toNewRecipe: (recipe?: any) =>
			navigate("/recipe/new", { state: { recipe } }),
		toRecipe: (id: string) => navigate(`/recipe/${id}`),
		toGuestRecipe: () => navigate("recipe/guest"),
		toRecoverPassword: () => navigate("/auth/recover-password"),
	};
}

import { Search } from "lucide-react";

import { NavUser } from "@/components/app-sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "../ui/input";
import { useRecipe } from "@/hooks/use-recipe";
import { useNavigateTo } from "@/hooks/use-navigate-to";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import RecipeItem from "./recipe-item";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [result, setResult] = useState(null);

	const { toRecipe } = useNavigateTo();
	const { toggleSidebar } = useSidebar();
	const { recipes, deleteRecipe } = useRecipe();
	const isMobile = useIsMobile();

	const { t } = useTranslation();

	const handleFilterRecipe = (e) => {
		if (e.target.value.length === 0) {
			setResult(null);
			return;
		}
		const filteredRecipes = recipes?.filter((recipe) =>
			recipe.title.toLowerCase().includes(e.target.value.toLowerCase()),
		);
		setResult(filteredRecipes);
	};

	const onClickRecipe = (id) => {
		toRecipe(id);
		if (isMobile) {
			toggleSidebar();
		}
	};

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader className="mt-5">
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex items-center gap-2">
							<Search />
							<Input
								placeholder={t("Search")}
								onChange={(e) => handleFilterRecipe(e)}
							/>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{result ? (
					<SidebarGroup>
						<SidebarGroupLabel>{t("Results")}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{result.map((recipe) => (
									<RecipeItem
										key={recipe.id}
										recipe={recipe}
										onClickRecipe={onClickRecipe}
										deleteRecipe={deleteRecipe}
										isMobile={isMobile}
									/>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				) : (
					<>
						{recipes.filter((r) => r.is_favorite).length > 0 && (
							<>
								<SidebarGroup>
									<SidebarGroupLabel>{t("Favorites")}</SidebarGroupLabel>
									<SidebarGroupContent>
										<SidebarMenu>
											{recipes.map((recipe) => {
												if (!recipe.is_favorite) return null;
												return (
													<RecipeItem
														key={recipe.id}
														recipe={recipe}
														onClickRecipe={onClickRecipe}
														deleteRecipe={deleteRecipe}
														isMobile={isMobile}
													/>
												);
											})}
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
								<Separator />
							</>
						)}
						<SidebarGroup>
							<SidebarGroupLabel>{t("Recently saved")}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{recipes.length === 0 ? (
										<p className="text-sm text-muted-foreground px-4 py-2">
											{t("No recipe yet")}
										</p>
									) : (
										recipes.map((recipe) => (
											<RecipeItem
												key={recipe.id}
												recipe={recipe}
												onClickRecipe={onClickRecipe}
												deleteRecipe={deleteRecipe}
												isMobile={isMobile}
											/>
										))
									)}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</>
				)}

				{/* <NavMain items={data.navMain} /> */}
				{/* <NavProjects projects={data.projects} /> */}
				{/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
			</SidebarContent>
		</Sidebar>
	);
}

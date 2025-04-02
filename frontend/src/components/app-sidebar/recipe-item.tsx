import { Folder, MoreHorizontal, Share, Trash2 } from "lucide-react";
import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTranslation } from "react-i18next";

const RecipeItem = ({
	recipe,
	onClickRecipe,
	deleteRecipe,
	isMobile,
	tooltip,
}) => {
	const { t } = useTranslation();
	return (
		<SidebarMenuItem key={recipe.id}>
			<SidebarMenuButton
				onClick={() => onClickRecipe(recipe.id)}
				className="cursor-pointer"
				tooltip={tooltip}
			>
				<span className="block max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
					{recipe.title}
				</span>
			</SidebarMenuButton>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuAction showOnHover>
						<MoreHorizontal />
						<span className="sr-only">More</span>
					</SidebarMenuAction>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-48"
					side={isMobile ? "bottom" : "right"}
					align={isMobile ? "end" : "start"}
				>
					{/* <DropdownMenuItem>
            <Folder className="text-muted-foreground" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share className="text-muted-foreground" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator /> */}
					<DropdownMenuItem onClick={() => deleteRecipe(recipe.id)}>
						<Trash2 className="text-muted-foreground" />
						<span>{t("appSidebar.delete")}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
};

export default RecipeItem;

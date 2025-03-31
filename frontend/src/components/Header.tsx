import Title from "@/components/Title";
import { useSidebar } from "@/components/ui/sidebar";
import { LogOut, PanelLeftIcon, Sparkles, SquarePen, User } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useNavigateTo } from "@/hooks/use-navigate-to";
import { useAuth } from "@/hooks/use-auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const Header = () => {
	const { toggleSidebar } = useSidebar();
	const { toHome, toLogin } = useNavigateTo();
	const { openLoginDialogIfGuest, isAuthenticated, user, signOut } = useAuth();
	const { t } = useTranslation();

	const handleToggleSidebar = () => {
		if (openLoginDialogIfGuest()) toggleSidebar();
	};

	const initials = user?.email?.slice(0, 2).toUpperCase();

	return (
		<>
			<div className="flex px-5 items-center justify-between mt-5 w-full">
				<Button variant="outline" size="icon" onClick={handleToggleSidebar}>
					<PanelLeftIcon size={22} className="transition-all" />
				</Button>
				<Title />
				<div className="flex gap-2">
					<Button variant="outline" size="icon" onClick={toHome}>
						<SquarePen size={22} className="transition-all" />
					</Button>
					<ModeToggle />
					{isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="icon" className="bg-teal-400">
									<User size={22} className="transition-all" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								// side={isMobile ? "bottom" : "right"}
								align="end"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											{/* <AvatarImage src={user.avatar} alt={user.name} /> */}
											<AvatarFallback className="rounded-lg">
												{initials}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate text-xs">{user?.email}</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<Sparkles />
										Upgrade to Plus
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => i18n.changeLanguage("fr")}>
									🇫🇷{"  "}Français
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
									🇬🇧{"  "}English
								</DropdownMenuItem>
								<DropdownMenuItem onClick={signOut}>
									<LogOut />
									{t("Log out")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="outline" size="icon" onClick={() => toLogin()}>
							<User size={22} className="transition-all" />
						</Button>
					)}
				</div>
			</div>
		</>
	);
};

export default Header;

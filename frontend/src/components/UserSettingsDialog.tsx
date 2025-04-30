import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTrigger,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

import { useNavigateTo } from "@/hooks/use-navigate-to";
import { UsersService } from "@/client/sdk.gen";

// Validation schemas for each section
const ProfileSchema = z.object({
	username: z.string().min(1, "Full name is required"),
});

const LanguageSchema = z.object({
	language: z.enum(["en", "fr"]),
});

const SecuritySchema = z
	.object({
		currentPassword: z.string().optional(),
		newPassword: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.newPassword || data.confirmPassword) {
				return data.newPassword === data.confirmPassword;
			}
			return true;
		},
		{
			message: "Passwords do not match",
			path: ["confirmPassword"],
		},
	);

interface UserSettingsDialogProps {
	open: boolean;
	setOpen: (value: boolean) => void;
}

export function UserSettingsDialog({ open, setOpen }: UserSettingsDialogProps) {
	const { t, i18n } = useTranslation();
	const [openRemoveAccountDialog, setOpenRemoveAccountDialog] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { toRegister } = useNavigateTo()

	// Profile form
	const profileForm = useForm<z.infer<typeof ProfileSchema>>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			username: "",
		},
	});

	// Language form
	const languageForm = useForm<z.infer<typeof LanguageSchema>>({
		resolver: zodResolver(LanguageSchema),
		defaultValues: {
			language: (i18n.language === "fr" || i18n.language === "en") ? i18n.language : "en",
		},
	});

	// Security form
	const securityForm = useForm<z.infer<typeof SecuritySchema>>({
		resolver: zodResolver(SecuritySchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	// Fetch current user data when dialog opens
	useEffect(() => {
		if (open) {
			const fetchUserData = async () => {
				try {
					setIsLoading(true);
					const userData = await UsersService.readUserMe();
					profileForm.reset({
						username: userData.full_name || "",
					});
				} catch (error) {
					console.error("Error fetching user data:", error);
					toast.error(t("userSettings.fetchError"));
				} finally {
					setIsLoading(false);
				}
			};

			fetchUserData();
		}
	}, [open, profileForm, t]);

	// Handle form submissions
	const onProfileSubmit = async (data: z.infer<typeof ProfileSchema>) => {
		try {
			await UsersService.updateUserMe({
				requestBody: {
					full_name: data.username
				}
			});

			toast.success(t("userSettings.profileUpdated"));

			// Reset the form to clean state
			profileForm.reset(data);
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error(t("userSettings.profileUpdateError"));
		}
	};

	const onLanguageSubmit = async (data: z.infer<typeof LanguageSchema>) => {
		try {
			// Change the language in the UI
			i18n.changeLanguage(data.language);

			// Store the language preference in localStorage
			localStorage.setItem('i18nextLng', data.language);

			// Show success message
			toast.success(t("userSettings.languageUpdated"));

			// Reset the form to clean state
			languageForm.reset(data);
		} catch (error) {
			console.error("Error updating language:", error);
			toast.error(t("userSettings.languageUpdateError"));
		}
	};

	const onSecuritySubmit = async (data: z.infer<typeof SecuritySchema>) => {
		try {
			if (data.newPassword && data.currentPassword) {
				await UsersService.updatePasswordMe({
					requestBody: {
						current_password: data.currentPassword,
						new_password: data.newPassword
					}
				});

				toast.success(t("userSettings.passwordUpdated"));

				// Reset the form
				securityForm.reset({
					currentPassword: "",
					newPassword: "",
					confirmPassword: ""
				});
			}
		} catch (error) {
			console.error("Error updating password:", error);
			toast.error(t("userSettings.passwordUpdateError"));
		}
	};

	// Dialog close handler
	const handleClose = () => setOpen(false);

	const deleteUser = async () => {
		try {
			setIsDeleting(true);
			await UsersService.deleteUserMe();
			localStorage.removeItem("access_token");
			toast.success(t("userSettings.accountDeleted"));
			toRegister();
		} catch (error) {
			console.error("Error deleting account:", error);
			toast.error(t("userSettings.deleteError"));
		} finally {
			setIsDeleting(false);
			setOpenRemoveAccountDialog(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className="sm:max-w-xl h-11/12 overflow-auto space-y-4"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>{t("userSettings.title")}</DialogTitle>
					<DialogDescription>
						{t("userSettings.description") || "Update your information below."}
					</DialogDescription>
				</DialogHeader>

				{/* Profile Section */}
				<div>
					<h2 className="text-lg font-semibold mb-4">
						{t("userSettings.profileTitle") || "Profile"}
					</h2>
					<Form {...profileForm}>
						<form
							onSubmit={profileForm.handleSubmit(onProfileSubmit)}
							className="space-y-4"
						>
							<FormField
								control={profileForm.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("userSettings.username")}</FormLabel>
										<FormControl>
											<Input {...field} autoComplete="off" disabled={isLoading} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{profileForm.formState.isDirty && (
								<Button type="submit" className="w-full">
									{t("userSettings.save")}
								</Button>
							)}
						</form>
					</Form>
				</div>

				<Separator />

				{/* Language Section */}
				<div>
					<h2 className="text-lg font-semibold">
						{t("userSettings.language") || "Language"}
					</h2>
					<p className="text-sm text-muted-foreground mb-4">
						{t("userSettings.languageDescription")}
					</p>
					<Form {...languageForm}>
						<form
							onSubmit={languageForm.handleSubmit(onLanguageSubmit)}
							className="space-y-4"
							autoComplete="off"
						>
							<FormField
								control={languageForm.control}
								name="language"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger>
													<span className="mr-2">
														{field.value === "fr" ? "🇫🇷" : "🇬🇧"}
													</span>
													{field.value === "fr" ? "Français" : "English"}
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="en">🇬🇧 English</SelectItem>
													<SelectItem value="fr">🇫🇷 Français</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{languageForm.formState.isDirty && (
								<Button type="submit" className="w-full">
									{t("userSettings.save")}
								</Button>
							)}
						</form>
					</Form>
				</div>

				<Separator />

				{/* Security Section (Passwords) */}
				<div>
					<h2 className="text-lg font-semibold mb-4">
						{t("userSettings.securityTitle")}
					</h2>
					<Form {...securityForm}>
						<form
							onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
							className="space-y-4"
							autoComplete="off"
						>
							<FormField
								control={securityForm.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("userSettings.currentPassword")}</FormLabel>
										<FormControl>
											<Input
												type="password"
												{...field}
												autoComplete="current-password"
												data-form-type="other"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={securityForm.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("userSettings.newPassword")}</FormLabel>
										<FormControl>
											<Input
												type="password"
												{...field}
												autoComplete="new-password"
												data-form-type="other"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={securityForm.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("userSettings.confirmPassword")}</FormLabel>
										<FormControl>
											<Input
												type="password"
												{...field}
												autoComplete="new-password"
												data-form-type="other"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{securityForm.formState.isDirty && (
								<Button type="submit" className="w-full">
									{t("userSettings.save")}
								</Button>
							)}
						</form>
					</Form>
				</div>

				<Separator />

				{/* Danger Zone (Delete Account) */}
				<div>
					<h2 className="text-lg font-semibold text-destructive">
						{t("userSettings.dangerZoneTitle")}
					</h2>
					<p className="text-sm text-muted-foreground mb-4">
						{t("userSettings.dangerZoneDescription")}
					</p>
					<AlertDialog open={openRemoveAccountDialog} onOpenChange={setOpenRemoveAccountDialog}>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								{t("userSettings.deleteAccount")}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>{t("userSettings.confirmDeleteTitle")}</AlertDialogTitle>
								<AlertDialogDescription>{t("userSettings.confirmDeleteText")}</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<Button variant="outline" onClick={() => setOpenRemoveAccountDialog(false)}>
									{t("userSettings.cancel")}
								</Button>
								<Button
									variant="destructive"
									onClick={deleteUser}
									disabled={isDeleting}
								>
									{isDeleting ? t("userSettings.deleting") : t("userSettings.confirmDelete")}
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>

				<DialogFooter className="mt-8">
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
						className="mr-2"
					>
						{t("userSettings.cancel") || "Annuler"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

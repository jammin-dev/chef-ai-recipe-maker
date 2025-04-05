import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import coverImg from "@/assets/auth-cover.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" }),
		confirmPassword: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

export function RecoverPasswordPage(
	props: React.ComponentProps<"div">,
): JSX.Element {
	// For translations if needed
	const { t } = useTranslation();
	const { recoverPassword } = useAuth();
	// Local states for loading & success dialog
	const [loading, setLoading] = useState(false);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);

	// Extract token from URL: http://localhost:5173/auth/reset-password?token=...
	const location = useLocation();
	const token = new URLSearchParams(location.search).get("token");

	// 2) Setup React Hook Form with our schema
	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	// 3) Submission handler
	const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
		try {
			// Make sure we have a token
			if (!token) {
				form.setError("password", {
					message:
						"Invalid or missing token. Please check your link or request a new reset email.",
				});
				return;
			}

			setLoading(true);
			// Send token + new password to recoverPassword
			await recoverPassword(token, values.password);

			setShowSuccessDialog(true);
		} catch (error) {
			console.error("Recovery failed:", error);
			form.setError("password", {
				message: "Password reset failed. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", props.className)} {...props}>
			<Card className="overflow-hidden p-0 md:min-w-3xl">
				<CardContent className="grid p-0 md:grid-cols-2 md:min-h-[500px]">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="p-6 md:p-8 self-center"
						>
							<div className="flex flex-col gap-5">
								{/* Title & Subtitle */}
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-bold">
										{t("auth.resetPasswordTitle", "Reset Your Password")}
									</h1>
								</div>

								{/* New Password Field */}
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("auth.newPassword", "New Password")}
											</FormLabel>
											<FormControl>
												<Input
													id="new-password"
													type="password"
													placeholder="********"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Confirm Password Field */}
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("auth.confirmPassword")}</FormLabel>
											<FormControl>
												<Input
													id="confirm-password"
													type="password"
													placeholder="********"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Submit Button */}
								<Button type="submit" className="w-full" disabled={loading}>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{t("auth.resetButton", "Reset Password")}
								</Button>
							</div>
						</form>
					</Form>

					{/* Cover Image (right side on larger screens) */}
					<div className="bg-muted relative hidden md:block">
						<img
							src={coverImg}
							alt="Cover"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Terms of Service sentence, optional */}
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				{t(
					"auth.tosDisclaimer",
					"By resetting your password, you agree to keep it confidential.",
				)}
			</div>

			{/* Success Dialog */}
			<AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("auth.resetSuccessTitle", "Password Reset Successful")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(
								"auth.resetSuccessDesc",
								"Your password has been updated successfully. You can now log in with your new password.",
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction asChild>
							<Link to="/auth/login">{t("auth.ok", "OK")}</Link>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

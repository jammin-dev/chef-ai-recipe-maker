import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

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

//
// 1. Define our Zod schema for an email field
//
const recoverEmailSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

export function RecoverPasswordPage(
	props: React.ComponentProps<"div">,
): JSX.Element {
	// For translations if needed
	const { t } = useTranslation();
	const { recoverPassword } = useAuth(); // or wherever your recoverPassword method exists

	// Local states for loading & success dialog
	const [loading, setLoading] = useState(false);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);

	// 2. Setup React Hook Form with our schema
	const form = useForm<z.infer<typeof recoverEmailSchema>>({
		resolver: zodResolver(recoverEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	// 3. Submission handler
	const onSubmit = async (values: z.infer<typeof recoverEmailSchema>) => {
		try {
			setLoading(true);
			// Assuming you have a method like "login.recoverPassword(email)"
			// that triggers sending the recovery email
			await recoverPassword(values.email);

			setShowSuccessDialog(true);
		} catch (error) {
			console.error("Recovery email failed:", error);
			form.setError("email", {
				message: t(
					"auth.recoverEmailFailure",
					"An error occurred. Please try again.",
				),
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
										{t("auth.recoverEmailTitle", "Recover Password")}
									</h1>
								</div>

								{/* Email Field */}
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("auth.emailLabel", "Email")}</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder={t(
														"auth.emailPlaceholder",
														"Enter your email",
													)}
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
									{t("auth.sendRecoveryButton", "Send")}
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

			{/* Terms of Service / Disclaimer sentence */}
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				{t(
					"auth.recoverEmailDisclaimer",
					"By requesting a password recovery, you will receive an email with further instructions.",
				)}
			</div>

			{/* Success Dialog */}
			<AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("auth.recoverEmailSuccessTitle", "Recovery Email Sent")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(
								"auth.recoverEmailSuccessDesc",
								"We've sent a recovery email to your inbox. Please check your email for further instructions.",
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

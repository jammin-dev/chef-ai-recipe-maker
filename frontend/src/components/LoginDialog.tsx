import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigateTo } from "@/hooks/use-navigate-to";
import { useTranslation } from "react-i18next";

interface LoginDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, setOpen }) => {
	const { t } = useTranslation();
	const { toLogin, toRegister } = useNavigateTo();

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("loginDialogTitle")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("loginDialogDescription")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						{t("cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							setOpen(false);
							toRegister();
						}}
					>
						{t("register")}
					</AlertDialogAction>
					<AlertDialogAction
						onClick={() => {
							setOpen(false);
							toLogin();
						}}
					>
						{t("loginDialog")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default LoginDialog;

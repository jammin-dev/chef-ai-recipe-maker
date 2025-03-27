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

interface LoginDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, setOpen }) => {
  const { toLogin, toRegister } = useNavigateTo();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You need to be logged in</AlertDialogTitle>
          <AlertDialogDescription>
            Please log in or create an account to save your favorite recipes and
            access them later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              toRegister();
            }}
          >
            Register
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              toLogin();
            }}
          >
            Log in
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginDialog;

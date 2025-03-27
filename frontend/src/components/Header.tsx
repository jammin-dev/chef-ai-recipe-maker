import Title from "@/components/Title";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon, SquarePen } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useNavigateTo } from "@/hooks/use-navigate-to";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { toHome } = useNavigateTo();
  const { openLoginDialogIfGuest } = useAuth();

  const handleToggleSidebar = () => {
    if (openLoginDialogIfGuest()) return;
    toggleSidebar();
  };

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
        </div>
      </div>
      {/* <LoginDialog open={openLoginDialog} setOpen={setOpenLoginDialog} /> */}
    </>
  );
};

export default Header;

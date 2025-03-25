import Title from "@/components/Title";
import { useSidebar } from "@/components/ui/sidebar";
import { TypoLead } from "@/components/ui/typography";
import { PanelLeftIcon, SquarePen } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useNavigateTo } from "@/hooks/use-navigate-to";

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { toHome } = useNavigateTo();

  return (
    <div className="flex px-5 items-center justify-between mt-5 w-full">
      <Button variant="outline" size="icon" onClick={toggleSidebar}>
        <PanelLeftIcon size={22} />
      </Button>
    <div className="flex px-5 items-center justify-between mt-5 w-full">
      <Button variant="outline" size="icon" onClick={toggleSidebar}>
        <PanelLeftIcon size={22} />
      </Button>
      <Title />
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={toHome}>
          <SquarePen size={22} />
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;

import Title from "@/components/Title";
import { useSidebar } from "@/components/ui/sidebar";
import { TypoLead } from "@/components/ui/typography";
import { PanelLeftIcon, SquarePen } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex px-5 items-center justify-between mt-5 w-full">
      <Button variant="outline" size="icon" onClick={toggleSidebar}>
        <PanelLeftIcon size={22} />
      </Button>
      <Title />
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <SquarePen size={22} />
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;

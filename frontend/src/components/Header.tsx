import Title from "@/components/Title";
import { useSidebar } from "@/components/ui/sidebar";
import { TypoLead } from "@/components/ui/typography";
import { PanelLeftIcon } from "lucide-react";

const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex px-5 items-center justify-between mt-5">
      <div
        onClick={toggleSidebar}
        className="w-12 h-12 cursor-pointer hover:bg-accent hover:text-accent-foreground flex flex-col justify-center items-center rounded-md"
      >
        <PanelLeftIcon size={22} className="dark:text-white" />
      </div>
      <Title />
      <div className="w-12 h-12 hover:bg-accent hover:text-accent-foreground flex flex-col justify-center items-center rounded-md cursor-default">
        <TypoLead>2/3</TypoLead>
      </div>
    </div>
  );
};

export default Header;

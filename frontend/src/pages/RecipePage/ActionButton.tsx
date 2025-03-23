import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  icon: React.ReactNode;
  action: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, action }) => {
  return (
    <Button size={"lg"} variant={"outline"} onClick={action}>
      {icon}
    </Button>
  );
};

export default ActionButton;

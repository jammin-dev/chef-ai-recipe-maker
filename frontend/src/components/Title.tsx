import { TypoH1, TypoH4 } from "@/components/ui/typography";
import { useNavigateTo } from "@/hooks/use-navigate-to";

const Title = () => {
  const { toHome } = useNavigateTo();
  return (
    <div className="cursor-pointer" onClick={toHome}>
      <TypoH1>Chef!</TypoH1>
      <TypoH4>AI Recipe Maker</TypoH4>
    </div>
  );
};

export default Title;

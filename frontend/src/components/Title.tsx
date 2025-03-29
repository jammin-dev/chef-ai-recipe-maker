import { TypoH1, TypoH4 } from "@/components/ui/typography";
import { useNavigateTo } from "@/hooks/use-navigate-to";

const Title = () => {
	const { toHome } = useNavigateTo();
	return (
		<div className="cursor-pointer" onClick={toHome}>
			<TypoH1 classname="leading-none">Chef!</TypoH1>
			<TypoH4 classname="leading-none ml-5">AI Recipe Maker</TypoH4>
		</div>
	);
};

export default Title;

import { useTranslation } from "react-i18next";
import { TypoMuted, TypoSmall } from "./ui/typography";

const Footer = () => {
	const { t } = useTranslation();
	return (
		<footer className="flex justify-center items-center w-full">
			<TypoMuted>&copy; 2025 Chef!</TypoMuted>
			{/* {" | "}
      <a href="mailto:benjamin.vandamme@me.com" className="ml-4 underline">
        <TypoSmall>{t("contact")}</TypoSmall>
      </a>
      {" | "}
      <a href="mailto:benjamin.vandamme@me.com" className="ml-4 underline">
        <TypoSmall>{t("report a bug")}</TypoSmall>
      </a> */}
		</footer>
	);
};

export default Footer;

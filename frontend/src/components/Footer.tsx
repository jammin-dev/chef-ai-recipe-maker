import { useTranslation } from "react-i18next";
import { TypoSmall } from "./ui/typography";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="flex justify-center gap-4 items-center h-10 w-full pb-8">
      <TypoSmall>&copy; 2025 Chef!</TypoSmall>
      {" | "}
      <a href="mailto:benjamin.vandamme@me.com" className="ml-4 underline">
        <TypoSmall>{t("contact")}</TypoSmall>
      </a>
      {" | "}
      <a href="mailto:benjamin.vandamme@me.com" className="ml-4 underline">
        <TypoSmall>{t("report a bug")}</TypoSmall>
      </a>
    </footer>
  );
};

export default Footer;

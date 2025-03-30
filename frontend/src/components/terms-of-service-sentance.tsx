import { useTranslation } from "react-i18next";

const TermsOfServiceSentance = ({ children }) => {
	const { t } = useTranslation();
	return (
		<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
			{children}
			{t(", you accept our ")}
			<a href="#">{t("Terms of Service")}</a>
			{t(" and")} <a href="#">{t("Privacy Policy")}</a>.
		</div>
	);
};
export default TermsOfServiceSentance;

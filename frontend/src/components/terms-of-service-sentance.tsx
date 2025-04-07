import { useTranslation } from "react-i18next";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { useState } from "react";
import { TermsOfServiceModal } from "./TermsOfServiceModal";

const TermsOfServiceSentance = ({ children }) => {
	const { t } = useTranslation();
	const [openPrivacy, setOpenPrivacy] = useState(false);
	const [openTerms, setOpenTerms] = useState(false);
	return (
		<>
			<div className="text-muted-foreground text-center text-xs text-balance">
				{children}
				{t(", you accept our ")}
				<span
					className="underline hover:text-primary underline-offset-4 cursor-pointer"
					onClick={() => setOpenTerms(true)}
				>
					{t("Terms of Service")}
				</span>
				{t(" and")}{" "}
				<span
					className="underline hover:text-primary underline-offset-4 cursor-pointer"
					onClick={() => setOpenPrivacy(true)}
				>
					{t("Privacy Policy")}
				</span>
				{"."}
			</div>
			<PrivacyPolicyModal open={openPrivacy} setOpen={setOpenPrivacy} />
			<TermsOfServiceModal open={openTerms} setOpen={setOpenTerms} />
		</>
	);
};
export default TermsOfServiceSentance;

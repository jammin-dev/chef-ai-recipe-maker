// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

const baseLang = localStorage.getItem("i18nextLng")?.split("-")[0];
if (baseLang) {
	localStorage.setItem("i18nextLng", baseLang);
}

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			fr: { translation: fr },
		},
		fallbackLng: "en",
		load: "languageOnly",
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ["querystring", "localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"],
		},
	});

export default i18n;

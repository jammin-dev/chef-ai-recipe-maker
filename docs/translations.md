# Translations Guide (i18n with React & TypeScript)

This project uses **i18next** to manage translations in a React + TypeScript environment. Below is a brief overview of how it’s set up and how to contribute or update translations.

---

## Overview

- **Library**: [i18next](https://www.i18next.com/)
- **React Integration**: [react-i18next](https://react.i18next.com/)
- **Primary Language**: English (default)

---

## File Structure

We keep translation files in the `src/locales` folder. Each language has its own subfolder:

```
src
└── locales
    ├── en
    │   ├── common.json
    │   └── other-namespace.json
    ├── fr
    │   ├── common.json
    │   └── other-namespace.json
    ...
```

Each `.json` file contains key-value pairs like so:

```json
{
  "welcome_message": "Welcome to our app!",
  "logout": "Log Out"
}
```

---

## How to Add or Update Translations

1. **Locate** the JSON file for the language you want to update (e.g., `src/locales/fr/common.json`).
2. **Find or add** the translation keys you need. Match them with the English file to ensure consistency.
3. **Translate** the values — do not modify the keys unless absolutely necessary.
4. **Test** your changes in development mode, for example by visiting:
   `http://localhost:3000/?lng=fr`
   This forces i18next to use French (or any other language).

---

## Adding a New Language

1. **Create** a folder for the new language, e.g. `src/locales/de`.
2. **Copy** the JSON files from the default language (`en`) into the new language folder.
3. **Translate** all the values inside the copied JSON files.
4. **Register** your new language in the i18n config if necessary (some setups auto-detect available folders).

---

## Key i18n Configuration Snippets

Typically, we have an `i18n.ts` or `i18n.js` in `src/` or `src/config/` that looks like this:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import fr from "./locales/fr/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    fr: { common: fr },
    // add more languages here
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
```

(Adjust to match your actual config.)

---

## Using Translations in Components

```ts
import { useTranslation } from "react-i18next";

const MyComponent: React.FC = () => {
  const { t } = useTranslation("common");

  return <h1>{t("welcome_message")}</h1>;
};
```

In this example, `welcome_message` must exist in `common.json` for all languages you support.

---

## Need Help or Found a Bug?

- Open or comment on a translation-related issue.
- Check the Master Translation To-Do Issue for any tasks in progress or missing keys.

Happy translating! 🎉

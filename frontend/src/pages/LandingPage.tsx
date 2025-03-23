// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "@/i18n"; // Import i18n config

import { Button } from "@/components/ui/button";
import Title from "@/components/Title";
import { ModeToggle } from "@/components/ModeToggle";

function LandingPage() {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <Title />
      <div className="flex flex-col items-center justify-center gap-4">
        <p>{t("landing page")}</p>
        <div className="flex gap-2">
          <Link to="/auth/login">
            <Button>Login</Button>
          </Link>
          <Link to="/auth/register">
            <Button variant="secondary">Register</Button>
          </Link>
          <ModeToggle />
          <button onClick={() => i18n.changeLanguage("fr")}>🇫🇷 French</button>
          <button onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

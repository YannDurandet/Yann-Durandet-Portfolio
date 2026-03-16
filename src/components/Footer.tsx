import Logo from "../imports/Logo";
import { useTranslation } from "react-i18next";
import { TechBadge } from "./ui/TechBadge";
import { Globe } from "lucide-react";
import { useReveal } from "../hooks/useReveal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, i18n } = useTranslation();
  const revealRef = useReveal<HTMLDivElement>({ stagger: 100 });

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <footer className="relative py-36 bg-text-primary text-white overflow-hidden">
      {/* Mountain background - static, no parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1636229645265-22f8ddc61910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwbW91bnRhaW4lMjBwZWFrc3xlbnwxfHx8fDE3NjM0OTUyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
          backgroundPosition: "center bottom",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-24 relative z-10" ref={revealRef}>
         <div className="absolute top-0 left-6 hidden md:block">
           <TechBadge text="[ SECTOR: END ]" className="opacity-50" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12">
          {/* Logo */}
          <div className="flex flex-col gap-6 items-center md:items-start" data-reveal>
            <div className="w-[180px] transition-transform hover:scale-105">
              <a href="/" className="block">
                <Logo />
              </a>
            </div>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium cursor-pointer border-none text-white"
            >
              <Globe className="w-4 h-4" />
              {i18n.language === "en" ? "Français" : "English"}
            </button>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center gap-1 text-white/60 text-center" data-reveal>
            <span>© {currentYear} DRNDT Studio.</span>
            <span>{t("footer.madeWith")}</span>
          </div>

          {/* Quick links - Column layout */}
          <div className="flex flex-col gap-3 items-center md:items-end" data-reveal>
            <a
              href="/privacy"
              className="text-white/60 hover:text-accent transition-colors transition-transform hover:translate-x-0.5"
            >
              {t("footer.privacy")}
            </a>
            <a
              href="/terms"
              className="text-white/60 hover:text-accent transition-colors transition-transform hover:translate-x-0.5"
            >
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

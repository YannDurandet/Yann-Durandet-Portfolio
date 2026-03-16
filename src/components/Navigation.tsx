import { useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";
import Logo from "../imports/Logo";
import { scrollToSection } from "../utils/scroll";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProgress(v);
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (sectionId: string) => {
    setMenuOpen(false);
    if (sectionId === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollToSection(sectionId);
    }
  };

  const navLinks = [
    { name: t("nav.home"), section: "/" },
    { name: t("nav.about"), section: "about" },
    { name: t("nav.work"), section: "work" },
    { name: t("nav.services"), section: "services" },
    { name: t("nav.contact"), section: "contact" },
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
        <div
          className="h-full bg-accent origin-left"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <nav
        className={`animate-slide-down fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-bg-primary/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="w-[180px] transition-transform hover:scale-105">
              <a href="/" className="block">
                <Logo />
              </a>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex gap-8 items-center" style={{ fontFamily: 'var(--font-cascadia)' }}>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.section)}
                  className="text-text-secondary relative group cursor-pointer bg-transparent border-none text-[14px] hover:-translate-y-0.5 transition-transform"
                >
                  [ {link.name} ]
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            <div className="hidden md:flex gap-4 items-center">
              <button
                onClick={() => handleNav("contact")}
                className="ml-2 px-4 py-3 rounded-full font-semibold border-2 cursor-pointer bg-accent text-white border-accent hover:bg-transparent hover:text-accent hover:border-accent hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
              >
                [ {t("nav.letsTalk")} ]
              </button>
            </div>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-transparent border-none cursor-pointer p-2 text-text-primary z-[70]"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[55] bg-bg-primary/98 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link, i) => (
            <button
              key={link.name}
              onClick={() => handleNav(link.section)}
              className="text-text-primary text-2xl font-semibold bg-transparent border-none cursor-pointer opacity-0 animate-fade-up"
              style={{
                fontFamily: 'var(--font-cascadia)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              [ {link.name} ]
            </button>
          ))}
          <button
            onClick={() => handleNav("contact")}
            className="mt-4 px-8 py-4 rounded-full font-semibold border-2 cursor-pointer bg-accent text-white border-accent text-lg opacity-0 animate-fade-up"
            style={{ animationDelay: `${navLinks.length * 80}ms` }}
          >
            [ {t("nav.letsTalk")} ]
          </button>
        </div>
      )}
    </>
  );
}

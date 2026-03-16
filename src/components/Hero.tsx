import { motion } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import _imgVantageSq from "../assets/vantage-sq.webp";
import _imgVerstappenSq from "../assets/verstappen-sq.webp";
import _imgLunaSq from "../assets/luna-sq.webp";
import _imgGrottiSq from "../assets/grotti-sq.webp";
import _imgEvasionSq from "../assets/evasion-sq.webp";
import _imgDronesSq from "../assets/drones-sq.webp";
import _imgSofiaSq from "../assets/sofia-sq.webp";
import _imgDitherSq from "../assets/dither-sq.webp";

// Astro returns { src: string } objects for image imports; extract the URL
const imgSrc = (img: any): string => (typeof img === "string" ? img : img.src);
const imgVantageSq = imgSrc(_imgVantageSq);
const imgVerstappenSq = imgSrc(_imgVerstappenSq);
const imgLunaSq = imgSrc(_imgLunaSq);
const imgGrottiSq = imgSrc(_imgGrottiSq);
const imgEvasionSq = imgSrc(_imgEvasionSq);
const imgDronesSq = imgSrc(_imgDronesSq);
const imgSofiaSq = imgSrc(_imgSofiaSq);
const imgDitherSq = imgSrc(_imgDitherSq);
import { socialLinks } from "../data/socialLinks";
import { scrollToSection } from "../utils/scroll";
import { MountainDivider } from "./ui/MountainDivider";
import { TechBadge } from "./ui/TechBadge";
import { useTranslation } from "react-i18next";
import { useTextScramble } from "../hooks/useTextScramble";

export function Hero() {
  const [activeImage, setActiveImage] = useState(0);
  const [scrambleActive, setScrambleActive] = useState(false);
  const { t } = useTranslation();

  // Trigger scramble shortly after mount (loading screen has finished)
  useEffect(() => {
    const timer = setTimeout(() => setScrambleActive(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const line1 = useTextScramble(t("hero.title.crafting"), scrambleActive, 800);
  const line2 = useTextScramble(t("hero.title.digital"), scrambleActive, 1000);
  const line3 = useTextScramble(t("hero.title.experiences"), scrambleActive, 1200);

  const images = [
    { src: imgVantageSq, alt: "Vantage Consulting Automobile" },
    { src: imgVerstappenSq, alt: "Max Verstappen Poster" },
    { src: imgLunaSq, alt: "Luna Leaf" },
    { src: imgGrottiSq, alt: "Grotti Motor Sports" },
    { src: imgEvasionSq, alt: "Evasion" },
    { src: imgDronesSq, alt: "Drones Focus" },
    { src: imgSofiaSq, alt: "Sofia by SGS" },
    { src: imgDitherSq, alt: "Dither Abstract" },
  ];

  // Auto-switch images every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageClick = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(circle at 20% 50%, var(--color-accent) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 10s linear infinite",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div
              className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-text-secondary">{t("hero.availability")}</span>
            </div>

            <h1
              className="animate-fade-up text-text-primary mb-6 !text-2xl !md:text-5xl font-bold leading-tight"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="font-cascadia">{line1}</span>{" "}
              <span className="relative inline-block">
                <span className="text-accent font-cascadia">{line2}</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 10"
                >
                  <path
                    d="M0,5 Q50,0 100,5 T200,5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-accent"
                  />
                </svg>
              </span>{" "}
              <span className="font-cascadia">{line3}</span>
            </h1>

            <p
              className="animate-fade-up text-text-secondary mb-8 max-w-xl"
              style={{ animationDelay: "0.4s" }}
            >
              {t("hero.subtitle")}
            </p>

            <div
              className="animate-fade-up flex flex-col md:flex-row gap-4"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                onClick={() => scrollToSection("work")}
                className="px-4 py-3 rounded-md font-semibold border-2 cursor-pointer bg-accent text-white border-accent hover:bg-transparent hover:text-accent hover:border-accent hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
              >
                [ {t("hero.viewWork")} ]
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="px-4 py-3 border-2 border-text-primary text-text-primary rounded-md font-semibold cursor-pointer bg-transparent hover:scale-105 hover:bg-text-primary hover:text-bg-primary active:scale-95 transition-all duration-300"
              >
                {t("hero.learnMore")}
              </button>
            </div>

            {/* Social Links */}
            <div
              className="animate-fade-up flex gap-4 mt-6"
              style={{ animationDelay: "0.8s" }}
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-transparent border-none cursor-pointer p-0 block hover:scale-110 hover:rotate-[5deg] active:scale-90 transition-transform duration-200"
                  >
                    <Icon className="w-[30px] h-[30px] text-accent hover:text-text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right content - Interactive image stack (keeps motion for state-driven animations) */}
          <div className="animate-fade-up relative" style={{ animationDelay: "0.4s" }}>
            <div className="relative w-full aspect-square scale-110 md:scale-[0.935]">
              {/* Background decorative shapes */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-soft rounded-lg rotate-6 hover:rotate-12 hover:scale-105 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-bg-secondary rounded-lg -rotate-6 hover:-rotate-12 hover:scale-105 transition-transform duration-500 ease-out" />

              {/* Image stack */}
              <div className="absolute inset-4 rounded-[1.25rem] shadow-2xl overflow-hidden cursor-pointer" onClick={handleImageClick}>
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                      opacity: 1,
                      zIndex: activeImage === index ? 10 : 9 - index,
                      scale: activeImage === index ? 1 : 1.1,
                    }}
                    whileHover={{ scale: activeImage === index ? 1.02 : 1.12 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay for non-active images */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: index % 2 === 0 ? "var(--color-accent)" : "var(--color-text-secondary)",
                      }}
                      animate={{
                        opacity: activeImage === index ? 0 : 0.5,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-transparent border-none cursor-pointer p-0 z-30"
        style={{ animation: "bounce-arrow 2s ease-in-out infinite" }}
      >
        <ArrowDown className="w-6 h-6 text-accent" />
      </button>

      <div className="absolute top-32 left-6 md:left-12 z-20 hidden md:block">
        <TechBadge text="[ START_POINT ]" />
      </div>

      <MountainDivider fill="#DDDBD1" className="transform translate-y-[1px]" />
    </section>
  );
}

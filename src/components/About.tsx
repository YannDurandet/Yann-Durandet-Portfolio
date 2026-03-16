import { ArrowRight } from "lucide-react";
import { MountainDivider } from "./ui/MountainDivider";
import { TechBadge } from "./ui/TechBadge";
import { useTranslation } from "react-i18next";
import { scrollToSection } from "../utils/scroll";
import { useReveal } from "../hooks/useReveal";

export function About() {
  const { t } = useTranslation();
  const revealRef = useReveal<HTMLDivElement>({ stagger: 150 });

  const stats = [
    { number: "20+", label: t("about.stats.projects") },
    { number: "3+", label: t("about.stats.experience") },
    { number: "4+", label: t("about.stats.clients") },
  ];

  return (
    <section
      id="about"
      className="relative py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Mountain background - static */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1736081003817-cf956a46dead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwbW91bnRhaW4lMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYzNDkwMjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Mountain landscape"
          className="w-full h-full object-cover grayscale"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary via-transparent to-bg-secondary" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={revealRef}>
        <div className="absolute top-0 left-0 hidden md:block -translate-x-6">
          <TechBadge text="[ SECTOR: STUDIO ]" />
        </div>

        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Stats cards */}
          <div className="space-y-6 w-full">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-reveal
                className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:translate-x-2.5 transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-2 h-16 bg-gradient-to-b from-accent to-accent/60 rounded-full transition-transform duration-300 hover:scale-y-[1.2]" />
                  <div>
                    <h3 className="text-accent">{stat.number}</h3>
                    <p className="text-text-secondary">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Story */}
          <div>
            <div data-reveal>
              <div className="inline-block px-4 py-2 bg-accent-soft rounded-sm mb-6 hover:scale-105 transition-transform duration-300">
                <span className="text-accent">{t("about.tag")}</span>
              </div>

              <h2 className="text-text-primary mb-6">
                {t("about.title")}{" "}
                <span className="text-accent">{t("about.titleHighlight")}</span>
              </h2>

              <div className="space-y-4 text-text-secondary">
                <p>{t("about.p1")}</p>
                <p>{t("about.p2")}</p>
                <p className="whitespace-pre-line">{t("about.p3")}</p>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-2 text-accent group font-semibold bg-transparent border-none cursor-pointer p-0 hover:translate-x-2.5 transition-transform duration-300"
                >
                  {t("about.cta")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MountainDivider fill="#EFEDE3" className="transform translate-y-[1px]" />
    </section>
  );
}

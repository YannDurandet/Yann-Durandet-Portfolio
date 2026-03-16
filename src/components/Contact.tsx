import { ArrowUpRight, Send } from "lucide-react";
import LinkedIn from "../imports/LinkedIn";
import X from "../imports/X";
import Instagram from "../imports/Instagram";
import { useTranslation } from "react-i18next";
import { MountainDivider } from "./ui/MountainDivider";
import { TechBadge } from "./ui/TechBadge";
import { useReveal } from "../hooks/useReveal";

export function Contact() {
  const { t } = useTranslation();
  const revealRef = useReveal<HTMLDivElement>({ stagger: 120 });

  const socialLinks = [
    {
      icon: LinkedIn,
      label: "LinkedIn",
      display: "Yann Durandet",
      href: "https://www.linkedin.com/in/yann-durandet-web-designer/",
    },
    {
      icon: X,
      label: "X (Twitter)",
      display: "@YannDurandet",
      href: "https://x.com/YannDurandet",
    },
    {
      icon: Instagram,
      label: "Instagram",
      display: "@durandet.studio",
      href: "https://instagram.com/durandet.studio",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-32 bg-bg-secondary overflow-hidden min-h-[80vh] flex items-center"
    >
      {/* Mountain background */}
      <div className="absolute inset-0 opacity-15">
        <img
          src="https://images.unsplash.com/photo-1482173895011-5b7ea214f4f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHJhbmdlJTIwYmxhY2slMjB3aGl0ZXxlbnwxfHx8fDE3NjM0OTAyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Mountain range"
          className="w-full h-full object-cover grayscale"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-bg-secondary" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 w-full" ref={revealRef}>
        <div className="absolute top-[-4rem] left-0 hidden md:block">
          <TechBadge text="[ SECTOR: COMMS ]" />
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12" data-reveal>
          <div className="inline-block px-4 py-2 bg-accent/10 rounded-sm mb-6">
            <span className="text-accent">{t("contact.tag")}</span>
          </div>

          <h2 className="text-text-primary mb-6 text-4xl md:text-5xl font-bold">
            {t("contact.title")}{" "}
            <span className="text-accent">{t("contact.titleHighlight")}</span>
          </h2>

          <p className="text-text-secondary mb-4 text-lg">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Primary email CTA */}
        <div className="text-center mb-12" data-reveal>
          <p className="text-text-primary font-medium text-lg mb-6">
            {t("contact.method")}
          </p>
          <a
            href="mailto:yann@durandet.studio"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-semibold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
            yann@durandet.studio
          </a>
        </div>

        {/* Secondary social links */}
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto mb-12" data-reveal>
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
              >
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-text-primary font-medium">{link.display}</span>
                <ArrowUpRight className="w-4 h-4 text-text-primary/30 group-hover:text-accent transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Info bar */}
        <div className="text-center" data-reveal>
          <div className="inline-flex flex-col md:flex-row gap-8 p-6 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40">
            <div>
              <span className="block text-text-secondary text-sm mb-1">{t("contact.response.label")}</span>
              <span className="font-semibold text-text-primary">{t("contact.response.value")}</span>
            </div>
            <div className="hidden md:block w-px bg-text-primary/10" />
            <div>
              <span className="block text-text-secondary text-sm mb-1">{t("contact.availability.label")}</span>
              <span className="font-semibold text-text-primary">{t("contact.availability.value")}</span>
            </div>
          </div>
        </div>
      </div>
      <MountainDivider fill="#302F2C" className="transform translate-y-[1px]" />
    </section>
  );
}

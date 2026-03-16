import { ExternalLink, TrendingUp } from "lucide-react";
import vantageImage from "../assets/vantage-wide.webp";
import sofiaImage from "../assets/sofia-wide.webp";
import ditheringImage from "../assets/dithering-wide.webp";
import artEvasionImage from "../assets/evasion-wide.webp";
import { MountainDivider } from "./ui/MountainDivider";
import { TechBadge } from "./ui/TechBadge";
import { useTranslation } from "react-i18next";
import { useReveal } from "../hooks/useReveal";

export function Projects() {
  const { t } = useTranslation();
  const revealRef = useReveal<HTMLDivElement>({ stagger: 150 });

  const projects = [
    {
      id: "PRJ_01",
      title: "Sofia by SGS",
      category: t("projects.items.sofia.category"),
      image: sofiaImage,
      link: "https://sofia.sgs.com",
      description: t("projects.items.sofia.description"),
      result: t("projects.items.sofia.result"),
    },
    {
      id: "PRJ_02",
      title: "Vantage Automobile",
      category: t("projects.items.vantage.category"),
      image: vantageImage,
      link: "https://instagram.com/vantage.automobile",
      description: t("projects.items.vantage.description"),
      result: t("projects.items.vantage.result"),
    },
    {
      id: "PRJ_03",
      title: "Dithering Tool",
      category: t("projects.items.dithering.category"),
      image: ditheringImage,
      link: "https://yanndurandet.github.io/Halftone-Editor/",
      description: t("projects.items.dithering.description"),
      result: t("projects.items.dithering.result"),
    },
    {
      id: "PRJ_04",
      title: "Art Evasion Nature",
      category: t("projects.items.artEvasion.category"),
      image: artEvasionImage,
      link: "https://art-evasion-nature.com/",
      description: t("projects.items.artEvasion.description"),
      result: t("projects.items.artEvasion.result"),
    },
  ];

  // Alternating layout: row 1 = [large, small], row 2 = [small, large]
  const rows = [
    [projects[0], projects[1]],
    [projects[2], projects[3]],
  ];

  return (
    <section id="work" className="relative py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={revealRef}>
        <div className="absolute top-0 left-6 hidden md:block">
          <TechBadge text="[ SECTOR: WORKS ]" />
        </div>

        <div className="text-center mb-16" data-reveal>
          <div className="inline-block px-4 py-2 bg-bg-secondary rounded-full mb-6 hover:scale-105 transition-transform duration-300">
            <span className="text-accent">{t("projects.tag")}</span>
          </div>

          <h2 className="text-text-primary mb-6">
            {t("projects.title")}{" "}
            <span className="text-accent">{t("projects.titleHighlight")}</span>
          </h2>

          <p className="text-text-secondary max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Asymmetric grid */}
        <div className="space-y-8">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {row.map((project, colIndex) => {
                // Row 0: first item is large (2 cols), second is small (1 col)
                // Row 1: first item is small (1 col), second is large (2 cols)
                const isLarge = rowIndex === 0 ? colIndex === 0 : colIndex === 1;

                return (
                  <a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block ${isLarge ? "md:col-span-2" : "md:col-span-1"}`}
                    data-reveal
                  >
                    <div className={`relative rounded-3xl overflow-hidden shadow-lg bg-white ${isLarge ? "aspect-[16/9]" : "aspect-square"}`}>
                      {/* Image */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top bar: category + link */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                        <div className="flex flex-col gap-2">
                          <span className="font-cascadia text-xs text-white/70 tracking-widest">
                            [{project.id}]
                          </span>
                          <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
                            {project.category}
                          </span>
                        </div>
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-all duration-300">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Bottom content: always visible */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <h3 className="text-white mb-1 text-xl md:text-2xl">{project.title}</h3>
                        <p className="text-white/80 text-sm md:text-base mb-3 line-clamp-2">{project.description}</p>

                        {/* Result stat */}
                        <div className="flex items-center gap-2 text-accent text-sm font-semibold">
                          <TrendingUp className="w-4 h-4" />
                          <span>{project.result}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <MountainDivider
        fill="#302F2C"
        className="transform translate-y-[1px]"
      />
    </section>
  );
}

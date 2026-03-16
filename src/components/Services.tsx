import { Palette, Layout, Smartphone, Sparkles } from "lucide-react";
import { MountainDivider } from "./ui/MountainDivider";
import { TechBadge } from "./ui/TechBadge";
import { useTranslation } from "react-i18next";
import { useReveal } from "../hooks/useReveal";

export function Services() {
  const { t } = useTranslation();
  const revealRef = useReveal<HTMLDivElement>({ stagger: 120 });

  const services = [
    {
      icon: Palette,
      title: t("services.items.brandIdentity.title"),
      description: t("services.items.brandIdentity.description"),
      features: t("services.items.brandIdentity.features", { returnObjects: true }) as string[],
    },
    {
      icon: Layout,
      title: t("services.items.webDesign.title"),
      description: t("services.items.webDesign.description"),
      features: t("services.items.webDesign.features", { returnObjects: true }) as string[],
    },
    {
      icon: Smartphone,
      title: t("services.items.digitalProducts.title"),
      description: t("services.items.digitalProducts.description"),
      features: t("services.items.digitalProducts.features", { returnObjects: true }) as string[],
    },
    {
      icon: Sparkles,
      title: t("services.items.creativeDirection.title"),
      description: t("services.items.creativeDirection.description"),
      features: t("services.items.creativeDirection.features", { returnObjects: true }) as string[],
    },
  ];

  return (
    <section id="services" className="relative py-32 bg-text-primary overflow-hidden">
      {/* Mountain background — static */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1744535284634-7b3e33e34e35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWslMjBtb25vY2hyb21lfGVufDF8fHx8MTc2MzQ5MDIzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Mountain peak"
          className="w-full h-full object-cover grayscale"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-text-primary via-transparent to-text-primary" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={revealRef}>
        <div className="absolute top-0 left-6 hidden md:block">
          <TechBadge text="[ SECTOR: OFFER ]" />
        </div>

        <div className="text-center mb-16" data-reveal>
          <div className="inline-block px-4 py-2 bg-accent/20 rounded-full mb-6">
            <span className="text-accent">{t("services.tag")}</span>
          </div>

          <h2 className="text-white mb-6">
            {t("services.title")}{" "}
            <span className="text-accent">{t("services.titleHighlight")}</span>
          </h2>

          <p className="text-white/70 max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="group" data-reveal>
                <div className="relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden transition-all duration-400 ease-out hover:-translate-y-2.5 hover:bg-white/[0.08]">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Header with Icon and Title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-soft rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-white m-0">{service.title}</h3>
                    </div>

                    {/* Content */}
                    <p className="text-white/70 mb-6 leading-none">{service.description}</p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          <span className="text-white/60">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MountainDivider fill="#DDDBD1" className="transform translate-y-[1px]" />
    </section>
  );
}

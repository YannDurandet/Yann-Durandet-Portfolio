import { Footer } from "./Footer";
import Logo from "../imports/Logo";
import { CustomCursor } from "./ui/CustomCursor";
import "../lib/i18n";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-primary">
      <CustomCursor />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm shadow-lg animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="w-[180px] transition-transform hover:scale-105">
              <a href="/" className="block"><Logo /></a>
            </div>
            <div className="hidden md:flex gap-8 items-center" style={{ fontFamily: "var(--font-cascadia)" }}>
              <a href="/" className="text-text-secondary relative group hover:-translate-y-0.5 transition-transform">
                [ {t("nav.home")} ]
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwbW91bnRhaW4lMjByYW5nZXxlbnwxfHx8fDE3NjM0OTQ4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-text-primary mb-6 animate-fade-up">
            Conditions G&eacute;n&eacute;rales d&apos;Utilisation <span className="text-accent">(CGU)</span>
          </h1>
          <p className="text-text-secondary animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Date d&apos;entr&eacute;e en vigueur : 1 mars 2026
          </p>
        </div>
      </section>

      <section className="py-16 bg-bg-secondary">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div>
            <h2 className="text-text-primary mb-4">1. &Eacute;diteur du site</h2>
            <p className="text-text-secondary mb-4">
              DURANDET STUDIO<br />Siret : 99172412100017<br />Email : yann@durandet.studio Directeur de la publication : Yann Durandet<br />H&eacute;bergeur : GitHub Pages
            </p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">2. Objet</h2>
            <p className="text-text-secondary mb-4">Les pr&eacute;sentes CGU d&eacute;finissent les conditions d&apos;acc&egrave;s et d&apos;utilisation du site [https://durandet.studio] (le &laquo; Site &raquo;), portfolio pr&eacute;sentant mes services de cr&eacute;ation et refonte de sites internet.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">3. Acc&egrave;s au site</h2>
            <p className="text-text-secondary mb-4">L&apos;acc&egrave;s au Site est gratuit et ouvert &agrave; tout internaute disposant d&apos;une connexion internet.<br />Tous les co&ucirc;ts li&eacute;s &agrave; l&apos;acc&egrave;s (mat&eacute;riel, connexion) sont &agrave; la charge de l&apos;utilisateur.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">4. Propri&eacute;t&eacute; intellectuelle</h2>
            <p className="text-text-secondary mb-4">L&apos;ensemble du contenu du Site (textes, images, logos, maquettes, code source des exemples pr&eacute;sent&eacute;s) est ma propri&eacute;t&eacute; exclusive ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation.<br />Toute reproduction, m&ecirc;me partielle, est interdite sans mon accord &eacute;crit pr&eacute;alable (art. L.122-4 du Code de la propri&eacute;t&eacute; intellectuelle).</p>
            <p className="text-text-secondary">Les projets clients pr&eacute;sent&eacute;s dans le portfolio sont diffus&eacute;s avec l&apos;accord &eacute;crit des clients concern&eacute;s.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">5. Responsabilit&eacute;</h2>
            <p className="text-text-secondary mb-4">Je m&apos;efforce de maintenir le Site accessible 24h/24, 7j/7, mais je ne suis pas tenu &agrave; une obligation de r&eacute;sultat.<br />L&apos;acc&egrave;s peut &ecirc;tre interrompu pour maintenance ou cas de force majeure sans que ma responsabilit&eacute; soit engag&eacute;e.</p>
            <p className="text-text-secondary">Les liens hypertextes vers des sites tiers n&apos;engagent pas ma responsabilit&eacute; quant &agrave; leur contenu.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">6. Utilisation du formulaire de contact</h2>
            <p className="text-text-secondary mb-4">L&apos;utilisation du formulaire de contact implique l&apos;acceptation pleine et enti&egrave;re des pr&eacute;sentes CGU et de la <a href="/privacy" className="text-accent hover:underline">Politique de confidentialit&eacute;</a>.</p>
            <p className="text-text-secondary">Il est interdit d&apos;utiliser le formulaire &agrave; des fins ill&eacute;gales, de spam ou de prospection non sollicit&eacute;e.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">7. Droit applicable et juridiction</h2>
            <p className="text-text-secondary mb-4">Les pr&eacute;sentes CGU sont r&eacute;gies par le droit fran&ccedil;ais.<br />Tout litige sera soumis aux tribunaux comp&eacute;tents de la ville de Rouen (76000)</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">8. Contact</h2>
            <p className="text-text-secondary mb-4">Pour toute question : yann@durandet.studio</p>
          </div>

          <div className="pt-8 border-t border-text-primary/10">
            <p className="text-text-secondary text-sm">&copy; 2026 Yann Durandet &ndash; Tous droits r&eacute;serv&eacute;s.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

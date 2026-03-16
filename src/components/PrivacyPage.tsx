import { Footer } from "./Footer";
import Logo from "../imports/Logo";
import { CustomCursor } from "./ui/CustomCursor";
import "../lib/i18n";
import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
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
            Politique de <span className="text-accent">confidentialit&eacute;</span>
          </h1>
          <p className="text-text-secondary animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Derni&egrave;re mise &agrave; jour : 1 mars 2026
          </p>
        </div>
      </section>

      <section className="py-16 bg-bg-secondary">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div>
            <p className="text-text-secondary mb-4">
              La pr&eacute;sente politique de confidentialit&eacute; vous informe de la mani&egrave;re dont DURANDET STUDIO, cr&eacute;ateur de sites internet ind&eacute;pendant (ci-apr&egrave;s &laquo; je &raquo; ou &laquo; moi &raquo;), traite vos donn&eacute;es personnelles lorsque vous visitez mon site portfolio [https://durandet.studio] (ci-apr&egrave;s le &laquo; Site &raquo;) et notamment lorsque vous utilisez le formulaire de contact.
            </p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">1. Responsable du traitement</h2>
            <p className="text-text-secondary mb-4">
              DURANDET STUDIO<br />Siret : 99172412100017<br />Email : yann@durandet.studio
            </p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">2. Donn&eacute;es collect&eacute;es via le formulaire de contact</h2>
            <p className="text-text-secondary mb-4">Lorsque vous remplissez le formulaire de contact, je collecte uniquement les donn&eacute;es suivantes :</p>
            <ul className="space-y-3 text-text-secondary mb-4">
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Nom et pr&eacute;nom</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Adresse e-mail</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Message / description de votre projet</span></li>
            </ul>
            <p className="text-text-secondary">Ces donn&eacute;es sont collect&eacute;es avec votre consentement explicite (case &agrave; cocher non pr&eacute;-coch&eacute;e).</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">3. Finalit&eacute;s du traitement</h2>
            <p className="text-text-secondary mb-4">Vos donn&eacute;es sont utilis&eacute;es exclusivement pour :</p>
            <ul className="space-y-3 text-text-secondary mb-4">
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>R&eacute;pondre &agrave; votre demande de devis ou d&apos;information</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Vous recontacter dans le cadre de votre projet de cr&eacute;ation ou refonte de site internet</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>&Eacute;ventuellement vous transmettre le devis correspondant</span></li>
            </ul>
            <p className="text-text-secondary">Aucune prospection commerciale automatis&eacute;e n&apos;est r&eacute;alis&eacute;e &agrave; partir de ces donn&eacute;es.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">4. Base juridique</h2>
            <p className="text-text-secondary">Le traitement repose sur votre consentement (art. 6.1.a du RGPD) et, le cas &eacute;ch&eacute;ant, sur l&apos;ex&eacute;cution de mesures pr&eacute;contractuelles &agrave; votre demande (art. 6.1.b du RGPD).</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">5. Destinataires des donn&eacute;es</h2>
            <p className="text-text-secondary mb-4">Je suis la seule destinataire de vos donn&eacute;es.<br />Elles ne sont ni vendues, ni lou&eacute;es, ni transmises &agrave; des tiers &agrave; des fins commerciales.</p>
            <p className="text-text-secondary">H&eacute;bergement du site :<br />Le Site est h&eacute;berg&eacute; par GitHub Pages dont les serveurs sont situ&eacute;s aux &Eacute;tats-Unis / Union europ&eacute;enne.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">6. Dur&eacute;e de conservation</h2>
            <p className="text-text-secondary mb-4">Vos donn&eacute;es issues du formulaire de contact sont conserv&eacute;es :</p>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Pendant 3 ans &agrave; compter du dernier contact si aucun contrat n&apos;est conclu</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>En cas de signature d&apos;un devis ou contrat : pendant la dur&eacute;e de la relation contractuelle + 5 ans &agrave; des fins comptables et probatoires</span></li>
            </ul>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">7. Vos droits</h2>
            <p className="text-text-secondary mb-4">Conform&eacute;ment au RGPD et &agrave; la loi Informatique et Libert&eacute;s, vous disposez des droits suivants :</p>
            <ul className="space-y-3 text-text-secondary mb-4">
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Droit d&apos;acc&egrave;s, de rectification, de suppression</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Droit de retirer votre consentement &agrave; tout moment</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Droit d&apos;opposition et de limitation du traitement</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Droit &agrave; la portabilit&eacute; des donn&eacute;es</span></li>
              <li className="flex gap-3"><span className="text-accent mt-1">&bull;</span><span>Droit de d&eacute;finir des directives relatives au sort de vos donn&eacute;es apr&egrave;s votre d&eacute;c&egrave;s</span></li>
            </ul>
            <p className="text-text-secondary mb-2">Pour exercer ces droits ou pour toute question, contactez-moi &agrave; yann@durandet.studio.</p>
            <p className="text-text-secondary">Vous disposez &eacute;galement du droit d&apos;introduire une r&eacute;clamation aupr&egrave;s de la CNIL (www.cnil.fr).</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">8. Cookies et traceurs</h2>
            <p className="text-text-secondary mb-4">Ce site n&apos;utilise actuellement aucun cookie ni traceur (pas de Google Analytics, pas de pixel Facebook, etc.).</p>
            <p className="text-text-secondary">Seuls les cookies strictement n&eacute;cessaires au fonctionnement du formulaire (CSRF, session si applicable) sont utilis&eacute;s et sont supprim&eacute;s &agrave; la fermeture du navigateur.</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">9. S&eacute;curit&eacute;</h2>
            <p className="text-text-secondary">Je mets en oeuvre toutes les mesures techniques et organisationnelles appropri&eacute;es pour prot&eacute;ger vos donn&eacute;es (chiffrement TLS, sauvegardes s&eacute;curis&eacute;es, acc&egrave;s restreint).</p>
          </div>

          <div>
            <h2 className="text-text-primary mb-4">10. Modification de la politique</h2>
            <p className="text-text-secondary mb-4">Je me r&eacute;serve le droit de modifier cette politique. Toute modification substantielle vous sera signal&eacute;e par un bandeau sur le Site.</p>
            <p className="text-text-secondary">Pour toute question : yann@durandet.studio</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

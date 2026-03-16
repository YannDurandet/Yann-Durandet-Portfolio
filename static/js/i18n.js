/* ===== TRANSLATIONS ===== */
const translations = {
  en: {
    nav: { home: "Home", about: "About", work: "Work", services: "Services", contact: "Contact", letsTalk: "Let's Talk" },
    hero: {
      availability: "Available for new projects - March 2026",
      title: { crafting: "Freelance Designer & Art Director", digital: "Specializing in Branding", experiences: "and High-End Interfaces" },
      subtitle: "I turn ambitious brands into digital experiences that stand out \u2014 through strategy, precision, and relentless attention to detail.",
      viewWork: "View My Work", learnMore: "Learn More",
    },
    about: {
      stats: { projects: "Projects Delivered", experience: "Years Experience", clients: "Trusted Partners" },
      tag: "My Story",
      title: "Design is applied", titleHighlight: "mountaineering.",
      p1: "Every project starts with a clear vision \u2014 your summit. I map the best route, then execute with no shortcuts and no compromise on quality.",
      p2: "For 3 years, I partnered with SGS to redesign Sofia, their global enterprise software used by tens of thousands daily. From UX strategy to final pixel \u2014 a full-scale transformation.",
      p3: "What sets me apart?\n\u2022 Obsessive attention to detail at every scale\n\u2022 Dual expertise: brand strategy + art direction\n\u2022 Consistently ahead of schedule",
      cta: "Start Your Project",
    },
    projects: {
      tag: "Selected Work",
      title: "Projects That Made an", titleHighlight: "Impact",
      subtitle: "Strategy-driven design for brands that refuse to blend in.",
      items: {
        sofia:     { category: "Web Design",      description: "3-year UX/UI redesign of SGS\u2019s global enterprise platform, serving tens of thousands of users worldwide.",                        result: "Adopted by 30,000+ users across 40 countries" },
        vantage:   { category: "Brand Identity",   description: "Full brand identity for a bespoke luxury vehicle sourcing firm \u2014 from logo to visual system.",                                   result: "Brand launch with 500+ followers in first month" },
        dithering: { category: "Web Dev",           description: "Open-source halftone and dithering image processor \u2014 a personal experiment in visual algorithms.",                               result: "2,000+ GitHub stars, featured on Hacker News" },
        artEvasion:{ category: "Branding",          description: "Logo and brand identity for a local artisan laser engraving studio. Website by Damien Bourdais.",                                    result: "Complete identity delivered in under 3 weeks" },
      },
    },
    services: {
      tag: "What I Do",
      title: "Services That Elevate Your", titleHighlight: "Brand",
      subtitle: "End-to-end design solutions built to sharpen your positioning and drive real results.",
      items: {
        brandIdentity:    { title: "Brand Identity",      description: "Logo, guidelines, visual strategy \u2014 everything to make you instantly recognizable.",      features: ["Logo Design","Brand Guidelines","Visual Strategy","Color Systems"] },
        webDesign:        { title: "Web Design",           description: "Custom-built sites on Webflow or Framer \u2014 fast, polished, conversion-ready.",             features: ["UI/UX Design","Responsive Design","Prototyping","Design Systems"] },
        digitalProducts:  { title: "Digital Products",     description: "From MVP to scale-up: research, wireframes, interface design, and user testing.",              features: ["App Design","User Research","Wireframing","User Testing"] },
        creativeDirection:{ title: "Creative Direction",   description: "Strategic art direction to keep your brand sharp and consistent at every touchpoint.",          features: ["Art Direction","Content Strategy","Brand Strategy","Visual Storytelling"] },
      },
    },
    contact: {
      tag: "Get in Touch",
      title: "Let\u2019s Create Something", titleHighlight: "Extraordinary",
      subtitle: "Have a project in mind? Whether you\u2019re building from scratch or elevating an existing brand, I\u2019d love to hear about it.",
      method: "Drop me an email, or reach out on X, Instagram, or LinkedIn \u2014 whichever works best.",
      response: { label: "Response time:", value: "Usually within 24 hours" },
      availability: { label: "Availability:", value: "Open for new projects starting March 2026" },
    },
    footer: { madeWith: "Designed & built by hand in the Alps", privacy: "Privacy", terms: "Terms" },
  },
  fr: {
    nav: { home: "Accueil", about: "\u00c0 Propos", work: "Projets", services: "Services", contact: "Contact", letsTalk: "Discutons" },
    hero: {
      availability: "Disponible pour de nouveaux projets - Mars 2026",
      title: { crafting: "Designer & directeur artistique freelance", digital: "Sp\u00e9cialis\u00e9 en branding", experiences: "et interfaces haut de gamme" },
      subtitle: "Je transforme des marques ambitieuses en exp\u00e9riences digitales qui marquent \u2014 par la strat\u00e9gie, la pr\u00e9cision et le souci du moindre d\u00e9tail.",
      viewWork: "Voir mes Projets", learnMore: "En Savoir Plus",
    },
    about: {
      stats: { projects: "Projets Livr\u00e9s", experience: "Ann\u00e9es d\u2019Exp\u00e9rience", clients: "Partenaires de Confiance" },
      tag: "Mon Histoire",
      title: "Le design, c\u2019est de l\u2019alpinisme", titleHighlight: "appliqu\u00e9.",
      p1: "Chaque projet commence par une vision claire \u2014 votre sommet. Je trace la meilleure voie, puis j\u2019ex\u00e9cute sans raccourci et sans compromis sur la qualit\u00e9.",
      p2: "Pendant 3 ans, j\u2019ai accompagn\u00e9 SGS dans la refonte de Sofia, leur logiciel d\u2019entreprise utilis\u00e9 quotidiennement par des dizaines de milliers de personnes. De la strat\u00e9gie UX au dernier pixel \u2014 une transformation compl\u00e8te.",
      p3: "Ce qui me diff\u00e9rencie ?\n\u2022 Attention obsessionnelle au d\u00e9tail \u00e0 chaque \u00e9chelle\n\u2022 Double expertise : strat\u00e9gie de marque + direction artistique\n\u2022 Syst\u00e9matiquement en avance sur le calendrier",
      cta: "Commencer un Projet",
    },
    projects: {
      tag: "S\u00e9lection",
      title: "Des Projets qui ont un", titleHighlight: "Impact",
      subtitle: "Du design strat\u00e9gique pour les marques qui refusent de passer inaper\u00e7ues.",
      items: {
        sofia:     { category: "Web Design",            description: "Refonte UX/UI sur 3 ans de la plateforme entreprise de SGS, utilis\u00e9e par des dizaines de milliers d\u2019utilisateurs dans le monde.", result: "Adopt\u00e9 par 30 000+ utilisateurs dans 40 pays" },
        vantage:   { category: "Identit\u00e9 de Marque", description: "Identit\u00e9 de marque compl\u00e8te pour un cabinet de recherche de v\u00e9hicules de luxe sur mesure \u2014 du logo au syst\u00e8me visuel.",        result: "Lancement de marque avec 500+ abonn\u00e9s le premier mois" },
        dithering: { category: "D\u00e9v Web",            description: "Processeur d\u2019images halftone et dithering open-source \u2014 une exp\u00e9rimentation personnelle en algorithmes visuels.",              result: "2 000+ \u00e9toiles GitHub, mis en avant sur Hacker News" },
        artEvasion:{ category: "Branding",               description: "Logo et identit\u00e9 de marque pour un atelier artisanal de gravure laser. Site web par Damien Bourdais.",                                result: "Identit\u00e9 compl\u00e8te livr\u00e9e en moins de 3 semaines" },
      },
    },
    services: {
      tag: "Ce que je fais",
      title: "Des Services qui \u00c9l\u00e8vent Votre", titleHighlight: "Marque",
      subtitle: "Des solutions de design de bout en bout pour affiner votre positionnement et g\u00e9n\u00e9rer des r\u00e9sultats concrets.",
      items: {
        brandIdentity:    { title: "Identit\u00e9 de Marque",   description: "Logo, charte, strat\u00e9gie visuelle \u2014 tout pour vous rendre imm\u00e9diatement reconnaissable.",     features: ["Logo","Charte Graphique","Strat\u00e9gie Visuelle","Syst\u00e8mes de Couleurs"] },
        webDesign:        { title: "Web Design",                 description: "Sites sur mesure en Webflow ou Framer \u2014 rapides, soign\u00e9s, pr\u00eats \u00e0 convertir.",           features: ["Design UI/UX","Design Responsive","Prototypage","Design Systems"] },
        digitalProducts:  { title: "Produits Num\u00e9riques",   description: "Du MVP au passage \u00e0 l\u2019\u00e9chelle : recherche, wireframes, design d\u2019interface et tests utilisateurs.", features: ["Design d\u2019App","Recherche Utilisateur","Wireframing","Tests Utilisateurs"] },
        creativeDirection:{ title: "Direction Artistique",       description: "Direction artistique strat\u00e9gique pour garder votre marque affut\u00e9e et coh\u00e9rente sur tous les points de contact.", features: ["Direction Artistique","Strat\u00e9gie de Contenu","Strat\u00e9gie de Marque","Narration Visuelle"] },
      },
    },
    contact: {
      tag: "Contactez-moi",
      title: "Cr\u00e9ons Quelque Chose", titleHighlight: "d\u2019Extraordinaire",
      subtitle: "Un projet en t\u00eate ? Que vous partiez de z\u00e9ro ou que vous souhaitiez faire \u00e9voluer une marque existante, j\u2019aimerais en discuter.",
      method: "Envoyez-moi un email, ou \u00e9crivez-moi sur X, Instagram ou LinkedIn \u2014 comme vous pr\u00e9f\u00e9rez.",
      response: { label: "Temps de r\u00e9ponse :", value: "G\u00e9n\u00e9ralement sous 24 heures" },
      availability: { label: "Disponibilit\u00e9 :", value: "Ouvert aux nouveaux projets d\u00e8s Mars 2026" },
    },
    footer: { madeWith: "Con\u00e7u et construit \u00e0 la main dans les Alpes", privacy: "Confidentialit\u00e9", terms: "Conditions" },
  },
};

/* ===== I18N ENGINE ===== */
let currentLang = 'en';

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

function detectLanguage() {
  const stored = localStorage.getItem('lang');
  if (stored) return stored;
  return navigator.language.startsWith('fr') ? 'fr' : 'en';
}

function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const t = translations[lang].translation || translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(t, key);
    if (value !== null) {
      if (typeof value === 'string') {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    }
  });

  // Update service features dynamically
  document.querySelectorAll('[data-i18n-features]').forEach(el => {
    const key = el.getAttribute('data-i18n-features');
    const features = getNestedValue(t, key);
    if (Array.isArray(features)) {
      el.innerHTML = features.map(f =>
        `<div class="service-feature"><span class="service-feature-dot"></span><span>${f}</span></div>`
      ).join('');
    }
  });

  // Update language toggle button text
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.querySelector('span').textContent = lang === 'en' ? 'Fran\u00e7ais' : 'English';
  }
}

function toggleLanguage() {
  const newLang = currentLang === 'en' ? 'fr' : 'en';
  applyTranslations(newLang);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(detectLanguage());
});

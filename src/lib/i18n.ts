import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About",
        work: "Work",
        services: "Services",
        contact: "Contact",
        letsTalk: "Let's Talk",
      },
      hero: {
        availability: "Available for new projects - March 2026",
        title: {
          crafting: "Freelance Designer & Art Director",
          digital: "Specializing in Branding",
          experiences: "and High-End Interfaces",
        },
        subtitle:
          "I turn ambitious brands into digital experiences that stand out — through strategy, precision, and relentless attention to detail.",
        viewWork: "View My Work",
        learnMore: "Learn More",
      },
      about: {
        stats: {
          projects: "Projects Delivered",
          experience: "Years Experience",
          clients: "Trusted Partners",
        },
        tag: "My Story",
        title: "Design is applied",
        titleHighlight: "mountaineering.",
        p1: "Every project starts with a clear vision — your summit. I map the best route, then execute with no shortcuts and no compromise on quality.",
        p2: "For 3 years, I partnered with SGS to redesign Sofia, their global enterprise software used by tens of thousands daily. From UX strategy to final pixel — a full-scale transformation.",
        p3: "What sets me apart?\n• Obsessive attention to detail at every scale\n• Dual expertise: brand strategy + art direction\n• Consistently ahead of schedule",
        cta: "Start Your Project",
      },
      projects: {
        tag: "Selected Work",
        title: "Projects That Made an",
        titleHighlight: "Impact",
        subtitle:
          "Strategy-driven design for brands that refuse to blend in.",
        viewAll: "View All Projects",
        items: {
          vantage: {
            category: "Brand Identity",
            description:
              "Full brand identity for a bespoke luxury vehicle sourcing firm — from logo to visual system.",
            result: "Brand launch with 500+ followers in first month",
          },
          sofia: {
            category: "Web Design",
            description:
              "3-year UX/UI redesign of SGS's global enterprise platform, serving tens of thousands of users worldwide.",
            result: "Adopted by 30,000+ users across 40 countries",
          },
          dithering: {
            category: "Web Dev",
            description:
              "Open-source halftone and dithering image processor — a personal experiment in visual algorithms.",
            result: "2,000+ GitHub stars, featured on Hacker News",
          },
          artEvasion: {
            category: "Branding",
            description:
              "Logo and brand identity for a local artisan laser engraving studio. Website by Damien Bourdais.",
            result: "Complete identity delivered in under 3 weeks",
          },
        },
      },
      services: {
        tag: "What I Do",
        title: "Services That Elevate Your",
        titleHighlight: "Brand",
        subtitle:
          "End-to-end design solutions built to sharpen your positioning and drive real results.",
        items: {
          brandIdentity: {
            title: "Brand Identity",
            description:
              "Logo, guidelines, visual strategy — everything to make you instantly recognizable.",
            features: [
              "Logo Design",
              "Brand Guidelines",
              "Visual Strategy",
              "Color Systems",
            ],
          },
          webDesign: {
            title: "Web Design",
            description:
              "Custom-built sites on Webflow or Framer — fast, polished, conversion-ready.",
            features: [
              "UI/UX Design",
              "Responsive Design",
              "Prototyping",
              "Design Systems",
            ],
          },
          digitalProducts: {
            title: "Digital Products",
            description:
              "From MVP to scale-up: research, wireframes, interface design, and user testing.",
            features: [
              "App Design",
              "User Research",
              "Wireframing",
              "User Testing",
            ],
          },
          creativeDirection: {
            title: "Creative Direction",
            description:
              "Strategic art direction to keep your brand sharp and consistent at every touchpoint.",
            features: [
              "Art Direction",
              "Content Strategy",
              "Brand Strategy",
              "Visual Storytelling",
            ],
          },
        },
      },
      contact: {
        tag: "Get in Touch",
        title: "Let's Create Something",
        titleHighlight: "Extraordinary",
        subtitle:
          "Have a project in mind? Whether you're building from scratch or elevating an existing brand, I'd love to hear about it.",
        method: "Drop me an email, or reach out on X, Instagram, or LinkedIn — whichever works best.",
        response: {
          label: "Response time:",
          value: "Usually within 24 hours",
        },
        availability: {
          label: "Availability:",
          value: "Open for new projects starting March 2026",
        },
      },
      footer: {
        madeWith: "Designed & built by hand in the Alps",
        privacy: "Privacy",
        terms: "Terms",
      },
      privacy: {
        title: "Privacy",
        titleHighlight: "Policy",
        lastUpdated: "Last updated: March 1, 2026",
        intro: {
          title: "Introduction",
          p1: "At DRNDT Studio, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
          p2: "Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site."
        },
        infoCollection: {
          title: "Information We Collect",
          intro: "We may collect information about you in a variety of ways. The information we may collect on the site includes:",
          personalData: "<strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and contact information that you voluntarily give to us when you contact us or express interest in our services.",
          derivativeData: "<strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, access times, and the pages you have viewed."
        },
        useInfo: {
          title: "Use of Your Information",
          intro: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:",
          list: [
            "Respond to your inquiries and provide customer service",
            "Send you marketing and promotional communications",
            "Improve our website and services",
            "Monitor and analyze usage and trends"
          ]
        },
        security: {
          title: "Security of Your Information",
          p1: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable."
        },
        contact: {
          title: "Contact Us",
          p1: "If you have questions or comments about this Privacy Policy, please contact us at:"
        }
      },
      terms: {
        title: "Terms of",
        titleHighlight: "Service",
        lastUpdated: "Last updated: March 1, 2026",
        agreement: {
          title: "Agreement to Terms",
          p1: "These Terms of Service constitute a legally binding agreement made between you and DRNDT Studio, concerning your access to and use of our website and services.",
          p2: "You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the site."
        },
        intellectualProperty: {
          title: "Intellectual Property Rights",
          p1: "Unless otherwise indicated, the site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the \"Content\") are owned or controlled by us or licensed to us.",
          p2: "The Content and the trademarks, service marks, and logos contained therein (the \"Marks\") are protected by copyright and trademark laws. You are granted a limited license only for purposes of viewing the material contained on this site."
        },
        userRepresentations: {
          title: "User Representations",
          intro: "By using the site, you represent and warrant that:",
          list: [
            "All registration information you submit will be true, accurate, current, and complete",
            "You will maintain the accuracy of such information and promptly update such registration information as necessary",
            "You have the legal capacity and you agree to comply with these Terms of Service",
            "You will not access the site through automated or non-human means"
          ]
        },
        services: {
          title: "Services",
          intro: "DRNDT Studio provides brand and web design services. We reserve the right to:",
          list: [
            "Modify or discontinue services at any time without notice",
            "Refuse service to anyone for any reason at any time",
            "Update pricing and service offerings as needed"
          ]
        },
        limitation: {
          title: "Limitation of Liability",
          p1: "In no event will DRNDT Studio or its directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site."
        },
        governing: {
          title: "Governing Law",
          p1: "These Terms shall be governed by and defined following the laws applicable in your jurisdiction. DRNDT Studio and yourself irrevocably consent that the courts shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms."
        },
        contact: {
          title: "Contact Us",
          p1: "If you have any questions or concerns about these Terms of Service, please contact us at:"
        }
      }
    },
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        about: "À Propos",
        work: "Projets",
        services: "Services",
        contact: "Contact",
        letsTalk: "Discutons",
      },
      hero: {
        availability: "Disponible pour de nouveaux projets - Mars 2026",
        title: {
          crafting: "Designer & directeur artistique freelance",
          digital: "Spécialisé en branding",
          experiences: "et interfaces haut de gamme",
        },
        subtitle:
          "Je transforme des marques ambitieuses en expériences digitales qui marquent — par la stratégie, la précision et le souci du moindre détail.",
        viewWork: "Voir mes Projets",
        learnMore: "En Savoir Plus",
      },
      about: {
        stats: {
          projects: "Projets Livrés",
          experience: "Années d’Expérience",
          clients: "Partenaires de Confiance",
        },
        tag: "Mon Histoire",
        title: "Le design, c’est de l’alpinisme",
        titleHighlight: "appliqué.",
        p1: "Chaque projet commence par une vision claire — votre sommet. Je trace la meilleure voie, puis j’exécute sans raccourci et sans compromis sur la qualité.",
        p2: "Pendant 3 ans, j’ai accompagné SGS dans la refonte de Sofia, leur logiciel d’entreprise utilisé quotidiennement par des dizaines de milliers de personnes. De la stratégie UX au dernier pixel — une transformation complète.",
        p3: "Ce qui me différencie ?\n• Attention obsessionnelle au détail à chaque échelle\n• Double expertise : stratégie de marque + direction artistique\n• Systématiquement en avance sur le calendrier",
        cta: "Commencer un Projet",
      },
      projects: {
        tag: "Sélection",
        title: "Des Projets qui ont un",
        titleHighlight: "Impact",
        subtitle:
          "Du design stratégique pour les marques qui refusent de passer inaperçues.",
        viewAll: "Voir Tous les Projets",
        items: {
          vantage: {
            category: "Identité de Marque",
            description:
              "Identité de marque complète pour un cabinet de recherche de véhicules de luxe sur mesure — du logo au système visuel.",
            result: "Lancement de marque avec 500+ abonnés le premier mois",
          },
          sofia: {
            category: "Web Design",
            description:
              "Refonte UX/UI sur 3 ans de la plateforme entreprise de SGS, utilisée par des dizaines de milliers d’utilisateurs dans le monde.",
            result: "Adopté par 30 000+ utilisateurs dans 40 pays",
          },
          dithering: {
            category: "Dév Web",
            description:
              "Processeur d’images halftone et dithering open-source — une expérimentation personnelle en algorithmes visuels.",
            result: "2 000+ étoiles GitHub, mis en avant sur Hacker News",
          },
          artEvasion: {
            category: "Branding",
            description:
              "Logo et identité de marque pour un atelier artisanal de gravure laser. Site web par Damien Bourdais.",
            result: "Identité complète livrée en moins de 3 semaines",
          },
        },
      },
      services: {
        tag: "Ce que je fais",
        title: "Des Services qui Élèvent Votre",
        titleHighlight: "Marque",
        subtitle:
          "Des solutions de design de bout en bout pour affiner votre positionnement et générer des résultats concrets.",
        items: {
          brandIdentity: {
            title: "Identité de Marque",
            description:
              "Logo, charte, stratégie visuelle — tout pour vous rendre immédiatement reconnaissable.",
            features: [
              "Logo",
              "Charte Graphique",
              "Stratégie Visuelle",
              "Systèmes de Couleurs",
            ],
          },
          webDesign: {
            title: "Web Design",
            description:
              "Sites sur mesure en Webflow ou Framer — rapides, soignés, prêts à convertir.",
            features: [
              "Design UI/UX",
              "Design Responsive",
              "Prototypage",
              "Design Systems",
            ],
          },
          digitalProducts: {
            title: "Produits Numériques",
            description:
              "Du MVP au passage à l’échelle : recherche, wireframes, design d’interface et tests utilisateurs.",
            features: [
              "Design d’App",
              "Recherche Utilisateur",
              "Wireframing",
              "Tests Utilisateurs",
            ],
          },
          creativeDirection: {
            title: "Direction Artistique",
            description:
              "Direction artistique stratégique pour garder votre marque affûtée et cohérente sur tous les points de contact.",
            features: [
              "Direction Artistique",
              "Stratégie de Contenu",
              "Stratégie de Marque",
              "Narration Visuelle",
            ],
          },
        },
      },
      contact: {
        tag: "Contactez-moi",
        title: "Créons Quelque Chose",
        titleHighlight: "d’Extraordinaire",
        subtitle:
          "Un projet en tête ? Que vous partiez de zéro ou que vous souhaitiez faire évoluer une marque existante, j’aimerais en discuter.",
        method: "Envoyez-moi un email, ou écrivez-moi sur X, Instagram ou LinkedIn — comme vous préférez.",
        response: {
          label: "Temps de réponse :",
          value: "Généralement sous 24 heures",
        },
        availability: {
          label: "Disponibilité :",
          value: "Ouvert aux nouveaux projets dès Mars 2026",
        },
      },
      footer: {
        madeWith: "Conçu et construit à la main dans les Alpes",
        privacy: "Confidentialité",
        terms: "Conditions",
      },
      privacy: {
        title: "Politique de",
        titleHighlight: "Confidentialité",
        lastUpdated: "Dernière mise à jour : 1 Mars 2026",
        intro: {
          title: "Introduction",
          p1: "Chez DRNDT Studio, nous prenons votre vie privée au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web.",
          p2: "Veuillez lire attentivement cette politique de confidentialité. Si vous n'êtes pas d'accord avec les termes de cette politique de confidentialité, veuillez ne pas accéder au site."
        },
        infoCollection: {
          title: "Informations que nous collectons",
          intro: "Nous pouvons collecter des informations vous concernant de diverses manières. Les informations que nous pouvons collecter sur le site incluent :",
          personalData: "<strong>Données Personnelles :</strong> Informations personnellement identifiables, telles que votre nom, votre adresse e-mail et vos coordonnées que vous nous fournissez volontairement lorsque vous nous contactez ou exprimez un intérêt pour nos services.",
          derivativeData: "<strong>Données Dérivées :</strong> Informations que nos serveurs collectent automatiquement lorsque vous accédez au site, telles que votre adresse IP, votre type de navigateur, votre système d'exploitation, les temps d'accès et les pages que vous avez consultées."
        },
        useInfo: {
          title: "Utilisation de vos informations",
          intro: "Disposer d'informations précises à votre sujet nous permet de vous offrir une expérience fluide, efficace et personnalisée. Plus précisément, nous pouvons utiliser les informations collectées à votre sujet pour :",
          list: [
            "Répondre à vos demandes et fournir un service client",
            "Vous envoyer des communications marketing et promotionnelles",
            "Améliorer notre site web et nos services",
            "Surveiller et analyser l'utilisation et les tendances"
          ]
        },
        security: {
          title: "Sécurité de vos informations",
          p1: "Nous utilisons des mesures de sécurité administratives, techniques et physiques pour aider à protéger vos informations personnelles. Bien que nous ayons pris des mesures raisonnables pour sécuriser les informations personnelles que vous nous fournissez, sachez que malgré nos efforts, aucune mesure de sécurité n'est parfaite ou impénétrable."
        },
        contact: {
          title: "Nous Contacter",
          p1: "Si vous avez des questions ou des commentaires sur cette politique de confidentialité, veuillez nous contacter à :"
        }
      },
      terms: {
        title: "Conditions",
        titleHighlight: "d'Utilisation",
        lastUpdated: "Dernière mise à jour : 1 Mars 2026",
        agreement: {
          title: "Accord aux Conditions",
          p1: "Ces Conditions d'Utilisation constituent un accord juridiquement contraignant conclu entre vous et DRNDT Studio, concernant votre accès et votre utilisation de notre site web et de nos services.",
          p2: "Vous acceptez qu'en accédant au site, vous avez lu, compris et accepté d'être lié par toutes ces Conditions d'Utilisation. Si vous n'acceptez pas toutes ces conditions, il vous est expressément interdit d'utiliser le site."
        },
        intellectualProperty: {
          title: "Droits de Propriété Intellectuelle",
          p1: "Sauf indication contraire, le site est notre propriété exclusive et tous les codes sources, bases de données, fonctionnalités, logiciels, conceptions de sites web, fichiers audio, vidéo, textes, photographies et graphiques sur le site (collectivement, le « Contenu ») sont détenus ou contrôlés par nous ou nous sont concédés sous licence.",
          p2: "Le Contenu et les marques de commerce, marques de service et logos qui y sont contenus (les « Marques ») sont protégés par les lois sur le droit d'auteur et les marques de commerce. Vous bénéficiez d'une licence limitée uniquement dans le but de consulter le matériel contenu sur ce site."
        },
        userRepresentations: {
          title: "Déclarations de l'Utilisateur",
          intro: "En utilisant le site, vous déclarez et garantissez que :",
          list: [
            "Toutes les informations d'inscription que vous soumettez seront vraies, exactes, actuelles et complètes",
            "Vous maintiendrez l'exactitude de ces informations et mettrez rapidement à jour ces informations d'inscription si nécessaire",
            "Vous avez la capacité juridique et vous acceptez de vous conformer à ces Conditions d'Utilisation",
            "Vous n'accéderez pas au site par des moyens automatisés ou non humains"
          ]
        },
        services: {
          title: "Services",
          intro: "DRNDT Studio fournit des services de design de marque et de sites web. Nous nous réservons le droit de :",
          list: [
            "Modifier ou interrompre les services à tout moment sans préavis",
            "Refuser le service à quiconque pour n'importe quelle raison à tout moment",
            "Mettre à jour les prix et les offres de services selon les besoins"
          ]
        },
        limitation: {
          title: "Limitation de Responsabilité",
          p1: "En aucun cas DRNDT Studio ou ses administrateurs, employés ou agents ne seront responsables envers vous ou un tiers de tout dommage direct, indirect, consécutif, exemplaire, accidentel, spécial ou punitif, y compris la perte de profit, la perte de revenus, la perte de données ou d'autres dommages résultant de votre utilisation du site."
        },
        governing: {
          title: "Droit Applicable",
          p1: "Ces Conditions seront régies et définies conformément aux lois applicables dans votre juridiction. DRNDT Studio et vous-même consentez irrévocablement à ce que les tribunaux aient compétence exclusive pour résoudre tout litige pouvant survenir en relation avec ces conditions."
        },
        contact: {
          title: "Nous Contacter",
          p1: "Si vous avez des questions ou des préoccupations concernant ces Conditions d'Utilisation, veuillez nous contacter à :"
        }
      }
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
(() => {
  'use strict';

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Storage can throw (private mode, blocked site data) — never let that stop the page
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* ignore */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch { /* ignore */ }
    },
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const supportsViewTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  const supportsScrollTimeline = CSS.supports('animation-timeline: scroll()');

  /* -----------------------------------------------
     View transitions — morph the work card <-> case-study header
     (the cross-fade itself is opt-in from CSS; this script is
     render-blocking so both listeners exist before first paint)
     ----------------------------------------------- */
  const CASE_SLUGS = ['sofia', 'vantage', 'dord'];

  // 'sofia.html' and '/sofia' both -> 'sofia'; home -> '' or 'index'
  function pageSlug(url) {
    return new URL(url, location.href).pathname.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
  }

  function isHome(slug) {
    return slug === '' || slug === 'index';
  }

  // The element that should morph on `page`, for a navigation to/from `other`
  function morphTarget(page, other) {
    if (isHome(page) && CASE_SLUGS.includes(other)) {
      const card = document.querySelector(`a.work__grid-item[href="${other}.html"] .work__grid-img-wrap`);
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight ? card : null;
    }
    if (CASE_SLUGS.includes(page) && isHome(other)) {
      return document.getElementById('case-hero');
    }
    return null;
  }

  // Outgoing page: name the element before the browser captures the old state
  window.addEventListener('pageswap', (e) => {
    if (!e.viewTransition || !e.activation) return;
    const target = morphTarget(pageSlug(location.href), pageSlug(e.activation.entry.url));
    if (target) target.style.viewTransitionName = 'case-hero';
  });

  // Incoming page: name the matching element, then clean up so the page stays bfcache-eligible
  window.addEventListener('pagereveal', async (e) => {
    if (!e.viewTransition) return;
    const from = window.navigation?.activation?.from;
    if (!from) return;
    // "Back to work" links to /#work; the browser applies that scroll after first paint,
    // so do it now to have the card on screen when the new state is captured
    if (isHome(pageSlug(location.href)) && location.hash.length > 1) {
      try { document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant' }); } catch { /* invalid selector */ }
    }
    const target = morphTarget(pageSlug(location.href), pageSlug(from.url));
    if (!target) return;
    target.style.viewTransitionName = 'case-hero';
    await e.viewTransition.finished;
    target.style.viewTransitionName = '';
  });

  // A page restored from bfcache may still carry the name set in pageswap
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.querySelectorAll('[style*="view-transition-name"]').forEach((el) => {
        el.style.viewTransitionName = '';
      });
    }
  });

  /* -----------------------------------------------
     Preloader — splash on arrival, skipped when navigating
     inside the site (flagged by the inline <head> script)
     ----------------------------------------------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    if (document.documentElement.classList.contains('no-preloader')) {
      preloader.remove();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.setAttribute('aria-hidden', 'true');
          preloader.classList.add('is-done');
          setTimeout(() => preloader.remove(), 800);
        }, 1200);
      });
    }
  }

  /* -----------------------------------------------
     Smooth scroll engine — wheel-based lerp
     (anchor links on touch / narrow screens use CSS scroll-behavior)
     ----------------------------------------------- */
  if (!('ontouchstart' in window) && window.innerWidth > 640 && !reducedMotion.matches) {
    let scrollTargetY = window.scrollY;
    let scrollCurrentY = window.scrollY;
    let smoothScrollRafId = 0;

    // Only spin the frame loop while there is distance left to cover
    function smoothScrollLoop() {
      smoothScrollRafId = 0;
      if (Math.abs(scrollCurrentY - scrollTargetY) > 0.5) {
        scrollCurrentY = lerp(scrollCurrentY, scrollTargetY, 0.20);
        window.scrollTo({ top: scrollCurrentY, behavior: 'instant' });
        smoothScrollRafId = requestAnimationFrame(smoothScrollLoop);
      }
    }

    function startSmoothScroll() {
      if (!smoothScrollRafId) smoothScrollRafId = requestAnimationFrame(smoothScrollLoop);
    }

    window.addEventListener('wheel', (e) => {
      // Let an open modal (lightbox) handle its own wheel input
      if (e.target instanceof Element && e.target.closest('dialog[open]')) return;
      e.preventDefault();
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollTargetY = Math.max(0, Math.min(scrollTargetY + e.deltaY, maxScroll));
      startSmoothScroll();
    }, { passive: false });

    // Intercept anchor clicks — set scrollTargetY directly to avoid lerp/jump race
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          scrollTargetY = target.getBoundingClientRect().top + window.scrollY;
          startSmoothScroll();
        }
      });
    });

    // Sync when something other than this loop moved the page (keyboard, scrollbar drag, find-in-page).
    // Our own scrollTo calls land within a pixel of scrollCurrentY, so they leave the target alone.
    window.addEventListener('scroll', () => {
      if (Math.abs(window.scrollY - scrollCurrentY) > 2) {
        scrollTargetY = window.scrollY;
        scrollCurrentY = window.scrollY;
      }
    }, { passive: true });
  }

  /* -----------------------------------------------
     i18n — translations, detection, toggle
     ----------------------------------------------- */
  const SITE_CONFIG = {
    availability: {
      en: '[ Available for new projects ]',
      fr: '[ Disponible pour de nouveaux projets ]',
    },
  };

  const translations = {
    en: {
      'nav-contact': '03 — Contact',
      'nav-menu': '[ Menu ]',
      'nav-work': '01 — Work',
      'nav-about': '02 — About',
      'nav-cta': 'Book a Call',
      'about-label': '[ About ]',
      'contact-label': '[ Get in touch ]',
      'hero-headline': 'I redesigned the software 97,000 people use every day.',
      'hero-meta': 'Yann Durandet — Web & Brand Designer',
      'hero-availability': SITE_CONFIG.availability.en,
      'work-label': '[ Selected Work ]',
      'about-badge': '[ Sector: Studio ]',
      'about-lead': "I believe the best design doesn't just look right — it feels right, because it started with listening.",
      'about-p1': "I work with founders, product teams, and companies who need design that actually earns trust — not just looks the part. For two years at SGS, I was the sole designer behind Sofia: a complete UX overhaul of an enterprise platform used daily by 97,000 people across 40+ countries. That same rigour is what I bring to every project, whatever the scale.",
      'about-p2': 'Based in Normandy. Working worldwide.',
      'contact-cta': 'Book a 15-min intro call →',
      'contact-status1': '[ Available for enterprise UX, brand identity, and web design ]',
      'contact-status2': '[ Usually responds within 24 hours ]',
      'footer-legal': '[ Legal ]',
      'footer-projects': '[ Projects ]',
      'footer-socials': '[ Socials ]',
      'footer-copy': '© 2026 DRNDT Studio — Designed & built with too much caffeine',
      'pullquote-text': '"The goal of a designer is to listen, observe, understand, sympathize, empathize, synthesize, and glean insights that enable him or her to \'make the invisible visible.\'"',
      'pullquote-cite': '— Hillman Curtis',
      'hero-sub': 'Enterprise UX & Brand Design — SGS, global leader in Testing & Certification. Now available for new projects.',
      'how-i-work-label': '[ How I Work ]',
      'hiw-01-title': 'Discovery',
      'hiw-01-body': 'Auditing friction points and defining the business case before a single pixel is moved.',
      'hiw-02-title': 'Iteration',
      'hiw-02-body': 'Building scalable design systems through high-fidelity prototyping and constant feedback loops.',
      'hiw-03-title': 'Handoff',
      'hiw-03-body': 'Delivering developer-ready documentation and brand guidelines designed for long-term growth.',
      'contact-intro': 'Ready to build something that feels as good as it looks? Book a 15-minute intro call to discuss your project.',
      'contact-availability': 'Now booking for Q3 2026',
      'footer-tagline': '"Design is empathy in motion."',
      // ── Shared case study UI ──
      'cs-back': '← Back to work',
      'cs-next-back-label': '[ Back ]',
      'cs-next-back-link': '← Back to work',
      'cs-next-next-label': '[ Next ]',
      'cs-next-next-link': 'Back to all work →',
      'cs-have-project': 'Have a project in mind?',
      'cs-zoom': 'Enlarge image',
      'cs-close-label': '[ Close ]',
      // ── DORD ──
      'dord-sector': '[ Sector: Motorsport ]',
      'dord-badge-deliverable': '[ Deliverable: Branding & Web ]',
      'dord-badge-type': '[ Type: Active Project ]',
      'dord-badge-status': '[ Status: Live & ongoing ]',
      'dord-stat-deliverable': 'Branding & Web',
      'dord-stat-label-deliverable': 'Deliverable',
      'dord-stat-active': 'Active Project',
      'dord-stat-label-type': 'Type',
      'dord-stat-live': 'Live & ongoing',
      'dord-stat-label-status': 'Status',
      'dord-01-label': '01 — Context',
      'dord-01-title': 'What is DORD?',
      'dord-01-body': 'DORD — short for Department of Racing Drivers — is a motorsport media platform I built from scratch as a personal passion project. It covers international racing: driver profiles, race reports, results, and a live calendar spanning categories from Formula 1 to endurance racing. More than a blog, it operates like a real editorial outlet — with a defined visual identity, a structured content architecture, and a tone of voice built around the sport.',
      'dord-02-label': '02 — Challenge',
      'dord-02-title': 'Building something from scratch.',
      'dord-02-body': 'The tension with a passion project is that it risks looking like one. Motorsport content exists in abundance — from official team feeds to fan wikis — but very little of it is designed with care. The challenge was holding myself to the same standard I\'d apply to any client brief: a coherent brand system, a scalable design language, and copy that reads like it belongs somewhere worth reading.',
      'dord-03-label': '03 — Process',
      'dord-03-title': 'How it evolved.',
      'dord-03-body': 'DORD started as an informal project with no fixed direction. Over time, a clearer editorial identity emerged — typographic-led, restrained in colour, structured around legibility and hierarchy. The logo was refined, the type stack locked in, and the layout system built to flex across race reports, standings tables, and longer editorial pieces. Today it runs on a clean, publication-style design that prioritises content over decoration.',
      'dord-04-label': '04 — Deliverables',
      'dord-04-title': 'What exists today.',
      'dord-04-body': 'The project spans branding, web design, and a functional race calendar. Deliverables include a complete logo and wordmark system, a defined colour palette and typographic scale, a fully designed website, and an interactive race calendar tracking international motorsport schedules. Each element was designed to work together as a system, not a collection of isolated assets.',
      'dord-05-label': '05 — The Site',
      'dord-05-title': 'See it live.',
      'dord-visit': 'Visit DORD →',
      // ── Vantage ──
      'vantage-sector': '[ Sector: Automotive ]',
      'vantage-badge-deliverable': '[ Deliverable: Brand Identity ]',
      'vantage-badge-type': '[ Type: Client Work ]',
      'vantage-badge-status': '[ Status: Delivered ]',
      'vantage-stat-deliverable': 'Brand Identity',
      'vantage-stat-label-deliverable': 'Deliverable',
      'vantage-stat-client': 'Client Work',
      'vantage-stat-label-type': 'Type',
      'vantage-stat-delivered': 'Delivered',
      'vantage-stat-label-status': 'Status',
      'vantage-01-label': '01 — Context',
      'vantage-01-title': 'What is Vantage Automobiles?',
      'vantage-01-body': 'Vantage Automobiles is an independent automotive consultancy helping clients source, evaluate, and acquire vehicles with confidence. Operating in a market where trust is the product, they needed a brand identity that would communicate credibility and expertise from the first impression — something that felt established without being stiff.',
      'vantage-02-label': '02 — Challenge',
      'vantage-02-title': 'The brief.',
      'vantage-02-body': 'Vantage came with no visual identity at all. The brief was to build one from scratch: a logo system, a colour palette, and a set of guidelines that would give the business a professional face across every touchpoint. The design challenge was distinguishing a young consultancy in a field where competitors either lean on heritage clichés or underdifferentiated corporate aesthetics.',
      'vantage-03-label': '03 — Process',
      'vantage-03-title': 'How I approached it.',
      'vantage-03-body': 'I started with a positioning exercise — mapping where Vantage sat between warmth and precision, approachability and authority. From there, moodboards led to logo exploration: several directions were tested before landing on a mark that balanced confidence with restraint. Typography and colour were chosen to reinforce the same qualities — reliable, legible, credible.',
      'vantage-04-label': '04 — Deliverables',
      'vantage-04-title': 'What I built.',
      'vantage-04-body': 'The full brand package included a primary logo and logomark with usage variations, a complete colour palette and typographic system, a brand guidelines document for consistent application, and a set of mockups showing the identity applied across real-world contexts — stationery, signage, and digital formats.',
      'vantage-05-label': '05 — Outcome',
      'vantage-05-title': 'Result.',
      'vantage-05-body': 'The brand was delivered and well received. It gave Vantage a clear, professional face to take into the market — something that could hold its own against more established players while still feeling specific to who they are.',
      // ── Sofia ──
      'sofia-sector': '[ Sector: Enterprise Software ]',
      'sofia-badge-role': '[ Role: Lead Designer ]',
      'sofia-badge-scope': '[ Scope: Full UX + UI ]',
      'sofia-badge-timeline': '[ Timeline: 2023 – 2025 ]',
      'sofia-badge-format': '[ Format: Apprenticeship ]',
      'sofia-hero-problem': '97,000 people used this software every day. Nobody had asked them what they actually needed.',
      'sofia-stat-label-users': 'Users worldwide',
      'sofia-stat-label-countries': 'Countries',
      'sofia-stat-label-languages': 'Languages supported',
      'sofia-stat-label-samples': 'Samples processed / year',
      'sofia-01-label': '01 — Context',
      'sofia-01-title': 'What is SOFIA?',
      'sofia-01-p1': 'SOFIA — Solutions for Oil and Fluid Information Applications — is SGS\'s global enterprise platform for Oil Condition Monitoring. Maintenance engineers, fleet managers, and industrial operators use it to track the health of machinery oils, greases, and fluids across transportation, wind energy, mining, and marine industries.',
      'sofia-01-p2': 'When a sample comes back abnormal, SOFIA tells you before a turbine fails or an engine seizes. SGS processes over 2 million oil samples a year through the platform, with results available 24/7 across a web dashboard and mobile app.',
      'sofia-01-p3': 'SGS is the world\'s leading Testing, Inspection and Certification company — one of the most trusted names in industrial quality assurance globally. Sofia is one of their central operational tools.',
      'sofia-02-label': '02 — Challenge',
      'sofia-02-title': 'A platform that had outgrown its design.',
      'sofia-02-p1': 'When I joined SGS as a design apprentice in 2023, Sofia worked — technically. But it had grown faster than its design had. Years of incremental development had left it with inconsistent visual patterns, fragmented navigation logic, no component system, and an interface that had never been intentionally designed for the scale it had reached.',
      'sofia-02-p2': '97,000 users. 17+ languages. Industries ranging from wind turbine maintenance to marine fleet management. And a design that had never had a dedicated designer behind it.',
      'sofia-02-p3': 'The brief wasn\'t "make it look nicer." It was: audit everything, understand what\'s broken, fix it, and ship it globally.',
      'sofia-03-label': '03 — Process',
      'sofia-03-title': 'Two years. Every screen. One designer.',
      'sofia-03-p1': 'I started with a full UX audit — mapping every screen, every user flow, every friction point. Not to catalogue problems, but to understand the system before touching it. In enterprise software at this scale, an uninformed change creates three new problems for every one it fixes.',
      'sofia-03-p2': 'From the audit came a complete rework of the information architecture: navigation restructured around actual user tasks rather than internal data models. Then a component library built from scratch — the first time Sofia had one.',
      'sofia-03-p3': 'Every screen was redesigned in high fidelity before being handed to development. No handoff gaps, because there was only one designer — I was present through implementation, QA, and the global rollout.',
      'sofia-04-label': '04 — Deliverables',
      'sofia-04-title': 'What I built.',
      'sofia-04-p1': '<strong>UX Research & Audit</strong> — Mapped the entire existing platform, identified structural and usability failures, and presented findings to stakeholders before a single pixel changed.',
      'sofia-04-p2': '<strong>Information Architecture</strong> — Rebuilt the navigation and page hierarchy from scratch, prioritising the workflows that 97,000 users actually perform every day.',
      'sofia-04-p3': '<strong>Component Library</strong> — Designed and documented Sofia\'s first ever shared component system: a reusable set of UI elements built for consistency at scale and long-term maintainability.',
      'sofia-04-p4': '<strong>UI Design</strong> — Full high-fidelity redesign across the entire platform, from dashboard to report detail views, in all supported screen sizes.',
      'sofia-04-p5': '<strong>Design QA</strong> — Stayed involved through implementation to catch regressions and ensure the delivered product matched the design intent.',
      'sofia-result': '"The redesigned Sofia shipped to a global rollout without a single major regression in user feedback. For a platform at that scale, that\'s not a given."',
      'sofia-05-label': '05 — Outcome',
      'sofia-05-title': 'Shipped. Globally. Clean.',
      'sofia-05-p1': 'The redesigned platform went live across SGS\'s global network without a significant regression in user feedback — a meaningful benchmark for an enterprise tool at this scale, used daily by nearly 100,000 people with no tolerance for downtime or confusion.',
      'sofia-05-p2': 'The component library built during the project is now the design foundation for ongoing Sofia development. The information architecture rebuilt from scratch became the navigation structure shipped in the final product.',
      'sofia-05-p3': 'Two years. One designer. Every screen.',
      'sofia-cta': 'Have a product that\'s outgrown its design?',
      'sofia-next-label': '[ Next ]',
      'sofia-next-link': 'Back to all work →',
      'pinpire-sector': '[ Sector: Web Game ]',
      'pinpire-badge-role': '[ Role: Designer & Owner ]',
      'pinpire-badge-scope': '[ Scope: Concept + UI Design ]',
      'pinpire-badge-built': '[ Built with: Claude Code ]',
      'pinpire-badge-status': '[ Status: Live — redesign in progress ]',
      'pinpire-hero-problem': 'A map quiz where the year you choose decides which empires and kingdoms exist.',
      'pinpire-stat-type': 'Web game',
      'pinpire-stat-label-type': 'Type',
      'pinpire-stat-status': 'Live',
      'pinpire-stat-label-status': 'Status',
      'pinpire-stat-host': 'Cloudflare',
      'pinpire-stat-label-host': 'Hosted on',
      'pinpire-01-label': '01 — Context',
      'pinpire-01-title': 'What is Pinpire?',
      'pinpire-01-p1': 'Pinpire is a browser-based historical map quiz in the style of Seterra. You pick a region and a year, then click the historical polities — the empires, kingdoms and states of that era — on the map.',
      'pinpire-01-p2': 'It keeps the Seterra format, find a place on a map, and adds time: the year you choose decides which polities exist on the map. I designed it, and built it with Claude Code.',
      'pinpire-02-label': '02 — How it plays',
      'pinpire-02-title': 'Pick a region. Pick a year. Start pinning.',
      'pinpire-02-p1': '<strong>Pick a region</strong> — a continent, or the states of the US.',
      'pinpire-02-p2': '<strong>Pick a year</strong> — it sets which empires, kingdoms and states are on the map.',
      'pinpire-02-p3': '<strong>Click the polities</strong> — find each one on the map as it\'s asked.',
      'pinpire-03-label': '03 — Design',
      'pinpire-03-title': 'Designed first, built second.',
      'pinpire-03-p1': 'I\'m the sole designer and owner of Pinpire. The workflow is design first: I lay out the interface in Figma, then hand it to Claude Code to build.',
      'pinpire-03-p2': 'The game is live and playable today, and its interface is being reworked. The screens on this page are that redesign — still in design, not yet implemented.',
      'pinpire-03-p3': 'The name took a few tries. The project started as Chrono Pin, then became Pin the Past — until other games turned out to use that name, or one very close to it. The new name had to start with “Pin” so my pin logo would still fit. That led to Pinpire.',
      'pinpire-04-label': '04 — Build',
      'pinpire-04-title': 'How it was made.',
      'pinpire-04-p1': '<strong>Figma</strong> — the interface is laid out there first, screen by screen.',
      'pinpire-04-p2': '<strong>Claude Code</strong> — it does the implementation, working from my designs.',
      'pinpire-04-p3': '<strong>Cloudflare Workers</strong> — the game runs on Workers, and the pinpire.com domain is registered with Cloudflare too.',
      'pinpire-05-label': '05 — Roadmap',
      'pinpire-05-title': 'What\'s next.',
      'pinpire-05-p0': 'The core quiz is live. Everything below is planned or only being considered — none of it has shipped.',
      'pinpire-05-p1': '<strong>UI rework</strong> — In design. Being designed in Figma, then implemented by Claude Code.',
      'pinpire-05-p2': '<strong>Flags</strong> — Under consideration. The next update candidate.',
      'pinpire-05-p3': '<strong>Text-to-speech</strong> — Under consideration. Country names read aloud, with a free option preferred over a paid service.',
      'pinpire-05-p4': '<strong>Neighbours mode</strong> — An idea. A random country comes up and you guess every country that borders it; France\'s answer includes Brazil and Suriname. It would start with present-day countries, with past eras maybe later.',
      'pinpire-06-label': '06 — Play',
      'pinpire-06-title': 'Try it yourself.',
      'pinpire-visit': 'Play Pinpire →',
    },
    fr: {
      'nav-contact': '03 — Contact',
      'nav-menu': '[ Menu ]',
      'nav-work': '01 — Travaux',
      'nav-about': '02 — À propos',
      'nav-cta': 'Prendre rendez-vous',
      'about-label': '[ À propos ]',
      'contact-label': '[ Me contacter ]',
      'hero-headline': "J'ai repensé le logiciel qu'utilisent 97 000 personnes chaque jour.",
      'hero-meta': 'Yann Durandet — Designer Web & Identité de marque',
      'hero-availability': SITE_CONFIG.availability.fr,
      'work-label': '[ Travaux sélectionnés ]',
      'about-badge': '[ Secteur : Studio ]',
      'about-lead': "Je crois que le meilleur design ne se contente pas d'être beau — il est juste, parce qu'il a commencé par écouter.",
      'about-p1': "Je travaille avec des fondateurs, des équipes produit et des entreprises qui ont besoin d'un design qui inspire vraiment confiance — pas seulement un design qui fait bonne impression. Pendant deux ans chez SGS, j'ai été le seul designer derrière Sofia : une refonte UX complète d'une plateforme enterprise utilisée quotidiennement par 97 000 personnes dans plus de 40 pays. C'est cette même rigueur que j'apporte à chaque projet, quelle qu'en soit l'échelle.",
      'about-p2': 'Basé en Normandie. Disponible dans le monde entier.',
      'contact-cta': 'Prendre rendez-vous →',
      'contact-status1': "[ Disponible pour l'identité de marque, le design web et la direction artistique ]",
      'contact-status2': '[ Répond généralement sous 24 heures ]',
      'footer-legal': '[ Légal ]',
      'footer-projects': '[ Projets ]',
      'footer-socials': '[ Réseaux ]',
      'footer-copy': '© 2026 DRNDT Studio — Conçu & construit avec trop de caféine',
      'pullquote-text': '« Le rôle du designer est d\'écouter, d\'observer, de comprendre, de sympathiser, d\'empathiser, de synthétiser, et de dégager des intuitions qui lui permettent de « rendre l\'invisible visible ». »',
      'pullquote-cite': '— Hillman Curtis',
      'hero-sub': "Enterprise UX & Brand Design — SGS, leader mondial de l'inspection et de la certification. Disponible pour de nouveaux projets.",
      'how-i-work-label': '[ Comment je travaille ]',
      'hiw-01-title': 'Découverte',
      'hiw-01-body': "Auditer les points de friction et définir le business case avant de déplacer un seul pixel.",
      'hiw-02-title': 'Itération',
      'hiw-02-body': "Construire des design systems scalables à travers des prototypes haute fidélité et des boucles de feedback constantes.",
      'hiw-03-title': 'Livraison',
      'hiw-03-body': "Fournir une documentation prête pour les développeurs et des brand guidelines conçues pour une croissance à long terme.",
      'contact-intro': "Prêt à construire quelque chose aussi performant que beau ? Réservez un appel de 15 minutes pour discuter de votre projet.",
      'contact-availability': 'Disponible pour le Q3 2026',
      'footer-tagline': '"Le design, c\'est l\'empathie en mouvement."',
      // ── Shared case study UI ──
      'cs-back': '← Retour aux travaux',
      'cs-next-back-label': '[ Retour ]',
      'cs-next-back-link': '← Retour aux travaux',
      'cs-next-next-label': '[ Suivant ]',
      'cs-next-next-link': 'Retour à tous les travaux →',
      'cs-have-project': 'Un projet en tête ?',
      'cs-zoom': 'Agrandir l\'image',
      'cs-close-label': '[ Fermer ]',
      // ── DORD ──
      'dord-sector': '[ Secteur : Motorsport ]',
      'dord-badge-deliverable': '[ Livrable : Branding & Web ]',
      'dord-badge-type': '[ Type : Projet actif ]',
      'dord-badge-status': '[ Statut : En ligne & continu ]',
      'dord-stat-deliverable': 'Branding & Web',
      'dord-stat-label-deliverable': 'Livrable',
      'dord-stat-active': 'Projet actif',
      'dord-stat-label-type': 'Type',
      'dord-stat-live': 'En ligne & continu',
      'dord-stat-label-status': 'Statut',
      'dord-01-label': '01 — Contexte',
      'dord-01-title': 'Qu\'est-ce que DORD ?',
      'dord-01-body': 'DORD — abréviation de Department of Racing Drivers — est une plateforme media motorsport que j\'ai construite de zéro, comme projet personnel. Elle couvre le sport automobile international : profils de pilotes, comptes rendus de courses, résultats, et un calendrier en direct couvrant des catégories allant de la Formule 1 aux courses d\'endurance. Plus qu\'un simple blog, elle fonctionne comme un vrai média — avec une identité visuelle définie, une architecture de contenu structurée et une ligne éditoriale construite autour du sport.',
      'dord-02-label': '02 — Défi',
      'dord-02-title': 'Construire de zéro.',
      'dord-02-body': 'La tension inhérente à un projet personnel, c\'est qu\'il risque d\'en avoir l\'air. Le contenu motorsport existe en abondance — des comptes officiels des équipes aux wikis de fans — mais très peu est conçu avec soin. Le défi était de me tenir au même standard que pour n\'importe quelle commande client : un système de marque cohérent, un langage visuel scalable, et un contenu qui donne envie d\'être lu.',
      'dord-03-label': '03 — Processus',
      'dord-03-title': 'Comment ça a évolué.',
      'dord-03-body': 'DORD a commencé comme un projet informel sans direction fixe. Avec le temps, une identité éditoriale plus claire a émergé — typographique, sobre en couleurs, structurée autour de la lisibilité et de la hiérarchie. Le logo a été affiné, la stack typographique fixée, et le système de mise en page conçu pour s\'adapter aux comptes rendus de courses, aux tableaux de classements et aux articles longs. Aujourd\'hui, il repose sur un design épuré, façon publication, qui met le contenu au premier plan.',
      'dord-04-label': '04 — Livrables',
      'dord-04-title': 'Ce qui existe aujourd\'hui.',
      'dord-04-body': 'Le projet couvre le branding, le web design et un calendrier de courses fonctionnel. Les livrables comprennent un système de logo et de wordmark complet, une palette de couleurs et une échelle typographique définies, un site web entièrement designé, et un calendrier de courses interactif suivant les calendriers motorsport internationaux. Chaque élément a été conçu pour fonctionner ensemble comme un système, et non comme une collection d\'assets isolés.',
      'dord-05-label': '05 — Le site',
      'dord-05-title': 'Voir en ligne.',
      'dord-visit': 'Visiter DORD →',
      // ── Vantage ──
      'vantage-sector': '[ Secteur : Automobile ]',
      'vantage-badge-deliverable': '[ Livrable : Identité de marque ]',
      'vantage-badge-type': '[ Type : Commande client ]',
      'vantage-badge-status': '[ Statut : Livré ]',
      'vantage-stat-deliverable': 'Identité de marque',
      'vantage-stat-label-deliverable': 'Livrable',
      'vantage-stat-client': 'Commande client',
      'vantage-stat-label-type': 'Type',
      'vantage-stat-delivered': 'Livré',
      'vantage-stat-label-status': 'Statut',
      'vantage-01-label': '01 — Contexte',
      'vantage-01-title': 'Qu\'est-ce que Vantage Automobiles ?',
      'vantage-01-body': 'Vantage Automobiles est un cabinet de conseil automobile indépendant qui accompagne ses clients dans la recherche, l\'évaluation et l\'acquisition de véhicules en toute confiance. Dans un marché où la confiance est le produit, ils avaient besoin d\'une identité de marque capable de communiquer crédibilité et expertise dès le premier regard — quelque chose d\'établi sans être rigide.',
      'vantage-02-label': '02 — Défi',
      'vantage-02-title': 'La commande.',
      'vantage-02-body': 'Vantage est arrivé sans aucune identité visuelle. La commande consistait à en créer une de toutes pièces : un système de logo, une palette de couleurs et un ensemble de guidelines pour donner à l\'entreprise un visage professionnel sur chaque point de contact. Le défi de design était de distinguer une jeune société de conseil dans un secteur où les concurrents s\'appuient soit sur des clichés patrimoniaux, soit sur une esthétique corporate indifférenciée.',
      'vantage-03-label': '03 — Processus',
      'vantage-03-title': 'Mon approche.',
      'vantage-03-body': 'J\'ai commencé par un exercice de positionnement — en cartographiant où Vantage se situait entre chaleur et précision, accessibilité et autorité. De là, des moodboards ont conduit à l\'exploration du logo : plusieurs directions ont été testées avant d\'aboutir à un signe équilibrant confiance et retenue. La typographie et les couleurs ont été choisies pour renforcer les mêmes qualités — fiable, lisible, crédible.',
      'vantage-04-label': '04 — Livrables',
      'vantage-04-title': 'Ce que j\'ai construit.',
      'vantage-04-body': 'Le package de marque complet comprenait un logo principal et un logomark avec variations d\'usage, un système complet de couleurs et de typographie, un document de brand guidelines pour une application cohérente, et un jeu de mockups montrant l\'identité appliquée dans des contextes réels — papeterie, signalétique et formats digitaux.',
      'vantage-05-label': '05 — Résultat',
      'vantage-05-title': 'Résultat.',
      'vantage-05-body': 'La marque a été livrée et bien accueillie. Elle a donné à Vantage un visage clair et professionnel pour aborder le marché — quelque chose capable de tenir tête aux acteurs plus établis tout en restant spécifique à qui ils sont.',
      // ── Sofia ──
      'sofia-sector': '[ Secteur : Logiciel Enterprise ]',
      'sofia-badge-role': '[ Rôle : Designer principal ]',
      'sofia-badge-scope': '[ Périmètre : UX + UI complet ]',
      'sofia-badge-timeline': '[ Calendrier : 2023 – 2025 ]',
      'sofia-badge-format': '[ Format : Apprentissage ]',
      'sofia-hero-problem': '97 000 personnes utilisaient ce logiciel chaque jour. Personne ne leur avait demandé ce dont elles avaient réellement besoin.',
      'sofia-stat-label-users': 'Utilisateurs dans le monde',
      'sofia-stat-label-countries': 'Pays',
      'sofia-stat-label-languages': 'Langues supportées',
      'sofia-stat-label-samples': 'Échantillons traités / an',
      'sofia-01-label': '01 — Contexte',
      'sofia-01-title': 'Qu\'est-ce que SOFIA ?',
      'sofia-01-p1': 'SOFIA — Solutions for Oil and Fluid Information Applications — est la plateforme enterprise mondiale de SGS pour la surveillance de l\'état des huiles. Ingénieurs de maintenance, gestionnaires de flottes et opérateurs industriels l\'utilisent pour suivre la santé des huiles de machine, graisses et fluides dans les secteurs du transport, de l\'énergie éolienne, des mines et du maritime.',
      'sofia-01-p2': 'Quand un échantillon revient anormal, SOFIA vous prévient avant qu\'une turbine ne tombe en panne ou qu\'un moteur ne gripe. SGS traite plus de 2 millions d\'échantillons d\'huile par an via la plateforme, avec des résultats disponibles 24h/24 via un tableau de bord web et une application mobile.',
      'sofia-01-p3': 'SGS est le leader mondial des services de test, d\'inspection et de certification — l\'un des noms les plus fiables de l\'assurance qualité industrielle mondiale. Sofia est l\'un de leurs outils opérationnels centraux.',
      'sofia-02-label': '02 — Défi',
      'sofia-02-title': 'Une plateforme qui avait dépassé son design.',
      'sofia-02-p1': 'Quand j\'ai rejoint SGS en tant qu\'apprenti designer en 2023, Sofia fonctionnait — techniquement. Mais la plateforme avait évolué plus vite que son design. Des années de développement incrémental avaient laissé des patterns visuels incohérents, une logique de navigation fragmentée, aucun système de composants, et une interface qui n\'avait jamais été intentionnellement conçue pour l\'échelle qu\'elle avait atteinte.',
      'sofia-02-p2': '97 000 utilisateurs. Plus de 17 langues. Des secteurs allant de la maintenance d\'éoliennes à la gestion de flottes maritimes. Et un design qui n\'avait jamais eu de designer dédié derrière lui.',
      'sofia-02-p3': 'La commande n\'était pas « faites-le plus beau ». C\'était : auditez tout, comprenez ce qui est cassé, réparez-le, et déployez-le mondialement.',
      'sofia-03-label': '03 — Processus',
      'sofia-03-title': 'Deux ans. Chaque écran. Un seul designer.',
      'sofia-03-p1': 'J\'ai commencé par un audit UX complet — en cartographiant chaque écran, chaque parcours utilisateur, chaque point de friction. Non pas pour cataloguer les problèmes, mais pour comprendre le système avant d\'y toucher. Dans un logiciel enterprise à cette échelle, un changement mal informé crée trois nouveaux problèmes pour chacun qu\'il résout.',
      'sofia-03-p2': 'L\'audit a conduit à une refonte complète de l\'architecture de l\'information : la navigation restructurée autour des vraies tâches utilisateurs plutôt que des modèles de données internes. Puis une bibliothèque de composants construite de zéro — la première que Sofia ait jamais eue.',
      'sofia-03-p3': 'Chaque écran a été redesigné en haute fidélité avant d\'être remis aux développeurs. Pas de gaps dans la passation, car il n\'y avait qu\'un seul designer — j\'étais présent tout au long de l\'implémentation, de la QA et du déploiement mondial.',
      'sofia-04-label': '04 — Livrables',
      'sofia-04-title': 'Ce que j\'ai construit.',
      'sofia-04-p1': '<strong>Recherche UX & Audit</strong> — Cartographie de la plateforme existante dans son intégralité, identification des défaillances structurelles et d\'utilisabilité, et présentation des conclusions aux parties prenantes avant qu\'un seul pixel ne change.',
      'sofia-04-p2': '<strong>Architecture de l\'information</strong> — Reconstruction totale de la navigation et de la hiérarchie des pages, en priorisant les workflows que 97 000 utilisateurs effectuent vraiment chaque jour.',
      'sofia-04-p3': '<strong>Bibliothèque de composants</strong> — Conception et documentation du premier système de composants partagés de Sofia : un ensemble réutilisable d\'éléments UI conçus pour la cohérence à l\'échelle et la maintenabilité à long terme.',
      'sofia-04-p4': '<strong>UI Design</strong> — Refonte complète en haute fidélité sur l\'ensemble de la plateforme, du tableau de bord aux vues de détail de rapports, pour toutes les tailles d\'écran supportées.',
      'sofia-04-p5': '<strong>Design QA</strong> — Présent tout au long de l\'implémentation pour détecter les régressions et s\'assurer que le produit livré corresponde à l\'intention du design.',
      'sofia-result': '« La nouvelle version de Sofia a été déployée mondialement sans aucune régression majeure dans les retours utilisateurs. Pour une plateforme à cette échelle, ça ne va pas de soi. »',
      'sofia-05-label': '05 — Résultat',
      'sofia-05-title': 'Livré. Mondialement. Proprement.',
      'sofia-05-p1': 'La plateforme redesignée a été déployée sur le réseau mondial de SGS sans régression significative dans les retours utilisateurs — un benchmark important pour un outil enterprise à cette échelle, utilisé quotidiennement par près de 100 000 personnes sans tolérance pour les temps d\'arrêt ou la confusion.',
      'sofia-05-p2': 'La bibliothèque de composants construite pendant le projet est maintenant la base de design pour le développement continu de Sofia. L\'architecture de l\'information reconstruite de zéro est devenue la structure de navigation déployée dans le produit final.',
      'sofia-05-p3': 'Deux ans. Un designer. Chaque écran.',
      'sofia-cta': 'Vous avez un produit qui a dépassé son design ?',
      'sofia-next-label': '[ Suivant ]',
      'sofia-next-link': 'Retour à tous les travaux →',
      'pinpire-sector': '[ Secteur : Jeu web ]',
      'pinpire-badge-role': '[ Rôle : Designer & porteur du projet ]',
      'pinpire-badge-scope': '[ Périmètre : Concept + UI design ]',
      'pinpire-badge-built': '[ Construit avec : Claude Code ]',
      'pinpire-badge-status': '[ Statut : En ligne — refonte en cours ]',
      'pinpire-hero-problem': 'Un quiz cartographique où l\'année choisie décide quels empires et quels royaumes existent.',
      'pinpire-stat-type': 'Jeu web',
      'pinpire-stat-label-type': 'Type',
      'pinpire-stat-status': 'En ligne',
      'pinpire-stat-label-status': 'Statut',
      'pinpire-stat-host': 'Cloudflare',
      'pinpire-stat-label-host': 'Hébergé sur',
      'pinpire-01-label': '01 — Contexte',
      'pinpire-01-title': 'Qu\'est-ce que Pinpire ?',
      'pinpire-01-p1': 'Pinpire est un quiz de cartes historiques, jouable dans le navigateur, dans l\'esprit de Seterra. On choisit une région et une année, puis on clique sur les entités politiques de l\'époque — empires, royaumes et États — sur la carte.',
      'pinpire-01-p2': 'Il garde le format de Seterra, retrouver un lieu sur une carte, et y ajoute le temps : l\'année choisie détermine quelles entités politiques existent sur la carte. Je l\'ai conçu, puis construit avec Claude Code.',
      'pinpire-02-label': '02 — Le jeu',
      'pinpire-02-title': 'Une région. Une année. À vos épingles.',
      'pinpire-02-p1': '<strong>Choisir une région</strong> — un continent, ou les États américains.',
      'pinpire-02-p2': '<strong>Choisir une année</strong> — elle détermine quels empires, royaumes et États figurent sur la carte.',
      'pinpire-02-p3': '<strong>Cliquer sur les entités</strong> — retrouvez chacune sur la carte, au fil des questions.',
      'pinpire-03-label': '03 — Design',
      'pinpire-03-title': 'Conçu d\'abord, construit ensuite.',
      'pinpire-03-p1': 'Je suis l\'unique designer et le propriétaire de Pinpire. Le workflow est « design d\'abord » : je dessine l\'interface dans Figma, puis je construis le site.',
      'pinpire-03-p2': 'Le jeu est en ligne et jouable dès aujourd\'hui, et son interface est finie',
      'pinpire-03-p3': 'Le nom a demandé plusieurs essais. Le projet s\'appelait d\'abord Chrono Pin, puis Pin the Past — jusqu\'à ce que d\'autres jeux utilisent déjà ce nom, ou un nom très proche. Le nouveau nom devait commencer par « Pin » pour que mon logo en forme d\'épingle fonctionne toujours. D\'où Pinpire.',
      'pinpire-04-label': '04 — Fabrication',
      'pinpire-04-title': 'Comment il a été fait.',
      'pinpire-04-p1': '<strong>Figma</strong> — l\'interface y est d\'abord dessinée, écran par écran.',
      'pinpire-04-p2': '<strong>React & Vue</strong> — afin d\'implémenter, à partir de mes maquettes.',
      'pinpire-04-p3': '<strong>Cloudflare Workers</strong> — le jeu tourne sur Workers, et le domaine pinpire.com est lui aussi enregistré chez Cloudflare.',
      'pinpire-05-label': '05 — Jouer',
      'pinpire-05-title': 'Essayez-le vous-même.',
      'pinpire-visit': 'Jouer à Pinpire →',
    },
  };

  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  const detectedLang = (navigator.language || '').startsWith('fr') ? 'fr' : 'en';
  let currentLang = storage.get('lang') || detectedLang;

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (translations[lang][key] !== undefined) {
        el.innerHTML = translations[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-label]').forEach((el) => {
      const label = translations[lang][el.dataset.i18nLabel];
      if (label !== undefined) {
        const suffix = el.dataset.i18nSuffix;
        el.setAttribute('aria-label', suffix ? `${label}: ${suffix}` : label);
      }
    });

    if (langToggle) {
      langToggle.textContent = lang === 'en' ? '[ FR ]' : '[ EN ]';
      langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch language to French' : 'Switch language to English');
    }
    if (langToggleMobile) {
      langToggleMobile.textContent = lang === 'en' ? '[ FR ]' : '[ EN ]';
      langToggleMobile.setAttribute('aria-label', lang === 'en' ? 'Switch language to French' : 'Switch language to English');
    }
    window.dispatchEvent(new Event('langchange'));
  }

  // Persist only an explicit choice, so a visitor who never toggles keeps following their browser language
  function toggleLang() {
    const next = currentLang === 'en' ? 'fr' : 'en';
    storage.set('lang', next);
    applyLang(next);
  }

  applyLang(currentLang);

  if (langToggle) {
    langToggle.addEventListener('click', toggleLang);
  }

  /* -----------------------------------------------
     Dark mode — init + toggle
     ----------------------------------------------- */
  // With no stored choice the page follows the OS (CSS color-scheme + light-dark()).
  // The toggle pins the opposite scheme; toggling back returns to following the OS.
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const THEME_COLORS = { light: '#F0EAD8', dark: '#212622' };

  function pinnedTheme() {
    const stored = storage.get('theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
  }

  function effectiveTheme() {
    return pinnedTheme() ?? (systemDark.matches ? 'dark' : 'light');
  }

  function renderTheme() {
    const theme = effectiveTheme();
    const pinned = pinnedTheme();
    if (pinned) {
      root.dataset.theme = pinned;
    } else {
      delete root.dataset.theme;
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);

    const label = theme === 'dark' ? '[ Light ]' : '[ Dark ]';
    const ariaLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    [themeToggle, themeToggleMobile].forEach((btn) => {
      if (!btn) return;
      btn.textContent = label;
      btn.setAttribute('aria-label', ariaLabel);
    });
  }

  function toggleTheme() {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    const system = systemDark.matches ? 'dark' : 'light';
    if (next === system) {
      storage.remove('theme');
    } else {
      storage.set('theme', next);
    }
    renderTheme();
  }

  renderTheme();
  systemDark.addEventListener('change', renderTheme);

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Mobile footer toggles
  if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLang);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  /* -----------------------------------------------
     Image lightbox — native <dialog> (case-study pages)
     Images are wrapped in buttons here, so the HTML stays plain <img> without JS.
     Built before the cursor setup so the buttons get the hover treatment too.
     ----------------------------------------------- */
  const caseImages = document.querySelectorAll('.cs-img img');
  if (caseImages.length) {
    const lightbox = document.createElement('dialog');
    lightbox.className = 'lightbox';

    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox__img';

    const closeForm = document.createElement('form');
    closeForm.method = 'dialog';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox__close';
    closeBtn.dataset.i18n = 'cs-close-label';
    closeBtn.textContent = translations[currentLang]['cs-close-label'];
    closeForm.append(closeBtn);

    lightbox.append(lightboxImg, closeForm);
    document.body.append(lightbox);

    // A click anywhere (backdrop or image) closes; Esc and the close button work natively
    lightbox.addEventListener('click', () => lightbox.close());

    // Largest candidate from srcset, falling back to what the page already loaded
    function largestSource(img) {
      const candidates = (img.srcset || '')
        .split(',')
        .map((entry) => entry.trim().split(/\s+/))
        .filter(([url, descriptor]) => url && descriptor && descriptor.endsWith('w'))
        .map(([url, descriptor]) => ({ url, width: parseInt(descriptor, 10) }))
        .sort((a, b) => b.width - a.width);
      return candidates.length ? candidates[0].url : img.currentSrc || img.src;
    }

    caseImages.forEach((img) => {
      const zoom = document.createElement('button');
      zoom.type = 'button';
      zoom.className = 'cs-img__zoom';
      zoom.dataset.i18nLabel = 'cs-zoom';
      zoom.dataset.i18nSuffix = img.alt;
      zoom.setAttribute('aria-label', `${translations[currentLang]['cs-zoom']}: ${img.alt}`);
      img.replaceWith(zoom);
      zoom.append(img);

      zoom.addEventListener('click', () => {
        lightboxImg.src = largestSource(img);
        lightboxImg.alt = img.alt;
        lightbox.setAttribute('aria-label', img.alt);
        lightbox.showModal();
      });
    });
  }

  /* -----------------------------------------------
     Custom Cursor — dot + ring (fine pointers only)
     ----------------------------------------------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring && finePointer.matches) {
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let cursorRafId = 0;

    // Only run the frame loop while the cursor is still catching up with the pointer
    function animateCursor() {
      // Dot snaps fast
      dotX = lerp(dotX, mouseX, 0.6);
      dotY = lerp(dotY, mouseY, 0.6);
      dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

      // Ring lerps slower
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

      const settled = Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1;
      cursorRafId = settled ? 0 : requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorRafId) cursorRafId = requestAnimationFrame(animateCursor);
    });

    animateCursor();

    // Inject label span into ring
    const cursorLabel = document.createElement('span');
    cursorLabel.className = 'cursor-label';
    ring.appendChild(cursorLabel);

    // Hover scale on interactive elements (contact CTA gets special label below)
    const hoverTargets = document.querySelectorAll('a:not(.contact__cta), button, [data-hoverable]');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });

    // Cursor label on a target: [selector, label]
    [
      ['.contact__cta', 'Mail'],
      ['div.work__grid-item', '[ — ]'],  // unavailable grid items
      ['.cs-img__zoom', '[ + ]'],        // lightbox triggers
    ].forEach(([selector, label]) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorLabel.textContent = label;
          ring.classList.add('is-project-hover');
          ring.classList.remove('is-hover'); // prevent size conflict
        });
        el.addEventListener('mouseleave', () => {
          cursorLabel.textContent = '';
          ring.classList.remove('is-project-hover');
        });
      });
    });
  }

  /* -----------------------------------------------
     Phone menu (native popover): close it once a link inside is followed
     ----------------------------------------------- */
  const navMenu = document.getElementById('navLinks');
  if (navMenu && typeof navMenu.hidePopover === 'function') {
    navMenu.addEventListener('click', (e) => {
      if (e.target instanceof Element && e.target.closest('a') && navMenu.matches(':popover-open')) {
        navMenu.hidePopover();
      }
    });
  }

  /* -----------------------------------------------
     Nav scroll state
     ----------------------------------------------- */
  const nav = document.querySelector('.nav');

  let lastScrollY = 0;
  const NAV_THRESHOLD = 60;

  function updateNav() {
    const currentY = window.scrollY;
    if (currentY > NAV_THRESHOLD) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
      nav.classList.remove('nav--hidden');
    }

    // Hide on scroll down, show on scroll up (only after threshold)
    if (currentY > NAV_THRESHOLD) {
      if (currentY > lastScrollY + 5) {
        nav.classList.add('nav--hidden');
      } else if (currentY < lastScrollY - 5) {
        nav.classList.remove('nav--hidden');
      }
    }
    lastScrollY = currentY;
  }

  window.addEventListener('scroll', updateNav, { passive: true });

  /* -----------------------------------------------
     [data-reveal] — IntersectionObserver fallback
     Browsers with scroll-driven animations reveal via CSS (animation-timeline: view()),
     and reduced-motion users see everything straight away, so only the rest need this.
     ----------------------------------------------- */
  if (!supportsViewTimeline && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  }

  /* -----------------------------------------------
     Magnetic hover — nav links & CTA
     ----------------------------------------------- */
  const magneticEls = document.querySelectorAll('.nav__links a, .nav__links button');
  const MAX_PULL = 6;

  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const px = (dx / rect.width) * MAX_PULL * 2;
      const py = (dy / rect.height) * MAX_PULL * 2;
      el.style.transform = `translate(${px}px, ${py}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });









  /* -----------------------------------------------
     Altimeter — scroll-driven, m/ft toggle (home page only)
     ----------------------------------------------- */
  const altValue = document.querySelector('.altimeter__value');
  const altUnit = document.querySelector('.altimeter__unit');
  const altBar = document.querySelector('.altimeter__bar');
  const altBarFill = document.querySelector('.altimeter__bar-fill');

  if (altValue && altUnit && altBar && altBarFill) {
    let useMeters = true;
    const MAX_ALT_M = 4810; // Mont Blanc
    // The bar fills from a CSS scroll timeline; set --alt-progress only where that isn't available
    const barNeedsScript = !supportsScrollTimeline || reducedMotion.matches;

    function updateAltimeter() {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollH > 0 ? window.scrollY / scrollH : 0;
      const altM = Math.round(progress * MAX_ALT_M);
      const altFt = Math.round(altM * 3.28084);

      altValue.textContent = useMeters
        ? altM.toLocaleString()
        : altFt.toLocaleString();
      if (barNeedsScript) altBarFill.style.setProperty('--alt-progress', progress);
    }

    function toggleUnit() {
      useMeters = !useMeters;
      altUnit.textContent = useMeters ? 'm' : 'ft';
      updateAltimeter();
    }

    // Both controls are <button>s, so Enter/Space activate them natively
    altUnit.addEventListener('click', toggleUnit);
    altBar.addEventListener('click', toggleUnit);

    window.addEventListener('scroll', updateAltimeter, { passive: true });
    updateAltimeter();
  }

  /* -----------------------------------------------
     Illustration parallax — scroll fallback
     (browsers with scroll-driven animations do this in CSS)
     ----------------------------------------------- */
  if (!supportsViewTimeline && !reducedMotion.matches) {
    const items = [
      { selector: '.hero__painting img',   depth: 0.15 },
      { selector: '.scene-break img',      depth: 0.30 },
    ]
      .map(({ selector, depth }) => {
        const el = document.querySelector(selector);
        return { el, wrapper: el?.closest('.hero__painting, .scene-break'), depth };
      })
      .filter(({ el, wrapper }) => el && wrapper);

    if (items.length) {
      const tick = () => {
        items.forEach(({ el, wrapper, depth }) => {
          const rect = wrapper.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const center = rect.top + rect.height / 2 - window.innerHeight / 2;
          el.style.translate = `0 ${center * depth * -1}px`;
        });
      };

      window.addEventListener('scroll', tick, { passive: true });
      tick();
    }
  }

  /* -----------------------------------------------
     Contact image — match body height at 3:5 ratio
     Also re-synced after web fonts load and after a language switch, which change
     the body height without a window resize. (Not a ResizeObserver: the image width
     feeds back into the body's text wrapping, so observing it could oscillate.)
     ----------------------------------------------- */
  const contactBody = document.querySelector('.contact__body');
  const contactBg = document.querySelector('.contact__bg');
  if (contactBody && contactBg) {
    const syncContactImage = () => {
      contactBg.style.width = window.innerWidth <= 768 ? '' : `${contactBody.offsetHeight * 3 / 5}px`;
    };
    syncContactImage();
    window.addEventListener('resize', syncContactImage);
    window.addEventListener('langchange', syncContactImage);
    document.fonts?.ready.then(syncContactImage);
  }
})();

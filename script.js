(() => {
  'use strict';

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* -----------------------------------------------
     Preloader
     ----------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('is-done');
      setTimeout(() => preloader.remove(), 1200);
    }, 1800);
  });

  /* -----------------------------------------------
     Smooth scroll engine — wheel-based lerp
     ----------------------------------------------- */
  if (!('ontouchstart' in window) && window.innerWidth > 640 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let scrollTargetY = window.scrollY;
    let scrollCurrentY = window.scrollY;
    let isWheelScroll = false;

    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      isWheelScroll = true;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollTargetY = Math.max(0, Math.min(scrollTargetY + e.deltaY, maxScroll));
    }, { passive: false });

    // Intercept anchor clicks — set scrollTargetY directly to avoid lerp/jump race
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          scrollTargetY = target.getBoundingClientRect().top + window.scrollY;
        }
      });
    });

    // Sync with keyboard scroll, programmatic scrollTo
    window.addEventListener('scroll', () => {
      if (!isWheelScroll) {
        scrollTargetY = window.scrollY;
        scrollCurrentY = window.scrollY;
      }
      isWheelScroll = false;
    }, { passive: true });

    let smoothScrollRafId;
    function smoothScrollLoop() {
      if (Math.abs(scrollCurrentY - scrollTargetY) > 0.5) {
        scrollCurrentY = lerp(scrollCurrentY, scrollTargetY, 0.20);
        window.scrollTo(0, scrollCurrentY);
      }
      smoothScrollRafId = requestAnimationFrame(smoothScrollLoop);
    }
    smoothScrollLoop();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(smoothScrollRafId);
      } else {
        smoothScrollLoop();
      }
    });
  }

  /* -----------------------------------------------
     i18n — translations, detection, toggle
     ----------------------------------------------- */
  const SITE_CONFIG = {
    availability: {
      en: '[ Available for new projects ]',
      fr: '[ Disponible pour de nouveaux projets ]',
    },
    bookingDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + 2);
      const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthsFr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      return {
        en: `${monthsEn[d.getMonth()]} ${d.getFullYear()}`,
        fr: `${monthsFr[d.getMonth()]} ${d.getFullYear()}`,
      };
    })(),
  };

  const translations = {
    en: {
      'nav-contact': '03 — Contact',
      'nav-work': '01 — Work',
      'nav-about': '02 — About',
      'nav-cta': 'Book a Call',
      'work-cat-sofia': '[ Enterprise UX ]',
      'work-cat-vantage': '[ Brand Identity ]',
      'work-cat-dord': '[ Personal ]',
      'about-label': '[ About ]',
      'contact-label': '[ Get in touch ]',
      'sofia-meta-role': '[ Role: Lead Designer ]',
      'sofia-meta-scope': '[ Scope: UX + UI ]',
      'sofia-meta-timeline': '[ Timeline: 2 years ]',
      'sofia-meta-users': '[ Users: 30,000+ ]',
      'sofia-caption': '[ Sofia platform, SGS — 2023–2025 ]',
      'about-disciplines': 'Brand Identity · Web Design · Creative Direction · UX Research',
      'hero-headline': 'Strategic Web & Brand Design for Founders and Enterprise Teams.',
      'hero-meta': 'Yann Durandet — Web & Brand Designer',
      'hero-availability': SITE_CONFIG.availability.en,
      'work-label': '[ Selected Work ]',
      'experiments-line': '+ Various experiments and design snippets — available on my <a href="https://instagram.com/durandet.studio" class="inline__link" target="_blank" rel="noopener noreferrer">Instagram</a>',
      'sofia-badge': '[ Sector: Enterprise UX ]',
      'sofia-problem': 'Tens of thousands of people used this software every day. Nobody had asked them what they actually needed.',
      'sofia-p1': 'Global Enterprise Platform for a Fortune 500 leader, deployed across 40 countries to over 30,000 users. When I joined, the platform had outgrown its design — functional, but fractured.',
      'sofia-p2': 'Over two years, I led the full redesign from the inside out: UX research, information architecture, component design, and final UI delivery — no handoff gaps, no external agency, one designer.',
      'sofia-p3': 'Unified a fractured ecosystem into a single, high-performance Design System. Zero user regressions post-rollout. At that scale, that result is earned, not assumed.',
      'vantage-badge': '[ Brand Identity ]',
      'vantage-p1': 'Vantage sources high-end vehicles from across Europe for clients in Normandy — privately, precisely, without the dealership experience. They needed a brand that felt as considered as their service.',
      'vantage-p2': 'I built their identity from scratch: naming direction, logo, colour system, and visual language. The brief was trust before a word is spoken.',
      'vantage-result': 'Brand live — currently sourcing clients across Normandy',
      'dord-badge': '[ Personal — Ongoing ]',
      'dord-p1': "A motorsports news and calendar site I run because I wanted to build something for an audience I'm already part of. Design, content, and code — all mine.",
      'dord-result': 'Growing audience — built entirely in personal time',
      'about-badge': '[ Sector: Studio ]',
      'about-lead': "I believe the best design doesn't just look right — it feels right, because it started with listening.",
      'about-p1': "Agency-Level Strategy. Studio-Level Attention. You're getting years of expertise — from brand identity to enterprise UX — delivered through a single, senior point of contact. I bridge the gap between high-level creative direction and technical execution for clients worldwide.",
      'about-p2': 'Based in Normandy. Working worldwide.',
      'contact-cta': 'Book a 15-min call →',
      'contact-status1': '[ Available for brand identity, web design, and creative direction ]',
      'contact-status2': '[ Usually responds within 24 hours ]',
      'work-cat-sonar': '[ Brand Design ]',
      'sonar-badge': '[ Sector: Software ]',
      'sonar-meta-perimeter': '[ Perimeter: Branding ]',
      'sonar-meta-time': '[ Time: 2 months ]',
      'sonar-problem': 'A brand that hears what others miss.',
      'sonar-caption': '[ SONAR — Brand Design, 2025 ]',
      'sonar-p1': "SONAR is built around precision detection — the ability to read what's beneath the surface. Where others see noise, SONAR finds signal. A brand for those who listen differently.",
      'footer-text': '© 2026 DRNDT Studio — Designed & built by hand',
      'footer-copy': '© 2026 DRNDT Studio — Designed & built with too much caffeine',
      'pullquote-text': '"The goal of a designer is to listen, observe, understand, sympathize, empathize, synthesize, and glean insights that enable him or her to \'make the invisible visible.\'"',
      'pullquote-cite': '— Hillman Curtis',
      'hero-sub': 'Building high-end digital identities and scalable UX that earn trust before a word is spoken.',
      'how-i-work-label': '[ How I Work ]',
      'hiw-01-title': 'Discovery',
      'hiw-01-body': 'Auditing friction points and defining the business case before a single pixel is moved.',
      'hiw-02-title': 'Iteration',
      'hiw-02-body': 'Building scalable design systems through high-fidelity prototyping and constant feedback loops.',
      'hiw-03-title': 'Handoff',
      'hiw-03-body': 'Delivering developer-ready documentation and brand guidelines designed for long-term growth.',
      'contact-intro': 'Ready to build something that feels as good as it looks? Book a 15-minute intro call to discuss your project.',
      'contact-availability': `Now booking for ${SITE_CONFIG.bookingDate.en}`,
      'footer-tagline': '"Design is empathy in motion."',
    },
    fr: {
      'nav-contact': '03 — Contact',
      'nav-work': '01 — Travaux',
      'nav-about': '02 — À propos',
      'nav-cta': 'Prendre rendez-vous',
      'work-cat-sofia': '[ UX Entreprise ]',
      'work-cat-vantage': '[ Identité de marque ]',
      'work-cat-dord': '[ Personnel ]',
      'about-label': '[ À propos ]',
      'contact-label': '[ Me contacter ]',
      'sofia-meta-role': '[ Rôle : Designer principal ]',
      'sofia-meta-scope': '[ Périmètre : UX + UI ]',
      'sofia-meta-timeline': '[ Durée : 2 ans ]',
      'sofia-meta-users': '[ Utilisateurs : 30 000+ ]',
      'sofia-caption': '[ Plateforme Sofia, SGS — 2023–2025 ]',
      'about-disciplines': 'Identité de marque · Design web · Direction artistique · Recherche UX',
      'hero-headline': 'Web & Brand Design stratégique pour entreprises et startups.',
      'hero-meta': 'Yann Durandet — Designer Web & Identité de marque',
      'hero-availability': SITE_CONFIG.availability.fr,
      'work-label': '[ Travaux sélectionnés ]',
      'experiments-line': '+ Diverses expérimentations et snippets design — disponibles sur mon <a href="https://instagram.com/durandet.studio" class="inline__link" target="_blank" rel="noopener noreferrer">Instagram</a>',
      'sofia-badge': '[ Secteur : UX Entreprise ]',
      'sofia-problem': "Des dizaines de milliers de personnes utilisaient ce logiciel chaque jour. Personne ne leur avait jamais demandé ce dont ils avaient réellement besoin.",
      'sofia-p1': "Plateforme Enterprise mondiale pour un leader Fortune 500, déployée dans 40 pays auprès de plus de 30 000 utilisateurs. À mon arrivée, la plateforme avait dépassé son design — fonctionnelle, mais fragmentée.",
      'sofia-p2': "Sur deux ans, j'ai mené la refonte complète de l'intérieur : recherche UX, architecture de l'information, design des composants, livraison UI finale — sans agence externe, sans rupture de suivi, un seul designer.",
      'sofia-p3': "Résultat : un écosystème fragmenté unifié en un Design System haute performance. Zéro régression utilisateur post-déploiement. À cette échelle, ce résultat se mérite.",
      'vantage-badge': '[ Identité de marque ]',
      'vantage-p1': "Vantage source des véhicules haut de gamme à travers l'Europe pour des clients en Normandie — discrètement, précisément, sans l'expérience concessionnaire. Ils avaient besoin d'une marque aussi soignée que leur service.",
      'vantage-p2': "J'ai construit leur identité de zéro : direction de naming, logo, système de couleurs et langage visuel. Le brief était de gagner la confiance avant qu'un mot soit prononcé.",
      'vantage-result': 'Marque en ligne — actuellement en recherche de clients en Normandie',
      'dord-badge': '[ Personnel — En cours ]',
      'dord-p1': "Un site d'actualités et de calendrier motorsport que je gère parce que je voulais construire quelque chose pour une audience dont je fais déjà partie. Design, contenu et code — tout est de moi.",
      'dord-result': 'Audience en croissance — construit entièrement sur mon temps personnel',
      'about-badge': '[ Secteur : Studio ]',
      'about-lead': "Je crois que le meilleur design ne se contente pas d'être beau — il est juste, parce qu'il a commencé par écouter.",
      'about-p1': "Stratégie de niveau agence. Attention de niveau studio. Vous bénéficiez d'années d'expertise — de l'identité de marque à l'UX enterprise — livrées par un unique point de contact senior. Je comble le fossé entre la direction créative de haut niveau et l'exécution technique pour des clients du monde entier.",
      'about-p2': 'Basé en Normandie. Disponible dans le monde entier.',
      'contact-cta': 'Prendre rendez-vous →',
      'contact-status1': "[ Disponible pour l'identité de marque, le design web et la direction artistique ]",
      'contact-status2': '[ Répond généralement sous 24 heures ]',
      'work-cat-sonar': '[ Design de Marque ]',
      'sonar-badge': '[ Secteur : Logiciel ]',
      'sonar-meta-perimeter': '[ Périmètre : Branding ]',
      'sonar-meta-time': '[ Durée : 2 mois ]',
      'sonar-problem': 'Une marque qui entend ce que les autres manquent.',
      'sonar-caption': '[ SONAR — Design de Marque, 2025 ]',
      'sonar-p1': "SONAR repose sur la détection de précision — la capacité à lire ce qui se trouve sous la surface. Là où les autres voient du bruit, SONAR trouve le signal. Une marque pour ceux qui écoutent autrement.",
      'footer-text': '© 2026 DRNDT Studio — Conçu & construit à la main',
      'footer-copy': '© 2026 DRNDT Studio — Conçu & construit avec trop de caféine',
      'pullquote-text': '« Le rôle du designer est d\'écouter, d\'observer, de comprendre, de sympathiser, d\'empathiser, de synthétiser, et de dégager des intuitions qui lui permettent de « rendre l\'invisible visible ». »',
      'pullquote-cite': '— Hillman Curtis',
      'hero-sub': "Créer des identités digitales haut de gamme et des UX scalables qui inspirent confiance avant qu'un mot soit prononcé.",
      'how-i-work-label': '[ Comment je travaille ]',
      'hiw-01-title': 'Découverte',
      'hiw-01-body': "Auditer les points de friction et définir le business case avant de déplacer un seul pixel.",
      'hiw-02-title': 'Itération',
      'hiw-02-body': "Construire des design systems scalables à travers des prototypes haute fidélité et des boucles de feedback constantes.",
      'hiw-03-title': 'Livraison',
      'hiw-03-body': "Fournir une documentation prête pour les développeurs et des brand guidelines conçues pour une croissance à long terme.",
      'contact-intro': "Prêt à construire quelque chose aussi performant que beau ? Réservez un appel de 15 minutes pour discuter de votre projet.",
      'contact-availability': `Disponible à partir de ${SITE_CONFIG.bookingDate.fr}`,
      'footer-tagline': '"Le design, c\'est l\'empathie en mouvement."',
    },
  };

  const langToggle = document.getElementById('langToggle');
  const detectedLang = (navigator.language || '').startsWith('fr') ? 'fr' : 'en';
  let currentLang = localStorage.getItem('lang') || detectedLang;

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

    langToggle.textContent = lang === 'en' ? '[ FR ]' : '[ EN ]';
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch language to French' : 'Switch language to English');
    localStorage.setItem('lang', lang);
  }

  applyLang(currentLang);

  langToggle.addEventListener('click', () => {
    applyLang(currentLang === 'en' ? 'fr' : 'en');
  });

  /* -----------------------------------------------
     Dark mode — init + toggle
     ----------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '[ Light ]';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      document.body.removeAttribute('data-theme');
      themeToggle.textContent = '[ Dark ]';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
    localStorage.setItem('theme', theme);
  }

  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  /* -----------------------------------------------
     Custom Cursor — dot + ring
     ----------------------------------------------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let cursorRafId;
  function animateCursor() {
    // Dot snaps fast
    dotX = lerp(dotX, mouseX, 0.6);
    dotY = lerp(dotY, mouseY, 0.6);
    dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

    // Ring lerps slower
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

    cursorRafId = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Inject label span into ring
  const cursorLabel = document.createElement('span');
  cursorLabel.className = 'cursor-label';
  ring.appendChild(cursorLabel);

  // Hover scale on interactive elements (skip work items + contact CTA — handled below)
  const hoverTargets = document.querySelectorAll('a:not(.work__item):not(.contact__cta), button, [data-hoverable]');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });

  // Cursor label — work items
  document.querySelectorAll('.work__item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorLabel.textContent = 'View';
      ring.classList.add('is-project-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorLabel.textContent = '';
      ring.classList.remove('is-project-hover');
    });
  });

  // Cursor label — contact CTA
  const contactCta = document.querySelector('.contact__cta');
  if (contactCta) {
    contactCta.addEventListener('mouseenter', () => {
      cursorLabel.textContent = 'Mail';
      ring.classList.add('is-project-hover');
    });
    contactCta.addEventListener('mouseleave', () => {
      cursorLabel.textContent = '';
      ring.classList.remove('is-project-hover');
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
     [data-reveal] — IntersectionObserver
     ----------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-img]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger by sibling index
          const parent = entry.target.parentElement;
          const siblings = parent.querySelectorAll('[data-reveal]');
          let idx = 0;
          siblings.forEach((sib, i) => {
            if (sib === entry.target) idx = i;
          });
          entry.target.style.transitionDelay = `${idx * 100}ms`;
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* -----------------------------------------------
     Magnetic hover — nav links & CTA
     ----------------------------------------------- */
  const magneticEls = document.querySelectorAll('.nav__links a, .nav__links button, .contact__cta');
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
     Work counter — index on hover
     ----------------------------------------------- */
  const counterCurrent = document.querySelector('.work__counter-current');
  const workListEl = document.querySelector('.work__list');

  document.querySelectorAll('.work__item').forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      if (counterCurrent) counterCurrent.textContent = String(i + 1).padStart(2, '0');
    });
  });

  if (workListEl && counterCurrent) {
    workListEl.addEventListener('mouseleave', () => {
      counterCurrent.textContent = '00';
    });
  }

  /* -----------------------------------------------
     Work Hover — floating placeholder
     ----------------------------------------------- */
  const workItems = document.querySelectorAll('.work__item');
  const hoverFloat = document.querySelector('.work__hover-float');
  const hoverImg = document.querySelector('.work__hover-img');

  let floatX = 0;
  let floatY = 0;
  let floatRenderX = 0;
  let floatRenderY = 0;
  let floatVisible = false;

  let floatRafId;
  function animateFloat() {
    if (floatVisible) {
      floatRenderX = lerp(floatRenderX, floatX, 0.1);
      floatRenderY = lerp(floatRenderY, floatY, 0.1);
      hoverFloat.style.transform =
        `translate(${floatRenderX}px, ${floatRenderY}px)`;
    }
    floatRafId = requestAnimationFrame(animateFloat);
  }

  animateFloat();

  workItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const src = item.dataset.image;
      if (src) hoverImg.src = src;
      hoverFloat.classList.add('is-active');
      floatVisible = true;
    });

    item.addEventListener('mousemove', (e) => {
      floatX = e.clientX + 24;
      floatY = e.clientY - 100;
    });

    item.addEventListener('mouseleave', () => {
      hoverFloat.classList.remove('is-active');
      floatVisible = false;
    });
  });

  /* -----------------------------------------------
     Sofia parallax — scroll-driven window effect
     ----------------------------------------------- */
  const sofiaPx = document.querySelector('.sofia-parallax');
  if (sofiaPx) {
    const mapLayer = sofiaPx.querySelector('.sofia-layer--map');
    const uiLayer = sofiaPx.querySelector('.sofia-layer--ui');

    const MAP_SPEED = 40; // px travel at viewport edges
    const UI_SPEED = 70;

    let mapY = 0, uiY = 0;
    let mapTargetY = 0, uiTargetY = 0;

    function updateScrollTargets() {
      const rect = sofiaPx.getBoundingClientRect();
      const vh = window.innerHeight;
      // +1 = element center at bottom of viewport, -1 = at top
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      mapTargetY = clamped * MAP_SPEED;
      uiTargetY = clamped * UI_SPEED;
    }

    window.addEventListener('scroll', updateScrollTargets, { passive: true });
    updateScrollTargets();

    let parallaxRafId;
    function animateParallax() {
      mapY = lerp(mapY, mapTargetY, 0.08);
      uiY = lerp(uiY, uiTargetY, 0.1);
      mapLayer.style.transform = `translateY(${mapY}px)`;
      uiLayer.style.transform = `translateY(${uiY}px)`;
      parallaxRafId = requestAnimationFrame(animateParallax);
    }
    animateParallax();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(parallaxRafId);
      } else {
        animateParallax();
      }
    });
  }

  /* -----------------------------------------------
     SONAR parallax — scroll-driven
     ----------------------------------------------- */
  const sonarPx = document.querySelector('.sonar-parallax');
  if (sonarPx) {
    const sonarBg = sonarPx.querySelector('.sonar-layer--bg');
    const sonarLogo = sonarPx.querySelector('.sonar-layer--logo');
    const BG_SPEED = 40, LOGO_SPEED = 20;
    let sonarBgY = 0, sonarLogoY = 0, sonarBgTargetY = 0, sonarLogoTargetY = 0;

    function updateSonarTargets() {
      const rect = sonarPx.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
      const c = Math.max(-1, Math.min(1, progress));
      sonarBgTargetY = c * BG_SPEED;
      sonarLogoTargetY = c * LOGO_SPEED;
    }
    window.addEventListener('scroll', updateSonarTargets, { passive: true });
    updateSonarTargets();

    let sonarRafId;
    function animateSonarParallax() {
      sonarBgY = lerp(sonarBgY, sonarBgTargetY, 0.08);
      sonarLogoY = lerp(sonarLogoY, sonarLogoTargetY, 0.1);
      sonarBg.style.transform = `translateY(${sonarBgY}px)`;
      sonarLogo.style.transform = `translateY(${sonarLogoY}px)`;
      sonarRafId = requestAnimationFrame(animateSonarParallax);
    }
    animateSonarParallax();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(sonarRafId);
      else animateSonarParallax();
    });
  }

  /* -----------------------------------------------
     Altimeter — scroll-driven, m/ft toggle
     ----------------------------------------------- */
  const altValue = document.querySelector('.altimeter__value');
  const altUnit = document.querySelector('.altimeter__unit');
  const altBar = document.querySelector('.altimeter__bar');
  const altBarFill = document.querySelector('.altimeter__bar-fill');
  let useMeters = true;
  const MAX_ALT_M = 4810; // Mont Blanc

  function updateAltimeter() {
    const scrollH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollH > 0 ? window.scrollY / scrollH : 0;
    const altM = Math.round(progress * MAX_ALT_M);
    const altFt = Math.round(altM * 3.28084);

    altValue.textContent = useMeters
      ? altM.toLocaleString()
      : altFt.toLocaleString();
    altBarFill.style.height = `${progress * 100}%`;
  }

  function toggleUnit() {
    useMeters = !useMeters;
    altUnit.textContent = useMeters ? 'm' : 'ft';
    updateAltimeter();
  }

  altUnit.addEventListener('click', toggleUnit);
  altBar.addEventListener('click', toggleUnit);

  window.addEventListener('scroll', updateAltimeter, { passive: true });
  updateAltimeter();

  /* -----------------------------------------------
     Work counter — dynamic total
     ----------------------------------------------- */
  const workCounterTotal = document.querySelector('.work__counter-total');
  if (workCounterTotal) {
    const total = document.querySelectorAll('.work__item').length;
    workCounterTotal.textContent = `/${String(total).padStart(2, '0')}`;
  }

  /* -----------------------------------------------
     rAF cleanup on tab hide (cursor + float)
     Smooth scroll and parallax manage their own visibilitychange handlers.
     ----------------------------------------------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(cursorRafId);
      cancelAnimationFrame(floatRafId);
    } else {
      animateCursor();
      animateFloat();
    }
  });
})();

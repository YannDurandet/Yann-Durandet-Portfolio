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
      preloader.setAttribute('aria-hidden', 'true');
      preloader.classList.add('is-done');
      setTimeout(() => preloader.remove(), 800);
    }, 1200);
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
      'about-label': '[ About ]',
      'contact-label': '[ Get in touch ]',
      'hero-headline': 'Strategic Web & Brand Design for Founders and Enterprise Teams.',
      'hero-meta': 'Yann Durandet — Web & Brand Designer',
      'hero-availability': SITE_CONFIG.availability.en,
      'work-label': '[ Selected Work ]',
      'about-badge': '[ Sector: Studio ]',
      'about-lead': "I believe the best design doesn't just look right — it feels right, because it started with listening.",
      'about-p1': "Agency-Level Strategy. Studio-Level Attention. You're getting years of expertise — from brand identity to enterprise UX — delivered through a single, senior point of contact. I bridge the gap between high-level creative direction and technical execution for clients worldwide.",
      'about-p2': 'Based in Normandy. Working worldwide.',
      'contact-cta': 'Book a 15-min call →',
      'contact-status1': '[ Available for brand identity, web design, and creative direction ]',
      'contact-status2': '[ Usually responds within 24 hours ]',
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
      'about-label': '[ À propos ]',
      'contact-label': '[ Me contacter ]',
      'hero-headline': 'Web & Brand Design stratégique pour entreprises et startups.',
      'hero-meta': 'Yann Durandet — Designer Web & Identité de marque',
      'hero-availability': SITE_CONFIG.availability.fr,
      'work-label': '[ Travaux sélectionnés ]',
      'about-badge': '[ Secteur : Studio ]',
      'about-lead': "Je crois que le meilleur design ne se contente pas d'être beau — il est juste, parce qu'il a commencé par écouter.",
      'about-p1': "Stratégie de niveau agence. Attention de niveau studio. Vous bénéficiez d'années d'expertise — de l'identité de marque à l'UX enterprise — livrées par un unique point de contact senior. Je comble le fossé entre la direction créative de haut niveau et l'exécution technique pour des clients du monde entier.",
      'about-p2': 'Basé en Normandie. Disponible dans le monde entier.',
      'contact-cta': 'Prendre rendez-vous →',
      'contact-status1': "[ Disponible pour l'identité de marque, le design web et la direction artistique ]",
      'contact-status2': '[ Répond généralement sous 24 heures ]',
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
  const langToggleMobile = document.getElementById('langToggleMobile');
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
    if (langToggleMobile) {
      langToggleMobile.textContent = lang === 'en' ? '[ FR ]' : '[ EN ]';
      langToggleMobile.setAttribute('aria-label', lang === 'en' ? 'Switch language to French' : 'Switch language to English');
    }
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
  const themeToggleMobile = document.getElementById('themeToggleMobile');
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
    if (themeToggleMobile) {
      themeToggleMobile.textContent = theme === 'dark' ? '[ Light ]' : '[ Dark ]';
      themeToggleMobile.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    localStorage.setItem('theme', theme);
  }

  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Mobile footer toggles (may not exist on sofia.html — guard with if)
  if (langToggleMobile) {
    langToggleMobile.addEventListener('click', () => applyLang(currentLang === 'en' ? 'fr' : 'en'));
  }

  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));
  }

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

  // Hover scale on interactive elements (contact CTA gets special label below)
  const hoverTargets = document.querySelectorAll('a:not(.contact__cta), button, [data-hoverable]');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
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

  // Cursor label — unavailable grid items
  const unavailableItems = document.querySelectorAll('div.work__grid-item');
  unavailableItems.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorLabel.textContent = '[ — ]';
      ring.classList.add('is-project-hover');
      ring.classList.remove('is-hover'); // prevent size conflict
    });
    el.addEventListener('mouseleave', () => {
      cursorLabel.textContent = '';
      ring.classList.remove('is-project-hover');
    });
  });


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

  altUnit.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleUnit(); }
  });
  altBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleUnit(); }
  });

  window.addEventListener('scroll', updateAltimeter, { passive: true });
  updateAltimeter();

  /* -----------------------------------------------
     Single visibilitychange handler for RAFs
     (smooth scroll only exists on non-touch desktop)
     ----------------------------------------------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (typeof smoothScrollRafId !== 'undefined') cancelAnimationFrame(smoothScrollRafId);
      cancelAnimationFrame(cursorRafId);
    } else {
      if (typeof smoothScrollLoop !== 'undefined') smoothScrollLoop();
      animateCursor();
    }
  });
})();

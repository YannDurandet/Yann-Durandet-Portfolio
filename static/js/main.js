/* ===== CUBIC BEZIER EASING ===== */
function cubicBezier(p1x, p1y, p2x, p2y) {
  // Newton-Raphson iteration for cubic bezier
  return function (t) {
    let x = t, i = 0;
    while (i++ < 8) {
      const cx = 3*p1x*(1-x)*(1-x)*x + 3*p2x*(1-x)*x*x + x*x*x - t;
      const dx = 3*p1x*(1-2*x+x*x-2*(1-x)*x) + 3*p2x*(2*(1-x)*x-x*x+2*x*(1-x)-2*x*x) + 3*x*x;
      if (Math.abs(cx) < 1e-6) break;
      x -= cx / (dx || 1e-6);
    }
    return 3*p1y*(1-x)*(1-x)*x + 3*p2y*(1-x)*x*x + x*x*x;
  };
}

/* ===== SMOOTH SCROLL ===== */
function scrollToSection(id) {
  if (id === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ===== LOADING SCREEN ===== */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const counter = document.getElementById('loader-counter');
  const progressBar = document.getElementById('loader-progress');
  const mainContent = document.querySelector('.main-content');
  if (!screen) return;

  const ease = cubicBezier(0.22, 1, 0.36, 1);
  const duration = 4000;
  const start = performance.now();

  // Animate SVG paths
  const paths = screen.querySelectorAll('.loader-svg path[data-animate]');
  paths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = ease(progress);

    // Counter
    counter.textContent = Math.round(eased * 4807);

    // Progress bar
    progressBar.style.transform = `translateX(${(eased - 1) * 100}%)`;

    // SVG paths
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDashoffset = length * (1 - eased);
      path.style.opacity = 1;
    });

    // Fill gradient
    const fillPath = screen.querySelector('.loader-svg path[data-fill]');
    if (fillPath && progress > 0.375) {
      const fillProgress = Math.min((progress - 0.375) / 0.625, 1);
      fillPath.style.opacity = fillProgress;
    }

    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Exit after 4.5s
  setTimeout(() => {
    screen.classList.add('exit');
    if (mainContent) mainContent.classList.add('visible');
    setTimeout(() => screen.remove(), 800);
  }, 4500);
}

/* ===== CUSTOM CURSOR ===== */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });

  function addHoverListeners(el) {
    el.addEventListener('mouseenter', () => ring.classList.add('custom-cursor-ring--hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('custom-cursor-ring--hover'));
  }

  document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor-hover]').forEach(addHoverListeners);

  // Watch for dynamically added elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.matches && n.matches('a, button, [role="button"], [data-cursor-hover]')) addHoverListeners(n);
          if (n.querySelectorAll) n.querySelectorAll('a, button, [role="button"], [data-cursor-hover]').forEach(addHoverListeners);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ===== NAVIGATION ===== */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  let menuOpen = false;

  // Scroll handler
  function onScroll() {
    // Nav background
    if (nav) {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    // Progress bar
    if (progressBar) {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Nav link clicks
  document.querySelectorAll('[data-nav-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav-to');
      if (menuOpen) toggleMenu();
      scrollToSection(target);
    });
  });

  // Hamburger
  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    menuIcon.style.display = menuOpen ? 'none' : 'block';
    closeIcon.style.display = menuOpen ? 'block' : 'none';
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
}

/* ===== TEXT SCRAMBLE ===== */
function initTextScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  const elements = document.querySelectorAll('[data-scramble]');

  elements.forEach(el => {
    const finalText = el.getAttribute('data-scramble');
    const delay = parseInt(el.getAttribute('data-scramble-delay') || '800', 10);
    el.textContent = finalText; // Fallback

    setTimeout(() => {
      const duration = 600;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        let result = '';
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === ' ') { result += ' '; continue; }
          if (progress > i / finalText.length) {
            result += finalText[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        el.textContent = result;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
  });
}

/* ===== IMAGE CAROUSEL ===== */
function initCarousel() {
  const stack = document.getElementById('image-stack');
  if (!stack) return;

  const layers = stack.querySelectorAll('.hero-image-layer');
  let active = 0;

  function update() {
    layers.forEach((layer, i) => {
      layer.classList.toggle('active', i === active);
      layer.style.zIndex = i === active ? 10 : 9 - i;
    });
  }
  update();

  stack.addEventListener('click', () => {
    active = (active + 1) % layers.length;
    update();
  });

  setInterval(() => {
    active = (active + 1) % layers.length;
    update();
  }, 20000);
}

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find sibling index for stagger
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.setProperty('--reveal-delay', (idx * 150) + 'ms');
        }
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* ===== ALTIMETER ===== */
function initAltimeter() {
  const number = document.getElementById('alt-number');
  const unitEl = document.getElementById('alt-unit');
  const widget = document.getElementById('altimeter');
  if (!number || !widget) return;

  let unit = 'm';

  function update() {
    const progress = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const alt = 1000 + progress * 3807;
    const display = unit === 'm' ? Math.round(alt) : Math.round(alt * 3.28084);
    number.textContent = display;
    if (unitEl) unitEl.textContent = unit;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  widget.addEventListener('click', () => {
    unit = unit === 'm' ? 'ft' : 'm';
    update();
  });
}

/* ===== INIT ALL ===== */
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initCustomCursor();
  initNavigation();
  initCarousel();
  initReveal();
  initAltimeter();

  // Delay text scramble until after loading screen
  setTimeout(initTextScramble, 4600);
});

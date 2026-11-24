// Dev-only: sweep many viewport sizes and flag overlaps between HUD elements and the reticle ring, or P1 elements clipped off-screen.
// Usage: node scripts/layout-audit.mjs [--fast]
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

// Default = realistic devices/windows. --grid = exhaustive sweep (over-reports: includes sizes no real window has).
const REAL = [
  // phones portrait
  [320, 568], [360, 640], [360, 780], [375, 667], [390, 844], [393, 852], [412, 915], [430, 932],
  // phones landscape
  [568, 320], [667, 375], [844, 390], [932, 430],
  // small / narrow desktop windows (incl. the 491×557 pane that exposed the arc bug)
  [491, 557], [540, 700], [600, 800], [640, 640], [700, 600], [800, 600], [900, 700],
  // short landscape windows (browser panes, split screens)
  [761, 520], [780, 600], [820, 520], [899, 557], [960, 540], [963, 557], [1000, 600], [1100, 620], [1152, 648], [1200, 700], [1280, 560], [1366, 600], [1600, 700], [1920, 600], [1920, 780],
  // tablets
  [768, 1024], [820, 1180], [1024, 768], [1180, 820], [1024, 1366],
  // laptops / desktops (visible window sizes, browser chrome already removed)
  [1280, 600], [1280, 720], [1366, 650], [1366, 768], [1440, 700], [1440, 780], [1440, 900], [1536, 730], [1536, 864], [1680, 900], [1920, 940], [1920, 1080], [2560, 1300], [2560, 1440],
];
const GRID = [];
for (const w of [320, 360, 390, 430, 491, 540, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280, 1440, 1920]) for (const h of [360, 390, 480, 557, 640, 700, 740, 844, 900, 1024, 1180, 1080]) GRID.push([w, h]);
const SIZES = process.argv.includes('--grid') ? GRID : REAL;
const ELS = { wordmark: '.wordmark', byline: '.byline', clocks: '.clocks', timecode: '.timecode', label: '.callout .label', ribbon: '#ribbon', log: '.log', gauge: '.gauge', channel: '.channel', 'doodle-bc': '#doodle-bc' };
const MUST_SHOW = ['wordmark', 'label', 'ribbon', 'channel', 'clocks', 'timecode', 'gauge', 'doodle-bc', 'log'];   // these appear at EVERY size (phones/tablets scroll to reach them)
const P1 = ['wordmark', 'label', 'ribbon', 'channel'];

const srv = await serve(); const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`); await page.waitForTimeout(400);

let bad = 0, total = 0;
for (const [w, h] of SIZES) {
  total++;
  await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(60);
  const r = await page.evaluate(({ ELS, P1, MUST_SHOW }) => {
    // "ink" boxes: tight text line boxes + elements with a filled background/border + svgs (so empty block space never counts)
    const boxesOf = (e) => {
      const out = [], inter = (b, c) => c ? { left: Math.max(b.left, c.left), top: Math.max(b.top, c.top), right: Math.min(b.right, c.right), bottom: Math.min(b.bottom, c.bottom) } : b;
      const add = (b, clip) => { b = inter(b, clip); b.right - b.left > 1 && b.bottom - b.top > 1 && out.push({ l: b.left, t: b.top, r: b.right, b: b.bottom }); };
      const walk = (n, clip) => {
        if (n.nodeType === 3) { if (n.textContent.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); for (const b of rg.getClientRects()) add(b, clip); } return; }
        if (n.nodeType !== 1) return;
        const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const r = n.getBoundingClientRect();
        if (cs.overflow !== 'visible') clip = inter(r, clip);   // clipped content (e.g. the console's older lines) is not visible, so it can't overlap anything
        const filled = (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.borderLeftWidth !== '0px' || cs.borderRightWidth !== '0px';
        if (filled || n.tagName === 'svg' || n.tagName === 'SVG' || n.tagName === 'VIDEO' || n.classList.contains('box')) add(r, clip); // .box = the wordmark's pseudo-element frame
        if (n.tagName.toLowerCase() === 'svg') return;
        for (const c of n.childNodes) walk(c, clip);
      };
      walk(e, null); return out;
    };
    const els = {}; for (const [k, s] of Object.entries(ELS)) { const e = document.querySelector(s); if (!e) continue; const cs = getComputedStyle(e); if (cs.display === 'none') continue; const bx = boxesOf(e); if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') { const b = e.getBoundingClientRect(); bx.push({ l: b.left, t: b.top, r: b.right, b: b.bottom }); } if (bx.length) els[k] = bx; }
    const ret = document.querySelector('.reticle').getBoundingClientRect();
    const ring = { x: ret.left + ret.width / 2, y: ret.top + ret.height / 2, R: (240 / 520) * ret.width };
    const probs = [], names = Object.keys(els);
    const hit = (A, B) => A.some((a) => B.some((b) => a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1));
    for (let i = 0; i < names.length; i++) {
      // vs ring: flag if any ink box penetrates the outer dashed circle by more than 5px
      if (els[names[i]].some((a) => { const nx = Math.max(a.l, Math.min(ring.x, a.r)), ny = Math.max(a.t, Math.min(ring.y, a.b)); return ring.R - Math.hypot(nx - ring.x, ny - ring.y) > 5; })) probs.push(`${names[i]}×ring`);
      for (let j = i + 1; j < names.length; j++) if (hit(els[names[i]], els[names[j]])) probs.push(`${names[i]}×${names[j]}`);
    }
    const union = (A) => A.reduce((u, a) => ({ l: Math.min(u.l, a.l), t: Math.min(u.t, a.t), r: Math.max(u.r, a.r), b: Math.max(u.b, a.b) }), { l: 1e9, t: 1e9, r: -1e9, b: -1e9 });
    const scrollMode = matchMedia('(max-width:880px), (max-width:1024px) and (orientation:portrait), (max-height:480px)').matches;
    const de = document.documentElement;
    for (const k of MUST_SHOW) if (!els[k]) probs.push(`${k} hidden`);
    if (de.scrollWidth > innerWidth + 1) probs.push('horizontal scroll');
    if (!scrollMode && de.scrollHeight > innerHeight + 1) probs.push('desktop page scrolls');
    if (scrollMode && de.scrollHeight <= innerHeight + 1) probs.push('scroll mode but nothing below the hero');
    for (const k of P1) { const e = els[k] && union(els[k]); if (!e) probs.push(`${k} missing/hidden`); else if (e.l < -1 || e.t < -1 || e.r > innerWidth + 1 || e.b > innerHeight + 1) probs.push(`${k} off-screen`); }
    return probs;
  }, { ELS, P1, MUST_SHOW });
  if (r.length) { bad++; console.log(`${String(w).padStart(4)}×${String(h).padEnd(4)} ${r.join(', ')}`); }
}
await browser.close(); srv.close();
console.log(`\n${bad}/${total} viewport sizes have problems`);

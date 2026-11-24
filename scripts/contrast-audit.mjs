// Dev-only: per-element WCAG contrast over the *rendered* background (text hidden, backdrop sampled, 5th-percentile = worst-case area).
import { chromium } from 'playwright';
import sharp from 'sharp';
import { serve } from './serve.mjs';
const VIEWPORTS = (process.argv[2] || '1920x1080,1440x900,1280x720,1024x768,820x1180,390x844,360x640,844x390').split(',').map((v) => v.split('x').map(Number));
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const srv = await serve(); const browser = await chromium.launch();
let bad = 0;
for (const [w, h] of VIEWPORTS) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })).newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`); await page.waitForTimeout(700);
  const items = await page.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('.hud *, .dock *, .channel *')) {
      if (!e.childNodes.length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(e);
      let r = e.getBoundingClientRect();
      // only the visible part counts: intersect with every ancestor that clips its content (e.g. the console's older lines are clipped away)
      let box = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflow === 'visible') continue;
        const pr = p.getBoundingClientRect();
        box = { left: Math.max(box.left, pr.left), top: Math.max(box.top, pr.top), right: Math.min(box.right, pr.right), bottom: Math.min(box.bottom, pr.bottom) };
      }
      r = { left: box.left, top: box.top, width: box.right - box.left, height: box.bottom - box.top };
      if (cs.display === 'none' || cs.visibility === 'hidden' || r.width < 2 || r.height < 2) continue;
      const m = cs.color.match(/[\d.]+/g).map(Number);
      out.push({ t: e.textContent.trim().slice(0, 28), x: r.left, y: r.top, w: r.width, h: r.height, c: m, a: m[3] ?? 1, size: parseFloat(cs.fontSize), weight: +cs.fontWeight });
    }
    return out;
  });
  await page.addStyleTag({ content: '.hud *,.dock *,.channel *{color:transparent!important}' });
  const png = await page.screenshot({ fullPage: true });   // phones/tablets scroll: measure the dock too
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  console.log(`\n${w}×${h}`);
  for (const it of items) {
    const x0 = Math.max(0, Math.ceil(it.x) + 1), y0 = Math.max(0, Math.ceil(it.y) + 1), x1 = Math.min(w, Math.floor(it.x + it.w) - 1), y1 = Math.min(info.height, Math.floor(it.y + it.h) - 1); // inset 1px: edge pixels are anti-aliased
    if (x1 <= x0 || y1 <= y0) continue;
    const C = [];
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * info.width + x) * info.channels, bg = [data[i], data[i + 1], data[i + 2]];
      const fg = bg.map((b, k) => it.a * it.c[k] + (1 - it.a) * b);
      C.push((Math.max(lum(...fg), lum(...bg)) + 0.05) / (Math.min(lum(...fg), lum(...bg)) + 0.05));
    }
    C.sort((a, b) => a - b);
    const p5 = C[Math.floor(C.length * 0.05)], large = it.size * 0.75 >= 18 || (it.size * 0.75 >= 14 && it.weight >= 700);
    const need = large ? 3 : 4.5;
    if (p5 < need) { bad++; console.log(`  ✗ ${p5.toFixed(2)}:1 (need ${need}) ${it.size}px a=${it.a} "${it.t}"`); }
  }
}
await browser.close(); srv.close();
console.log(bad ? `\n${bad} element(s) under threshold` : '\nall text elements pass');

// Dev-only: measure the wordmark's real ink — gaps around the "ON" frame and the credit line's left edge — from screenshot pixels.
// Usage: node scripts/measure-wordmark.mjs [1440x900,1920x1080,...]
import { chromium } from 'playwright';
import sharp from 'sharp';
import { serve } from './serve.mjs';
const sizes = (process.argv[2] || '1440x900,1920x1080,1280x720,1024x768').split(',').map((s) => s.split('x').map(Number));
const srv = await serve(); const browser = await chromium.launch();
export const results = [];
for (const [w, h] of sizes) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })).newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`); await page.waitForTimeout(700);
  const g = await page.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(), wm = r('.wordmark'), by = r('.byline'), fs = parseFloat(getComputedStyle(document.querySelector('.wordmark')).fontSize); return { wm: [wm.left, wm.top, wm.right, wm.bottom], by: [by.left, by.top, by.right, by.bottom], fs, vw: innerWidth }; });
  const { data, info } = await sharp(await page.screenshot()).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i + 1], data[i + 2]]; };
  const white = ([r, g, b], t) => r > t && g > t && b > t;
  const amber = ([r, g, b]) => r > 150 && g > 100 && b < 100 && r - b > 80;
  // cap rows: middle 40% of the wordmark line box
  const cy = (g.wm[1] + g.wm[3]) / 2, rows = [Math.round(cy - g.fs * 0.3), Math.round(cy + g.fs * 0.3)];
  const wcols = new Set(), acols = new Set();
  for (let y = rows[0]; y <= rows[1]; y++) for (let x = 0; x < w; x++) { const p = px(x, y); if (amber(p)) acols.add(x); else if (white(p, 175)) wcols.add(x); }
  const aMin = Math.min(...acols), aMax = Math.max(...acols);
  const outside = [...wcols].filter((x) => x < aMin - 1 || x > aMax + 1).sort((a, b) => a - b);
  const leftInk = Math.max(...outside.filter((x) => x < aMin)), rightInk = Math.min(...outside.filter((x) => x > aMax)), firstInk = outside[0], lastInk = outside[outside.length - 1];
  // credit line: first bright column in its rows
  let by = Infinity;
  for (let y = Math.round(g.by[1]); y <= Math.round(g.by[3]); y++) for (let x = 0; x < w; x++) if (white(px(x, y), 150) && x < by) by = x;
  const out = { size: `${w}x${h}`, fs: +g.fs.toFixed(1), gapLeft: leftInk ? aMin - leftInk : null, gapRight: rightInk - aMax, frame: aMax - aMin, wordmarkInk: lastInk - firstInk, widthPct: +(100 * (lastInk - firstInk) / w).toFixed(1), firstInk, bylineInk: by, bylineOffset: by - firstInk };
  console.log(JSON.stringify(out)); results.push(out);
  await page.context().close();
}
await browser.close(); srv.close();

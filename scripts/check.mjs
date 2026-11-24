// Assertions from the spec (§14.2). Usage: node scripts/check.mjs [https://durandet.studio]
import { chromium } from 'playwright';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serve } from './serve.mjs';

const VIEWPORTS = [[1920, 1080], [1440, 900], [1280, 720], [1024, 768], [820, 1180], [390, 844], [360, 640], [844, 390]];
const PHASES = { scheduled: ['2026-11-25T12:00:00Z', 'SCHEDULED'], departing: ['2026-12-03T12:00:00Z', 'DEPARTING'], transit: ['2026-12-04T22:00:00Z', 'IN TRANSIT'], arrived: ['2026-12-05T02:00:00Z', 'ARRIVED'], dormant: ['2027-01-15T12:00:00Z', 'DORMANT'] };
const remote = process.argv[2];
const srv = remote ? { url: remote.replace(/\/$/, ''), close() {} } : await serve();
const origin = new URL(srv.url).origin;

// Playwright's Chromium cannot decode H.264, so locally the mp4 URLs are answered with a tiny VP8 stand-in (1280×720, 1.2 s): the same player logic runs, no codec needed.
let CLIP = null;
if (!remote) { try { const f = join(tmpdir(), 'drndt-test-clip.webm'); execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'color=c=0x203040:s=1280x720:d=1.2:r=15', '-c:v', 'libvpx', '-b:v', '30k', '-an', f]); CLIP = readFileSync(f); } catch { CLIP = null; } }

let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('  ✗ ' + msg); } else console.log('  ✓ ' + msg); };

// static: exactly one <a> per html file in public/
const walk = (d) => readdirSync(d).flatMap((f) => { const p = d + '/' + f; return statSync(p).isDirectory() ? walk(p) : [p]; });
if (!remote) {
  console.log('static');
  for (const f of walk(new URL('../public', import.meta.url).pathname).filter((f) => f.endsWith('.html')))
    ok((readFileSync(f, 'utf8').match(/<a[ >]/g) || []).length === 1, `exactly one "<a" in ${f.split('/public/')[1]}`);
  for (const f of walk(new URL('../public', import.meta.url).pathname).filter((f) => /\.(js|html|css)$/.test(f)))
    ok(!/window\.open|location\.href\s*=|mailto:|tel:|<form|<area/i.test(readFileSync(f, 'utf8')), `no navigation APIs / mailto / tel / form in ${f.split('/public/')[1]}`);
}

const browser = await chromium.launch();
const newPage = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  if (CLIP) await ctx.route('**/video/*.mp4', (route) => route.fulfill({ status: 200, contentType: 'video/webm', body: CLIP }));
  const log = { requests: [], console: [] };
  page.on('request', (r) => log.requests.push(r.url()));
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && log.console.push({ type: m.type(), text: m.text(), url: m.location()?.url || '' }));
  page.on('pageerror', (e) => log.console.push({ type: 'pageerror', text: String(e), url: '' }));
  return { ctx, page, log };
};

for (const path of ['/', '/this-page-does-not-exist']) {
  console.log(`page ${path}`);
  const { ctx, page, log } = await newPage();
  const res = await page.goto(srv.url + path + (path === '/' ? '?t=2026-12-04T22:00:00Z' : ''));
  ok(path === '/' ? res.status() === 200 : res.status() === 404, `HTTP status ${res.status()} (${path === '/' ? 'expect 200' : 'expect real 404'})`);
  await page.waitForTimeout(3600);

  const igCfg = await page.evaluate(async () => (await import('/main.js')).CONFIG.instagram);
  const dom = await page.evaluate(() => ({
    a: [...document.querySelectorAll('a')].map((a) => a.href),
    extra: document.querySelectorAll('area,form,[onclick],[href]:not(a):not(link)').length,
    h1: document.querySelectorAll('h1').length,
    lang: document.documentElement.lang,
    fmt: document.querySelector('meta[name="format-detection"]')?.content,
    focusable: [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex],[contenteditable]')].length,
  }));
  ok(dom.a.length === 1 && dom.a[0] === igCfg, `one <a>, href === CONFIG.instagram (${dom.a[0]})`);
  ok(dom.extra === 0, 'no area/form/onclick/stray [href]');
  ok(dom.h1 === 1 && dom.lang === 'en', 'one <h1>, lang="en"');
  ok(/telephone=no/.test(dom.fmt || ''), 'format-detection meta present');
  ok(dom.focusable === 1, 'only one focusable element');
  await page.keyboard.press('Tab');
  ok(await page.evaluate(() => document.activeElement?.tagName === 'A'), 'Tab #1 focuses the link');
  await page.keyboard.press('Tab');
  ok(await page.evaluate(() => document.activeElement?.tagName !== 'A'), 'Tab #2 leaves the page');
  ok(log.requests.every((u) => u.startsWith(origin) || u.startsWith('data:')), `all ${log.requests.length} requests same-origin`);
  const realErrors = log.console.filter((m) => !(path !== '/' && m.url === srv.url + path)); // a real 404 page logs its own 404
  ok(realErrors.length === 0, `no console errors/warnings ${realErrors.length ? JSON.stringify(realErrors) : ''}`);
  await ctx.close();
}

console.log('viewports: no scrollbars + reticle lock');
for (const [w, h] of VIEWPORTS) {
  const { ctx, page } = await newPage({ viewport: { width: w, height: h } });
  await page.goto(srv.url + '/?t=2026-12-04T22:00:00Z');
  await page.waitForTimeout(3600);
  const r = await page.evaluate(async () => {
    const { CONFIG } = await import('/main.js'), v = document.querySelector('.bgv.on'), ret = document.querySelector('.reticle').getBoundingClientRect();
    const t = (CONFIG.videos.find((c) => v.currentSrc.endsWith(c.src)) || {}).target || CONFIG.bgTarget;
    return { sh: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, iw: innerWidth, ih: innerHeight, nw: v.videoWidth, nh: v.videoHeight, tx: t.x, ty: t.y, rx: ret.left + ret.width / 2, ry: ret.top + ret.height / 2 };
  });
  const s = Math.max(r.iw / r.nw, r.ih / r.nh);
  const ex = r.tx * r.nw * s - (r.nw * s - r.iw) / 2, ey = r.ty * r.nh * s - (r.nh * s - r.ih) / 2;
  const dx = Math.abs(r.rx - ex) / r.iw, dy = Math.abs(r.ry - ey) / r.ih;
  const scrollMode = w <= 880 || (w <= 1024 && h > w) || h <= 480;   // phones, portrait tablets, narrow windows, landscape phones scroll; desktop is one screen
  ok(r.sw <= r.iw && (scrollMode ? r.sh > r.ih : r.sh <= r.ih), `${w}×${h} ${scrollMode ? 'scrolls down, never sideways' : 'single screen, no scroll'} (${r.sw}×${r.sh} in ${r.iw}×${r.ih})`);
  if (r.nw) ok(dx < 0.02 && dy < 0.02, `${w}×${h} reticle within 2% of lock (Δx ${(dx * 100).toFixed(2)}%, Δy ${(dy * 100).toFixed(2)}%)`);
  else console.log(`  - ${w}×${h} lock check skipped (this Chromium cannot decode H.264)`);
  await ctx.close();
}

console.log('wordmark frame');
{
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(600);
  const fr = await page.evaluate(() => { const b = document.querySelector('.box').getBoundingClientRect(); const m = getComputedStyle(document.querySelector('.box'), '::before'); return { w: b.width, h: b.height, mask: m.webkitMaskImage || m.maskImage || '' }; });
  ok(Math.abs(fr.w - fr.h) < 0.5, `"ON" frame is a perfect square (${fr.w.toFixed(2)} × ${fr.h.toFixed(2)})`);
  ok(/main-frame\.svg/.test(fr.mask), 'frame uses public/art/main-frame.svg as a mask');
  await ctx.close();
}

if (!remote) {
  console.log('wordmark spacing (measured from rendered pixels)');
  const { execFileSync } = await import('node:child_process');
  const lines = execFileSync('node', [new URL('./measure-wordmark.mjs', import.meta.url).pathname, '1440x900,1920x1080'], { encoding: 'utf8' }).trim().split('\n').map((l) => JSON.parse(l));
  for (const m of lines) {
    ok(m.gapLeft !== null && Math.abs(m.gapLeft - m.gapRight) <= 3, `${m.size} gaps around "ON" are equal (left ${m.gapLeft}px, right ${m.gapRight}px)`);
    ok(Math.abs(m.bylineOffset) <= 2, `${m.size} credit line aligns with the first letter (offset ${m.bylineOffset}px)`);
  }
}

console.log('reticle arcs stay centred while rotating');
{
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(3600);
  const offs = await page.evaluate(() => {
    const ret = document.querySelector('.reticle').getBoundingClientRect(), spin = document.querySelector('.spin'), c = spin.querySelector('circle');
    const cx = ret.left + ret.width / 2, cy = ret.top + ret.height / 2;
    return [0, -75, -150, -225].map((s) => { // 0°, 90°, 180°, 270° of the 300 s rotation
      spin.style.animationPlayState = 'paused'; spin.style.animationDelay = s + 's';
      const b = c.getBoundingClientRect();
      return Math.hypot(b.left + b.width / 2 - cx, b.top + b.height / 2 - cy);
    });
  });
  ok(offs.every((d) => d < 1.5), `arc ring centre stays on reticle centre at 0/90/180/270° (max drift ${Math.max(...offs).toFixed(2)}px)`);
  await ctx.close();
}

console.log('desktop layout: stack order, status block, nothing top-left');
for (const [w, h] of [[1440, 900], [1920, 1080], [1280, 720], [1100, 700], [963, 557]]) {
  const { ctx, page } = await newPage({ viewport: { width: w, height: h } });
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(2200);   // let the reticle finish its boot contraction before measuring
  const g = await page.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
    const ret = r('.reticle'), co = r('.callout'), lb = r('.callout .label'), rb = r('#ribbon');
    return { clocks: r('.clocks'), tc: r('.timecode'), gauge: r('.gauge'), bc: r('#doodle-bc'), cx: ret.left + ret.width / 2, ringR: (240 / 520) * ret.width, coLeft: Math.min(co.left, lb.left, rb.left),
      oldText: /\/\/ DRNDT|MODE:/.test(document.body.innerText), hair: !!document.querySelector('.hair, .readout') };
  });
  ok(g.clocks.bottom <= g.tc.top + 1 && g.tc.bottom <= g.gauge.top + 1 && g.gauge.bottom <= g.bc.top + 1, `${w}×${h} stack order top→bottom: times, countdown, gauge, barcode art`);
  ok(Math.abs(g.tc.right - g.gauge.right) <= 3 && Math.abs(g.clocks.right - g.gauge.right) <= 3 && Math.abs(g.bc.right - g.gauge.right) <= 3, `${w}×${h} stack is right-aligned (clocks ${g.clocks.right.toFixed(0)} · countdown ${g.tc.right.toFixed(0)} · gauge ${g.gauge.right.toFixed(0)} · barcode ${g.bc.right.toFixed(0)})`);
  ok(!g.oldText && !g.hair, `${w}×${h} no "// DRNDT STUDIO / MODE" text, no old readouts, no bar under the countdown`);
  ok(g.coLeft >= g.cx + g.ringR - 6, `${w}×${h} status block is right of the circle (starts ${g.coLeft.toFixed(0)}, ring ends ${(g.cx + g.ringR).toFixed(0)})`);
  await ctx.close();
}

console.log('phones & tablets: everything is there, scroll to reach the rest');
for (const [w, h] of [[390, 844], [360, 640], [820, 1180], [768, 1024], [844, 390]]) {
  const { ctx, page } = await newPage({ viewport: { width: w, height: h } });
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(2200);
  const vis = await page.evaluate(() => Object.fromEntries(['.wordmark', '.callout .label', '#ribbon', '.clocks', '.timecode', '.gauge', '#doodle-bc', '.log', '.channel'].map((s) => { const e = document.querySelector(s); const b = e && e.getBoundingClientRect(); return [s, !!b && getComputedStyle(e).display !== 'none' && b.width > 0 && b.height > 0]; })));
  const hidden = Object.entries(vis).filter(([, v]) => !v).map(([s]) => s);
  ok(hidden.length === 0, `${w}×${h} all elements are displayed${hidden.length ? ' — missing: ' + hidden.join(', ') : ''}`);
  const before = await page.evaluate(() => ({ y: scrollY, max: document.documentElement.scrollHeight - innerHeight }));
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(150);
  const after = await page.evaluate(() => { const lg = document.querySelector('.log').getBoundingClientRect(), ch = document.querySelector('.channel').getBoundingClientRect(); return { logTop: lg.top, logBottom: lg.bottom, chTop: ch.top, chBottom: ch.bottom, ih: innerHeight, sx: scrollX, lines: document.querySelectorAll('#log li').length }; });
  ok(before.y === 0 && before.max > 0, `${w}×${h} page scrolls (${before.max}px below the first screen)`);
  ok(after.logTop >= 0 && after.logBottom <= after.chTop - 4 && after.lines > 0, `${w}×${h} console is reachable and not covered by the pinned link (log ${after.logTop.toFixed(0)}–${after.logBottom.toFixed(0)}, link starts ${after.chTop.toFixed(0)})`);
  ok(after.chBottom <= after.ih + 1 && after.sx === 0, `${w}×${h} link stays pinned at the bottom, no sideways scroll`);
  await ctx.close();
}

console.log('console log: colours + keeps writing');
{
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(2200);
  const snap = () => page.evaluate(() => { const lis = [...document.querySelectorAll('#log li')]; return { n: lis.length, texts: lis.map((l) => l.textContent), classes: [...new Set(lis.map((l) => l.className.replace('typing', '').trim()))], last: lis.at(-1).textContent }; });
  const a = await snap(); await page.waitForTimeout(6000); const b = await snap();
  ok(a.n > 0 && a.n <= 9 && b.n <= 9, `never more than 9 lines on screen (${a.n} → ${b.n})`);
  ok(a.texts.join('|') !== b.texts.join('|'), `new lines keep being written (6 s later the text differs)`);
  ok(b.classes.every((c) => ['w', 'y', 'r'].includes(c)), `only white/yellow/red lines (${b.classes.join(', ')})`);
  const col = await page.evaluate(() => { const probe = (c) => { const li = document.createElement('li'); li.className = c; li.textContent = 'x'; document.getElementById('log').append(li); const v = getComputedStyle(li).color; li.remove(); return v; }; return { w: probe('w'), y: probe('y'), r: probe('r') }; });
  ok(col.y === 'rgb(255, 208, 96)' && col.r === 'rgb(255, 90, 77)' && /^rgba\(232, 236, 239/.test(col.w), `colours: white ${col.w} · yellow ${col.y} · red ${col.r}`);
  await ctx.close();
}

console.log('background: not draggable, under every UI layer');
{
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(600);
  await page.evaluate(() => document.addEventListener('dragstart', () => { window.__drags = (window.__drags || 0) + 1; }));
  await page.mouse.move(300, 300); await page.mouse.down(); await page.mouse.move(420, 380, { steps: 8 }); await page.mouse.up();
  await page.mouse.dblclick(300, 300);
  const r = await page.evaluate(() => {
    const z = (s) => +getComputedStyle(document.querySelector(s)).zIndex, img = document.querySelector('.bgv.on');
    const mid = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return { drags: window.__drags || 0, draggable: img.draggable, pe: getComputedStyle(img).pointerEvents, bg: z('.bg'),
      layers: ['.tint', '.mosaic-c', '.fx-grid', '.fx-vig', '.hud', '.doodles', '.fx-scan', '.channel'].map(z),
      top: mid ? mid.tagName : '', sel: String(getSelection()) };
  });
  ok(r.drags === 0, `dragging the page fires no dragstart (${r.drags})`);
  ok(r.draggable === false && r.pe === 'none' && !/^(IMG|PICTURE|VIDEO)$/.test(r.top), `background video draggable=false, pointer-events none, never the hit target (hit: ${r.top})`);
  ok(r.layers.every((v, i, a) => v > r.bg && (i === 0 || v >= a[i - 1])), `photo z-index ${r.bg} is below every layer in order (${r.layers.join(' ≤ ')})`);
  ok(r.sel === '', 'double-click selects nothing');
  await ctx.close();
}

console.log('background videos: one after another, forever, hard cuts');
{
  const { ctx, page } = await newPage({ javaScriptEnabled: false });
  await page.goto(srv.url + '/');
  const nj = await page.evaluate(() => { const a = document.getElementById('bgv-a'); return { src: a.getAttribute('src'), loop: a.loop, autoplay: a.autoplay, muted: a.muted }; });
  const first = /videos:\s*\[\s*\{\s*src:\s*'([^']+)'/.exec(readFileSync(new URL('../public/main.js', import.meta.url), 'utf8'))[1];   // CONFIG.videos[0]
  ok(nj.src === first && nj.loop && nj.autoplay && nj.muted, `without JS the first clip (${first}) loops on its own (muted, autoplay)`),
  await ctx.close();
}
{
  const { ctx, page } = await newPage({ reducedMotion: 'reduce' });
  await page.goto(srv.url + '/');
  await page.waitForTimeout(600);
  const rm = await page.evaluate(() => [...document.querySelectorAll('.bgv')].map((v) => ({ src: v.getAttribute('src'), paused: v.paused })));
  ok(rm.every((v) => v.src === null && v.paused), 'reduced motion: no video is loaded, the poster stays');
  ok(await page.evaluate(() => { const v = document.querySelector('#doodle-bc video'); return v.paused && !v.autoplay; }), 'reduced motion: the barcode animation is paused on its first frame');
  await ctx.close();
}
if (CLIP) {
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  const seq = await page.evaluate(async () => {
    const { CONFIG } = await import('/main.js'), out = [], fx = [];
    for (let n = 0; n < 100; n++) {
      await new Promise((r) => setTimeout(r, 100));
      const on = [...document.querySelectorAll('.bgv.on')], name = on[0] && on[0].currentSrc.split('/').pop();
      if (on.length !== 1) fx.push('on=' + on.length);
      if (name && out.at(-1) !== name) out.push(name);
      for (const e of document.querySelectorAll('.bgv')) { const cs = getComputedStyle(e); if (cs.transitionDuration !== '0s' || cs.opacity !== '1' || cs.visibility !== 'visible') fx.push('fade?'); }
    }
    return { out, fx: [...new Set(fx)], files: CONFIG.videos.map((c) => c.src.split('/').pop()) };
  });
  const want = [...seq.files, seq.files[0]];   // every clip in order, then back to the first
  ok(want.every((f, i) => seq.out[i] === f), `plays all ${seq.files.length} clips in order, then loops: ${seq.out.join(' → ')}`);
  ok(seq.fx.length === 0, `hard cuts only: one player in front at any time, no transition, no opacity change (${seq.fx.join(', ') || 'clean'})`);
  await ctx.close();
}

console.log('countdown (zero at 15 Jan 2027 21:45 Paris = 20:45 UTC) + gauge (minutes, base 32)');
for (const [iso, tc, gauge, p] of [
  ['2027-01-15T20:45:00Z', 'T-00:00:00:00', '0000', 1],      // the moment itself
  ['2027-01-15T20:44:58Z', 'T-00:00:00:02', '0001', null],   // 2 s left → still 1 minute (rounded up)
  ['2027-01-15T19:45:00Z', 'T-00:01:00:00', '001S', null],   // 60 min = 1S in base 32
  ['2027-01-15T19:44:59Z', 'T-00:01:00:01', '001T', null],   // 61 min
  ['2026-11-23T20:45:00Z', 'T-53:00:00:00', '2AH0', 0.0168], // 76,320 min = 2AH0 in base 32
  ['2027-03-01T12:00:00Z', 'T-00:00:00:00', '0000', 1],      // after the end it holds at zero
]) {
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=${iso}`);
  await page.waitForTimeout(250);
  const g = await page.evaluate(() => ({ tc: document.getElementById('timecode').textContent, g: document.getElementById('g-num').textContent, p: +getComputedStyle(document.getElementById('stage')).getPropertyValue('--p') }));
  ok(g.tc === tc && g.g === gauge && (p === null || Math.abs(g.p - p) < 0.0006), `${iso} → ${g.tc} · gauge ${g.g} · bar ${g.p}`);
  await ctx.close();
}

console.log('blur boxes on the grid');
{
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(5000);
  const snap = () => page.evaluate(async () => {
    const G = (await import('/main.js')).CONFIG.grid, B = (await import('/main.js')).CONFIG.blur, pat = document.getElementById('g'), z = (s) => +getComputedStyle(document.querySelector(s)).zIndex;
    return { G, B, W: +pat.getAttribute('width'), d: pat.querySelector('path').getAttribute('d'), z: { blurs: z('#blurs'), grid: z('.fx-grid'), hud: z('.hud') }, pe: getComputedStyle(document.getElementById('blurs')).pointerEvents,
      boxes: [...document.querySelectorAll('#blurs .blur-box')].map((b) => ({ l: parseFloat(b.style.left), t: parseFloat(b.style.top), w: parseFloat(b.style.width), h: parseFloat(b.style.height), bf: getComputedStyle(b).backdropFilter })) };
  });
  const a = await snap(); await page.waitForTimeout(5000); const b = await snap();
  ok(a.W === 2 * a.G.cell && a.d.startsWith(`M${a.G.x} ${a.G.y}`), `grid pattern matches CONFIG.grid (tile ${a.W} = 2 × ${a.G.cell}px, first dash at ${a.G.x},${a.G.y})`);
  ok(a.boxes.length > 0 && a.boxes.length <= a.B.maxBurst, `${a.boxes.length} blur boxes on screen (ceiling ${a.B.maxBurst})`);
  ok([...a.boxes, ...b.boxes].every((x) => x.w === a.G.cell && x.h === a.G.cell && (x.l - a.G.x) % a.G.cell === 0 && (x.t - a.G.y) % a.G.cell === 0), `every box is exactly one ${a.G.cell}px cell, aligned to the grid marks`);
  ok([...a.boxes, ...b.boxes].every((x) => /blur\(/.test(x.bf)), 'boxes blur what is behind them (backdrop-filter)');
  ok(a.z.blurs < a.z.grid && a.z.grid < a.z.hud && a.pe === 'none', `boxes sit under the grid marks and the HUD, never catch the mouse (z ${a.z.blurs} < ${a.z.grid} < ${a.z.hud})`);
  ok(JSON.stringify(a.boxes.map((x) => [x.l, x.t])) !== JSON.stringify(b.boxes.map((x) => [x.l, x.t])), 'boxes keep changing place over time');
  await ctx.close();
}
{
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(1200);
  const life = await page.evaluate(async () => {   // same random fades and holds as the real thing, but many boxes so there is a real sample to measure
    Object.assign((await import('/main.js')).CONFIG.blur, { burst: 0.5, max: 40, maxBurst: 40, pause: [20, 90] });
    const out = [], t = new Map();
    new MutationObserver((ms) => { for (const m of ms) { m.addedNodes.forEach((n) => t.set(n, performance.now())); m.removedNodes.forEach((n) => t.has(n) && out.push(performance.now() - t.get(n))); } }).observe(document.getElementById('blurs'), { childList: true });
    await new Promise((r) => setTimeout(r, 10000));
    return out.map(Math.round);
  });
  ok(life.length >= 12 && Math.min(...life) < 1500 && Math.max(...life) - Math.min(...life) > 1500, `box lifetimes are unpredictable: ${life.length} finished, from ${Math.min(...life)} ms to ${Math.max(...life)} ms`);
  await ctx.close();
}
{
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(1500);
  const r = await page.evaluate(async () => {   // worst case: constant bursts, long holds → the count must be able to pass the usual max, never the ceiling, and fades stay fast
    const B = (await import('/main.js')).CONFIG.blur, lo = Math.min(B.fadeIn[0], B.fadeOut[0]), hi = Math.max(B.fadeIn[1], B.fadeOut[1]);
    Object.assign(B, { burst: 1, overflow: 1, hold: [4000, 4500], pause: [20, 60] });
    let max = 0, bad = 0; const durs = new Set();
    for (let n = 0; n < 40; n++) { await new Promise((r) => setTimeout(r, 150)); const bs = [...document.querySelectorAll('#blurs .blur-box')]; max = Math.max(max, bs.length); for (const b of bs) { const d = Math.round(parseFloat(getComputedStyle(b).transitionDuration) * 1000); durs.add(d); if (d < lo - 1 || d > hi + 1) bad++; } }
    return { max, cap: B.maxBurst, usual: B.max, variety: durs.size, bad, lo, hi };
  });
  ok(r.max > r.usual && r.max <= r.cap, `count can pass the usual ${r.usual} but never the ceiling ${r.cap} (peak ${r.max})`);
  ok(r.bad === 0 && r.variety >= 5, `fades are fast (${r.lo}–${r.hi} ms) and differ per box (${r.variety} distinct durations)`);
  await ctx.close();
}
{
  const { ctx, page } = await newPage({ reducedMotion: 'reduce' });
  await page.goto(`${srv.url}/`);
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => ({ n: document.querySelectorAll('#blurs .blur-box').length, tr: getComputedStyle(document.querySelector('#blurs .blur-box')).transitionDuration }));
  ok(r.n > 0 && r.tr === '0s', `reduced motion: ${r.n} still boxes, no fading`);
  await ctx.close();
}

console.log('phases (ribbon text after boot)');
for (const [name, [iso, want]] of Object.entries(PHASES)) {
  const { ctx, page } = await newPage();
  await page.goto(`${srv.url}/?t=${iso}`);
  await page.waitForTimeout(3600);
  const got = await page.textContent('#ribbon');
  ok(got === want, `${name} → ribbon "${got}" (want "${want}")`);
  await ctx.close();
}

console.log('reduced motion');
{
  const { ctx, page } = await newPage({ reducedMotion: 'reduce' });
  await page.goto(`${srv.url}/?t=2026-12-04T22:00:00Z`);
  await page.waitForTimeout(300);
  ok((await page.textContent('#ribbon')) === 'IN TRANSIT', 'final state immediately (no boot)');
  const anim = await page.evaluate(() => [getComputedStyle(document.querySelector('.spin')).animationName, getComputedStyle(document.querySelector('.reticle')).animationName, getComputedStyle(document.querySelector('.channel')).animationName]);
  ok(anim.every((a) => a === 'none'), `animations off (${anim.join(', ')})`);
  const lg = await page.evaluate(() => ({ n: document.querySelectorAll('#log li').length, typing: document.querySelectorAll('#log li.typing').length, last: document.querySelector('#log li:last-child').textContent }));
  ok(lg.n > 9 && lg.typing === 0 && lg.last === 'STANDBY', `console log stays a complete static list (${lg.n} lines, last: ${lg.last})`);
  await ctx.close();
}

console.log('JS disabled');
{
  const { ctx, page } = await newPage({ javaScriptEnabled: false });
  await page.goto(srv.url + '/');
  const t = await page.evaluate(() => ({
    h1: document.querySelector('h1').innerText.replace(/\s+/g, ' '), h1Text: document.querySelector('h1').textContent.replace(/\s+/g, ' '),
    ribbon: document.querySelector('#ribbon').innerText, ribbonOpacity: getComputedStyle(document.querySelector('#ribbon')).opacity,
    items: document.querySelectorAll('#log li').length, listOpacity: getComputedStyle(document.querySelector('#log')).opacity,
    link: !!document.querySelector('a[href^="https://www.instagram.com/"]'),
  }));
  ok(/STUDIO\s*ON\s*HOLD/i.test(t.h1) && t.h1Text === 'STUDIO ON HOLD', `wordmark visible and spaced for screen readers (${t.h1} / ${t.h1Text})`);
  ok(t.ribbon === 'RELOCATING' && t.ribbonOpacity === '1', 'ribbon RELOCATING, opaque');
  ok(t.items > 9 && t.listOpacity === '1', `console log present, opaque (${t.items} lines)`);
  ok(t.link, 'link present');
  await ctx.close();
}

console.log('doodles');
{
  const { ctx, page, log } = await newPage();
  await page.goto(`${srv.url}/?slots`);
  await page.waitForTimeout(800);
  const d = await page.evaluate(() => { const v = document.querySelector('#doodle-bc video'); return { svgs: document.querySelectorAll('.doodle svg').length, slots: document.body.classList.contains('show-slots'), n: document.querySelectorAll('.doodle').length, v: v && { src: v.getAttribute('src'), loop: v.loop, muted: v.muted, autoplay: v.autoplay } }; });
  ok(d.n === 6 && d.slots, '6 slots, ?slots debug outlines on');
  ok(d.svgs === 0 && d.v && d.v.src === '/doodles/doodle-bc.webm' && d.v.loop && d.v.muted && d.v.autoplay, 'barcode slot is the animated webm (muted, looping); no static SVG left');
  ok(log.console.length === 0 && log.requests.filter((u) => /doodle-/.test(u)).every((u) => /doodle-bc\.webm$/.test(u)), 'no SVG probes, no console noise');
  await page.waitForTimeout(1200);
  const pl = await page.evaluate(() => { const v = document.querySelector('#doodle-bc video'), b = v.getBoundingClientRect(); return { playing: !v.paused && v.currentTime > 0, w: v.videoWidth, h: v.videoHeight, bw: b.width, bh: b.height }; });
  ok(pl.playing && pl.w === 406 && Math.abs(pl.bw / pl.bh - 406 / 70) < 0.1, `animated barcode is playing (${pl.w}×${pl.h}), shown at ${pl.bw.toFixed(0)}×${pl.bh.toFixed(0)}, not stretched`);
  await ctx.close();
}
if (!remote) { // simulate Yann adding files: one valid SVG, one that the host answers with HTML (SPA fallback), one unlisted
  const { ctx, page } = await newPage();
  await page.route('**/doodles/doodles.json', (r) => r.fulfill({ json: { slots: ['ring', 'tl'] } }));
  await page.route('**/doodles/doodle-ring.svg', (r) => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10" data-draw="" onload="alert(1)"><script>1</script><path d="M0 0L10 10" stroke="currentColor"/></svg>' }));
  await page.route('**/doodles/doodle-tl.svg', (r) => r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>fallback</title>' }));
  await page.goto(`${srv.url}/`);
  await page.waitForTimeout(800);
  const d = await page.evaluate(() => ({ ring: document.querySelector('#doodle-ring svg')?.outerHTML || '', tl: !!document.querySelector('#doodle-tl svg'), draw: document.querySelector('#doodle-ring svg')?.classList.contains('draw') }));
  ok(/<path/.test(d.ring) && !/<script|onload|width=/.test(d.ring), 'listed SVG inlined, scripts/handlers/fixed size stripped');
  ok(!d.tl, 'non-SVG content-type is ignored');
  ok(d.draw, 'data-draw enables the draw-on class');
  await ctx.close();
}

await browser.close(); srv.close();
console.log(fails ? `\n${fails} FAILED` : '\nall checks passed');
process.exit(fails ? 1 : 0);

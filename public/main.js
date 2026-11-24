// DRNDT Studio holding page — progressive enhancement only. The HTML already ships the final state.

export const CONFIG = {
  instagram: 'https://www.instagram.com/durandet.studio/',
  // This file is public: keep everything day-level EXCEPT countdownEnd, which Yann asked to be exact.
  departureDay: '2026-12-03T00:00:00+01:00',   // Paris time
  transitStart: '2026-12-04T00:00:00+01:00',
  arrival:      '2026-12-05T12:00:00+13:00',   // TODO(Yann): confirm real arrival day
  arrivedWindowHours: 48,
  // Timecode + gauge both run to countdownEnd (Paris time; January = CET = +01:00). The gauge bar fills from countdownStart to countdownEnd.
  countdownStart: '2026-11-23T00:00:00+01:00',
  countdownEnd:   '2027-01-15T21:45:00+01:00',
  tz: { CDG: 'Europe/Paris', AKL: 'Pacific/Auckland' },
  // Console log (lines live in index.html, <ul id="log">): visible = lines on screen · prefill = lines already there on load · charMs = typing speed · pauseMs = [min, max] wait between lines
  log: { visible: 9, prefill: 6, charMs: 28, pauseMs: [450, 1500] },
  // Grid + blur boxes. grid MUST match <pattern id="g"> in index.html (tile = 2 × cell, first dash at x,y).
  // blur (all times in ms, [min, max], each box draws its own random value): fadeIn / hold / fadeOut · hold is skewed: many short flickers, a few long stays
  // max = usual number of boxes on screen · maxBurst = hard ceiling · overflow = chance a new box may go past `max` · burst = chance an event is a burst (3–7 boxes, often neighbours) · pause = gap between events (skewed short, sometimes long)
  grid: { cell: 72, x: 20, y: 40 },
  blur: { max: 8, maxBurst: 16, overflow: 0.35, burst: 0.18, fadeIn: [90, 320], hold: [120, 9000], fadeOut: [160, 520], pause: [60, 2400] },
  // Background clips: played in this order, forever, plain cuts (no fade). Optional per clip: target = where the reticle locks on the Sky Tower, as fractions of the frame
  // (leave it out to use bgTarget). To find the numbers open the page with ?pick and click the tower while that clip plays.
  videos: [
    { src: '/video/Auckland2.mp4' },
    { src: '/video/Auckland3.mp4' },
    { src: '/video/Auckland4.mp4' },
    { src: '/video/Auckland5.mp4' },
  ],
  bgTarget: { x: 0.497, y: 0.47 },             // default Sky Tower lock point
};

const $ = (s) => document.querySelector(s);
const q = new URLSearchParams(location.search);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = $('#stage'), hero = $('#hero');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = (n, l = 2) => String(n).padStart(l, '0');

// ── time (?t=ISO overrides "now", QA only) ──
const T0 = Date.now();
const override = Date.parse(q.get('t') || '');
const now = () => (Number.isNaN(override) ? Date.now() : override + (Date.now() - T0));

const D = Date.parse(CONFIG.departureDay), TS = Date.parse(CONFIG.transitStart), AR = Date.parse(CONFIG.arrival);
const AW = CONFIG.arrivedWindowHours * 36e5;
const CD0 = Date.parse(CONFIG.countdownStart), CD1 = Date.parse(CONFIG.countdownEnd);
const base32 = (n) => n.toString(32).toUpperCase().padStart(4, '0');   // minutes left, base 32 (0-9 A-V)
const PHASES = {
  scheduled: ['ADMIN TRANSFER PENDING', 'SCHEDULED'],
  departing: ['ADMIN TRANSFER IN PROGRESS', 'DEPARTING'],
  in_transit: ['ADMIN TRANSFER IN PROGRESS', 'IN TRANSIT'],
  arrived: ['ADMIN TRANSFER COMPLETE', 'ARRIVED'],
  dormant: ['STUDIO ON HOLD', 'DORMANT'],
};
const phaseAt = (t) => (t < D ? 'scheduled' : t < TS ? 'departing' : t < AR ? 'in_transit' : t < AR + AW ? 'arrived' : 'dormant');
const dhms = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1e3));   // round UP so the display reaches 00 exactly at the target instant
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => pad(n)).join(':');
};

// ── time zones ──
const clockFmt = {}, partsFmt = {};
for (const k in CONFIG.tz) {
  clockFmt[k] = new Intl.DateTimeFormat('en-GB', { timeZone: CONFIG.tz[k], hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  partsFmt[k] = new Intl.DateTimeFormat('en-US', { timeZone: CONFIG.tz[k], hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
}
function utcOffsetMin(k, t) {
  const p = {};
  for (const x of partsFmt[k].formatToParts(t)) p[x.type] = +x.value;
  return (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(t / 1e3) * 1e3) / 6e4;
}

// ── reticle lock (cover math, object-position 50% 50%) ──
export function coverPoint(nx, ny, mw, mh, W, H) {
  const s = Math.max(W / mw, H / mh);
  return { x: nx * mw * s - (mw * s - W) / 2, y: ny * mh * s - (mh * s - H) / 2 };
}
// ── background videos: the player in front (front) and the index of its clip (vi) ──
const vids = [$('#bgv-a'), $('#bgv-b')];
let front = vids[0], vi = 0;
const clip = (n) => CONFIG.videos[n % CONFIG.videos.length] || {};
function lock() {
  const W = hero.clientWidth, H = hero.clientHeight;   // the photo area (on phones/tablets the page is taller than this)
  const mw = front.videoWidth, mh = front.videoHeight, t = clip(vi).target || CONFIG.bgTarget;
  const p = mw && mh ? coverPoint(t.x, t.y, mw, mh, W, H) : { x: W / 2, y: H * 0.44 };
  stage.style.setProperty('--cx', p.x.toFixed(1) + 'px');
  stage.style.setProperty('--cy', p.y.toFixed(1) + 'px');
  stage.style.setProperty('--u', clamp(Math.min(H / 900, W > H ? W / 1440 : W / 820), 0.7, 1.25).toFixed(3));
}
addEventListener('resize', lock);
vids.forEach((v) => v.addEventListener('loadedmetadata', () => v === front && lock()));
lock();

// ── live readouts ──
const el = (id) => document.getElementById(id);
const set = (id, v) => { const e = el(id); if (e && e.textContent !== v) e.textContent = v; };
const is404 = document.body.dataset.page === '404';
let shown = '';

function tick() {
  const t = now(), ph = phaseAt(t), [label, ribbon] = PHASES[ph];
  set('clk-cdg', clockFmt.CDG.format(t));
  set('clk-akl', clockFmt.AKL.format(t));
  const off = Math.round((utcOffsetMin('AKL', t) - utcOffsetMin('CDG', t)) / 60);
  set('offset', (off >= 0 ? '+' : '') + off + 'H');

  // countdown: T-DD:HH:MM:SS to countdownEnd (holds at zero afterwards); gauge = whole minutes left in base 32; bar fills start → end
  const left = Math.max(0, CD1 - t);
  set('timecode', 'T-' + dhms(left));
  set('g-num', base32(Math.ceil(left / 6e4)));
  stage.style.setProperty('--p', clamp((t - CD0) / (CD1 - CD0), 0, 1).toFixed(4));
  // route progress (bottom line): moves only during the flight window
  const route = ph === 'in_transit' ? (t - TS) / (AR - TS) : ph === 'arrived' || ph === 'dormant' ? 1 : 0;
  stage.style.setProperty('--r', clamp(route, 0, 1).toFixed(4));

  if (!is404 && shown !== ph) {
    shown = ph;
    set('status-v', label);
    if (!booting) set('ribbon', ribbon);
  }
}

// ── boot sequence (once, ≤ 3 s) ──
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%';
let booting = false;
function boot() {
  const ribbon = el('ribbon'), final = ribbon.textContent;
  booting = true;
  const t0 = performance.now();
  document.documentElement.classList.add('ready');
  (function frame(now) {
    const t = now - t0, p = clamp(t / 1800, 0, 1);
    const target = is404 ? final : PHASES[shown][1];
    ribbon.textContent = p < 1
      ? [...target].map((c, i) => (c === ' ' || i < Math.floor(p * target.length * 1.15) ? c : GLYPHS[Math.floor((t / 60 + i * 7.3) % GLYPHS.length)])).join('')
      : target;
    if (t < 1850) requestAnimationFrame(frame);
    else { booting = false; ribbon.textContent = target; }
  })(t0);
}

// ── console log: types the <li>s of #log one after another, forever (reduced motion: the HTML list stays as a static log) ──
function streamLog() {
  const ul = el('log'), C = CONFIG.log;
  const lines = ul ? [...ul.children].map((li) => ({ t: li.textContent.trim(), c: li.className })).filter((l) => l.t) : [];
  if (!lines.length) return;
  stage.style.setProperty('--log-lines', C.visible);
  ul.replaceChildren();
  let i = 0;
  const add = (l) => { const li = document.createElement('li'); li.className = l.c; ul.append(li); while (ul.children.length > C.visible) ul.firstChild.remove(); return li; };
  for (; i < Math.min(C.prefill, lines.length); i++) add(lines[i]).textContent = lines[i].t;   // the log is already "running" when you arrive
  setTimeout(function next() {
    const l = lines[i++ % lines.length], li = add(l);
    li.classList.add('typing');
    let n = 0;
    (function type() {
      li.textContent = l.t.slice(0, ++n);
      if (n < l.t.length) return setTimeout(type, C.charMs + Math.random() * 20);
      li.classList.remove('typing');
      setTimeout(next, C.pauseMs[0] + Math.random() * (C.pauseMs[1] - C.pauseMs[0]));
    })();
  }, 1900);
}

// ── blur boxes: grid cells that fade in at random places, blur the photo behind them, then fade out (reduced motion: a still set) ──
function blurBoxes() {
  const layer = el('blurs'), G = CONFIG.grid, B = CONFIG.blur, used = new Set();   // B is read live, so the numbers in CONFIG.blur can be changed on the fly
  if (!layer) return;
  const rnd = (a, b) => a + Math.random() * (b - a), skew = (a, b, p) => a + (b - a) * Math.random() ** p;   // skew: p > 1 → mostly small values, sometimes large
  const dims = () => [Math.ceil((hero.clientWidth - G.x) / G.cell), Math.ceil((hero.clientHeight - G.y) / G.cell)];
  function add(i, j, still) {
    const key = i + ',' + j;
    if (used.has(key)) return false;
    used.add(key);
    const b = document.createElement('div'), blur = rnd(6, 12).toFixed(1), dim = rnd(0.82, 0.95).toFixed(2);   // every box blurs a little differently
    b.className = 'blur-box';
    b.style.cssText = `left:${G.x + i * G.cell}px;top:${G.y + j * G.cell}px;width:${G.cell}px;height:${G.cell}px;-webkit-backdrop-filter:blur(${blur}px) brightness(${dim});backdrop-filter:blur(${blur}px) brightness(${dim})`;
    layer.append(b);
    if (still) { requestAnimationFrame(() => b.classList.add('on')); return true; }
    const tin = rnd(...B.fadeIn), hold = skew(B.hold[0], B.hold[1], 2.2), tout = rnd(...B.fadeOut);
    b.style.transitionDuration = tin.toFixed(0) + 'ms'; b.style.transitionTimingFunction = 'ease-out';
    requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('on')));
    setTimeout(() => {
      b.style.transitionDuration = tout.toFixed(0) + 'ms'; b.style.transitionTimingFunction = 'ease-in';
      b.classList.remove('on');
      setTimeout(() => { b.remove(); used.delete(key); }, tout + 60);
    }, tin + hold);
    return true;
  }
  function spawn(near) {
    const n = layer.children.length;
    if (n >= B.maxBurst || (n >= B.max && Math.random() > B.overflow)) return null;
    const [cols, rows] = dims();
    for (let t = 0; t < 12; t++) {
      const i = near ? near.i + Math.floor(rnd(-1, 2)) : Math.floor(Math.random() * cols), j = near ? near.j + Math.floor(rnd(-1, 2)) : Math.floor(Math.random() * rows);
      if (i >= 0 && j >= 0 && i < cols && j < rows && add(i, j)) return { i, j };
    }
    return null;
  }
  if (reduce) { const [c, r] = dims(); for (let n = 0; n < 6; n++) add(Math.floor(Math.random() * c), Math.floor(Math.random() * r), true); return; }
  (function loop() {
    if (Math.random() < B.burst) {
      const seed = spawn(), count = 3 + Math.floor(Math.random() * 5);
      for (let k = 1; k < count; k++) setTimeout(() => spawn(Math.random() < 0.6 ? seed : null), k * rnd(25, 220));
    } else spawn();
    setTimeout(loop, skew(B.pause[0], B.pause[1], 2));
  })();
}

// ── rare glitch band (one every 9–16 s, 120 ms, ≤ 6 % opacity) ──
function glitch() {
  const g = el('glitch');
  setTimeout(() => {
    g.style.top = (Math.random() * 90).toFixed(1) + '%';
    g.style.height = 10 + Math.random() * 50 + 'px';
    g.classList.add('on');
    setTimeout(() => { g.classList.remove('on'); glitch(); }, 120);
  }, 9e3 + Math.random() * 7e3);
}

// ── doodle slots: inline /doodles/doodle-<slot>.svg for each slot listed in /doodles/doodles.json, otherwise stay empty ──
// (The list exists so empty slots never request a missing file — browsers log every 404 to the console.)
async function doodles() {
  let listed = [];
  try { const r = await fetch('/doodles/doodles.json'); if (r.ok) listed = (await r.json()).slots || []; } catch { /* none */ }
  for (const slot of document.querySelectorAll('.doodle')) {
    if (!listed.includes(slot.dataset.slot)) continue;
    try {
      const res = await fetch(`/doodles/doodle-${slot.dataset.slot}.svg`);
      if (!res.ok || !(res.headers.get('content-type') || '').includes('image/svg+xml')) continue;
      const doc = new DOMParser().parseFromString(await res.text(), 'image/svg+xml');
      const svg = doc.documentElement;
      if (svg.nodeName !== 'svg' || doc.querySelector('parsererror')) continue;
      svg.querySelectorAll('script,foreignObject').forEach((n) => n.remove());
      [svg, ...svg.querySelectorAll('*')].forEach((n) => [...n.attributes].forEach((a) => /^on/i.test(a.name) && n.removeAttribute(a.name)));
      const node = document.importNode(svg, true);
      node.removeAttribute('width'); node.removeAttribute('height');
      slot.appendChild(node);
      if (node.hasAttribute('data-draw') && !reduce) {
        node.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse').forEach((n) => n.setAttribute('pathLength', '1'));
        node.classList.add('draw');
      }
    } catch { /* empty slot */ }
  }
}

// ── background playlist: clip after clip, forever, hard cuts ──
function playlist() {
  const list = CONFIG.videos;
  if (reduce || navigator.connection?.saveData) {   // stills only: the poster stays, nothing is downloaded
    vids.forEach((v) => { v.pause(); v.removeAttribute('autoplay'); v.removeAttribute('src'); v.load(); });
    return;
  }
  if (list.length < 2) return;                      // one clip: the HTML already loops it
  front.loop = false;
  vids.forEach((v) => v.removeAttribute('autoplay'));   // autoplay would start a re-armed clip behind the scenes, so clips would arrive half-played
  front.play().catch(() => {});
  let skips = 0;
  const arm = (v, n) => { v.src = clip(n).src; v.preload = 'auto'; v.load(); };   // buffer the next clip behind the one playing
  arm(vids[1], 1);
  function advance() {
    const back = front === vids[0] ? vids[1] : vids[0], n = (vi + 1) % list.length;
    back.play().then(() => {                        // cut the moment the next clip is really running; the last frame stays up until then
      skips = 0;
      back.classList.add('on'); front.classList.remove('on');
      const old = front; front = back; vi = n; lock();
      arm(old, (n + 1) % list.length);
    }).catch(() => {                                // a clip that cannot play is skipped
      if (++skips > list.length) { skips = 0; front.currentTime = 0; front.play().catch(() => {}); return; }
      vi = n; arm(back, (n + 1) % list.length); advance();
    });
  }
  vids.forEach((v) => v.addEventListener('ended', () => v === front && advance()));
}

// ?pick → click the Sky Tower while a clip plays: the reticle jumps there and the numbers for CONFIG.videos[n].target appear
if (q.has('pick')) {
  const out = Object.assign(document.createElement('pre'), { className: 'pick-out', textContent: 'PICK: click the Sky Tower' });
  document.body.append(out);
  stage.addEventListener('click', (e) => {
    const r = hero.getBoundingClientRect(), mw = front.videoWidth, mh = front.videoHeight;
    if (!mw) return;
    const px = e.clientX - r.left, py = e.clientY - r.top, k = Math.max(r.width / mw, r.height / mh);
    const x = ((px + (mw * k - r.width) / 2) / (mw * k)).toFixed(3), y = ((py + (mh * k - r.height) / 2) / (mh * k)).toFixed(3);
    stage.style.setProperty('--cx', px + 'px'); stage.style.setProperty('--cy', py + 'px');
    out.textContent = `clip ${vi + 1} (${clip(vi).src}) → target: { x: ${x}, y: ${y} }`;
    console.log(out.textContent);
  });
}

// ── go ──
if (q.has('slots')) document.body.classList.add('show-slots');
playlist();
// animated doodles (webm): a still first frame with reduced motion / Save-Data
if (reduce || navigator.connection?.saveData) document.querySelectorAll('.doodle video').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
// tick on whole-second boundaries of the countdown so it shows 00:00:00:00 exactly at countdownEnd (not up to a second later)
(function loop() {
  tick();
  const left = CD1 - now();
  setTimeout(loop, left > 0 ? ((left - 1) % 1000) + 1 : 1000);
})();
if (!reduce && el('ribbon')) { boot(); streamLog(); glitch(); }
doodles();
blurBoxes();

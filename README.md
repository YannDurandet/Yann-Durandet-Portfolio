# DRNDT Studio — "on hold" holding page

Single-screen, zero-build static page (`public/`). One link: Instagram. The previous portfolio is preserved in git:
tag `portfolio-archive-2026-11` / branch `archive/portfolio` (`git checkout portfolio-archive-2026-11`).

**Preview locally:** `node scripts/serve.mjs` → http://127.0.0.1:8787 (applies `public/_headers`, real 404s). Add `?t=2026-12-04T22:00:00Z` to fake "now" (QA only); `?slots` outlines the doodle slots.

**Edit copy/dates/lock point:** `CONFIG` at the top of `public/main.js` (day-level dates only — the file is public). `arrival` is a TODO until the real day is confirmed. **Countdown:** the top-right timecode and the gauge run to `countdownEnd` (15 Jan 2027, 21:45 Paris, shows `T-00:00:00:00` and holds at zero). The gauge number is whole minutes left in base 32 (digits 0-9 A-V, rounded up, zero-padded to 4) and its bar fills from `countdownStart` to `countdownEnd`. The thin bottom line is separate: it only moves during the flight window (`transitStart` → `arrival`). `bgTarget` is the Sky Tower lock point as a fraction of the background image; re-tune it after swapping the background.

**Console log (bottom-left):** the lines live in `public/index.html`, in the `<ul id="log">` block (search for `CONSOLE LOG`). One `<li>` per line; the class sets the colour: `w` white, `y` yellow, `r` red, e.g. `<li class="y">NEW LINE OF TEXT</li>`. Lines are typed one after another in order and loop forever; add lines anywhere in the list. After editing run `node scripts/make-404.mjs` so the 404 page matches. Speed and how many lines show at once: `CONFIG.log` in `public/main.js`. With reduced motion (or no JS) the list shows as a static log. It sits bottom-left on desktop; on phones and tablets it is part of the scrolling area below the first screen.

**Layout:** desktop (≥ 881px wide, landscape) is one fixed screen with no scroll; bottom-right stack = CDG/AKL times, countdown, base-32 gauge, barcode art (`doodle-bc`). Phones, portrait tablets, windows ≤ 880px wide and landscape phones scroll: the first screen is the hero (photo, wordmark, reticle, status), the stack and console flow below it, and the link stays pinned at the bottom. Markup: `.hero` (photo + HUD) and `.dock` (stack + console) in `public/index.html`.

**Grid + blur boxes:** the dashed grid is one SVG pattern (`<pattern id="g">` in `index.html`, 72px cells). `CONFIG.grid` in `main.js` must match it. Random cells fade in, blur the photo behind them, and fade out (`CONFIG.blur`: fade-in / hold / fade-out ranges in ms — each box picks its own, holds are skewed toward short with the odd long one — how often, bursts, and how many may be on screen: usually up to 8, sometimes up to 16). They sit under the grid marks and the HUD; with reduced motion you get a still set.

**Deploy:** serve `public/` as static assets. Preview first; production only after approval. `404.html` is derived from `index.html`: after editing `index.html` run `node scripts/make-404.mjs`.

**Checks:** `cd scripts && npm i && npx playwright install chromium`, then from the repo root `node scripts/check.mjs` (add a URL to test a deployment), `node scripts/shoot.mjs` (screenshots to `shots/`), `node scripts/og.mjs` (rebuild `og.jpg`). For quick UI tweaks, `node scripts/check.mjs` alone is enough — the full suites run before deploys, not per tweak (see [CLAUDE.md](CLAUDE.md)).

## Background videos
`public/video/Auckland2…5.mp4` play one after another, forever, with plain cuts (no fade). The order and the list are `CONFIG.videos` in `public/main.js`: add, remove or reorder entries there. Each clip can have its own reticle lock on the Sky Tower: `{ src, target: { x, y } }` (fractions of the frame; default `CONFIG.bgTarget`). Open the page with `?pick`, click the tower while that clip plays, and copy the numbers shown. Muted H.264 MP4, no audio; make new clips fast-start (`ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4`). The next clip loads while the current one plays. `public/video/poster.jpg` is the still shown while loading, with reduced motion, Save-Data, and when a clip cannot play (`node scripts/prep-video.mjs` rebuilds it from the first clip of the list; the first `<video>` in `index.html` must be that same clip).

## Add doodles
Six slots: `ring`, `tl`, `tr`, `bl`, `bc`, `edge` (see `?slots`). Drop `doodle-<slot>.svg` into `public/doodles/` **and add the slot name to `public/doodles/doodles.json`** (`{"slots":["ring","bl"]}`). The list exists so empty slots never request a missing file (browsers log every 404 to the console).

Currently live: `doodle-bc.webm`, the animated "barcodes and gates" (VP9 with transparency), under the gauge. It is a plain `<video>` inside the `#doodle-bc` slot in `index.html` (not loaded through `doodles.json`); replace the file to change it. Chrome/Edge honour the transparency; Safari (and possibly Firefox) may show it on a solid box. An HEVC-alpha `.mov` fallback can be added if that matters.

**"ON" frame:** the square around "ON" is `public/art/main-frame.svg`, recoloured amber with a CSS mask (single-colour art works best). Replace that file to change it; keep it square. It lives in `/art/`, not `/media/`, because `/media/*` is cached for a year.

SVG rules: set a `viewBox`, no fixed `width/height`; `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `vector-effect="non-scaling-stroke"`; accents use `class="red"` or `class="amber"`; no raster images, scripts or fonts (outline text). Optional `data-draw=""` on the root draws the strokes on once at boot (skipped under reduced motion). From Illustrator export with *Styling → Presentation Attributes*.

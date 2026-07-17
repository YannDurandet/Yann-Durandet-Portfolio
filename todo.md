# SEO Image Assets — To Do

## Portfolio (durandet.studio)

These OG images are now referenced in the HTML but don't exist yet.
They need to be created and placed in `/assets/`.
Recommended format: JPEG, 1200×630px (1.91:1 ratio), under 1MB.

- [ ] `assets/og-dord.jpg` — OG card for the DORD case study
  - Show the logo or a key visual from the project against a dark/branded background
  - Referenced by: `dord.html`

- [ ] `assets/og-vantage.jpg` — OG card for the Vantage case study
  - Show the logo or brand colour palette on a clean background
  - Referenced by: `vantage.html`

- [ ] `assets/og-sofia.jpg` — OG card for the Sofia by SGS case study
  - Show a UI screenshot or the dashboard redesign
  - Referenced by: `sofia.html`

> Note: `assets/og-191.jpg` and `assets/og-square.jpg` already exist for the homepage.
> The square one (`og-square.jpg`) is used for Twitter's `summary_large_image` — make sure it's at least 800×800px.

---

## Linktree (yanndurandet.me)

- [ ] Replace SVG OG image with a JPEG/PNG
  - Current: `https://yanndurandet.me/assets/DRNDT_logo_dark.svg`
  - Facebook, LinkedIn, and most crawlers don't render SVG as OG images
  - Create a 1200×630px JPEG (logo on cream background works fine)
  - Upload to `/assets/` and update `og:image` in `index.html` line 12
  - Also add a `twitter:image` meta tag (currently missing from linktree)

---

## Nice to Have

- [ ] Set up GA4 in linktree — replace `G-XXXXXXXXXX` placeholder in `index.html` lines 35–39 with your real Measurement ID
- [ ] Submit `sitemap.xml` to Google Search Console: https://search.google.com/search-console

// Screenshots: node scripts/shoot.mjs [--only=1440x900] [--phase=transit] [--reduced]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';

const VIEWPORTS = [[1920, 1080], [1440, 900], [1280, 720], [1024, 768], [820, 1180], [390, 844], [360, 640], [844, 390]];
const PHASES = { scheduled: '2026-11-25T12:00:00Z', departing: '2026-12-03T12:00:00Z', transit: '2026-12-04T22:00:00Z', arrived: '2026-12-05T02:00:00Z', dormant: '2027-01-15T12:00:00Z' };
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const only = arg('only'), phaseOnly = arg('phase'), reducedOnly = process.argv.includes('--reduced');
const extra = arg('qs') || '';
const outDir = new URL('../shots/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

if (only && !VIEWPORTS.some(([w, h]) => `${w}x${h}` === only)) VIEWPORTS.push(only.split('x').map(Number)); // any custom size
const srv = await serve();
const browser = await chromium.launch();
for (const [w, h] of VIEWPORTS) {
  if (only && only !== `${w}x${h}`) continue;
  for (const [name, iso] of Object.entries(PHASES)) {
    if (phaseOnly ? phaseOnly !== name : name !== 'transit' && !only) continue;
    for (const reduced of reducedOnly ? [true] : [false]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
      const page = await ctx.newPage();
      await page.goto(`${srv.url}/?t=${iso}${extra}`);
      await page.waitForTimeout(reduced ? 600 : 3600);
      const file = `${outDir}${w}x${h}-${name}${reduced ? '-reduced' : ''}.png`;
      await page.screenshot({ path: file, fullPage: process.argv.includes('--full') });   // --full: whole scrollable page
      console.log(file);
      await ctx.close();
    }
  }
}
await browser.close(); srv.close();

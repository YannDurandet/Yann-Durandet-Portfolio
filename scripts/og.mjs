// Dev-only: public/og.jpg (1200×630) from the in-transit state.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
const srv = await serve();
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1200, height: 630 } })).newPage();
await page.goto(`${srv.url}/?t=2026-12-04T10:00:00Z`);
await page.waitForTimeout(3500);
await page.screenshot({ path: new URL('../public/og.jpg', import.meta.url).pathname, type: 'jpeg', quality: 82 });
await browser.close(); srv.close();
console.log('wrote public/og.jpg');

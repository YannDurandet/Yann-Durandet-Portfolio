// Dev-only: derive public/404.html from public/index.html (same shell, "signal lost" copy). Re-run after editing index.html.
import { readFileSync, writeFileSync } from 'node:fs';
const dir = new URL('../public/', import.meta.url);
let h = readFileSync(new URL('index.html', dir), 'utf8');
const sub = (a, b) => { if (!h.includes(a)) throw new Error('make-404: missing ' + a); h = h.replace(a, b); };
sub('<title>DRNDT Studio — On Hold</title>', '<title>DRNDT Studio — Signal Lost</title>');
sub(/<meta name="description"[^>]*>/.exec(h)[0], '<meta name="description" content="Route not found. DRNDT Studio is on hold during an admin transfer from Paris (CDG) to Auckland (AKL).">\n<meta name="robots" content="noindex">');
h = h.replace(/<link rel="canonical"[^>]*>\n/, '').replace(/<meta property="og:[^>]*>\n/g, '').replace(/<meta name="twitter:[^>]*>\n/g, '');
sub('<body>', '<body data-page="404">');
sub('<span class="v" id="status-v">ADMIN TRANSFER IN PROGRESS</span>', '<span class="v" id="status-v">ROUTE NOT FOUND</span>');
sub('id="ribbon">RELOCATING</p>', 'id="ribbon">SIGNAL LOST</p>');
sub('<p class="sr-only">', '<p class="sr-only">Page not found. ');
writeFileSync(new URL('404.html', dir), h);
console.log('wrote public/404.html');

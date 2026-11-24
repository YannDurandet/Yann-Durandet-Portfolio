// Dev-only static server that mimics Cloudflare static assets: applies public/_headers and serves 404.html with a real 404.
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../public/', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json' };

function parseHeaders() {
  const rules = []; let cur = null;
  for (const line of readFileSync(join(ROOT, '_headers'), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) rules.push((cur = { pat: line.trim(), h: {} }));
    else { const i = line.indexOf(':'); cur.h[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
  }
  return rules;
}
const match = (pat, path) => (pat.endsWith('/*') ? path.startsWith(pat.slice(0, -1)) || pat === '/*' : pat === path);

export function serve(port = 0) {
  const rules = parseHeaders();
  const server = http.createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.endsWith('/')) path += 'index.html';
    let file = normalize(join(ROOT, path));
    let status = 200;
    if (!file.startsWith(ROOT) || !existsSync(file) || !statSync(file).isFile() || path === '/_headers') {
      file = join(ROOT, '404.html'); status = 404;
      if (!existsSync(file)) { res.writeHead(404); return res.end('not found'); }
    }
    const headers = { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' };
    for (const r of rules) if (match(r.pat, path)) Object.assign(headers, r.h);
    const body = readFileSync(file), range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    headers['Accept-Ranges'] = 'bytes';
    if (range && status === 200) {   // video needs byte ranges
      const start = range[1] === '' ? Math.max(0, body.length - +range[2]) : +range[1], end = range[1] !== '' && range[2] !== '' ? Math.min(+range[2], body.length - 1) : body.length - 1;
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1 });
      return res.end(body.subarray(start, end + 1));
    }
    res.writeHead(status, headers);
    res.end(body);
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() })));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const s = await serve(+process.argv[2] || 8787);
  console.log('serving public/ at', s.url);
}

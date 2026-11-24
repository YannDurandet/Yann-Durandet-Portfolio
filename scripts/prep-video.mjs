// Dev-only: rebuild the poster (public/video/poster.jpg) from the FIRST clip of CONFIG.videos, 1 s in. Needs ffmpeg.
// The HTML's first <video src> must be that same clip (check.mjs verifies it).
// New clips: make them fast-start for the web first:  ffmpeg -i in.mp4 -c copy -movflags +faststart public/video/NAME.mp4
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const dir = new URL('../public/video/', import.meta.url).pathname;
const first = /videos:\s*\[\s*\{\s*src:\s*'\/video\/([^']+)'/.exec(readFileSync(new URL('../public/main.js', import.meta.url), 'utf8'))[1];
execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', '1', '-i', dir + first, '-frames:v', '1', '-q:v', '4', dir + 'poster.jpg']);
console.log(`wrote public/video/poster.jpg from ${first}`);

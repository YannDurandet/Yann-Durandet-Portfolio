import sharp from "sharp";
import { readdir } from "fs/promises";
import path from "path";

const ASSETS_DIR = "src/assets";
const QUALITY = 80;

const files = await readdir(ASSETS_DIR);
const pngs = files.filter((f) => f.endsWith(".png") && f !== "logo.png");

for (const file of pngs) {
  const input = path.join(ASSETS_DIR, file);
  const output = path.join(ASSETS_DIR, file.replace(".png", ".webp"));
  const info = await sharp(input).webp({ quality: QUALITY }).toFile(output);
  const oldSize = (await sharp(input).metadata()).size;
  console.log(
    `${file} → ${file.replace(".png", ".webp")}  (${(oldSize / 1024 / 1024).toFixed(1)}MB → ${(info.size / 1024).toFixed(0)}KB)`
  );
}

console.log("\nDone! Now update imports from .png to .webp");

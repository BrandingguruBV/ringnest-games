import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const artDir = join(webRoot, "scripts", "art");
const storeArt = join(webRoot, "..", "store-art");

/** Decode checked-in base64 so Vercel/GitHub always get real assets, not stubs. */
const b64Copies = [
  ["brand-banner.jpg.b64", "public/brand/banner.jpg"],
  ["brand-mark.jpg.b64", "public/brand/icon.jpg"],
  ["brand-mark.jpg.b64", "public/brand/logo.jpg"],
  ["brand-mark.jpg.b64", "public/brand/mark.jpg"],
  ["pet-orbits-icon.jpg.b64", "public/games/pet-orbits-icon.jpg"],
  ["pet-orbits-mark.jpg.b64", "public/games/pet-orbits-mark.jpg"],
  ["pet-orbits-thumb.jpg.b64", "public/games/pet-orbits-thumb.jpg"],
  ["favicon.ico.b64", "public/favicon.ico"],
  ["favicon-32.png.b64", "public/icons/favicon-32.png"],
  ["favicon-48.png.b64", "public/icons/favicon-48.png"],
  ["apple-touch-icon.png.b64", "public/apple-touch-icon.png"],
  ["icon-192.png.b64", "public/icons/icon-192.png"],
  ["icon-512.png.b64", "public/icons/icon-512.png"],
  ["app-icon.png.b64", "app/icon.png"],
  ["app-apple-icon.png.b64", "app/apple-icon.png"],
];

/** Local fallback when developing next to pet-orbits store-art. */
const fileCopies = [
  ["ringnest-banner.jpg", "public/brand/banner.jpg"],
  ["ringnest-icon.jpg", "public/brand/icon.jpg"],
  ["ringnest-logo.jpg", "public/brand/logo.jpg"],
  ["ringnest-mark.jpg", "public/brand/mark.jpg"],
  ["pet-orbits-icon-scene.jpg", "public/games/pet-orbits-icon.jpg"],
  ["pet-orbits-icon.jpg", "public/games/pet-orbits-mark.jpg"],
  ["pet-orbits-thumbnail.jpg", "public/games/pet-orbits-thumb.jpg"],
];

const written = new Set();

function writeBytes(destRel, bytes) {
  const dest = join(webRoot, destRel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, bytes);
  written.add(destRel);
  console.log(`[copy-art] ${destRel} (${bytes.length} bytes)`);
}

for (const [from, to] of b64Copies) {
  const src = join(artDir, from);
  if (!existsSync(src)) continue;
  const text = readFileSync(src, "utf8").replace(/\s+/g, "");
  if (!text) continue;
  writeBytes(to, Buffer.from(text, "base64"));
}

for (const [from, to] of fileCopies) {
  if (written.has(to)) continue;
  const dest = join(webRoot, to);
  const src = join(storeArt, from);
  if (!existsSync(src)) continue;
  if (existsSync(dest) && statSync(dest).size > 8000) continue;
  writeBytes(to, readFileSync(src));
}

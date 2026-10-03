import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const storeArt = join(webRoot, "..", "store-art");

const copies = [
  ["ringnest-banner.jpg", "public/brand/banner.jpg"],
  ["ringnest-icon.jpg", "public/brand/icon.jpg"],
  ["ringnest-logo.jpg", "public/brand/logo.jpg"],
  ["ringnest-mark.jpg", "public/brand/mark.jpg"],
  ["pet-orbits-icon-scene.jpg", "public/games/pet-orbits-icon.jpg"],
  ["pet-orbits-icon.jpg", "public/games/pet-orbits-mark.jpg"],
  ["pet-orbits-thumbnail.jpg", "public/games/pet-orbits-thumb.jpg"],
];

for (const [from, to] of copies) {
  const dest = join(webRoot, to);
  if (existsSync(dest)) continue;
  const src = join(storeArt, from);
  if (!existsSync(src)) continue;
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

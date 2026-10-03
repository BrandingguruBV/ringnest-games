import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const artDir = join(webRoot, "scripts", "art");

const copies = [
  ["brand__banner.jpg.b64", "public/brand/banner.jpg"],
  ["brand__icon.jpg.b64", "public/brand/icon.jpg"],
  ["brand__logo.jpg.b64", "public/brand/logo.jpg"],
  ["brand__mark.jpg.b64", "public/brand/mark.jpg"],
  ["games__pet-orbits-icon.jpg.b64", "public/games/pet-orbits-icon.jpg"],
  ["games__pet-orbits-mark.jpg.b64", "public/games/pet-orbits-mark.jpg"],
  ["games__pet-orbits-thumb.jpg.b64", "public/games/pet-orbits-thumb.jpg"],
];

for (const [from, to] of copies) {
  const src = join(artDir, from);
  const dest = join(webRoot, to);
  if (!existsSync(src)) continue;
  const b64 = readFileSync(src, "utf8").trim();
  if (b64.length < 200) continue;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(b64, "base64"));
}

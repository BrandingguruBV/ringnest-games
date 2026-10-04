# Ringnest website (ringnest.games)

Public studio site for **Ringnest**. Worlds on Games. 156 Pet Orbits pets on Catalog. Studio story on About.

Pet Orbits is a **Private** Ringnest group experience. Roblox shows a 404 on Private games. The Play button explains that until the owner sets it Public.

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://127.0.0.1:45221](http://127.0.0.1:45221).

## Add a game later

Edit `lib/games.ts`. Add a thumbnail under `public/games/`. Set `publicJoin: true` only when the Roblox experience is Public.

## Play on Roblox URL

Place id `85407099788309`. Universe id `10769197443`.

```bash
NEXT_PUBLIC_PET_ORBITS_PLACE_ID=85407099788309
```

When Roblox is Public, set `publicJoin: true` on Pet Orbits in `lib/games.ts`.

## Deploy

This folder is a Next.js app. Point the host at `web/` (or the Ringnest site repo root), then attach **ringnest.games**.

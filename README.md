# Ringnest website (ringnest.games)

Public studio site for **Ringnest**. Play Pet Orbits from Games. Browse 156 pets on Catalog. About the studio on About.

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://127.0.0.1:45221](http://127.0.0.1:45221).

## Add a game later

Edit `lib/games.ts`. Add a thumbnail under `public/games/`. Set a Roblox play URL when that world is ready.

## Play on Roblox URL

Place id `85407099788309`. Universe id `10769197443`.

```bash
NEXT_PUBLIC_PET_ORBITS_PLACE_ID=85407099788309
```

## Deploy

This folder is a Next.js app. Point the host at `web/` (or the Ringnest site repo root), then attach **ringnest.games**.

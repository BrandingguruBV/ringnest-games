# Ringnest

Studio website for [ringnest.games](https://ringnest.games). Roblox-style nest, orbiting orbs, and a catalog of every Ringnest game.

Right now the live title is **Pet Orbits**, with a **Play on Roblox** button. Filters (status, genre, search) already work so the next game is a data entry, not a redesign.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:45221](http://127.0.0.1:45221).

## Add a game later

Edit `lib/games.ts`. Add a thumbnail under `public/games/`. Live games need a `playUrl`. Coming soon games stay in the grid and filter as **Coming soon**.

## Play on Roblox URL

Pet Orbits universe id is `10769197443`. If you have the public place id, set it when deploying:

```bash
NEXT_PUBLIC_PET_ORBITS_PLACE_ID=yourPlaceId
```

Or set the full join link:

```bash
NEXT_PUBLIC_PET_ORBITS_PLAY_URL=https://www.roblox.com/games/PLACE_ID/Pet-Orbits
```

Until that is set, the button uses the universe start link.

## Deploy

This is a Next.js app. Vercel project **ringnest-games** deploys from this repo root. Attach the domain **ringnest.games** in the Vercel project settings when DNS is ready.

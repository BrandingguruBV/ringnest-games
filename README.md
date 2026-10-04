# Ringnest website (ringnest.games)

Public studio site for **Ringnest**. Worlds on Games. 156 Pet Orbits pets on Catalog. Studio story on About.

Pet Orbits is a **Private** Ringnest group experience. Roblox shows a 404 on Private games. The Play button explains that until the owner sets it Public.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:45221](http://127.0.0.1:45221).

## Add a game later

Edit `lib/games.ts`. Add a thumbnail under `public/games/`. Set `publicJoin: true` only when the Roblox experience is Public.

## Play on Roblox URL

Place id `85407099788309`. Universe id `10769197443`.

When Roblox is Public, set `publicJoin: true` on Pet Orbits in `lib/games.ts`.

## Deploy

This repo is the Next.js app for **ringnest.games**.

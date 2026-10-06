# Ringnest website (ringnest.games)

Public studio site for **Ringnest**. Play Pet Orbits from Games. The full Pet Orbits landing (`/games/pet-orbits`) covers why to play, 12 biomes, 162 pets, Nest Club, 12 passes, and 14 packs. Browse 162 pets on Catalog. About the studio on About. Discord guide on `/discord`.

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

## Discord

The `/discord` page is a player guide. After the Ringnest Discord bot is invited, `POST /api/discord/setup` builds the official layout (INFO, SUPPORT, PET ORBITS, tickets, AutoMod, ping buttons).

```bash
NEXT_PUBLIC_DISCORD_URL=https://discord.gg/your-invite
DISCORD_BOT_TOKEN=
DISCORD_PUBLIC_KEY=
DISCORD_APPLICATION_ID=
DISCORD_GUILD_ID=1556938161647517698
DISCORD_SETUP_SECRET=
```

Set the Discord Interactions Endpoint URL to `https://ringnest.games/api/discord/interactions`.

## Deploy

This folder is a Next.js app. Point the host at `web/` (or the Ringnest site repo root), then attach **ringnest.games**.

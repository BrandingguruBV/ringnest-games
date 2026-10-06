export const site = {
  name: "Ringnest",
  domain: "ringnest.games",
  url: "https://ringnest.games",
  tagline: "Worlds you join. Pets you keep. Reasons to come back.",
  description:
    "Ringnest makes games on Roblox. Play Pet Orbits: crash orbits, hatch 162 pets, run 12 biome nests, and come back for daily quests and offline pens.",
  about:
    "Ringnest is a game studio. We make worlds you can play on Roblox, on phone, PC, and console. Our first game is Pet Orbits. Ringnest is part of Brandingguru BV, Netherlands.",
  company: "Brandingguru BV",
  companyLegal: "Brandingguru BV, Netherlands",
  companyUrl: "https://branding-guru.com",
  groupName: "Ringnest",
  discord: {
    name: "Ringnest Discord",
    serverId: "1556938161647517698",
    /** Prefer a never-expiring discord.gg invite via NEXT_PUBLIC_DISCORD_URL. */
    url:
      process.env.NEXT_PUBLIC_DISCORD_URL ??
      "https://discord.gg/FhH6t6PhvR",
  },
  // Bump this when art or favicon changes so browsers fetch a new file.
  assetVersion: "20261005a",
};


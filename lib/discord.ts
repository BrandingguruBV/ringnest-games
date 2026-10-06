export const discordChannels = [
  {
    hash: "#announcements",
    name: "announcements",
    who: "Studio only",
    purpose: "Official news. New features, codes, downtime, and when Pet Orbits updates.",
    find: "Read here first. Do not chat in this channel.",
  },
  {
    hash: "#bugs",
    name: "bugs",
    who: "Anyone playing",
    purpose: "Things that broke. Hatch timers, shop buys, crashes, missing orbs.",
    find: "What happened, phone / PC / console, and a screenshot if you can.",
  },
  {
    hash: "#general",
    name: "general",
    who: "Players",
    purpose: "Talk about Pet Orbits, ask how something works, find people to play with.",
    find: "Crew tags, private-server invites, and day-to-day chat.",
  },
  {
    hash: "#clips-and-highlights",
    name: "clips-and-highlights",
    who: "Players",
    purpose: "Short videos, screenshots, and cool moments from the arena.",
    find: "Crown steals, rare hatches, nest runs. Your clips, not someone else's.",
  },
] as const;

export const discordUses = [
  {
    title: "Hear about updates",
    body: "Codes, season notes, and downtime land in announcements before they hit the Roblox page.",
  },
  {
    title: "Report a bug",
    body: "Bugs is the fastest way to tell Ringnest what broke. We cannot see every Studio report.",
  },
  {
    title: "Find people to play",
    body: "General is for crews, private servers, and “who is in the arena right now.”",
  },
  {
    title: "Share a clip",
    body: "Clips and highlights is for hatches, crashes, and nest runs you want other players to see.",
  },
] as const;

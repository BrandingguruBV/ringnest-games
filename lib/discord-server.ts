import { CHAT, DENY_ALL_VIEW, P, READ, STAFF, VOICE, bits } from "./discord-bitfield.ts";

export const RINGNEST_GUILD_ID = "1556938161647517698";
export const PLAY_URL = "https://www.roblox.com/games/85407099788309/Pet-Orbits";
export const SITE_URL = "https://ringnest.games";

export const COLOR = {
  lime: 0x00e38c,
  cyan: 0x22d3ee,
  gold: 0xffd84a,
  pink: 0xff4fd8,
  navy: 0x0b1428,
} as const;

export type RoleSpec = {
  key: string;
  name: string;
  color: number;
  hoist?: boolean;
  mentionable?: boolean;
  permissions?: string;
};

export const ROLE_SPECS: RoleSpec[] = [
  {
    key: "studio",
    name: "Ringnest Studio",
    color: COLOR.cyan,
    hoist: true,
    permissions: bits(
      "view",
      "send",
      "embed",
      "attach",
      "history",
      "manageMessages",
      "manageChannels",
      "manageRoles",
      "mentionEveryone",
      "moderate",
      "kick",
      "manageThreads",
      "publicThreads",
      "privateThreads",
      "sendThreads",
      "connect",
      "speak",
      "mute",
      "move",
      "appCommands",
      "manageWebhooks",
      "viewAudit",
    ),
  },
  {
    key: "mod",
    name: "Moderator",
    color: COLOR.lime,
    hoist: true,
    permissions: STAFF,
  },
  { key: "club", name: "Nest Club", color: COLOR.gold, hoist: true },
  { key: "creator", name: "Creator", color: COLOR.pink, hoist: true },
  { key: "tester", name: "Tester", color: 0x84e85a },
  { key: "updates", name: "Updates", color: COLOR.cyan, mentionable: true },
  { key: "events", name: "Events", color: COLOR.gold, mentionable: true },
  { key: "codes", name: "Codes", color: COLOR.lime, mentionable: true },
];

export type ChannelSpec = {
  key: string;
  name: string;
  type: "text" | "announce" | "forum" | "voice";
  topic: string;
  chat?: boolean;
  aliases?: string[];
};

export type CategorySpec = {
  key: string;
  name: string;
  hidden?: boolean;
  channels: ChannelSpec[];
};

export const CATEGORIES: CategorySpec[] = [
  {
    key: "info",
    name: "INFO",
    channels: [
      {
        key: "rules",
        name: "rules",
        type: "text",
        topic: "How this Discord works. Read once.",
      },
      {
        key: "announcements",
        name: "announcements",
        type: "announce",
        topic: "Official Pet Orbits news from Ringnest. Read only.",
        aliases: ["announcement"],
      },
      {
        key: "patch-notes",
        name: "patch-notes",
        type: "text",
        topic: "What changed in Pet Orbits, with the version number.",
      },
      {
        key: "codes",
        name: "codes",
        type: "text",
        topic: "Working promo codes. Staff only posts here.",
      },
      {
        key: "start-here",
        name: "start-here",
        type: "text",
        topic: "New to Pet Orbits? Start here.",
      },
    ],
  },
  {
    key: "support",
    name: "SUPPORT",
    channels: [
      {
        key: "support-desk",
        name: "support-desk",
        type: "text",
        topic: "Tap a button. A private ticket opens for you and Ringnest staff.",
      },
      {
        key: "bug-reports",
        name: "bug-reports",
        type: "forum",
        topic: "Public bugs. What broke, phone / PC / console, screenshot.",
        aliases: ["bugs"],
        chat: true,
      },
      {
        key: "suggestions",
        name: "suggestions",
        type: "forum",
        topic: "Ideas for Pet Orbits. One idea per post.",
        chat: true,
      },
    ],
  },
  {
    key: "play",
    name: "PET ORBITS",
    channels: [
      {
        key: "looking-for-group",
        name: "looking-for-group",
        type: "text",
        topic: "Who is in the arena. Crews and Nest Club runs.",
        chat: true,
      },
      {
        key: "nests-and-club",
        name: "nests-and-club",
        type: "text",
        topic: "Nest Club, pens, biomes, and nest defense.",
        chat: true,
      },
      {
        key: "clips",
        name: "clips",
        type: "text",
        topic: "Hatches, crown wins, and nest runs. Your clips only.",
        aliases: ["clips-and-highlights"],
        chat: true,
      },
    ],
  },
  {
    key: "hangout",
    name: "HANGOUT",
    channels: [
      {
        key: "chat",
        name: "chat",
        type: "text",
        topic: "Pet Orbits talk. Keep reports in tickets. Keep videos in clips.",
        aliases: ["general"],
        chat: true,
      },
      {
        key: "hangout-vc",
        name: "hangout",
        type: "voice",
        topic: "Jump in if you want people in your ear while you play.",
      },
    ],
  },
  {
    key: "tickets",
    name: "TICKETS",
    hidden: true,
    channels: [],
  },
  {
    key: "staff",
    name: "STAFF",
    hidden: true,
    channels: [
      {
        key: "staff-chat",
        name: "staff-chat",
        type: "text",
        topic: "Ringnest only.",
        chat: true,
      },
      {
        key: "mod-log",
        name: "mod-log",
        type: "text",
        topic: "AutoMod and ticket alerts.",
      },
    ],
  },
];

export const BUTTON = {
  updates: "rn_ping_updates",
  events: "rn_ping_events",
  codes: "rn_ping_codes",
  ticketBug: "rn_ticket_bug",
  ticketHelp: "rn_ticket_help",
  ticketClose: "rn_ticket_close",
} as const;

export function everyoneOverwrites(guildId: string, studioId: string, modId: string) {
  return [
    { id: guildId, type: 0, deny: bits("send", "mentionEveryone", "manageMessages") },
    { id: studioId, type: 0, allow: STAFF },
    { id: modId, type: 0, allow: STAFF },
  ];
}

export function categoryOverwrites(
  guildId: string,
  studioId: string,
  modId: string,
  hidden: boolean,
) {
  if (hidden) {
    return [
      { id: guildId, type: 0, deny: DENY_ALL_VIEW },
      { id: studioId, type: 0, allow: STAFF },
      { id: modId, type: 0, allow: STAFF },
    ];
  }
  return [
    { id: guildId, type: 0, allow: P.view.toString(), deny: bits("send", "mentionEveryone") },
    { id: studioId, type: 0, allow: STAFF },
    { id: modId, type: 0, allow: STAFF },
  ];
}

export function channelOverwrites(
  guildId: string,
  studioId: string,
  modId: string,
  spec: ChannelSpec,
  hiddenCategory: boolean,
) {
  if (hiddenCategory) {
    return categoryOverwrites(guildId, studioId, modId, true);
  }
  if (spec.chat) {
    return [
      { id: guildId, type: 0, allow: spec.type === "voice" ? VOICE : CHAT },
      { id: studioId, type: 0, allow: STAFF },
      { id: modId, type: 0, allow: STAFF },
    ];
  }
  if (spec.type === "voice") {
    return [
      { id: guildId, type: 0, allow: VOICE },
      { id: studioId, type: 0, allow: STAFF },
      { id: modId, type: 0, allow: STAFF },
    ];
  }
  return [
    { id: guildId, type: 0, allow: READ, deny: bits("send") },
    { id: studioId, type: 0, allow: STAFF },
    { id: modId, type: 0, allow: STAFF },
  ];
}

export const EMBEDS = {
  rules: {
    marker: "RINGNEST_RULES",
    title: "House rules",
    color: COLOR.cyan,
    description:
      "This is the official **Ringnest** Discord for **Pet Orbits**.\nPlay on Roblox. This server is news, help, crews, and clips.",
    fields: [
      {
        name: "1. Be decent",
        value: "No scams, no Robux giveaways, no account trading, no harassment.",
      },
      {
        name: "2. Staff never DM first about Robux",
        value: "If a “mod” messages you to verify an account or claim a prize, it is a fake. Report it here.",
      },
      {
        name: "3. Put things in the right room",
        value: "News is read-only. Bugs go through **support-desk**. Clips go in **clips**. Chat stays in **chat**.",
      },
      {
        name: "4. Age",
        value: "Discord is 13+. Under-16 play on Roblox follows Kids and Select, not this server.",
      },
      {
        name: "5. Play first",
        value: `[Pet Orbits on Roblox](${PLAY_URL}) · [ringnest.games](${SITE_URL})`,
      },
    ],
  },
  startHere: {
    marker: "RINGNEST_START",
    title: "Start here",
    color: COLOR.lime,
    description:
      "Crash orbits. Hatch pets. Run nests. Then come back here when you want people.",
    fields: [
      {
        name: "Play",
        value: `[Open Pet Orbits](${PLAY_URL})`,
      },
      {
        name: "Get pings",
        value: "Use the buttons under **Pings** so you hear updates, events, and codes. You can turn them off the same way.",
      },
      {
        name: "Stuck or broken",
        value: "Open **support-desk** and tap Bug or Help. That makes a private ticket with Ringnest.",
      },
      {
        name: "Find a crew",
        value: "**looking-for-group** is for “who is in the arena right now.” **nests-and-club** is for Nest Club.",
      },
    ],
  },
  pings: {
    marker: "RINGNEST_PINGS",
    title: "Pings",
    color: COLOR.gold,
    description: "Pick what Ringnest can mention you for. Tap again to drop the role.",
    fields: [
      { name: "Updates", value: "Patches and downtime." },
      { name: "Events", value: "Limiteds, crowns, and timed stuff." },
      { name: "Codes", value: "When a code is live." },
    ],
  },
  support: {
    marker: "RINGNEST_SUPPORT",
    title: "Support desk",
    color: COLOR.lime,
    description:
      "A private room opens for you and Ringnest staff. Do not paste passwords. We will never ask for them.",
    fields: [
      {
        name: "Bug",
        value: "What broke, phone / PC / console, and a screenshot if you can.",
      },
      {
        name: "Help",
        value: "How do I… Nest Club, pens, trading, or the shop.",
      },
    ],
  },
  patchSeed: {
    marker: "RINGNEST_PATCH_SEED",
    title: "How patch notes look",
    color: COLOR.cyan,
    description:
      "Ringnest posts here when Pet Orbits updates. Latest shipped version in this repo: **4.6.32**.",
    fields: [
      {
        name: "Format we use",
        value: "`vX.Y.Z` — what changed, what to try, what we fixed.",
      },
    ],
  },
  codesSeed: {
    marker: "RINGNEST_CODES_SEED",
    title: "Codes",
    color: COLOR.gold,
    description:
      "Live codes land here. If a code is dead, we mark it. Nobody in chat can post a real official code except Ringnest Studio.",
  },
  staff: {
    marker: "RINGNEST_STAFF",
    title: "Staff notes",
    color: COLOR.cyan,
    description:
      "This category is hidden from players. Tickets land in **TICKETS**. AutoMod alerts land in **mod-log**.",
    fields: [
      {
        name: "Still add Bloxlink",
        value: "Discord cannot install third-party bots for us. Invite [Bloxlink](https://discord.com/oauth2/authorize?client_id=476974154168761339&scope=bot%20applications.commands&permissions=268435456) so Roblox names show on Discord profiles.",
      },
      {
        name: "Talk as Ringnest",
        value: "Patch notes from the Studio role. Keep Brandingguru BV off player channels.",
      },
    ],
  },
};

export const SCAM_WORDS = [
  "free robux",
  "free nitro",
  "steam gift",
  "steamcommunity",
  "airdrop",
  "double your",
  "claim prize",
  "verify to claim",
  "gift nitro",
  "@everyone free",
];

import {
  COSMETIC,
  DENY_ALL_VIEW,
  DENY_CONNECT,
  DENY_SEND,
  MEDIA,
  P,
  READ,
  STAFF,
  TALK,
  VOICE,
  bits,
} from "./discord-bitfield";

export const RINGNEST_GUILD_ID = "1556938161647517698";
export const PLAY_URL = "https://www.roblox.com/games/85407099788309/Pet-Orbits";
export const SITE_URL = "https://ringnest.games";
export const FOOTER = "Ringnest · Pet Orbits";

export const COLOR = {
  lime: 0x00e38c,
  cyan: 0x22d3ee,
  gold: 0xffd84a,
  pink: 0xff4fd8,
  navy: 0x0b1428,
  orbiter: 0x9aa4ff,
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
  { key: "club", name: "Nest Club", color: COLOR.gold, hoist: true, permissions: COSMETIC },
  { key: "creator", name: "Creator", color: COLOR.pink, hoist: true, permissions: COSMETIC },
  { key: "tester", name: "Tester", color: 0x84e85a, permissions: COSMETIC },
  { key: "member", name: "Orbiter", color: COLOR.orbiter, permissions: COSMETIC },
  { key: "visitor", name: "Visitor", color: 0x64748b, permissions: COSMETIC },
  { key: "phone", name: "Phone", color: 0x64748b, permissions: COSMETIC },
  { key: "pc", name: "PC", color: 0x64748b, permissions: COSMETIC },
  { key: "console", name: "Console", color: 0x64748b, permissions: COSMETIC },
  { key: "updates", name: "Updates", color: COLOR.cyan, mentionable: true, permissions: COSMETIC },
  { key: "events", name: "Events", color: COLOR.gold, mentionable: true, permissions: COSMETIC },
  { key: "codes", name: "Codes", color: COLOR.lime, mentionable: true, permissions: COSMETIC },
];

export type ChannelAccess = "read" | "member" | "club" | "voice";

export type ChannelSpec = {
  key: string;
  name: string;
  type: "text" | "announce" | "forum" | "voice";
  topic: string;
  access?: ChannelAccess;
  media?: boolean;
  slowmode?: number;
  userLimit?: number;
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
        topic: "How this Discord works. Read once, then play.",
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
        topic: "Working promo codes. Only Ringnest posts here.",
      },
      {
        key: "start-here",
        name: "start-here",
        type: "text",
        topic: "New to Pet Orbits? Start here.",
      },
      {
        key: "faq",
        name: "faq",
        type: "text",
        topic: "Short answers. Tickets still go through support-desk.",
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
        topic: "Tap Bug or Help. A private ticket opens for you and Ringnest staff.",
      },
      {
        key: "bug-reports",
        name: "bug-reports",
        type: "forum",
        topic: "Public bugs. What broke, phone / PC / console, screenshot.",
        aliases: ["bugs"],
        access: "member",
        media: true,
        slowmode: 15,
      },
      {
        key: "suggestions",
        name: "suggestions",
        type: "forum",
        topic: "Ideas for Pet Orbits. One idea per post.",
        access: "member",
        media: true,
        slowmode: 15,
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
        topic: "Who is in the arena. Platform + what you want to do.",
        access: "member",
        slowmode: 10,
      },
      {
        key: "nests-and-club",
        name: "nests-and-club",
        type: "text",
        topic: "Nest Club members chat here. Everyone can read.",
        access: "club",
        slowmode: 5,
      },
      {
        key: "clips",
        name: "clips",
        type: "text",
        topic: "Hatches, crown wins, and nest runs. Your clips only.",
        aliases: ["clips-and-highlights"],
        access: "member",
        media: true,
        slowmode: 15,
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
        topic: "Pet Orbits talk. Bugs go to support-desk. Videos go to clips.",
        aliases: ["general"],
        access: "member",
        slowmode: 5,
      },
      {
        key: "hangout-vc",
        name: "hangout",
        type: "voice",
        topic: "Jump in if you want people in your ear while you play.",
        access: "voice",
      },
      {
        key: "squad-vc",
        name: "squad",
        type: "voice",
        topic: "Smaller voice room for a crew.",
        access: "voice",
        userLimit: 8,
      },
      {
        key: "afk-vc",
        name: "afk",
        type: "voice",
        topic: "Parked here if you go idle in voice.",
        access: "voice",
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
        access: "member",
        media: true,
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
  agree: "rn_agree_rules",
  ticketBug: "rn_ticket_bug",
  ticketHelp: "rn_ticket_help",
  ticketClose: "rn_ticket_close",
} as const;

export type PermCtx = {
  guildId: string;
  studioId: string;
  modId: string;
  memberId: string;
  clubId: string;
};

function staffOverwrites(ctx: PermCtx) {
  return [
    { id: ctx.studioId, type: 0, allow: STAFF, deny: "0" },
    { id: ctx.modId, type: 0, allow: STAFF, deny: "0" },
  ];
}

export function categoryOverwrites(ctx: PermCtx, hidden: boolean) {
  if (hidden) {
    return [{ id: ctx.guildId, type: 0, allow: "0", deny: DENY_ALL_VIEW }, ...staffOverwrites(ctx)];
  }
  return [
    { id: ctx.guildId, type: 0, allow: P.view.toString(), deny: DENY_SEND },
    ...staffOverwrites(ctx),
  ];
}

export function channelOverwrites(ctx: PermCtx, spec: ChannelSpec, hiddenCategory: boolean) {
  const staff = staffOverwrites(ctx);
  if (hiddenCategory) {
    return [{ id: ctx.guildId, type: 0, allow: "0", deny: DENY_ALL_VIEW }, ...staff];
  }
  if (spec.type === "voice" || spec.access === "voice") {
    return [
      { id: ctx.guildId, type: 0, allow: P.view.toString(), deny: DENY_CONNECT },
      { id: ctx.memberId, type: 0, allow: VOICE, deny: "0" },
      ...staff,
    ];
  }
  const talk = spec.media ? MEDIA : TALK;
  if (spec.access === "club") {
    return [
      { id: ctx.guildId, type: 0, allow: READ, deny: DENY_SEND },
      { id: ctx.memberId, type: 0, allow: READ, deny: DENY_SEND },
      { id: ctx.clubId, type: 0, allow: talk, deny: "0" },
      ...staff,
    ];
  }
  if (spec.access === "member") {
    return [
      { id: ctx.guildId, type: 0, allow: READ, deny: DENY_SEND },
      { id: ctx.memberId, type: 0, allow: talk, deny: "0" },
      ...staff,
    ];
  }
  return [{ id: ctx.guildId, type: 0, allow: READ, deny: DENY_SEND }, ...staff];
}

export type EmbedSpec = {
  marker: string;
  title: string;
  color: number;
  description: string;
  fields?: { name: string; value: string }[];
};

export const EMBEDS: Record<string, EmbedSpec> = {
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
        value:
          "If a “mod” messages you to verify an account or claim a prize, it is a fake. Report it in **support-desk**.",
      },
      {
        name: "3. Right room",
        value:
          "News is read-only. Bugs go through **support-desk**. Clips go in **clips**. Chat stays in **chat**.",
      },
      {
        name: "4. Age",
        value: "Discord is 13+. Under-16 play on Roblox follows Kids and Select, not this server.",
      },
      {
        name: "5. Chat access",
        value:
          "Tap **I agree** on the house rules (or finish Server Guide) to get **Orbiter**. That is what lets you talk in player rooms.",
      },
      {
        name: "6. Play first",
        value: `[Pet Orbits on Roblox](${PLAY_URL}) · [ringnest.games](${SITE_URL})`,
      },
    ],
  },
  startHere: {
    marker: "RINGNEST_START",
    title: "Start here",
    color: COLOR.lime,
    description: "Crash orbits. Hatch pets. Run nests. Then come back here when you want people.",
    fields: [
      { name: "Play", value: `[Open Pet Orbits](${PLAY_URL})` },
      {
        name: "Get in",
        value:
          "Tap **I agree** under House rules. That gives **Orbiter** and unlocks chat, LFG, clips, and voice.",
      },
      {
        name: "Get pings",
        value: "Use the **Updates / Events / Codes** buttons. Tap again to turn them off.",
      },
      {
        name: "Stuck or broken",
        value: "Open **support-desk** and tap Bug or Help. That makes a private ticket with Ringnest.",
      },
      {
        name: "Find a crew",
        value: "**looking-for-group** is who is in the arena. **nests-and-club** is Nest Club members.",
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
  faq: {
    marker: "RINGNEST_FAQ",
    title: "FAQ",
    color: COLOR.cyan,
    description: "Short answers. If it is still stuck, open a ticket in **support-desk**.",
    fields: [
      {
        name: "Where do I play?",
        value: `[Pet Orbits on Roblox](${PLAY_URL}). Discord is not the game.`,
      },
      {
        name: "Where are codes?",
        value: "Only in **codes**. If someone posts a code in chat, treat it as fake.",
      },
      {
        name: "Something broke",
        value: "**support-desk** → Bug. What broke, device, screenshot.",
      },
      {
        name: "How do I join Nest Club?",
        value: "Buy Nest Club in the Pet Orbits shop on Roblox. Then talk in **nests-and-club**.",
      },
      {
        name: "Can I trade accounts / Robux?",
        value: "No. That is how people lose accounts. We will not help recover that.",
      },
      {
        name: "Did a mod DM me?",
        value: "Ringnest staff never DM first about Robux, verification, or prizes.",
      },
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
  lfg: {
    marker: "RINGNEST_LFG",
    title: "Looking for group",
    color: COLOR.lime,
    description: "Who is in the arena right now. Keep it short so people can join you.",
    fields: [
      {
        name: "Format",
        value: "`Phone / PC / Console` — orbits, nest, or club. Example: `PC — nest defense, biome 4`.",
      },
      {
        name: "Don’t",
        value: "No Robux for carries. No “verify this link.” No dumping the same line every 20 seconds.",
      },
    ],
  },
  nests: {
    marker: "RINGNEST_NESTS",
    title: "Nest Club room",
    color: COLOR.gold,
    description: "Everyone can read. Only **Nest Club** members can talk here.",
    fields: [
      {
        name: "Use this for",
        value: "Pens, biomes, nest defense, and club runs.",
      },
      {
        name: "Need the role?",
        value: "Nest Club is a Roblox purchase. Ping staff in a ticket after you own it if the role is missing.",
      },
    ],
  },
  clips: {
    marker: "RINGNEST_CLIPS",
    title: "Clips",
    color: COLOR.pink,
    description: "Your hatches, crown wins, and nest runs. One clip per post.",
    fields: [
      {
        name: "This room",
        value: "Video and screenshots belong here. Chat stays in **chat**.",
      },
      {
        name: "Not this room",
        value: "Someone else’s clip, ads, or “watch this to win Robux.”",
      },
    ],
  },
  chat: {
    marker: "RINGNEST_CHAT",
    title: "Chat",
    color: COLOR.cyan,
    description: "Day-to-day Pet Orbits talk. You need **Orbiter** to send messages here.",
    fields: [
      {
        name: "Keep moving",
        value: "Bugs → **support-desk**. Clips → **clips**. Crews → **looking-for-group**.",
      },
      {
        name: "Slowmode is on",
        value: "So the room stays readable when a drop hits.",
      },
    ],
  },
  announcements: {
    marker: "RINGNEST_ANNOUNCE",
    title: "Ringnest is live here",
    color: COLOR.cyan,
    description:
      "Official Pet Orbits news lands in this room. Help is **support-desk**. Crews are **looking-for-group**.",
    fields: [
      { name: "Play", value: `[Pet Orbits](${PLAY_URL})` },
      { name: "Site", value: `[ringnest.games](${SITE_URL})` },
    ],
  },
  patchSeed: {
    marker: "RINGNEST_PATCH_SEED",
    title: "How patch notes look",
    color: COLOR.cyan,
    description: "Ringnest posts here when Pet Orbits updates. Latest shipped version in this repo: **4.6.32**.",
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
        value:
          "Discord cannot install third-party bots for us. Invite [Bloxlink](https://discord.com/oauth2/authorize?client_id=476974154168761339&scope=bot%20applications.commands&permissions=268435456) so Roblox names show on Discord profiles.",
      },
      {
        name: "Talk as Ringnest",
        value: "Patch notes from the Studio role. Keep Brandingguru BV off player channels.",
      },
      {
        name: "Chat lock",
        value:
          "Players need **Orbiter** (Server Guide → I agree). Nest Club talk is **nests-and-club** only. Owner/Admin can still type everywhere — that is Discord, not a leak.",
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
  "nitro gift",
  "free roblox",
  "robux generator",
  "verify at",
  "ticket.gift",
  "blox.ia",
];

export const JUNK_CHANNEL_NAMES = new Set([
  "legacy-announcements",
  "legacy-bugs",
  "Lobby",
  "Gaming",
  "Text Channels",
  "Voice Channels",
  "General",
]);

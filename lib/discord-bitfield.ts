/** Discord permission flags as decimal strings for overwrites. */
const b = (n: number) => BigInt(1) << BigInt(n);

export const P = {
  createInvite: b(0),
  kick: b(1),
  ban: b(2),
  administrator: b(3),
  manageChannels: b(4),
  manageGuild: b(5),
  addReactions: b(6),
  viewAudit: b(7),
  stream: b(9),
  view: b(10),
  send: b(11),
  manageMessages: b(13),
  embed: b(14),
  attach: b(15),
  history: b(16),
  mentionEveryone: b(17),
  externalEmoji: b(18),
  connect: b(20),
  speak: b(21),
  mute: b(22),
  deafen: b(23),
  move: b(24),
  nick: b(26),
  manageNicks: b(27),
  manageRoles: b(28),
  manageWebhooks: b(29),
  manageExpressions: b(30),
  appCommands: b(31),
  manageEvents: b(33),
  manageThreads: b(34),
  publicThreads: b(35),
  privateThreads: b(36),
  externalStickers: b(37),
  sendThreads: b(38),
  moderate: b(40),
  sendVoice: b(46),
  sendPolls: b(49),
} as const;

export function bits(...keys: (keyof typeof P)[]) {
  return keys.reduce((n, key) => n | P[key], BigInt(0)).toString();
}

export const CHAT = bits(
  "view",
  "send",
  "embed",
  "attach",
  "history",
  "addReactions",
  "externalEmoji",
  "externalStickers",
  "publicThreads",
  "sendThreads",
  "appCommands",
  "sendPolls",
);

export const READ = bits("view", "history", "addReactions", "appCommands");

export const VOICE = bits("view", "connect", "speak", "stream", "history");

export const STAFF = bits(
  "view",
  "send",
  "embed",
  "attach",
  "history",
  "addReactions",
  "manageMessages",
  "manageThreads",
  "publicThreads",
  "privateThreads",
  "sendThreads",
  "mentionEveryone",
  "connect",
  "speak",
  "mute",
  "move",
  "moderate",
  "appCommands",
);

export const DENY_ALL_VIEW = bits("view", "send", "connect");

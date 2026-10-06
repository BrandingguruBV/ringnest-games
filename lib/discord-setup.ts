import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DiscordApi, type DiscordObject } from "./discord-api";
import { EVERYONE_BASE, bits } from "./discord-bitfield";
import {
  BUTTON,
  CATEGORIES,
  COLOR,
  EMBEDS,
  FOOTER,
  JUNK_CHANNEL_NAMES,
  PLAY_URL,
  RINGNEST_GUILD_ID,
  ROLE_SPECS,
  SCAM_WORDS,
  SITE_URL,
  categoryOverwrites,
  channelOverwrites,
  type ChannelSpec,
  type EmbedSpec,
  type PermCtx,
} from "./discord-server";

const TYPE = { text: 0, voice: 2, category: 4, announce: 5, forum: 15 } as const;

export type SetupResult = {
  guildId: string;
  inviteUrl: string;
  botInviteUrl: string;
  applicationId: string;
  channels: Record<string, string>;
  roles: Record<string, string>;
};

type Role = DiscordObject & { name: string; color?: number; position?: number };
type Channel = DiscordObject & {
  name: string;
  type: number;
  parent_id?: string | null;
  position?: number;
};

function findChannel(channels: Channel[], spec: ChannelSpec) {
  const names = [spec.name, ...(spec.aliases ?? [])];
  return channels.find((channel) => names.includes(channel.name));
}

function markerIn(text: string | undefined, marker: string) {
  return Boolean(text && text.includes(marker));
}

function snowflake(n: number) {
  return ((BigInt(Date.now() - 1420070400000) << BigInt(22)) | BigInt(n)).toString();
}

export async function setupDiscord(token: string, guildId = RINGNEST_GUILD_ID): Promise<SetupResult> {
  const api = new DiscordApi(token);
  const me = await api.get<{ id: string; username: string }>("/users/@me");
  const guild = await api.get<{
    id: string;
    name: string;
    owner_id?: string;
    features?: string[];
  }>(`/guilds/${guildId}`);

  const icon = loadGuildIcon(512);
  const guildBody = {
    name: "Ringnest",
    description: "Official Pet Orbits Discord. Crash orbits, hatch pets, run nests. Play on Roblox.",
    verification_level: 2,
    default_message_notifications: 1,
    explicit_content_filter: 2,
    preferred_locale: "en-US",
    premium_progress_bar_enabled: false,
    ...(icon ? { icon } : {}),
  };
  await api.patch(`/guilds/${guildId}`, guildBody).catch((error: Error) => {
    if (!icon) {
      throw error;
    }
    const { icon: _icon, ...noIcon } = guildBody;
    return api.patch(`/guilds/${guildId}`, noIcon);
  });

  let roles = await api.get<Role[]>(`/guilds/${guildId}/roles`);
  const roleIds: Record<string, string> = {};
  for (const spec of ROLE_SPECS) {
    const existing = roles.find((role) => role.name === spec.name);
    const body = {
      name: spec.name,
      color: spec.color,
      hoist: Boolean(spec.hoist),
      mentionable: Boolean(spec.mentionable),
      permissions: spec.permissions ?? bits("view"),
    };
    const saved = existing
      ? await api.patch<Role>(`/guilds/${guildId}/roles/${existing.id}`, body)
      : await api.post<Role>(`/guilds/${guildId}/roles`, body);
    roleIds[spec.key] = saved.id;
  }
  roles = await api.get<Role[]>(`/guilds/${guildId}/roles`);

  const ctx: PermCtx = {
    guildId,
    studioId: roleIds.studio,
    modId: roleIds.mod,
    memberId: roleIds.member,
    clubId: roleIds.club,
  };

  await api.patch(`/guilds/${guildId}/roles/${guildId}`, { permissions: EVERYONE_BASE }).catch(() => undefined);

  let channels = await api.get<Channel[]>(`/guilds/${guildId}/channels`);
  await deleteJunk(api, channels);
  channels = await api.get<Channel[]>(`/guilds/${guildId}/channels`);

  const channelIds: Record<string, string> = {};
  let position = 0;

  for (const category of CATEGORIES) {
    const existingCat = channels.find(
      (channel) => channel.type === TYPE.category && channel.name === category.name,
    );
    const catOverwrites = categoryOverwrites(ctx, Boolean(category.hidden));
    const cat = existingCat
      ? await api.patch<Channel>(`/channels/${existingCat.id}`, {
          name: category.name,
          permission_overwrites: catOverwrites,
        })
      : await api.post<Channel>(`/guilds/${guildId}/channels`, {
          name: category.name,
          type: TYPE.category,
          permission_overwrites: catOverwrites,
        });
    channelIds[category.key] = cat.id;
    await api.patch(`/channels/${cat.id}`, { position }).catch(() => undefined);
    position += 1;

    for (const spec of category.channels) {
      const wantType = spec.type === "announce" ? TYPE.text : TYPE[spec.type];
      let existing = findChannel(channels, spec);
      if (existing && existing.type !== wantType) {
        const compatibleAnnounce = spec.type === "announce" && (existing.type === 0 || existing.type === 5);
        const compatibleVoice = spec.type === "voice" && existing.type === 2;
        if (!compatibleAnnounce && !compatibleVoice) {
          await api.patch(`/channels/${existing.id}`, { name: `legacy-${existing.name}`.slice(0, 90) });
          existing = undefined;
        }
      }
      const overwrites = channelOverwrites(ctx, spec, Boolean(category.hidden));
      const payload: Record<string, unknown> = {
        name: spec.name,
        topic: spec.topic,
        parent_id: cat.id,
        permission_overwrites: overwrites,
        rate_limit_per_user: spec.slowmode ?? 0,
      };
      if (spec.type === "voice" && spec.userLimit) {
        payload.user_limit = spec.userLimit;
      }
      if (spec.type === "forum") {
        payload.default_reaction_emoji = { emoji_name: "🪐" };
        if (!existing) {
          payload.available_tags = forumTags(spec.key);
        }
      }
      let saved: Channel;
      if (existing) {
        saved = await patchChannel(api, existing.id, payload);
      } else {
        saved = await createChannel(api, guildId, payload, spec.type === "forum" ? TYPE.forum : wantType, overwrites);
      }
      channelIds[spec.key] = saved.id;
      await api.patch(`/channels/${saved.id}`, { position, parent_id: cat.id }).catch(() => undefined);
      position += 1;
    }
    channels = await api.get<Channel[]>(`/guilds/${guildId}/channels`);
  }

  const announcements = channels.find((channel) => channel.id === channelIds.announcements);
  if (announcements && announcements.type !== TYPE.announce) {
    await api.patch(`/channels/${announcements.id}`, { type: TYPE.announce }).catch(() => undefined);
  }

  await api.patch(`/guilds/${guildId}`, {
    system_channel_id: channelIds.chat,
    system_channel_flags: 15,
    rules_channel_id: channelIds.rules,
    public_updates_channel_id: channelIds["staff-chat"] ?? channelIds["mod-log"],
    safety_alerts_channel_id: channelIds["mod-log"],
    afk_channel_id: channelIds["afk-vc"] ?? null,
    afk_timeout: 300,
    premium_progress_bar_enabled: false,
    features: Array.from(new Set([...(guild.features ?? []), "COMMUNITY"])),
  }).catch(() => undefined);

  await orderRoles(api, guildId, roleIds, roles);
  await api.patch(`/guilds/${guildId}/members/@me`, { nick: "Ringnest" }).catch(() => undefined);
  if (guild.owner_id) {
    await api.put(`/guilds/${guildId}/members/${guild.owner_id}/roles/${roleIds.studio}`).catch(() => undefined);
    await api.put(`/guilds/${guildId}/members/${guild.owner_id}/roles/${roleIds.member}`).catch(() => undefined);
  }

  await api.patch(`/guilds/${guildId}/welcome-screen`, {
    enabled: true,
    description: "Official Pet Orbits server from Ringnest. Play on Roblox, talk here.",
    welcome_channels: [
      { channel_id: channelIds["start-here"], description: "How this Discord works", emoji_name: "🪐" },
      { channel_id: channelIds.faq, description: "Short answers before you ask", emoji_name: "💬" },
      { channel_id: channelIds["looking-for-group"], description: "Find people to crash orbits with", emoji_name: "🎮" },
      { channel_id: channelIds.clips, description: "Post a hatch or a crown win", emoji_name: "✨" },
      { channel_id: channelIds["support-desk"], description: "Private ticket with Ringnest", emoji_name: "🛠️" },
    ],
  }).catch(() => undefined);

  await upsertOnboarding(api, guildId, channelIds, roleIds);
  await upsertAutomod(api, guildId, ctx.studioId, ctx.modId, channelIds["mod-log"]);
  await uploadEmoji(api, guildId);
  await upsertWidget(api, guildId, channelIds.announcements);

  await upsertEmbed(api, channelIds.rules, EMBEDS.rules, [
    { type: 2, style: 3, label: "I agree", custom_id: BUTTON.agree },
    { type: 2, style: 5, label: "Play Pet Orbits", url: PLAY_URL },
    { type: 2, style: 5, label: "ringnest.games", url: SITE_URL },
  ]);
  await upsertEmbed(api, channelIds.faq, EMBEDS.faq);
  await upsertEmbed(api, channelIds["start-here"], EMBEDS.startHere, [
    { type: 2, style: 5, label: "Play Pet Orbits", url: PLAY_URL },
    { type: 2, style: 5, label: "ringnest.games", url: SITE_URL },
  ]);
  await upsertEmbed(api, channelIds["start-here"], EMBEDS.pings, pingButtons());
  await upsertEmbed(api, channelIds["support-desk"], EMBEDS.support, [
    { type: 2, style: 1, label: "Bug", custom_id: BUTTON.ticketBug },
    { type: 2, style: 2, label: "Help", custom_id: BUTTON.ticketHelp },
  ]);
  await upsertEmbed(api, channelIds.announcements, EMBEDS.announcements, [
    { type: 2, style: 5, label: "Play Pet Orbits", url: PLAY_URL },
    { type: 2, style: 5, label: "ringnest.games", url: SITE_URL },
  ]);
  await upsertEmbed(api, channelIds["patch-notes"], EMBEDS.patchSeed);
  await upsertEmbed(api, channelIds.codes, EMBEDS.codesSeed);
  await upsertEmbed(api, channelIds["looking-for-group"], EMBEDS.lfg);
  await upsertEmbed(api, channelIds["nests-and-club"], EMBEDS.nests);
  await upsertEmbed(api, channelIds.clips, EMBEDS.clips);
  await upsertEmbed(api, channelIds.chat, EMBEDS.chat);
  await upsertEmbed(api, channelIds["staff-chat"], EMBEDS.staff);

  await sweepEmpty(api, Object.values(channelIds));
  await registerCommands(api, process.env.DISCORD_APPLICATION_ID || me.id, guildId);
  await pruneInvites(api, guildId);

  const invite = await api.post<{ code: string }>(`/channels/${channelIds["start-here"]}/invites`, {
    max_age: 0,
    max_uses: 0,
    unique: false,
  });
  const inviteUrl = `https://discord.gg/${invite.code}`;
  const applicationId = process.env.DISCORD_APPLICATION_ID || me.id;

  return {
    guildId: guild.id,
    inviteUrl,
    botInviteUrl:
      `https://discord.com/oauth2/authorize?client_id=${applicationId}` +
      `&permissions=8&scope=bot%20applications.commands`,
    applicationId,
    channels: channelIds,
    roles: roleIds,
  };
}

async function patchChannel(api: DiscordApi, id: string, payload: Record<string, unknown>) {
  try {
    return await api.patch<Channel>(`/channels/${id}`, payload);
  } catch {
    const { topic: _topic, available_tags: _tags, ...rest } = payload;
    return api.patch<Channel>(`/channels/${id}`, rest);
  }
}

async function createChannel(
  api: DiscordApi,
  guildId: string,
  payload: Record<string, unknown>,
  type: number,
  overwrites: unknown,
) {
  try {
    return await api.post<Channel>(`/guilds/${guildId}/channels`, { ...payload, type });
  } catch (error) {
    const { topic: _topic, available_tags: _tags, ...noTopic } = payload;
    try {
      return await api.post<Channel>(`/guilds/${guildId}/channels`, {
        ...noTopic,
        type: type === TYPE.forum ? TYPE.text : type,
      });
    } catch {
      if (type !== TYPE.forum) {
        throw error;
      }
      return api.post<Channel>(`/guilds/${guildId}/channels`, {
        name: payload.name,
        parent_id: payload.parent_id,
        permission_overwrites: overwrites,
        type: TYPE.text,
      });
    }
  }
}

async function deleteJunk(api: DiscordApi, channels: Channel[]) {
  for (const channel of channels) {
    if (!JUNK_CHANNEL_NAMES.has(channel.name) && !channel.name.startsWith("legacy-")) {
      continue;
    }
    await api.del(`/channels/${channel.id}`).catch(() => undefined);
  }
}

async function orderRoles(api: DiscordApi, guildId: string, roleIds: Record<string, string>, roles: Role[]) {
  const botRole = roles.find((role) => role.name === "Ringnest");
  const ranked = [
    roleIds.studio,
    roleIds.mod,
    roleIds.club,
    roleIds.creator,
    roleIds.tester,
    roleIds.member,
    roleIds.visitor,
    roleIds.phone,
    roleIds.pc,
    roleIds.console,
    roleIds.updates,
    roleIds.events,
    roleIds.codes,
  ].filter(Boolean);
  let pos = Math.max((botRole?.position ?? ranked.length + 1) - 1, 1);
  const payload = ranked.map((id) => {
    const item = { id, position: pos };
    pos -= 1;
    return item;
  });
  await api.patch(`/guilds/${guildId}/roles`, payload).catch(() => undefined);
}

async function upsertOnboarding(
  api: DiscordApi,
  guildId: string,
  channelIds: Record<string, string>,
  roleIds: Record<string, string>,
) {
  const current = await api
    .get<{ prompts?: { id: string; title: string; options?: { id: string; title: string }[] }[] }>(
      `/guilds/${guildId}/onboarding`,
    )
    .catch(() => ({ prompts: [] as { id: string; title: string; options?: { id: string; title: string }[] }[] }));

  const existing = current.prompts ?? [];
  const byTitle = (title: string) => existing.find((prompt) => prompt.title === title);
  const optionId = (promptTitle: string, optionTitle: string, fallback: number) => {
    const found = byTitle(promptTitle)?.options?.find((option) => option.title === optionTitle)?.id;
    return found ?? snowflake(fallback);
  };

  const rulesPrompt = byTitle("Have you read the house rules?");
  const playPrompt = byTitle("Where do you play?");
  const pingPrompt = byTitle("What should Ringnest ping you for?");

  const defaultIds = [
    channelIds.rules,
    channelIds.announcements,
    channelIds["patch-notes"],
    channelIds.codes,
    channelIds["start-here"],
    channelIds.faq,
    channelIds["support-desk"],
  ].filter(Boolean);

  const body = {
    enabled: true,
    mode: 1,
    default_channel_ids: defaultIds,
    prompts: [
      {
        id: rulesPrompt?.id ?? snowflake(11),
        type: 0,
        title: "Have you read the house rules?",
        single_select: true,
        required: true,
        in_onboarding: true,
        options: [
          {
            id: optionId("Have you read the house rules?", "Yes — I agree", 21),
            title: "Yes — I agree",
            description: "Gives Orbiter so you can talk",
            role_ids: [roleIds.member],
            emoji_name: "✅",
          },
          {
            id: optionId("Have you read the house rules?", "Just looking for now", 22),
            title: "Just looking for now",
            description: "Read-only until you agree",
            role_ids: [roleIds.visitor || roleIds.member],
            emoji_name: "👀",
          },
        ],
      },
      {
        id: playPrompt?.id ?? snowflake(12),
        type: 0,
        title: "Where do you play?",
        single_select: true,
        required: false,
        in_onboarding: true,
        options: [
          {
            id: optionId("Where do you play?", "Phone", 31),
            title: "Phone",
            description: "Mobile",
            role_ids: [roleIds.phone],
            emoji_name: "📱",
          },
          {
            id: optionId("Where do you play?", "PC", 32),
            title: "PC",
            description: "Computer",
            role_ids: [roleIds.pc],
            emoji_name: "🖥️",
          },
          {
            id: optionId("Where do you play?", "Console", 33),
            title: "Console",
            description: "Xbox / PlayStation",
            role_ids: [roleIds.console],
            emoji_name: "🎮",
          },
        ],
      },
      {
        id: pingPrompt?.id ?? snowflake(13),
        type: 0,
        title: "What should Ringnest ping you for?",
        single_select: false,
        required: false,
        in_onboarding: true,
        options: [
          {
            id: optionId("What should Ringnest ping you for?", "Updates", 41),
            title: "Updates",
            description: "Patches and downtime",
            role_ids: [roleIds.updates],
            emoji_name: "🛰️",
          },
          {
            id: optionId("What should Ringnest ping you for?", "Events", 42),
            title: "Events",
            description: "Limiteds and timed stuff",
            role_ids: [roleIds.events],
            emoji_name: "👑",
          },
          {
            id: optionId("What should Ringnest ping you for?", "Codes", 43),
            title: "Codes",
            description: "When a code is live",
            role_ids: [roleIds.codes],
            emoji_name: "🎫",
          },
        ],
      },
    ],
  };

  try {
    await api.put(`/guilds/${guildId}/onboarding`, body);
  } catch {
    try {
      await api.put(`/guilds/${guildId}/onboarding`, { ...body, mode: 0 });
    } catch {
      await api.put(`/guilds/${guildId}/onboarding`, { ...body, mode: 0, enabled: false }).catch(() => undefined);
    }
  }
}

async function upsertWidget(api: DiscordApi, guildId: string, channelId: string) {
  await api
    .patch(`/guilds/${guildId}/widget`, { enabled: true, channel_id: channelId })
    .catch(() => undefined);
}

async function registerCommands(api: DiscordApi, applicationId: string, guildId: string) {
  await api
    .put(`/applications/${applicationId}/guilds/${guildId}/commands`, [
      { name: "play", description: "Open Pet Orbits on Roblox", type: 1 },
      { name: "codes", description: "Where official Pet Orbits codes are posted", type: 1 },
      { name: "support", description: "Open a private ticket with Ringnest", type: 1 },
      { name: "rules", description: "Jump to the house rules", type: 1 },
      { name: "faq", description: "Short answers before you open a ticket", type: 1 },
    ])
    .catch(() => undefined);
}

async function pruneInvites(api: DiscordApi, guildId: string) {
  const invites = await api
    .get<{ code: string; max_age: number }[]>(`/guilds/${guildId}/invites`)
    .catch(() => []);
  for (const invite of invites) {
    if (invite.max_age === 0) {
      continue;
    }
    await api.del(`/invites/${invite.code}`).catch(() => undefined);
  }
}

async function uploadEmoji(api: DiscordApi, guildId: string) {
  const existing = await api.get<{ name: string }[]>(`/guilds/${guildId}/emojis`).catch(() => []);
  if (existing.some((emoji) => emoji.name === "ringnest")) {
    return;
  }
  const icon = loadGuildIcon(128);
  if (!icon) {
    return;
  }
  await api.post(`/guilds/${guildId}/emojis`, { name: "ringnest", image: icon }).catch(() => undefined);
}

function pingButtons() {
  return [
    { type: 2, style: 3, label: "Updates", custom_id: BUTTON.updates },
    { type: 2, style: 2, label: "Events", custom_id: BUTTON.events },
    { type: 2, style: 1, label: "Codes", custom_id: BUTTON.codes },
  ];
}

function forumTags(key: string) {
  if (key === "bug-reports") {
    return [
      { name: "Crash", moderated: false },
      { name: "Shop", moderated: false },
      { name: "Hatch", moderated: false },
      { name: "Nest", moderated: false },
      { name: "Other", moderated: false },
    ];
  }
  return [
    { name: "Gameplay", moderated: false },
    { name: "Pets", moderated: false },
    { name: "Nests", moderated: false },
    { name: "QoL", moderated: false },
  ];
}

type Button = { type: number; style: number; label: string; custom_id?: string; url?: string };

async function upsertEmbed(api: DiscordApi, channelId: string | undefined, embed: EmbedSpec, buttons?: Button[]) {
  if (!channelId) {
    return;
  }
  const messages = await api
    .get<{ id: string; pinned?: boolean; embeds?: { footer?: { text?: string }; title?: string; url?: string }[] }[]>(
      `/channels/${channelId}/messages?limit=20`,
    )
    .catch(() => []);
  const already = messages.find((message) =>
    message.embeds?.some(
      (item) =>
        item.title === embed.title ||
        markerIn(item.footer?.text, embed.marker) ||
        markerIn(item.url, embed.marker),
    ),
  );
  const body: Record<string, unknown> = {
    embeds: [
      {
        title: embed.title,
        description: embed.description,
        color: embed.color ?? COLOR.cyan,
        fields: embed.fields,
        url: `${SITE_URL}/discord#${embed.marker.toLowerCase()}`,
        footer: { text: FOOTER },
      },
    ],
  };
  if (buttons?.length) {
    body.components = [{ type: 1, components: buttons }];
  }
  const saved = already
    ? await api.patch<{ id: string }>(`/channels/${channelId}/messages/${already.id}`, body)
    : await api.post<{ id: string }>(`/channels/${channelId}/messages`, body);
  await api.put(`/channels/${channelId}/pins/${saved.id}`).catch(() => undefined);
}

async function sweepEmpty(api: DiscordApi, channelIds: string[]) {
  for (const channelId of channelIds) {
    const messages = await api
      .get<{ id: string; type?: number; content?: string; embeds?: unknown[]; pinned?: boolean }[]>(
        `/channels/${channelId}/messages?limit=20`,
      )
      .catch(() => []);
    for (const message of messages) {
      if (message.pinned || message.type) {
        continue;
      }
      if ((message.content && message.content.trim()) || (message.embeds && message.embeds.length)) {
        continue;
      }
      await api.del(`/channels/${channelId}/messages/${message.id}`).catch(() => undefined);
    }
  }
}

async function upsertAutomod(
  api: DiscordApi,
  guildId: string,
  studioId: string,
  modId: string,
  logChannelId: string,
) {
  const existing = await api.get<{ id: string; name: string }[]>(`/guilds/${guildId}/auto-moderation/rules`).catch(
    () => [],
  );
  const rules = [
    {
      name: "Ringnest scam words",
      event_type: 1,
      trigger_type: 1,
      trigger_metadata: { keyword_filter: SCAM_WORDS },
      actions: [
        {
          type: 1,
          metadata: { custom_message: "That looks like a scam. Ringnest staff never DM you for Robux." },
        },
        { type: 2, metadata: { channel_id: logChannelId } },
      ],
      enabled: true,
      exempt_roles: [studioId, modId],
    },
    {
      name: "Ringnest Discord invites",
      event_type: 1,
      trigger_type: 1,
      trigger_metadata: { keyword_filter: ["discord.gg/", "discord.com/invite"] },
      actions: [
        { type: 1, metadata: { custom_message: "Only Ringnest staff can post invites here." } },
        { type: 2, metadata: { channel_id: logChannelId } },
      ],
      enabled: true,
      exempt_roles: [studioId, modId],
    },
    {
      name: "Ringnest mention spam",
      event_type: 1,
      trigger_type: 5,
      trigger_metadata: { mention_total_limit: 5, mention_raid_protection_enabled: true },
      actions: [
        { type: 1 },
        { type: 3, metadata: { duration_seconds: 600 } },
        { type: 2, metadata: { channel_id: logChannelId } },
      ],
      enabled: true,
      exempt_roles: [studioId, modId],
    },
    {
      name: "Ringnest language presets",
      event_type: 1,
      trigger_type: 4,
      trigger_metadata: { presets: [2, 3] },
      actions: [
        { type: 1, metadata: { custom_message: "Keep this server safe for Pet Orbits players." } },
        { type: 2, metadata: { channel_id: logChannelId } },
      ],
      enabled: true,
      exempt_roles: [studioId, modId],
    },
  ];
  for (const rule of rules) {
    const found = existing.find((item) => item.name === rule.name);
    if (found) {
      await api.patch(`/guilds/${guildId}/auto-moderation/rules/${found.id}`, rule);
    } else {
      await api.post(`/guilds/${guildId}/auto-moderation/rules`, rule);
    }
  }
}

function loadGuildIcon(size = 512) {
  const cwd = process.cwd();
  const candidates = [
    join(cwd, "../store-art/ringnest-icon.jpg"),
    join(cwd, "../store-art/ringnest-mark.jpg"),
    join(cwd, "store-art/ringnest-icon.jpg"),
    join(cwd, "public/brand/mark.jpg"),
    join(cwd, "public/brand/icon.jpg"),
  ];
  for (const path of candidates) {
    try {
      const raw = readFileSync(path);
      const png = jpegToPngDataUri(raw, size);
      if (png) {
        return png;
      }
    } catch {
      // try next
    }
  }
  return null;
}

function jpegToPngDataUri(raw: Buffer, size: number) {
  try {
    const python = `
from PIL import Image
import io, sys
size = int(sys.argv[1])
img = Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")
img = img.resize((size, size))
out = io.BytesIO()
img.save(out, format="PNG", optimize=True)
sys.stdout.buffer.write(out.getvalue())
`;
    const result = spawnSync("python3", ["-c", python, String(size)], { input: raw, maxBuffer: 8 * 1024 * 1024 });
    if (result.status !== 0 || !result.stdout?.length) {
      return `data:image/jpeg;base64,${raw.toString("base64")}`;
    }
    return `data:image/png;base64,${Buffer.from(result.stdout).toString("base64")}`;
  } catch {
    return `data:image/jpeg;base64,${raw.toString("base64")}`;
  }
}

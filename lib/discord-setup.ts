import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DiscordApi, type DiscordObject } from "./discord-api";
import { bits } from "./discord-bitfield";
import {
  BUTTON,
  CATEGORIES,
  COLOR,
  EMBEDS,
  PLAY_URL,
  RINGNEST_GUILD_ID,
  ROLE_SPECS,
  SCAM_WORDS,
  SITE_URL,
  categoryOverwrites,
  channelOverwrites,
  type ChannelSpec,
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

type Role = DiscordObject & { name: string; color?: number };
type Channel = DiscordObject & { name: string; type: number };

function findChannel(channels: Channel[], spec: ChannelSpec) {
  const names = [spec.name, ...(spec.aliases ?? [])];
  return channels.find((channel) => names.includes(channel.name));
}

function markerIn(text: string | undefined, marker: string) {
  return Boolean(text && text.includes(marker));
}

export async function setupDiscord(token: string, guildId = RINGNEST_GUILD_ID): Promise<SetupResult> {
  const api = new DiscordApi(token);
  const me = await api.get<{ id: string; username: string }>("/users/@me");
  const guild = await api.get<{ id: string; name: string; features?: string[] }>(`/guilds/${guildId}`);

  const icon = loadGuildIcon();
  await api.patch(`/guilds/${guildId}`, {
    name: "Ringnest",
    description: "Official Pet Orbits Discord. Crash orbits, hatch pets, run nests. Play on Roblox.",
    verification_level: 2,
    default_message_notifications: 1,
    explicit_content_filter: 2,
    preferred_locale: "en-US",
    premium_progress_bar_enabled: true,
    ...(icon ? { icon } : {}),
  }).catch((error: Error) => {
    if (!icon) {
      throw error;
    }
    return api.patch(`/guilds/${guildId}`, {
      name: "Ringnest",
      description: "Official Pet Orbits Discord. Crash orbits, hatch pets, run nests. Play on Roblox.",
      verification_level: 2,
      default_message_notifications: 1,
      explicit_content_filter: 2,
      preferred_locale: "en-US",
      premium_progress_bar_enabled: true,
    });
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
      permissions: spec.permissions ?? bits("view", "send", "embed", "history", "addReactions", "appCommands"),
    };
    const saved = existing
      ? await api.patch<Role>(`/guilds/${guildId}/roles/${existing.id}`, body)
      : await api.post<Role>(`/guilds/${guildId}/roles`, body);
    roleIds[spec.key] = saved.id;
  }
  roles = await api.get<Role[]>(`/guilds/${guildId}/roles`);

  const studioId = roleIds.studio;
  const modId = roleIds.mod;

  await api.patch(`/guilds/${guildId}/roles/${guildId}`, {
    permissions: bits(
      "view",
      "send",
      "embed",
      "attach",
      "history",
      "addReactions",
      "externalEmoji",
      "connect",
      "speak",
      "stream",
      "nick",
      "appCommands",
      "publicThreads",
      "sendThreads",
    ),
  }).catch(() => undefined);

  let channels = await api.get<Channel[]>(`/guilds/${guildId}/channels`);
  const channelIds: Record<string, string> = {};
  let position = 0;

  for (const category of CATEGORIES) {
    const existingCat = channels.find(
      (channel) => channel.type === TYPE.category && channel.name === category.name,
    );
    const catOverwrites = categoryOverwrites(guildId, studioId, modId, Boolean(category.hidden));
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
    await api.patch(`/channels/${cat.id}`, { position: position });
    position += 1;

    for (const spec of category.channels) {
      const wantType = TYPE[spec.type];
      let existing = findChannel(channels, spec);
      if (existing && existing.type !== wantType) {
        await api.patch(`/channels/${existing.id}`, { name: `legacy-${existing.name}`.slice(0, 90) });
        existing = undefined;
      }
      const overwrites = channelOverwrites(guildId, studioId, modId, spec, Boolean(category.hidden));
      const payload: Record<string, unknown> = {
        name: spec.name,
        topic: spec.topic,
        parent_id: cat.id,
        permission_overwrites: overwrites,
      };
      if (spec.type === "forum") {
        payload.available_tags = forumTags(spec.key);
        payload.default_reaction_emoji = { emoji_name: "🪐" };
      }
      let saved: Channel;
      if (existing) {
        saved = await api.patch<Channel>(`/channels/${existing.id}`, payload);
      } else {
        try {
          saved = await api.post<Channel>(`/guilds/${guildId}/channels`, {
            ...payload,
            type: wantType,
          });
        } catch (error) {
          if (spec.type !== "forum") {
            throw error;
          }
          saved = await api.post<Channel>(`/guilds/${guildId}/channels`, {
            name: spec.name,
            topic: spec.topic,
            parent_id: cat.id,
            permission_overwrites: overwrites,
            type: TYPE.text,
          });
        }
      }
      channelIds[spec.key] = saved.id;
      await api.patch(`/channels/${saved.id}`, { position });
      position += 1;
    }
    channels = await api.get<Channel[]>(`/guilds/${guildId}/channels`);
  }

  await api.patch(`/guilds/${guildId}`, {
    system_channel_id: channelIds.chat,
    rules_channel_id: channelIds.rules,
    public_updates_channel_id: channelIds["staff-chat"] ?? channelIds["mod-log"],
    safety_alerts_channel_id: channelIds["mod-log"],
    features: Array.from(new Set([...(guild.features ?? []), "COMMUNITY"])),
  }).catch(() => undefined);

  await api.patch(`/guilds/${guildId}/welcome-screen`, {
    enabled: true,
    description: "Official Pet Orbits server from Ringnest. Play on Roblox, talk here.",
    welcome_channels: [
      { channel_id: channelIds["start-here"], description: "How this Discord works", emoji_name: "🪐" },
      { channel_id: channelIds["looking-for-group"], description: "Find people to crash orbits with", emoji_name: "🎮" },
      { channel_id: channelIds.clips, description: "Post a hatch or a crown steal", emoji_name: "✨" },
    ],
  }).catch(() => undefined);

  await upsertAutomod(api, guildId, studioId, modId, channelIds["mod-log"]);

  await postIfMissing(api, channelIds.rules, EMBEDS.rules, [
    { type: 2, style: 5, label: "Play Pet Orbits", url: PLAY_URL },
    { type: 2, style: 5, label: "ringnest.games", url: SITE_URL },
  ]);
  await postIfMissing(api, channelIds["start-here"], EMBEDS.startHere);
  await postIfMissing(api, channelIds["start-here"], EMBEDS.pings, pingButtons());
  await postIfMissing(api, channelIds["support-desk"], EMBEDS.support, [
    { type: 2, style: 1, label: "Bug", custom_id: BUTTON.ticketBug },
    { type: 2, style: 2, label: "Help", custom_id: BUTTON.ticketHelp },
  ]);
  await postIfMissing(api, channelIds["patch-notes"], EMBEDS.patchSeed);
  await postIfMissing(api, channelIds.codes, EMBEDS.codesSeed);
  await postIfMissing(api, channelIds["staff-chat"], EMBEDS.staff);

  const invite = await api.post<{ code: string }>(`/channels/${channelIds["start-here"]}/invites`, {
    max_age: 0,
    max_uses: 0,
    unique: false,
  });
  const inviteUrl = `https://discord.gg/${invite.code}`;

  const applicationId = process.env.DISCORD_APPLICATION_ID || me.id;
  const botInviteUrl =
    `https://discord.com/oauth2/authorize?client_id=${applicationId}` +
    `&permissions=8&scope=bot%20applications.commands`;

  return {
    guildId: guild.id,
    inviteUrl,
    botInviteUrl,
    applicationId,
    channels: channelIds,
    roles: roleIds,
  };
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

async function postIfMissing(
  api: DiscordApi,
  channelId: string,
  embed: (typeof EMBEDS)[keyof typeof EMBEDS],
  buttons?: { type: number; style: number; label: string; custom_id?: string; url?: string }[],
) {
  const messages = await api.get<{ id: string; embeds?: { footer?: { text?: string }; title?: string }[] }[]>(
    `/channels/${channelId}/messages?limit=20`,
  ).catch(() => []);
  const already = messages.some((message) =>
    message.embeds?.some((item) => markerIn(item.footer?.text, embed.marker) || item.title === embed.title),
  );
  if (already) {
    return;
  }
  const body: Record<string, unknown> = {
    embeds: [
      {
        title: embed.title,
        description: embed.description,
        color: embed.color ?? COLOR.cyan,
        fields: "fields" in embed ? embed.fields : undefined,
        footer: { text: embed.marker },
      },
    ],
  };
  if (buttons?.length) {
    body.components = [{ type: 1, components: buttons }];
  }
  await api.post(`/channels/${channelId}/messages`, body);
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

function loadGuildIcon() {
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
      const png = jpegToPngDataUri(raw);
      if (png) {
        return png;
      }
    } catch {
      // try next
    }
  }
  return null;
}

function jpegToPngDataUri(raw: Buffer) {
  try {
    const python = `
from PIL import Image
import io, sys
img = Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")
img = img.resize((512, 512))
out = io.BytesIO()
img.save(out, format="PNG", optimize=True)
sys.stdout.buffer.write(out.getvalue())
`;
    const result = spawnSync("python3", ["-c", python], { input: raw, maxBuffer: 8 * 1024 * 1024 });
    if (result.status !== 0 || !result.stdout?.length) {
      return `data:image/jpeg;base64,${raw.toString("base64")}`;
    }
    return `data:image/png;base64,${Buffer.from(result.stdout).toString("base64")}`;
  } catch {
    return `data:image/jpeg;base64,${raw.toString("base64")}`;
  }
}

import { createPublicKey, verify } from "node:crypto";
import { DiscordApi, type DiscordObject } from "./discord-api";
import { STAFF, bits } from "./discord-bitfield";
import { BUTTON, PLAY_URL, RINGNEST_GUILD_ID, SITE_URL } from "./discord-server";

const PING = 1;
const APPLICATION_COMMAND = 2;
const MESSAGE_COMPONENT = 3;
const CHANNEL_MESSAGE = 4;
const EPHEMERAL = 1 << 6;

type Interaction = {
  type: number;
  id: string;
  token: string;
  guild_id?: string;
  channel_id?: string;
  channel?: { id: string; name?: string; parent_id?: string | null };
  member?: { user?: { id: string; username: string }; roles?: string[] };
  user?: { id: string; username: string };
  message?: { id: string };
  data?: { custom_id?: string; component_type?: number; name?: string };
};

export function verifyDiscordSignature(rawBody: string, signature: string | null, timestamp: string | null, publicKey: string) {
  if (!signature || !timestamp) {
    return false;
  }
  try {
    const key = createPublicKey({
      key: Buffer.concat([
        Buffer.from("302a300506032b6570032100", "hex"),
        Buffer.from(publicKey, "hex"),
      ]),
      format: "der",
      type: "spki",
    });
    return verify(null, Buffer.from(timestamp + rawBody), key, Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

export async function handleDiscordInteraction(interaction: Interaction, token: string) {
  if (interaction.type === PING) {
    return { type: PING };
  }

  const userId = interaction.member?.user?.id || interaction.user?.id;
  const username = interaction.member?.user?.username || interaction.user?.username || "player";
  const guildId = interaction.guild_id || RINGNEST_GUILD_ID;
  const api = new DiscordApi(token);

  if (interaction.type === APPLICATION_COMMAND) {
    return handleSlash(api, guildId, interaction.data?.name || "");
  }

  if (interaction.type !== MESSAGE_COMPONENT || !interaction.data?.custom_id) {
    return ephemeral("Ringnest cannot handle that yet.");
  }
  if (!userId) {
    return ephemeral("Could not see who clicked.");
  }

  const customId = interaction.data.custom_id;

  if (customId === BUTTON.updates || customId === BUTTON.events || customId === BUTTON.codes) {
    const key = customId === BUTTON.updates ? "Updates" : customId === BUTTON.events ? "Events" : "Codes";
    return toggleRole(api, guildId, userId, key);
  }

  if (customId === BUTTON.ticketBug || customId === BUTTON.ticketHelp) {
    return openTicket(api, guildId, userId, username, customId === BUTTON.ticketBug ? "bug" : "help");
  }

  if (customId === BUTTON.ticketClose) {
    return closeTicket(api, interaction);
  }

  return ephemeral("Unknown button.");
}

async function handleSlash(api: DiscordApi, guildId: string, name: string) {
  const channels = await api.get<(DiscordObject & { name: string; type: number })[]>(`/guilds/${guildId}/channels`);
  const named = (channelName: string) => channels.find((channel) => channel.name === channelName);

  if (name === "play") {
    return {
      type: CHANNEL_MESSAGE,
      data: {
        flags: EPHEMERAL,
        content: "Pet Orbits is on Roblox. Discord is just the chat next to it.",
        components: [
          {
            type: 1,
            components: [
              { type: 2, style: 5, label: "Play Pet Orbits", url: PLAY_URL },
              { type: 2, style: 5, label: "ringnest.games", url: SITE_URL },
            ],
          },
        ],
      },
    };
  }

  if (name === "codes") {
    const channel = named("codes");
    return ephemeral(
      channel
        ? `Official codes are only posted in <#${channel.id}>. Anything in chat is fake.`
        : "Official codes land in #codes.",
    );
  }

  if (name === "support") {
    const channel = named("support-desk");
    return ephemeral(
      channel
        ? `Open a private ticket in <#${channel.id}>. Tap **Bug** or **Help**. Staff never DM you first about Robux.`
        : "Open a private ticket in #support-desk.",
    );
  }

  if (name === "rules") {
    const channel = named("rules");
    return ephemeral(channel ? `House rules are in <#${channel.id}>.` : "House rules are in #rules.");
  }

  if (name === "faq") {
    const channel = named("faq");
    return ephemeral(channel ? `Short answers live in <#${channel.id}>.` : "Short answers live in #faq.");
  }

  return ephemeral("Unknown command.");
}

async function toggleRole(api: DiscordApi, guildId: string, userId: string, roleName: string) {
  const roles = await api.get<{ id: string; name: string }[]>(`/guilds/${guildId}/roles`);
  const role = roles.find((item) => item.name === roleName);
  if (!role) {
    return ephemeral(`${roleName} is not on this server yet. Run the Ringnest Discord setup.`);
  }
  const member = await api.get<{ roles: string[] }>(`/guilds/${guildId}/members/${userId}`);
  const has = member.roles.includes(role.id);
  if (has) {
    await api.del(`/guilds/${guildId}/members/${userId}/roles/${role.id}`);
    return ephemeral(`Stopped pinging you for **${roleName}**.`);
  }
  await api.put(`/guilds/${guildId}/members/${userId}/roles/${role.id}`);
  return ephemeral(`You will get **${roleName}** pings.`);
}

async function openTicket(
  api: DiscordApi,
  guildId: string,
  userId: string,
  username: string,
  kind: "bug" | "help",
) {
  const channels = await api.get<(DiscordObject & { name: string; type: number })[]>(`/guilds/${guildId}/channels`);
  const tickets = channels.find((channel) => channel.type === 4 && channel.name === "TICKETS");
  const studio = (await api.get<{ id: string; name: string }[]>(`/guilds/${guildId}/roles`)).find(
    (role) => role.name === "Ringnest Studio",
  );
  const mod = (await api.get<{ id: string; name: string }[]>(`/guilds/${guildId}/roles`)).find(
    (role) => role.name === "Moderator",
  );
  if (!tickets || !studio || !mod) {
    return ephemeral("Tickets are not set up yet.");
  }

  const slug = username.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16) || "player";
  const name = `${kind}-${slug}`.slice(0, 90);
  const existing = channels.find((channel) => channel.parent_id === tickets.id && channel.name === name);
  if (existing) {
    return ephemeral(`You already have <#${existing.id}>.`);
  }

  const channel = await api.post<{ id: string }>(`/guilds/${guildId}/channels`, {
    name,
    type: 0,
    parent_id: tickets.id,
    topic: `${kind} ticket for ${username}`,
    permission_overwrites: [
      { id: guildId, type: 0, deny: bits("view") },
      { id: studio.id, type: 0, allow: STAFF },
      { id: mod.id, type: 0, allow: STAFF },
      {
        id: userId,
        type: 1,
        allow: bits("view", "send", "embed", "attach", "history", "addReactions"),
      },
    ],
  });

  await api.post(`/channels/${channel.id}/messages`, {
    content: `<@${userId}> Ringnest is here. Tell us what happened.`,
    embeds: [
      {
        title: kind === "bug" ? "Bug ticket" : "Help ticket",
        color: kind === "bug" ? 0x00e38c : 0x22d3ee,
        description:
          kind === "bug"
            ? "What broke, phone / PC / console, and a screenshot if you can."
            : "What are you trying to do in Pet Orbits?",
        footer: { text: "Ringnest · Pet Orbits" },
      },
    ],
    components: [
      {
        type: 1,
        components: [{ type: 2, style: 4, label: "Close ticket", custom_id: BUTTON.ticketClose }],
      },
    ],
  });

  return ephemeral(`Opened <#${channel.id}>. Only you and Ringnest staff can see it.`);
}

async function closeTicket(api: DiscordApi, interaction: Interaction) {
  const channelId = interaction.channel_id;
  if (!channelId) {
    return ephemeral("No ticket channel.");
  }
  const channel = await api.get<{ name: string; parent_id?: string | null }>(`/channels/${channelId}`);
  if (!channel.name.startsWith("bug-") && !channel.name.startsWith("help-")) {
    return ephemeral("This is not a ticket.");
  }
  await api.post(`/channels/${channelId}/messages`, {
    content: "Ticket closed.",
  });
  await api.del(`/channels/${channelId}`);
  return ephemeral("Ticket closed.");
}

function ephemeral(content: string) {
  return { type: CHANNEL_MESSAGE, data: { content, flags: EPHEMERAL } };
}

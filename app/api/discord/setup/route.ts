import { setupDiscord } from "@/lib/discord-setup";
import { RINGNEST_GUILD_ID } from "@/lib/discord-server";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const expected = process.env.DISCORD_SETUP_SECRET || process.env.CRON_SECRET;
  const token = process.env.DISCORD_BOT_TOKEN;
  const auth = request.headers.get("authorization") || "";
  if (!expected || auth !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!token) {
    return Response.json({ error: "Missing DISCORD_BOT_TOKEN" }, { status: 503 });
  }

  try {
    const result = await setupDiscord(token, process.env.DISCORD_GUILD_ID || RINGNEST_GUILD_ID);
    return Response.json({
      ok: true,
      inviteUrl: result.inviteUrl,
      interactionsUrl: "https://ringnest.games/api/discord/interactions",
      next: [
        "Paste Interactions Endpoint URL in the Discord Developer Portal: https://ringnest.games/api/discord/interactions",
        "Set NEXT_PUBLIC_DISCORD_URL on Vercel to the inviteUrl",
        "Invite Bloxlink from the note in #staff-chat",
      ],
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Setup failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

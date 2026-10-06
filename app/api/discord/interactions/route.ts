import { handleDiscordInteraction, verifyDiscordSignature } from "@/lib/discord-interactions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!publicKey || !token) {
    return new Response("Discord bot is not configured", { status: 503 });
  }

  const rawBody = await request.text();
  const valid = verifyDiscordSignature(
    rawBody,
    request.headers.get("x-signature-ed25519"),
    request.headers.get("x-signature-timestamp"),
    publicKey,
  );
  if (!valid) {
    return new Response("Bad Discord signature", { status: 401 });
  }

  const interaction = JSON.parse(rawBody) as Parameters<typeof handleDiscordInteraction>[0];
  const payload = await handleDiscordInteraction(interaction, token);
  return Response.json(payload);
}

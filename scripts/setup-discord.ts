import { setupDiscord } from "../lib/discord-setup.ts";
import { RINGNEST_GUILD_ID } from "../lib/discord-server.ts";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error("Set DISCORD_BOT_TOKEN, then run: npm run discord:setup");
  process.exit(1);
}

const result = await setupDiscord(token, process.env.DISCORD_GUILD_ID || RINGNEST_GUILD_ID);
console.log(JSON.stringify(result, null, 2));
console.log("\nInvite:", result.inviteUrl);
console.log("Interactions URL: https://ringnest.games/api/discord/interactions");

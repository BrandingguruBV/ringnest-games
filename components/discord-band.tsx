import Link from "next/link";
import { JoinDiscord } from "@/components/join-discord";
import { discordChannels } from "@/lib/discord";

export function DiscordBand() {
  return (
    <section
      id="discord"
      className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="rounded-[2rem] border border-[#5865F2]/35 bg-[linear-gradient(160deg,rgba(88,101,242,0.18),rgba(5,8,20,0.92))] p-8 backdrop-blur-md sm:p-12">
        <p className="text-[13px] font-extrabold tracking-[0.2em] text-[#c5cbff] uppercase">
          Discord
        </p>
        <h2 className="font-heading mt-2 text-3xl font-extrabold text-white sm:text-5xl">
          Chat next to the game
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
          Updates, bug reports, crews, and clips live on the Ringnest Discord. Play stays on
          Roblox. Open the full guide if you are new to Discord.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {discordChannels.map((channel) => (
            <li
              key={channel.name}
              className="rounded-full border border-white/15 bg-[#0b1428]/70 px-3 py-1.5 text-sm font-extrabold text-white"
            >
              #{channel.name}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <JoinDiscord />
          <Link
            href="/discord"
            className="inline-flex h-12 items-center justify-center rounded-2xl px-2 text-base font-extrabold text-white/90 underline-offset-4 hover:underline sm:h-14 sm:px-5"
          >
            What is on Discord
          </Link>
        </div>
      </div>
    </section>
  );
}

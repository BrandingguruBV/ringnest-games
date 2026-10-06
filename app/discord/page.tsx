import Link from "next/link";
import { JoinDiscord } from "@/components/join-discord";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { discordChannels, discordUses } from "@/lib/discord";
import { featuredGame } from "@/lib/games";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discord",
  description:
    "The Ringnest Discord is where Pet Orbits players get updates, report bugs, find people to play with, and share clips.",
};

export default function DiscordPage() {
  const featured = featuredGame();

  return (
    <article className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="text-[13px] font-extrabold tracking-[0.2em] text-[#9aa4ff] uppercase">
        Community
      </p>
      <h1 className="font-heading mt-2 text-4xl font-extrabold text-white sm:text-6xl">
        Ringnest on Discord
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-white/92">
        Discord is the chat next to the game. Roblox is where you play Pet Orbits. Discord is
        where you hear news, report bugs, find a crew, and post clips. It is not required to
        play.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <JoinDiscord />
        <PlayOnRoblox href={featured.playUrl} />
      </div>
      <p className="mt-3 text-sm font-semibold text-white/80">
        Opens {site.discord.name}. Log into Discord on the web or the app if it asks.
      </p>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-extrabold text-white">What you can do there</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {discordUses.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#0b1428]/82 px-4 py-4"
            >
              <h3 className="font-heading text-lg font-extrabold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/90">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-extrabold text-white">What you will find</h2>
        <p className="mt-3 leading-relaxed text-white/90">
          Four channels. Pick the one that matches what you came for.
        </p>
        <ul className="mt-6 grid gap-4">
          {discordChannels.map((channel) => (
            <li
              key={channel.name}
              id={channel.name}
              className="rounded-[1.4rem] border border-white/10 bg-[#0b1428]/82 p-5"
            >
              <p className="font-heading text-xl font-extrabold text-[#c5cbff]">
                #{channel.name}
              </p>
              <p className="mt-1 text-[13px] font-extrabold tracking-[0.14em] text-white/70 uppercase">
                {channel.who}
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/92">{channel.purpose}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{channel.find}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-extrabold text-white">House rules</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-white/90">
          <li>Be kind. No scams, no account trading, no Robux giveaway fakes.</li>
          <li>Put bugs in #bugs, news stays in #announcements, clips go in #clips-and-highlights.</li>
          <li>This server is for players who can already join Pet Orbits. Under-16 access follows Roblox Kids and Select, not Discord.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-extrabold text-white">Play first</h2>
        <p className="mt-3 leading-relaxed text-white/90">
          Discord does not replace the game. Open{" "}
          <Link
            href="/games/pet-orbits"
            className="font-bold text-cyan-200 underline-offset-4 hover:underline"
          >
            Pet Orbits
          </Link>{" "}
          on Roblox, then come here when you want news or a crew.
        </p>
      </section>
    </article>
  );
}

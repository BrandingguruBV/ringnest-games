import Link from "next/link";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: site.about,
};

export default function AboutPage() {
  return (
    <article className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="text-xs font-extrabold tracking-[0.28em] text-lime-300 uppercase">About</p>
      <h1 className="font-heading mt-2 text-4xl font-extrabold text-white sm:text-6xl">
        Ringnest
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-white/75">{site.about}</p>

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-extrabold text-white">What we make</h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Worlds you join on Roblox. First is Pet Orbits: one pet orbits you, you crash
          orbs to grow mass, hatch 156 named pets into pens, and run 12 biome nests.
          More Ringnest games will share this site, the same catalog style, and the same
          Play on Roblox button once they are Public.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-extrabold text-white">Who owns it</h2>
        <p className="mt-3 leading-relaxed text-white/70">
          The Roblox group is <span className="font-bold text-white">{site.groupName}</span>.
          Players will see <span className="font-bold text-white">By Ringnest</span>. The
          legal company is{" "}
          <a
            href={site.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-cyan-200 underline-offset-4 hover:underline"
          >
            {site.companyLegal}
          </a>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-extrabold text-white">This website</h2>
        <p className="mt-3 leading-relaxed text-white/70">
          <Link href="/games" className="font-bold text-cyan-200 underline-offset-4 hover:underline">
            Games
          </Link>{" "}
          is the lineup of Ringnest worlds.{" "}
          <Link href="/catalog" className="font-bold text-cyan-200 underline-offset-4 hover:underline">
            Catalog
          </Link>{" "}
          is the Pet Orbits Index: every named pet, rarity, and biome. Play on Roblox
          opens the live group experience when it is Public. Until then, Roblox shows a
          404 on Private games.
        </p>
      </section>
    </article>
  );
}

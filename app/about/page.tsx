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
          orbs to grow mass, hatch 162 named pets into pens, and run 12 biome nests.
          More Ringnest games will join Pet Orbits here.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-extrabold text-white">Who we are</h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Games are made by <span className="font-bold text-white">Ringnest</span>. The
          company is{" "}
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
        <h2 className="font-heading text-2xl font-extrabold text-white">Play Pet Orbits</h2>
        <p className="mt-3 leading-relaxed text-white/70">
          Open Pet Orbits on Roblox, or browse every hatchable pet in the{" "}
          <Link href="/catalog" className="font-bold text-cyan-200 underline-offset-4 hover:underline">
            Catalog
          </Link>
          . Optional{" "}
          <Link href="/#nest-club" className="font-bold text-cyan-200 underline-offset-4 hover:underline">
            Nest Club
          </Link>{" "}
          is 199 Robux a month for extra coins, nest grace, and a Lucky Egg. New Ringnest games land on{" "}
          <Link href="/games" className="font-bold text-cyan-200 underline-offset-4 hover:underline">
            Games
          </Link>{" "}
          when they go live.
        </p>
      </section>
    </article>
  );
}

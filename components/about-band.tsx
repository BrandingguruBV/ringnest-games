import Link from "next/link";
import { site } from "@/lib/site";

export function AboutBand() {
  return (
    <section id="about" className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="rounded-[2rem] border border-white/10 bg-[#0b1428]/82 p-8 backdrop-blur-md sm:p-12">
        <p className="text-[13px] font-extrabold tracking-[0.2em] text-lime-300 uppercase">About</p>
        <h2 className="font-heading mt-2 text-3xl font-extrabold text-white sm:text-5xl">
          Games from Ringnest
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
          {site.about}
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#0b1428]/88 p-4">
            <dt className="text-[13px] font-extrabold tracking-[0.2em] text-white/88 uppercase">
              Studio
            </dt>
            <dd className="mt-1 font-heading text-xl font-extrabold text-white">Ringnest</dd>
          </div>
          <div className="rounded-2xl bg-[#0b1428]/88 p-4">
            <dt className="text-[13px] font-extrabold tracking-[0.2em] text-white/88 uppercase">
              Company
            </dt>
            <dd className="mt-1 font-heading text-xl font-extrabold text-white">{site.company}</dd>
          </div>
          <div className="rounded-2xl bg-[#0b1428]/88 p-4">
            <dt className="text-[13px] font-extrabold tracking-[0.2em] text-white/88 uppercase">
              First game
            </dt>
            <dd className="mt-1 font-heading text-xl font-extrabold text-white">Pet Orbits</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/games/pet-orbits"
            className="inline-flex h-12 items-center rounded-2xl bg-white/10 px-5 text-sm font-extrabold text-white ring-1 ring-white/15 hover:bg-white/16"
          >
            Inside Pet Orbits
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center rounded-2xl bg-white/10 px-5 text-sm font-extrabold text-white ring-1 ring-white/15 hover:bg-white/16"
          >
            About Ringnest
          </Link>
          <Link
            href="/discord"
            className="inline-flex h-12 items-center rounded-2xl bg-white/10 px-5 text-sm font-extrabold text-white ring-1 ring-white/15 hover:bg-white/16"
          >
            Discord
          </Link>
          <a
            href={site.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center text-sm font-bold text-cyan-200 underline-offset-4 hover:text-white hover:underline"
          >
            {site.companyLegal}
          </a>
        </div>
      </div>
    </section>
  );
}

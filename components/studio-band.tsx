import { site } from "@/lib/site";

export function StudioBand() {
  return (
    <section id="studio" className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-12">
        <p className="text-xs font-extrabold tracking-[0.28em] text-lime-300 uppercase">Studio</p>
        <h2 className="font-heading mt-2 text-3xl font-extrabold text-white sm:text-5xl">
          Built in the nest
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Ringnest is the game studio behind Pet Orbits. Legal company{" "}
          <a
            href={site.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-cyan-200 underline-offset-4 hover:text-white hover:underline"
          >
            Branding Guru
          </a>{" "}
          ({site.companyLegal}). Group on Roblox: {site.groupName}. More worlds
          will share this site, this catalog, and the same Play on Roblox
          button.
        </p>
      </div>
    </section>
  );
}

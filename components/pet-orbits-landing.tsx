import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NestClubBand } from "@/components/nest-club";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import {
  biomes,
  coinUpgrades,
  controls,
  eggs,
  events,
  faqs,
  firstBuys,
  firstSession,
  forYou,
  freeLoop,
  landingNav,
  loopSteps,
  massRanks,
  nestFacts,
  notForYou,
  orbitShop,
  penFacts,
  pitch,
  robuxBuys,
  shopItems,
  systems,
  whyPlay,
  worldFacts,
  type ShopItem,
} from "@/lib/pet-orbits-content";
import { nestClub } from "@/lib/games";
import {
  BIOME_ORDER,
  RARITY_COLORS,
  RARITY_ORDER,
  type PetBiome,
  type PetRarity,
  pets,
} from "@/lib/pets";
import { cn } from "@/lib/utils";

const KIND_STYLE: Record<ShopItem["kind"], string> = {
  Club: "border-0 bg-[#ffd84a] text-[#3a2200]",
  Pass: "border-0 bg-[#00e38c] text-[#052013]",
  Pack: "border-0 bg-cyan-300 text-[#04202a]",
};

function countBy<T extends string>(key: (pet: (typeof pets)[number]) => T, order: T[]) {
  const tally = new Map<T, number>();
  for (const pet of pets) {
    const k = key(pet);
    tally.set(k, (tally.get(k) ?? 0) + 1);
  }
  return order
    .filter((item) => (tally.get(item) ?? 0) > 0)
    .map((item) => ({ item, count: tally.get(item) ?? 0 }));
}

function SectionHead({
  kicker,
  title,
  intro,
  id,
}: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-extrabold tracking-[0.28em] text-cyan-300 uppercase">{kicker}</p>
      <h2 id={id} className="font-heading mt-2 scroll-mt-28 text-3xl font-extrabold text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">{intro}</p>
    </div>
  );
}

export function PetOrbitsLanding({
  playUrl,
  thumbnail,
}: {
  playUrl: string | null;
  thumbnail: string;
}) {
  const rarityCounts = countBy((pet) => pet.rarity, RARITY_ORDER);
  const biomeCounts = countBy(
    (pet) => pet.biome,
    BIOME_ORDER.filter((biome) => biome !== "Limited" && biome !== "Prime") as PetBiome[],
  );
  const limited = pets.filter((pet) => pet.rarity === "Limited");
  const apex = pets.filter((pet) => pet.rarity === "Apex");
  const passes = shopItems.filter((item) => item.kind === "Pass");
  const packs = shopItems.filter((item) => item.kind === "Pack");

  return (
    <article className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/games"
        className="text-sm font-bold text-cyan-200 underline-offset-4 hover:text-white hover:underline"
      >
        Back to games
      </Link>

      <header className="mt-6 overflow-hidden rounded-[2rem] ring-1 ring-white/15">
        <div className="relative aspect-[4/5] min-h-[320px] sm:aspect-[16/9] sm:min-h-[380px]">
          <Image
            src={thumbnail}
            alt="Pet Orbits key art"
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
            <div className="flex flex-wrap gap-2">
              <Badge className="h-6 rounded-full border-0 bg-[#00e38c] font-bold text-[#052013]">
                Live on Roblox
              </Badge>
              <Badge className="h-6 rounded-full border-0 bg-white/15 font-bold text-white">
                Phone and PC
              </Badge>
              <Badge className="h-6 rounded-full border-0 bg-white/15 font-bold text-white">
                Playable free
              </Badge>
            </div>
            <h1 className="font-heading mt-4 text-4xl font-extrabold text-white sm:text-7xl">
              Pet Orbits
            </h1>
            <p className="mt-3 max-w-2xl text-base font-bold text-amber-200 sm:text-2xl">
              Crash orbits. Hatch 162 pets. Run 12 biome nests. Keep what you earn.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-lg">
              You are a collector in a stadium world. One pet circles you as a crash
              orb. Named pets you hatch sit in pens and pay coins. Twelve biomes
              around the bowl hide nests. Steal the egg, bank HOME, hatch rarer,
              crash bigger. Ringnest built it for phone and PC.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PlayOnRoblox href={playUrl} className="w-full sm:w-auto" />
              <Button
                asChild
                size="lg"
                className="h-14 rounded-2xl border-0 bg-[#ffd84a] px-7 text-lg font-extrabold text-[#3a2200] shadow-[0_10px_0_#b8860b] hover:bg-[#ffe37a] hover:text-[#3a2200]"
              >
                <a
                  href={nestClub.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to Nest Club on Roblox"
                >
                  Subscribe Nest Club
                </a>
              </Button>
              <a
                href="#shop"
                className="inline-flex h-14 items-center justify-center rounded-2xl px-5 text-base font-extrabold text-white/90 underline-offset-4 hover:underline"
              >
                See every pass and pack
              </a>
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="On this page"
        className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {landingNav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-extrabold tracking-wide text-white/80 hover:bg-white/14 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Named pets", value: String(pets.length) },
          { label: "Biomes", value: "12" },
          { label: "Bases", value: "16" },
          { label: "Shop SKUs", value: String(shopItems.length) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <dt className="text-[10px] font-bold tracking-wider text-white/50 uppercase">{stat.label}</dt>
            <dd className="font-heading mt-1 text-3xl font-extrabold text-white">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-16">
        <SectionHead id="what" kicker={pitch.kicker} title={pitch.title} intro={pitch.lead} />
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">{pitch.body}</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">{pitch.close}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-[#00e38c]/25 bg-[#00e38c]/8 p-5">
            <h3 className="font-heading text-xl font-extrabold text-white">Playable free</h3>
            <ul className="mt-3 grid gap-2">
              {freeLoop.map((item) => (
                <li key={item} className="text-sm font-semibold text-white/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.6rem] border border-amber-300/25 bg-amber-300/8 p-5">
            <h3 className="font-heading text-xl font-extrabold text-white">Optional Robux</h3>
            <ul className="mt-3 grid gap-2">
              {robuxBuys.map((item) => (
                <li key={item} className="text-sm font-semibold text-white/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHead
          id="why"
          kicker="Why play"
          title="Built for people who want a real loop"
          intro="Pet Orbits is not a lobby skin farm. Crash is a skill shot. Pens are an economy. Nests are a run you can fail. The Index is 162 names you actually hatch."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {whyPlay.map((item) => (
            <div key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
              <h3 className="font-heading text-2xl font-extrabold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHead
          id="for-you"
          kicker="Is it for you"
          title="Read this before you join"
          intro="This page is for people who already want a crash collector, and for people deciding if they do. If the yes list sounds like you, Play on Roblox. If the no list is you, save the Robux."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-xl font-extrabold text-[#00e38c]">Play this if</h3>
            <div className="mt-4 grid gap-3">
              {forYou.map((item) => (
                <div key={item.title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <h4 className="font-heading text-lg font-extrabold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-amber-200">Skip this if</h3>
            <div className="mt-4 grid gap-3">
              {notForYou.map((item) => (
                <div key={item.title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <h4 className="font-heading text-lg font-extrabold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHead
          id="loop"
          kicker="The loop"
          title="Crash, hatch, nest, climb"
          intro="Coins buy eggs. Eggs fill pens. Pens buy Speed. Speed unlocks farther nests. Farther nests hatch rarer pets. Rarer pets pay more. Mass is combat score you can bank."
        />
        <ol className="mt-8 grid gap-4">
          {loopSteps.map((step) => (
            <li
              key={step.n}
              className="grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:grid-cols-[auto_1fr] sm:items-start sm:p-6"
            >
              <span className="font-heading text-3xl font-extrabold text-[#00e38c]">{step.n}</span>
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-[1.6rem] border border-amber-300/20 bg-amber-300/8 p-5">
          <p className="text-xs font-extrabold tracking-[0.22em] text-amber-200 uppercase">Mass ranks</p>
          <p className="mt-3 flex flex-wrap gap-2">
            {massRanks.map((rank) => (
              <span
                key={rank}
                className="rounded-full bg-[#050814]/60 px-3 py-1 text-xs font-bold text-amber-100"
              >
                {rank}
              </span>
            ))}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Higher mass steals first, pays more steal coins, boosts pen income, and Titans+ bite harder.
            Shop banks 50, 200, or 1000 mass into coins at 2 coins each. You always keep 1 mass.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-heading text-xl font-extrabold text-white">Nest run</h3>
            <ul className="mt-4 space-y-3">
              {nestFacts.map((row) => (
                <li key={row.label}>
                  <p className="text-xs font-extrabold tracking-[0.18em] text-cyan-200 uppercase">{row.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{row.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-heading text-xl font-extrabold text-white">Pens and satellites</h3>
            <ul className="mt-4 space-y-3">
              {penFacts.map((row) => (
                <li key={row.label}>
                  <p className="text-xs font-extrabold tracking-[0.18em] text-cyan-200 uppercase">{row.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{row.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHead
          id="world"
          kicker="World"
          title="Stadium first. Twelve biomes after the stands."
          intro="Spawn is the cyan SAFE ZONE on grass. Music starts on join. Walk a GATE, or warp. Outer ice nests in Snow and Frost still bank on HOME. You cannot outrun those on foot back to spawn."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {worldFacts.map((fact) => (
            <li key={fact.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-cyan-200 uppercase">
                {fact.label}
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-white/80">{fact.value}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/8 text-[11px] font-extrabold tracking-wider text-white/55 uppercase">
              <tr>
                <th className="px-4 py-3">Biome</th>
                <th className="px-4 py-3">Speed to steal</th>
                <th className="px-4 py-3">Coin bonus</th>
                <th className="px-4 py-3">Nest eggs</th>
              </tr>
            </thead>
            <tbody>
              {biomes.map((biome) => (
                <tr key={biome.name} className="border-t border-white/8 text-white/85">
                  <td className="px-4 py-3 font-extrabold text-white">{biome.name}</td>
                  <td className="px-4 py-3">{biome.speed === 0 ? "None" : `Speed ${biome.speed}`}</td>
                  <td className="px-4 py-3">{biome.bonus}</td>
                  <td className="px-4 py-3 text-white/70">{biome.drop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-white/60">
          Walk speed starts at 36. Pens, Buy Speed goes to level 24. Sprint is a stamina burst on top.
          Cyan trail orbs speed you. Orange trail orbs add +1 mass.
        </p>
      </section>

      <section className="mt-16">
        <SectionHead
          id="pets"
          kicker="Collection"
          title={`${pets.length} named pets. Index is the long game.`}
          intro="Every hatch discovers a species. Locked Index slots show as ???. Complete a biome set for +15% pen income, stacking per biome. Catalog on this site lists every name."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {rarityCounts.map(({ item, count }) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-extrabold tracking-wider uppercase" style={{ color: RARITY_COLORS[item as PetRarity] }}>
                {item}
              </p>
              <p className="font-heading mt-1 text-3xl font-extrabold text-white">{count}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {biomeCounts.map(({ item, count }) => (
            <p
              key={item}
              className="rounded-xl border border-white/10 bg-[#050814]/50 px-3 py-2 text-sm font-semibold text-white/80"
            >
              {item} <span className="text-white/45">{count}</span>
            </p>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-[#ff46dc]/30 bg-[#ff46dc]/10 p-5">
            <h3 className="font-heading text-2xl font-extrabold text-white">Weekly Limited</h3>
            <p className="mt-2 text-sm text-white/70">
              Six Limited pets from the Limited Egg. Weekly stock. Featured name sits on the event strip.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {limited.map((pet) => (
                <li key={pet.id} className="text-sm font-bold text-pink-100">
                  {pet.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.6rem] border border-amber-300/30 bg-amber-300/10 p-5">
            <h3 className="font-heading text-2xl font-extrabold text-white">Apex, Prime only</h3>
            <p className="mt-2 text-sm text-white/70">
              Six Apex pets. Prime Egg in VIP Shop. Coins cannot buy them. Orbit Sovereign sits at the top of pen income.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {apex.map((pet) => (
                <li key={pet.id} className="text-sm font-bold text-amber-100">
                  {pet.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link
          href="/catalog"
          className="mt-6 inline-flex h-12 items-center rounded-2xl bg-white/10 px-5 text-sm font-extrabold text-white ring-1 ring-white/15 hover:bg-white/16"
        >
          Open the full Catalog
        </Link>
      </section>

      <section className="mt-16">
        <SectionHead
          id="eggs"
          kicker="Hatch"
          title="Seven eggs. One menu."
          intro="Dock Eggs and the gold island open the same hatch. Nest runs are how you get Cosmic and Rainbow cheaper than the shop. Extra pens and satellites show off what you already own."
        />
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {eggs.map((egg) => (
            <div key={egg.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-heading text-xl font-extrabold text-white">{egg.name}</h3>
                <p className="text-sm font-extrabold text-amber-200">{egg.cost}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{egg.get}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-heading text-xl font-extrabold text-white">Orbit Shop (coins)</h3>
            <p className="mt-2 text-sm text-white/65">
              Equip a stronger orbiting rarity. Mass is kept. Named pets stay in pens.
            </p>
            <ul className="mt-4 space-y-2">
              {orbitShop.map((row) => (
                <li key={row.rarity} className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-bold text-white">{row.rarity}</span>
                  <span className="text-amber-200">{row.cost}</span>
                  <span className="w-full text-white/65">{row.power}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <h3 className="font-heading text-xl font-extrabold text-white">Coin upgrades and Era</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {coinUpgrades.map((row) => (
                <li key={row.name}>
                  <span className="font-extrabold text-white">{row.name}.</span> {row.detail}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Era at mass 25. Mass resets to 1 plus Nest Egg. You keep 25% coins, or 50% with Gold Pass.
              Each Era: +1 coin per steal forever. Pens, Index, Speed, and passes stay. HUD says Index stays. Mass resets.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHead
          id="seasons"
          kicker="Live systems"
          title="Seasons, crews, events, trade"
          intro="The collector game never wipes. Seasons reset ranks, not Index. Events juice a session. Trade is one pet for one pet in the SAFE ZONE."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {systems.map((item) => (
            <div key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-xl font-extrabold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.name} className="rounded-xl border border-white/10 bg-[#050814]/50 px-4 py-3">
              <p className="text-sm font-extrabold text-white">{event.name}</p>
              <p className="text-xs text-white/60">{event.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <SectionHead
          id="shop"
          kicker="VIP Shop"
          title="Nest Club, 12 passes, 14 packs"
          intro="Open VIP on the dock, or subscribe from the Roblox Store tab. Nothing here is required to finish Index or biomes. Starter Pack is the cheap first buy. Roblox Premium players also get +10% coins in game."
        />
        <NestClubBand className="mt-8 px-0 py-0 sm:px-0 sm:py-0" />

        <h3 className="font-heading mt-12 text-2xl font-extrabold text-white">Passes, buy once</h3>
        <p className="mt-2 max-w-2xl text-sm text-white/65">
          Permanent power. Extra Pens is the one that actually makes slots 13-20 pay. Orbit Swarm is 12 satellites versus 4.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {passes.map((item) => (
            <ShopCard key={item.name} item={item} />
          ))}
        </div>

        <h3 className="font-heading mt-12 text-2xl font-extrabold text-white">Packs, buy again</h3>
        <p className="mt-2 max-w-2xl text-sm text-white/65">
          Starter Pack is once. Season Pass and Comeback Pack are once per 14-day season. Coin Titan and Limited Ticket are the repeat spend.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((item) => (
            <ShopCard key={item.name} item={item} />
          ))}
        </div>
        <h3 className="font-heading mt-12 text-2xl font-extrabold text-white">First buys that actually help</h3>
        <p className="mt-2 max-w-2xl text-sm text-white/65">
          Skip random packs until you have crashed, hatched, and banked a Meadow nest. Then pick one of these.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {firstBuys.map((buy) => (
            <article key={buy.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-heading text-lg font-extrabold text-white">{buy.name}</h4>
                <p className="text-sm font-extrabold text-amber-200">{buy.price}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{buy.why}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-white/60">
          Buy in the VIP Shop while you play, or open the{" "}
          <a
            href={nestClub.subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-cyan-200 underline-offset-4 hover:underline"
          >
            Roblox Store tab
          </a>
          {" "}for Nest Club. About 70% of each sale goes to the Ringnest group. The full crash, hatch, nest, and Index loop stays free.
        </p>
      </section>

      <section className="mt-16">
        <SectionHead
          id="start"
          kicker="First session"
          title="A good first ten minutes"
          intro="Phone and PC both work. On a small screen the dock scrolls sideways. Help replays the beginner lesson anytime."
        />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {firstSession.map((step, index) => (
            <li key={step} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[#00e38c] uppercase">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-white/85">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-white/10">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-white/8 text-[11px] font-extrabold tracking-wider text-white/55 uppercase">
              <tr>
                <th className="px-4 py-3">Control</th>
                <th className="px-4 py-3">How</th>
              </tr>
            </thead>
            <tbody>
              {controls.map((row) => (
                <tr key={row.what} className="border-t border-white/8">
                  <td className="px-4 py-3 font-extrabold text-white">{row.what}</td>
                  <td className="px-4 py-3 text-white/70">{row.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <SectionHead
          id="faq"
          kicker="FAQ"
          title="Straight answers before you join"
          intro="If you already want to play, this is the last page you need. Then open Roblox."
        />
        <div className="mt-8 grid gap-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4"
            >
              <summary className="cursor-pointer font-heading text-lg font-extrabold text-white">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-16 rounded-[2rem] border border-[#00e38c]/30 bg-[linear-gradient(160deg,rgba(0,227,140,0.16),rgba(5,8,20,0.92))] p-6 sm:p-10">
        <h2 className="font-heading text-3xl font-extrabold text-white sm:text-5xl">Play Pet Orbits</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75">
          You now know the crash, the pens, the 12 nests, the 162 pets, Nest Club, every pass, and every pack.
          Join on Roblox. Hatch the free Basic. Crash the gold orb. Run Meadow.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <PlayOnRoblox href={playUrl} />
          <Button
            asChild
            size="lg"
            className="h-14 rounded-2xl border-0 bg-[#ffd84a] px-7 text-lg font-extrabold text-[#3a2200] shadow-[0_10px_0_#b8860b] hover:bg-[#ffe37a] hover:text-[#3a2200]"
          >
            <a href={nestClub.subscribeUrl} target="_blank" rel="noopener noreferrer">
              Subscribe Nest Club
            </a>
          </Button>
          <Link
            href="/catalog"
            className="inline-flex h-14 items-center justify-center rounded-2xl px-5 text-base font-extrabold text-white underline-offset-4 hover:underline"
          >
            Browse 162 pets
          </Link>
        </div>
      </div>
    </article>
  );
}

function ShopCard({ item }: { item: ShopItem }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn("h-5 rounded-full px-2 font-bold", KIND_STYLE[item.kind])}>{item.kind}</Badge>
        <span className="text-[10px] font-bold tracking-wider text-white/45 uppercase">{item.section}</span>
      </div>
      <h4 className="font-heading mt-2 text-lg font-extrabold text-white">{item.name}</h4>
      <p className="text-sm font-extrabold text-amber-200">{item.price}</p>
      {item.once ? <p className="mt-1 text-xs font-bold text-cyan-200">{item.once}</p> : null}
      <p className="mt-2 text-sm leading-relaxed text-white/70">{item.detail}</p>
    </article>
  );
}

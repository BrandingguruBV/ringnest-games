import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyArtHero } from "@/components/key-art-hero";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { nestClub } from "@/lib/games";

export function PetOrbitsHero({
  playUrl,
  thumbnail,
}: {
  playUrl: string | null;
  thumbnail: string;
}) {
  return (
    <header className="mt-6">
      <KeyArtHero
        src={thumbnail}
        alt="Pet Orbits key art"
       
        imageClassName="min-h-[200px] sm:min-h-[340px]"
      >
        <div className="flex flex-wrap gap-2">
          <Badge className="h-7 rounded-full border-0 bg-[#00e38c] text-sm font-bold text-[#052013]">
            Live on Roblox
          </Badge>
          <Badge className="h-7 rounded-full border-0 bg-white/20 text-sm font-bold text-white">
            Phone and PC
          </Badge>
          <Badge className="h-7 rounded-full border-0 bg-white/20 text-sm font-bold text-white">
            Playable free
          </Badge>
        </div>
        <h1 className="font-heading mt-3 text-[2.4rem] leading-none font-extrabold text-white sm:mt-4 sm:text-6xl md:text-7xl">
          Pet Orbits
        </h1>
        <p className="mt-3 max-w-2xl text-base font-bold leading-snug text-amber-200 sm:text-2xl">
          Crash orbits. Hatch 162 pets. Run 12 biome nests. Keep what you earn.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
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
            className="inline-flex h-12 items-center justify-center rounded-2xl px-2 text-base font-extrabold text-white/90 underline-offset-4 hover:underline sm:h-14 sm:px-5"
          >
            See every pass and pack
          </a>
        </div>
      </KeyArtHero>
      <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white/92 sm:text-lg">
        You are a collector in a stadium world. One pet circles you as a crash
        orb. Named pets you hatch sit in pens and pay coins. Twelve biomes
        around the bowl hide nests. Steal the egg, bank HOME, hatch rarer,
        crash bigger. Ringnest built it for phone and PC.
      </p>
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PET_ORBITS_DASHBOARD, PET_ORBITS_PLACE_ID } from "@/lib/games";
import { cn } from "@/lib/utils";

function PlayTriangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="currentColor" d="M8 5.5v13l12-6.5L8 5.5z" />
    </svg>
  );
}

export function PlayOnRoblox({
  href,
  publicJoin = false,
  size = "lg",
  className,
  label = "Play on Roblox",
}: {
  href: string | null;
  publicJoin?: boolean;
  size?: "md" | "lg";
  className?: string;
  label?: string;
}) {
  const playClass = cn(
    "play-cta border-0 font-extrabold tracking-wide text-[#052013] shadow-[0_10px_0_#0a7a3e,0_18px_40px_rgba(0,176,111,0.35)] hover:bg-[#12d67a] hover:text-[#052013]",
    size === "lg" ? "h-14 rounded-2xl px-7 text-lg" : "h-11 rounded-xl px-5 text-base",
    className,
  );

  if (!href) {
    return (
      <Button
        disabled
        size="lg"
        className={cn(
          "h-12 rounded-2xl border-0 bg-white/10 px-6 text-base font-bold text-white/70",
          className,
        )}
      >
        Coming soon
      </Button>
    );
  }

  if (publicJoin) {
    return (
      <Button asChild size="lg" className={playClass}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <PlayTriangle className={size === "lg" ? "size-6" : "size-5"} />
          {label}
        </a>
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className={playClass}>
          <PlayTriangle className={size === "lg" ? "size-6" : "size-5"} />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-[#10182c] text-white ring-1 ring-white/15 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-extrabold text-white">
            Roblox is hiding this game
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-white/70">
            Pet Orbits is a <span className="font-bold text-white">Private</span> Ringnest
            group experience. Roblox shows a 404 on{" "}
            <span className="font-mono text-cyan-200">/games/{PET_ORBITS_PLACE_ID}</span> until
            the owner sets it Public. That is not a broken link on this site.
          </DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-white/80">
          <li>Play it in Roblox Studio on the Ringnest group tab.</li>
          <li>When account standing is green, File, Publish to Roblox (no As).</li>
          <li>Creator Dashboard, set the experience Public. This button will then open the game.</li>
        </ol>
        <DialogFooter className="border-white/10 bg-transparent sm:justify-start">
          <Button asChild className="rounded-xl bg-[#00e38c] font-extrabold text-[#052013] hover:bg-[#12d67a]">
            <a href={PET_ORBITS_DASHBOARD} target="_blank" rel="noopener noreferrer">
              Open Creator Dashboard
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-white/20 bg-white/5 font-bold text-white hover:bg-white/10 hover:text-white"
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              Try Roblox page
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

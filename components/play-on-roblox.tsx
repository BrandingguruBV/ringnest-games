"use client";

import { Button } from "@/components/ui/button";
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
  size = "lg",
  className,
  label = "Play on Roblox",
}: {
  href: string | null;
  size?: "md" | "lg";
  className?: string;
  label?: string;
}) {
  const playClass = cn(
    "play-cta border-0 font-extrabold tracking-wide text-[#052013] shadow-[0_10px_0_#0a7a3e,0_18px_40px_rgba(0,176,111,0.35)] hover:bg-[#12d67a] hover:text-[#052013]",
    size === "lg" ? "h-14 rounded-2xl px-7 text-lg" : "h-11 rounded-xl px-5 text-base",
    className,
  );
  const name = label.trim() || "Play on Roblox";

  if (!href) {
    return (
      <Button
        type="button"
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

  return (
    <Button asChild size="lg" className={playClass}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
        <PlayTriangle className={size === "lg" ? "size-6" : "size-5"} />
        {label}
      </a>
    </Button>
  );
}

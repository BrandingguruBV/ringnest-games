"use client";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function DiscordMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M19.27 5.33A17.4 17.4 0 0 0 14.89 4c-.2.36-.43.85-.59 1.24a16.1 16.1 0 0 0-4.6 0A10.6 10.6 0 0 0 9.1 4a17.3 17.3 0 0 0-4.4 1.34C2.18 9.05 1.49 12.66 1.84 16.22A17.5 17.5 0 0 0 7.1 18.9c.37-.5.7-1.03 1-1.58a11.3 11.3 0 0 1-1.57-.76c.13-.1.26-.2.38-.3a12.3 12.3 0 0 0 10.18 0c.13.1.25.2.38.3-.5.3-1.03.56-1.58.76.3.55.63 1.08 1 1.58a17.4 17.4 0 0 0 5.27-2.68c.43-4.07-.73-7.65-2.94-10.89ZM8.7 14.4c-.83 0-1.5-.78-1.5-1.74s.66-1.74 1.5-1.74 1.52.78 1.5 1.74c0 .96-.66 1.74-1.5 1.74Zm6.6 0c-.83 0-1.5-.78-1.5-1.74s.66-1.74 1.5-1.74 1.52.78 1.5 1.74c0 .96-.66 1.74-1.5 1.74Z"
      />
    </svg>
  );
}

export function JoinDiscord({
  size = "lg",
  className,
  label = "Open Discord",
}: {
  size?: "md" | "lg";
  className?: string;
  label?: string;
}) {
  return (
    <Button
      asChild
      size="lg"
      className={cn(
        "border-0 bg-[#5865F2] font-extrabold tracking-wide text-white shadow-[0_10px_0_#3c45c4] hover:bg-[#6b76f4] hover:text-white",
        size === "lg" ? "h-14 rounded-2xl px-7 text-lg" : "h-11 rounded-xl px-5 text-base",
        className,
      )}
    >
      <a
        href={site.discord.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label}: ${site.discord.name}`}
      >
        <DiscordMark className={size === "lg" ? "size-6" : "size-5"} />
        {label}
      </a>
    </Button>
  );
}

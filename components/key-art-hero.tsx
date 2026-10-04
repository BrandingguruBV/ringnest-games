import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KeyArtHeroProps = {
  src: string;
  alt: string;
  priority?: boolean;
  children: ReactNode;
  className?: string;
  /** Taller key art on small screens when the page wants more image presence. */
  imageClassName?: string;
};

/**
 * Mobile-safe key-art block: full-bleed image on top, solid navy copy band below.
 * Avoids text-on-image clipping that absolute overlays cause on short viewports.
 */
export function KeyArtHero({
  src,
  alt,
  priority = false,
  children,
  className,
  imageClassName,
}: KeyArtHeroProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] ring-1 ring-white/15 sm:rounded-[2rem]",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] min-h-[180px] sm:aspect-[16/9] sm:min-h-[300px]",
          imageClassName,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          unoptimized
          // Bias upward so the baked-in bottom marketing strip is cropped out.
          className="object-cover object-[center_18%] sm:object-center"
          sizes="100vw"
        />
        {/* Hide the tiny baked-in banner strip on phones — HTML copy carries the pitch. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-[#0b1428] sm:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0b1428] via-[#0b1428]/55 to-transparent max-sm:h-[38%]"
        />
      </div>
      <div className="bg-[#0b1428] px-5 py-5 sm:px-8 sm:py-8 md:px-10">{children}</div>
    </div>
  );
}

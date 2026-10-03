import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-[#050814]/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/mark.jpg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full ring-2 ring-lime-300/60"
          />
          <div>
            <p className="font-heading text-sm font-extrabold tracking-[0.2em] text-white">
              RINGNEST
            </p>
            <p className="text-xs text-white/55">{site.companyLegal}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-white/70">
          <Link href="/#games" className="hover:text-white">
            Games
          </Link>
          <Link href="/games" className="hover:text-white">
            Catalog
          </Link>
          <Link href="/games/pet-orbits" className="hover:text-white">
            Pet Orbits
          </Link>
          <a
            href="https://www.roblox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Roblox
          </a>
        </div>
      </div>
    </footer>
  );
}

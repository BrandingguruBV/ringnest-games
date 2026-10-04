import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-[13px] font-extrabold tracking-[0.2em] text-cyan-300 uppercase">Lost</p>
      <h1 className="font-heading mt-3 text-4xl font-extrabold text-white">Page not found</h1>
      <p className="mt-3 text-white/88">
        Head back to Games or the pet Catalog.
      </p>
      <Link
        href="/games"
        className="mt-6 inline-flex h-12 items-center rounded-2xl bg-[#00e38c] px-5 font-extrabold text-[#052013]"
      >
        Browse games
      </Link>
    </div>
  );
}

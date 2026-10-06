export function isNestClubHash(hash: string) {
  return hash === "#shop" || hash === "#nest-club";
}

export type SiteNavLink = {
  href: string;
  label: string;
  hint?: string;
  group?: string;
  match: (pathname: string, hash: string) => boolean;
};

/**
 * Information architecture (one live game):
 * Play the game → browse pets → talk to players → studio.
 * Nest Club and the Games index are shortcuts, not top-level pages.
 */
export const desktopNav: SiteNavLink[] = [
  {
    href: "/games/pet-orbits",
    label: "Pet Orbits",
    match: (p, h) => p.startsWith("/games/") && !isNestClubHash(h),
  },
  {
    href: "/catalog",
    label: "Catalog",
    match: (p) => p.startsWith("/catalog"),
  },
  {
    href: "/discord",
    label: "Discord",
    match: (p) => p.startsWith("/discord"),
  },
  {
    href: "/about",
    label: "About",
    match: (p) => p.startsWith("/about"),
  },
];

export const mobileMoreGroups = ["Community", "In the game", "Studio"] as const;

/** Destinations that are not already a bottom-tab. */
export const mobileMoreLinks: SiteNavLink[] = [
  {
    href: "/discord",
    label: "Discord",
    hint: "Updates, bugs, crews, clips",
    group: "Community",
    match: (p) => p.startsWith("/discord"),
  },
  {
    href: "/games/pet-orbits#shop",
    label: "Nest Club",
    hint: "199R / month on Roblox",
    group: "In the game",
    match: (_p, h) => isNestClubHash(h),
  },
  {
    href: "/games",
    label: "All games",
    hint: "Every Ringnest title",
    group: "In the game",
    match: (p, h) => p === "/games" && !isNestClubHash(h),
  },
  {
    href: "/about",
    label: "About",
    hint: "Ringnest and Brandingguru BV",
    group: "Studio",
    match: (p) => p.startsWith("/about"),
  },
];

export const footerNav: SiteNavLink[] = [
  {
    href: "/games/pet-orbits",
    label: "Pet Orbits",
    match: (p, h) => p.startsWith("/games/") && !isNestClubHash(h),
  },
  {
    href: "/catalog",
    label: "Catalog",
    match: (p) => p.startsWith("/catalog"),
  },
  {
    href: "/discord",
    label: "Discord",
    match: (p) => p.startsWith("/discord"),
  },
  {
    href: "/games/pet-orbits#shop",
    label: "Nest Club",
    match: (_p, h) => isNestClubHash(h),
  },
  {
    href: "/games",
    label: "All games",
    match: (p, h) => p === "/games" && !isNestClubHash(h),
  },
  {
    href: "/about",
    label: "About",
    match: (p) => p.startsWith("/about"),
  },
];

export function isMobileMoreActive(pathname: string, hash: string) {
  return mobileMoreLinks.some((link) => link.match(pathname, hash));
}

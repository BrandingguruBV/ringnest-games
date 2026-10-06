export function isNestClubHash(hash: string) {
  return hash === "#shop" || hash === "#nest-club";
}

export type SiteNavLink = {
  href: string;
  label: string;
  hint?: string;
  match: (pathname: string, hash: string) => boolean;
};

/** Desktop header links. */
export const desktopNav: SiteNavLink[] = [
  {
    href: "/games",
    label: "Games",
    match: (p, h) => p === "/games" && !isNestClubHash(h),
  },
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
    href: "/games/pet-orbits#shop",
    label: "Nest Club",
    match: (_p, h) => isNestClubHash(h),
  },
  {
    href: "/about",
    label: "About",
    match: (p) => p.startsWith("/about"),
  },
  {
    href: "/discord",
    label: "Discord",
    match: (p) => p.startsWith("/discord"),
  },
];

/** Extra destinations that live in the mobile More sheet. */
export const mobileMoreLinks: SiteNavLink[] = [
  {
    href: "/games",
    label: "Games",
    hint: "Every Ringnest title",
    match: (p, h) => p === "/games" && !isNestClubHash(h),
  },
  {
    href: "/games/pet-orbits#shop",
    label: "Nest Club",
    hint: "199R / month on Roblox",
    match: (_p, h) => isNestClubHash(h),
  },
  {
    href: "/about",
    label: "About",
    hint: "Ringnest and Brandingguru BV",
    match: (p) => p.startsWith("/about"),
  },
  {
    href: "/discord",
    label: "Discord",
    hint: "Updates, bugs, crews, clips",
    match: (p) => p.startsWith("/discord"),
  },
];

export function isMobileMoreActive(pathname: string, hash: string) {
  return mobileMoreLinks.some((link) => link.match(pathname, hash));
}

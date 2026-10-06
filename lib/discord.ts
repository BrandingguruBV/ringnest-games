export const discordChannels = [
  {
    hash: "#start-here",
    name: "start-here",
    who: "Everyone",
    purpose: "How this Discord works. Ping buttons for updates, events, and codes.",
    find: "Finish Server Guide here. Orbiter is what lets you talk in player rooms.",
  },
  {
    hash: "#announcements",
    name: "announcements",
    who: "Studio only",
    purpose: "Official news. New features, downtime, and when Pet Orbits updates.",
    find: "Read here first. Do not chat in this channel.",
  },
  {
    hash: "#faq",
    name: "faq",
    who: "Everyone",
    purpose: "Short answers: codes, Nest Club, tickets, fake staff DMs.",
    find: "Read this before opening a ticket.",
  },
  {
    hash: "#support-desk",
    name: "support-desk",
    who: "Anyone playing",
    purpose: "Tap Bug or Help. A private ticket opens for you and Ringnest staff.",
    find: "Use this instead of DMs. Staff never DM you first about Robux.",
  },
  {
    hash: "#looking-for-group",
    name: "looking-for-group",
    who: "Orbiters",
    purpose: "Who is in the arena. Crews, private servers, Nest Club runs.",
    find: "Say platform and what you want to do.",
  },
  {
    hash: "#clips",
    name: "clips",
    who: "Orbiters",
    purpose: "Hatches, crown steals, and nest runs.",
    find: "Your clips, not someone else's.",
  },
  {
    hash: "#chat",
    name: "chat",
    who: "Orbiters",
    purpose: "Day-to-day Pet Orbits talk.",
    find: "Keep bugs in support-desk. Keep clips in clips.",
  },
] as const;

export const discordUses = [
  {
    title: "Hear about updates",
    body: "Announcements, patch notes, and codes. Pick ping roles so you do not miss a drop.",
  },
  {
    title: "Get help without DMs",
    body: "Support desk opens a private ticket with Ringnest. That is the official way to report a bug.",
  },
  {
    title: "Find people to play",
    body: "Looking-for-group is for crews and private servers. Nests-and-club is for Nest Club.",
  },
  {
    title: "Share a clip",
    body: "Clips is for hatches, crashes, and nest runs you want other players to see.",
  },
] as const;

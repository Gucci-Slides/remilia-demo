// ─────────────────────────────────────────────────────────────────
// REMILIA LINK GRAPH
// Single source of truth for all outbound links from remilia.org
// ─────────────────────────────────────────────────────────────────

export type RemiliaLink = {
  label: string;
  href: string;
  category: string;
  note?: string;
};

export const LINK_CATEGORIES = [
  'INTRODUCING',
  'ENTERPRISE SOLUTIONS',
  'GLOBAL NETWORK',
  'DIGITAL INNOVATION',
  'CORPORATE LITERATURE',
  'AS SEEN IN',
  'CONTACT',
] as const;

export type LinkCategory = (typeof LINK_CATEGORIES)[number];

export const REMILIA_LINKS: RemiliaLink[] = [
  // ─────────────────────────────────────────────────────────────────
  // INTRODUCING
  // ─────────────────────────────────────────────────────────────────
  {
    label: 'CULT, INC.',
    href: 'https://cult.inc',
    category: 'INTRODUCING',
  },

  // ─────────────────────────────────────────────────────────────────
  // ENTERPRISE SOLUTIONS
  // ─────────────────────────────────────────────────────────────────
  {
    label: 'Remilia Quarterly',
    href: 'https://quarterly.remilia.org',
    category: 'ENTERPRISE SOLUTIONS',
  },
  {
    label: '33reisen',
    href: '#',
    category: 'ENTERPRISE SOLUTIONS',
    note: 'No public URL found',
  },
  {
    label: 'YAYO Supply',
    href: 'https://yayo.supply',
    category: 'ENTERPRISE SOLUTIONS',
  },
  {
    label: 'Remilia Agency',
    href: 'https://remilia.agency',
    category: 'ENTERPRISE SOLUTIONS',
  },
  {
    label: 'Remilia Virtual',
    href: 'https://remilia.agency',
    category: 'ENTERPRISE SOLUTIONS',
  },
  {
    label: 'Remilia Records',
    href: 'https://remiliacorporation.bandcamp.com',
    category: 'ENTERPRISE SOLUTIONS',
  },

  // ─────────────────────────────────────────────────────────────────
  // GLOBAL NETWORK
  // ─────────────────────────────────────────────────────────────────
  {
    label: 'Gift Shop',
    href: 'https://store.remilia.org',
    category: 'GLOBAL NETWORK',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/remaboremilia',
    category: 'GLOBAL NETWORK',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/remaboremilia',
    category: 'GLOBAL NETWORK',
  },
  {
    label: 'Soundcloud',
    href: 'https://soundcloud.com/remiliacorp',
    category: 'GLOBAL NETWORK',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/milady',
    category: 'GLOBAL NETWORK',
  },

  // ─────────────────────────────────────────────────────────────────
  // DIGITAL INNOVATION
  // ─────────────────────────────────────────────────────────────────
  {
    label: 'Milady Maker',
    href: 'https://miladymaker.net',
    category: 'DIGITAL INNOVATION',
  },
  {
    label: 'Remilio Babies',
    href: 'https://remilio.org',
    category: 'DIGITAL INNOVATION',
  },
  {
    label: 'FRUiTS MiLADY',
    href: 'https://fruits.remilia.org',
    category: 'DIGITAL INNOVATION',
  },
  {
    label: 'Kagami Academy',
    href: 'https://twitter.com/KagamiAcademy',
    category: 'DIGITAL INNOVATION',
    note: 'Twitter placeholder',
  },
  {
    label: 'Bonkler',
    href: 'https://bonkler.remilia.org',
    category: 'DIGITAL INNOVATION',
  },
  {
    label: 'Milady 3D Fumo',
    href: 'https://fumo.remilia.org',
    category: 'DIGITAL INNOVATION',
  },
  {
    label: 'Banners',
    href: 'https://blur.io/eth/collection/miladybanners',
    category: 'DIGITAL INNOVATION',
  },

  // ─────────────────────────────────────────────────────────────────
  // CORPORATE LITERATURE
  // ─────────────────────────────────────────────────────────────────
  {
    label: 'I Long for Network Spirituality (2021)',
    href: 'https://ilongfornetworkspirituality.net',
    category: 'CORPORATE LITERATURE',
  },
  {
    label: 'A New Net Art Manifesto (2021)',
    href: 'https://goldenlight.mirror.xyz',
    category: 'CORPORATE LITERATURE',
  },
  {
    label: 'Things Desired: An Egoless Online (2022)',
    href: 'https://goldenlight.mirror.xyz',
    category: 'CORPORATE LITERATURE',
  },
  {
    label: 'Network Spirituality: Collected Commentaries (2022)',
    href: 'https://goldenlight.mirror.xyz',
    category: 'CORPORATE LITERATURE',
  },
  {
    label: 'The Cancelled Will Inherit The Earth (2023)',
    href: 'https://goldenlight.mirror.xyz',
    category: 'CORPORATE LITERATURE',
  },

  // ─────────────────────────────────────────────────────────────────
  // AS SEEN IN
  // ─────────────────────────────────────────────────────────────────
  {
    label: 'Wired',
    href: 'https://www.wired.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'Bloomberg Law',
    href: 'https://news.bloomberglaw.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'The Point Magazine',
    href: 'https://thepointmag.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'VISLA',
    href: 'https://visla.kr',
    category: 'AS SEEN IN',
  },
  {
    label: 'Dazed',
    href: 'https://www.dazeddigital.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'Fast Company',
    href: 'https://www.fastcompany.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'GQ',
    href: 'https://www.gq.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'Public Space',
    href: 'https://publicspace.studio',
    category: 'AS SEEN IN',
  },
  {
    label: 'Reddit',
    href: 'https://www.reddit.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'Time Out',
    href: 'https://www.timeout.com',
    category: 'AS SEEN IN',
  },
  {
    label: 'Palladium Magazine',
    href: 'https://www.palladiummag.com',
    category: 'AS SEEN IN',
  },

  // ─────────────────────────────────────────────────────────────────
  // CONTACT
  // ─────────────────────────────────────────────────────────────────
  {
    label: 'Email',
    href: 'mailto:corporate@remilia.org',
    category: 'CONTACT',
  },
];

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

export function getLinksByCategory(category: string): RemiliaLink[] {
  return REMILIA_LINKS.filter((link) => link.category === category);
}

export function searchLinks(query: string): RemiliaLink[] {
  const q = query.toLowerCase().trim();
  if (!q) return REMILIA_LINKS;
  return REMILIA_LINKS.filter(
    (link) =>
      link.label.toLowerCase().includes(q) ||
      link.category.toLowerCase().includes(q)
  );
}

export function getCategories(): string[] {
  return [...LINK_CATEGORIES];
}

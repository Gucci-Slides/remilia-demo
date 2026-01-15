// ═══════════════════════════════════════════════════════════════
// GALLERY SPREAD DEFINITIONS
// Editorial layout sequence for Nuevo Tokyo–inspired gallery
// ═══════════════════════════════════════════════════════════════

export interface GalleryImage {
  src: string;
  alt: string;
  subject?: string;
  index?: string;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
}

export interface GallerySpread {
  id: string;
  layout: 'single' | 'double' | 'triple' | 'staggered';
  images: GalleryImage[];
}

export interface GalleryInterstitial {
  id: string;
  type: 'spacer' | 'text' | 'rule';
  text?: string;
}

export type GalleryItem = 
  | { kind: 'spread'; data: GallerySpread }
  | { kind: 'interstitial'; data: GalleryInterstitial };

// ═══════════════════════════════════════════════════════════════
// SAMPLE GALLERY SEQUENCE
// ═══════════════════════════════════════════════════════════════

export const GALLERY_SEQUENCE: GalleryItem[] = [
  // Opening spread — single dominant image
  {
    kind: 'spread',
    data: {
      id: 'spread-01',
      layout: 'single',
      images: [
        {
          src: '',
          alt: 'Subject 001',
          subject: 'NuevoTokyo',
          index: 'Archive / Active',
          aspectRatio: 'portrait',
        },
      ],
    },
  },

  { kind: 'interstitial', data: { id: 'int-01', type: 'spacer' } },

  // Triple spread — rhythm
  {
    kind: 'spread',
    data: {
      id: 'spread-02',
      layout: 'triple',
      images: [
        {
          src: '',
          alt: 'Subject 002',
          aspectRatio: 'portrait',
        },
        {
          src: '',
          alt: 'Subject 003',
          subject: 'Maasa',
          aspectRatio: 'portrait',
        },
        {
          src: '',
          alt: 'Subject 004',
          subject: 'Yusuke Okawa',
          aspectRatio: 'portrait',
        },
      ],
    },
  },

  { kind: 'interstitial', data: { id: 'int-02', type: 'rule' } },

  // Staggered pair
  {
    kind: 'spread',
    data: {
      id: 'spread-03',
      layout: 'staggered',
      images: [
        {
          src: '',
          alt: 'Subject 005',
          aspectRatio: 'portrait',
        },
        {
          src: '',
          alt: 'Subject 006',
          subject: 'Untitled',
          index: '2024',
          aspectRatio: 'portrait',
        },
      ],
    },
  },

  { kind: 'interstitial', data: { id: 'int-03', type: 'text', text: 'Archive / Ongoing' } },

  // Double spread
  {
    kind: 'spread',
    data: {
      id: 'spread-04',
      layout: 'double',
      images: [
        {
          src: '',
          alt: 'Subject 007',
          aspectRatio: 'portrait',
        },
        {
          src: '',
          alt: 'Subject 008',
          subject: 'Study',
          aspectRatio: 'square',
        },
      ],
    },
  },

  { kind: 'interstitial', data: { id: 'int-04', type: 'spacer' } },

  // Single feature
  {
    kind: 'spread',
    data: {
      id: 'spread-05',
      layout: 'single',
      images: [
        {
          src: '',
          alt: 'Subject 009',
          subject: 'Closing',
          index: 'Archive / Complete',
          aspectRatio: 'portrait',
        },
      ],
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// LAYOUT SEQUENCE GENERATOR
// ═══════════════════════════════════════════════════════════════

const LAYOUT_PATTERN: Array<'single' | 'double' | 'triple' | 'staggered'> = [
  'single',
  'triple',
  'staggered',
  'double',
  'single',
  'staggered',
  'triple',
  'double',
];

export function generateGallerySequence(images: GalleryImage[]): GalleryItem[] {
  const items: GalleryItem[] = [];
  let imageIndex = 0;
  let spreadIndex = 0;

  while (imageIndex < images.length) {
    const layout = LAYOUT_PATTERN[spreadIndex % LAYOUT_PATTERN.length];
    
    // Determine how many images this layout needs
    const imageCount = layout === 'triple' ? 3 : layout === 'single' ? 1 : 2;
    
    // Get available images
    const spreadImages = images.slice(imageIndex, imageIndex + imageCount);
    
    if (spreadImages.length === 0) break;

    // Add spread
    items.push({
      kind: 'spread',
      data: {
        id: `spread-${spreadIndex + 1}`,
        layout: spreadImages.length === 1 ? 'single' : layout,
        images: spreadImages,
      },
    });

    // Add interstitial after some spreads
    if (spreadIndex % 2 === 0) {
      const intType = spreadIndex % 4 === 0 ? 'spacer' : 'rule';
      items.push({
        kind: 'interstitial',
        data: {
          id: `int-${spreadIndex + 1}`,
          type: intType,
        },
      });
    }

    imageIndex += spreadImages.length;
    spreadIndex++;
  }

  return items;
}

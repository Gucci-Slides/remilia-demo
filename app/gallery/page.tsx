/**
 * ═══════════════════════════════════════════════════════════════
 * NUEVO TOKYO–INSPIRED EDITORIAL GALLERY
 * ═══════════════════════════════════════════════════════════════
 * 
 * Design Philosophy:
 * - This is not a marketplace, feed, or NFT grid
 * - The gallery behaves like a photography monograph
 * - Images are shown, not browsed
 * - Navigation is secondary to visual presence
 * 
 * Layout:
 * - 2–3 vertical images per "spread"
 * - Uneven rhythm (not symmetrical)
 * - Generous margins (10–15vw side gutters)
 * - White/off-white background with subtle paper texture
 * 
 * Image Treatment:
 * - Original aspect ratios maintained
 * - No rounded corners, shadows, or hover zooms
 * - Images feel printed, not digital
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import { GalleryShell } from '@/components/gallery/GalleryShell';
import { Spread } from '@/components/gallery/Spread';
import { Interstitial } from '@/components/gallery/Interstitial';
import { GALLERY_SEQUENCE } from '@/lib/gallery/spreads';

export default function GalleryPage() {
  return (
    <GalleryShell>
      {/* Opening spacer */}
      <div className="h-[25vh]" />

      {/* Gallery sequence */}
      {GALLERY_SEQUENCE.map((item, index) => {
        if (item.kind === 'spread') {
          return (
            <Spread
              key={item.data.id}
              images={item.data.images}
              layout={item.data.layout}
              priority={index < 2}
            />
          );
        }

        if (item.kind === 'interstitial') {
          return (
            <Interstitial
              key={item.data.id}
              type={item.data.type}
              text={item.data.text}
            />
          );
        }

        return null;
      })}

      {/* Closing */}
      <footer className="h-[40vh] flex items-end justify-center pb-12">
        <div className="text-center">
          <div className="w-8 h-px bg-neutral-200 mx-auto mb-6" />
          <p className="font-light text-[9px] tracking-[0.25em] text-neutral-300 uppercase">
            End of Archive
          </p>
        </div>
      </footer>
    </GalleryShell>
  );
}

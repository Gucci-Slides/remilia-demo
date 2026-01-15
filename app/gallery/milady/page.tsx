/**
 * ═══════════════════════════════════════════════════════════════
 * MILADY GALLERY — NUEVO TOKYO TREATMENT
 * ═══════════════════════════════════════════════════════════════
 * 
 * Fetches Milady NFT data and presents it in an editorial gallery
 * format inspired by Nuevo Tokyo photography monographs.
 * 
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { MiladyNFT, fetchMiladyCollection } from '@/lib/milady';
import { GalleryShell } from '@/components/gallery/GalleryShell';
import { Spread } from '@/components/gallery/Spread';
import { Interstitial } from '@/components/gallery/Interstitial';
import { GalleryImage, generateGallerySequence } from '@/lib/gallery/spreads';

export default function MiladyGalleryPage() {
  const [nfts, setNfts] = useState<MiladyNFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMiladyCollection(20);
        setNfts(data.nfts);
      } catch {
        // Silent fail — show empty gallery
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Convert NFTs to gallery images
  const galleryImages: GalleryImage[] = useMemo(() => {
    return nfts.map((nft, i) => ({
      src: nft.image || '',
      alt: nft.name,
      subject: `Milady #${nft.identifier}`,
      index: `Subject ${String(i + 1).padStart(3, '0')}`,
      aspectRatio: 'portrait' as const,
    }));
  }, [nfts]);

  // Generate editorial sequence
  const sequence = useMemo(() => {
    return generateGallerySequence(galleryImages);
  }, [galleryImages]);

  if (loading) {
    return (
      <GalleryShell>
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-light text-[10px] tracking-[0.2em] text-neutral-300 uppercase">
            Loading Archive
          </p>
        </div>
      </GalleryShell>
    );
  }

  return (
    <GalleryShell>
      {/* Opening */}
      <div className="h-[30vh] flex items-end justify-center pb-8">
        <div className="text-center">
          <h1 className="font-light text-[12px] tracking-[0.3em] text-neutral-400 uppercase mb-2">
            Milady
          </h1>
          <p className="font-light text-[9px] tracking-[0.15em] text-neutral-300">
            {nfts.length} Subjects
          </p>
        </div>
      </div>

      <Interstitial type="rule" />

      {/* Gallery sequence */}
      {sequence.map((item, index) => {
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

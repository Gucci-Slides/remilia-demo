'use client';

import { useState, useEffect } from 'react';
import { MiladyNFT, fetchMiladyCollection, fetchMiladyById } from '@/lib/milady';

interface MiladyGalleryProps {
  featured?: string[]; // Token IDs to feature
  limit?: number;
}

export function MiladyGallery({ featured, limit = 12 }: MiladyGalleryProps) {
  const [nfts, setNfts] = useState<MiladyNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (featured && featured.length > 0) {
          // Fetch specific NFTs by ID
          const results = await Promise.allSettled(
            featured.map(id => fetchMiladyById(id))
          );
          
          const loaded = results
            .filter((r): r is PromiseFulfilledResult<{ nft: MiladyNFT }> => 
              r.status === 'fulfilled'
            )
            .map(r => r.value.nft);
          
          setNfts(loaded);
        } else {
          // Fetch collection
          const data = await fetchMiladyCollection(limit);
          setNfts(data.nfts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load NFTs');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [featured, limit]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#999]">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#999]">
          {error}
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#999]">
          No NFTs found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {nfts.map((nft, index) => (
        <MiladyLook key={nft.id} nft={nft} align={index % 2 === 0 ? 'left' : 'right'} />
      ))}
    </div>
  );
}

interface MiladyLookProps {
  nft: MiladyNFT;
  align?: 'left' | 'right';
}

function MiladyLook({ nft, align = 'left' }: MiladyLookProps) {
  return (
    <article className="relative">
      {/* Image */}
      <div className={align === 'right' ? 'md:ml-[20%]' : 'md:mr-[20%]'}>
        <div className="relative w-full aspect-square md:aspect-[4/5] bg-[#1a1a1a]">
          {nft.image && (
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="px-8 md:px-16 lg:px-24 mt-8 md:mt-12">
        <div className={`max-w-md ${align === 'right' ? 'ml-auto text-right' : ''}`}>
          <h3 className="font-display text-[24px] md:text-[32px] leading-[0.95] tracking-[-0.02em] mb-4">
            {nft.name}
          </h3>
          
          <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#666] space-y-1">
            {nft.drip_grade && <div>Drip Grade: {nft.drip_grade}</div>}
            {nft.core && <div>Core: {nft.core}</div>}
            {nft.background && <div>Background: {nft.background}</div>}
          </div>

          <div className="mt-6">
            <a
              href={nft.opensea_url}
              className="editorial-link text-[9px] tracking-[0.1em] uppercase"
              target="_blank"
              rel="noopener noreferrer"
            >
              → View on OpenSea
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// Single featured NFT display
interface MiladyFeaturedProps {
  tokenId: string;
}

export function MiladyFeatured({ tokenId }: MiladyFeaturedProps) {
  const [nft, setNft] = useState<MiladyNFT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMiladyById(tokenId);
        setNft(data.nft);
      } catch (err) {
        console.error('Failed to load NFT:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tokenId]);

  if (loading || !nft) {
    return (
      <div className="w-full aspect-square bg-[#1a1a1a] flex items-center justify-center">
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/30">
          {loading ? 'Loading...' : 'Failed to load'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={nft.image}
        alt={nft.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.1em] uppercase text-white/60">
        {nft.name}
      </div>
    </div>
  );
}

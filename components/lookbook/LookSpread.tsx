'use client';

import Image from 'next/image';
import { MiladyNFT } from '@/lib/milady';
import {
  SpreadLayout,
  selectDisplayTraits,
  formatTokenName,
  formatTokenId,
} from '@/lib/lookbook';

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

interface LookSpreadProps {
  nft: MiladyNFT;
  index: number;
  layout: SpreadLayout;
}

export function LookSpread({ nft, index, layout }: LookSpreadProps) {
  switch (layout) {
    case 'OFFSET':
      return <OffsetLook nft={nft} index={index} />;
    case 'TIGHT':
      return <TightLook nft={nft} index={index} />;
    case 'SINGLE':
    default:
      return <SingleLook nft={nft} index={index} />;
  }
}

// ═══════════════════════════════════════════════════════════════
// SINGLE LOOK — Standard entry
// ═══════════════════════════════════════════════════════════════

function SingleLook({ nft, index }: { nft: MiladyNFT; index: number }) {
  const traits = selectDisplayTraits(nft, 3);
  const name = formatTokenName(nft);
  const id = formatTokenId(nft);

  return (
    <article className="min-h-[62vh] py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Image */}
        <div className="relative aspect-square md:aspect-[4/5] bg-black overflow-hidden">
          <TokenImage nft={nft} priority={index <= 2} />
        </div>

        {/* Label block */}
        <div className="mt-3 flex justify-between items-start">
          <div>
            <div className="font-sans text-[13px] font-medium tracking-tight text-black">
              {name}
            </div>
            <div className="font-mono text-[10px] text-black/50 mt-0.5">
              {traits.map(t => `${t.label}: ${t.value}`).join(' / ')}
            </div>
          </div>
          <div className="font-mono text-[10px] text-black/40">
            {id}
          </div>
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIGHT LOOK — Compressed, closer stacking
// ═══════════════════════════════════════════════════════════════

function TightLook({ nft, index }: { nft: MiladyNFT; index: number }) {
  const name = formatTokenName(nft);
  const id = formatTokenId(nft);

  return (
    <article className="min-h-[55vh] py-4 md:py-5 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Image — slightly smaller */}
        <div className="relative aspect-[3/4] bg-black overflow-hidden">
          <TokenImage nft={nft} priority={index <= 2} />
        </div>

        {/* Minimal label */}
        <div className="mt-2 flex justify-between items-baseline">
          <div className="font-sans text-[12px] font-medium text-black">
            {name}
          </div>
          <div className="font-mono text-[9px] text-black/35">
            {id}
          </div>
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════
// OFFSET LOOK — Asymmetric placement
// ═══════════════════════════════════════════════════════════════

function OffsetLook({ nft, index }: { nft: MiladyNFT; index: number }) {
  const traits = selectDisplayTraits(nft, 3);
  const name = formatTokenName(nft);
  const id = formatTokenId(nft);
  const isLeft = index % 2 === 0;

  return (
    <article className="min-h-[65vh] py-6 md:py-8 px-4 md:px-6">
      <div className={`max-w-4xl mx-auto flex flex-col md:flex-row md:items-end md:gap-8 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
        {/* Image */}
        <div className="flex-1 max-w-xl">
          <div className="relative aspect-square bg-black overflow-hidden">
            <TokenImage nft={nft} priority={index <= 2} />
          </div>
        </div>

        {/* Label block */}
        <div className={`mt-4 md:mt-0 md:w-48 ${isLeft ? 'md:text-left' : 'md:text-right'}`}>
          <div className="font-sans text-[14px] font-medium tracking-tight text-black">
            {name}
          </div>
          <div className="font-mono text-[9px] text-black/50 mt-1 space-y-0.5">
            {traits.map((t, i) => (
              <div key={i}>{t.label}: {t.value}</div>
            ))}
          </div>
          <div className="font-mono text-[9px] text-black/30 mt-2">
            {id}
          </div>
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════
// GROUP STRIP — Multiple Miladies in a row
// ═══════════════════════════════════════════════════════════════

interface GroupStripProps {
  nfts: MiladyNFT[];
}

export function GroupStrip({ nfts }: GroupStripProps) {
  if (nfts.length === 0) return null;

  return (
    <article className="py-8 md:py-10 px-4 md:px-6 bg-black">
      {/* Strip */}
      <div className="flex gap-1 md:gap-2 overflow-x-auto">
        {nfts.map((nft) => (
          <div key={nft.id} className="flex-shrink-0 w-[140px] md:w-[180px] lg:w-[220px]">
            <div className="relative aspect-square bg-neutral-900 overflow-hidden">
              <TokenImage nft={nft} />
            </div>
            <div className="mt-1.5 font-mono text-[8px] text-white/50 truncate">
              #{nft.id}
            </div>
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="mt-4 font-mono text-[9px] text-white/30 tracking-wider">
        LINEUP / {nfts.length} UNITS
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════
// INTERRUPTION — Aggressive typographic break
// ═══════════════════════════════════════════════════════════════

interface InterruptionProps {
  text: string;
}

export function Interruption({ text }: InterruptionProps) {
  return (
    <article className="py-12 md:py-16 px-4 md:px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="font-sans text-[48px] md:text-[72px] lg:text-[96px] font-bold tracking-tighter leading-[0.85] text-white">
          {text}
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOKEN IMAGE
// ═══════════════════════════════════════════════════════════════

interface TokenImageProps {
  nft: MiladyNFT;
  priority?: boolean;
}

function TokenImage({ nft, priority = false }: TokenImageProps) {
  if (!nft.image) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
        <div className="font-mono text-[9px] text-white/20">
          NO IMAGE
        </div>
      </div>
    );
  }

  return (
    <Image
      src={nft.image}
      alt={nft.name || `Milady #${nft.id}`}
      fill
      sizes="(max-width: 768px) 100vw, 600px"
      className="object-cover object-[50%_25%]"
      priority={priority}
    />
  );
}

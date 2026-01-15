'use client';

import Image from 'next/image';
import { MiladyClassification } from '@/lib/milady/drip';
import { getExpertBlock } from '@/lib/milady/layoutRhythm';

// ═══════════════════════════════════════════════════════════════
// DOCTRINE QUOTE — Inline italic text block
// ═══════════════════════════════════════════════════════════════

interface DoctrineQuoteProps {
  text: string;
}

export function DoctrineQuote({ text }: DoctrineQuoteProps) {
  return (
    <div className="bg-[#f5f2ea] p-3 flex items-center justify-center h-full min-h-[80px]">
      <p className="font-serif text-[13px] md:text-[14px] italic text-black/60 leading-snug text-center">
        — {text}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHIC SPREAD — Large bold text
// ═══════════════════════════════════════════════════════════════

interface TypographicSpreadProps {
  text: string;
  index: number;
}

export function TypographicSpread({ text, index }: TypographicSpreadProps) {
  return (
    <div className="bg-black p-4 flex flex-col justify-between h-full min-h-[200px]">
      <div className="flex-1 flex items-center justify-center">
        <h2 className="font-sans text-[32px] md:text-[48px] font-black text-white tracking-tight leading-[0.9] text-center">
          {text}
        </h2>
      </div>
      
      {/* Footer stamps */}
      <div className="flex items-center justify-between mt-4">
        <span className="font-mono text-[7px] text-white/30 tracking-widest">
          DALE
        </span>
        <span className="font-mono text-[8px] text-white/40">
          DRIP <span className="ml-2">{Math.floor(index / 15)}/10</span>
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPERT BLOCK — Red accent theme block
// ═══════════════════════════════════════════════════════════════

interface ExpertBlockProps {
  theme: string;
  index: number;
}

export function ExpertBlock({ theme, index }: ExpertBlockProps) {
  const config = getExpertBlock(theme, index);

  return (
    <div className="bg-red-600 p-4 flex flex-col justify-center h-full min-h-[80px]">
      <h3 className="font-sans text-[18px] md:text-[22px] font-black text-white tracking-tight leading-tight">
        {config.title}
      </h3>
      <p className="font-sans text-[11px] text-white/80 mt-1 tracking-wide">
        {config.subtitle}
      </p>
      <div className="mt-2 font-mono text-[7px] text-white/40 tracking-widest">
        MMHLC TODO LE LOGH FU HURGH
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FLYER BLOCK — Full width with barcode
// ═══════════════════════════════════════════════════════════════

interface FlyerBlockProps {
  index: number;
}

export function FlyerBlock({ index }: FlyerBlockProps) {
  return (
    <div className="col-span-full bg-white border-y border-black/20 py-4 px-4">
      <div className="flex items-center justify-between gap-4">
        {/* QR Code placeholder */}
        <div className="w-16 h-16 bg-black/5 border border-black/10 flex items-center justify-center flex-shrink-0">
          <div className="grid grid-cols-4 gap-0.5">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 ${i % 3 === 0 ? 'bg-black' : 'bg-black/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Main text */}
        <div className="flex-1">
          <h2 className="font-sans text-[36px] md:text-[48px] font-black tracking-tighter text-black leading-none">
            DRIP CHECK
          </h2>
        </div>

        {/* Barcode */}
        <div className="flex gap-0.5 flex-shrink-0">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className="bg-black" 
              style={{ 
                width: i % 3 === 0 ? '2px' : '1px', 
                height: '32px' 
              }} 
            />
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <div className="mt-2 flex justify-between">
        <span className="font-mono text-[7px] text-black/30 tracking-widest">
          DRMFLADOMW-N55 LINANCIHACE BOLTMA BAILPOUM STRVING
        </span>
        <span className="font-mono text-[8px] text-black/40">N</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO CARD — Large featured image
// ═══════════════════════════════════════════════════════════════

interface HeroCardProps {
  milady: MiladyClassification;
  onClick?: () => void;
}

export function HeroCard({ milady, onClick }: HeroCardProps) {
  return (
    <article 
      onClick={onClick}
      className={`relative bg-neutral-200 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="relative aspect-[4/5]">
        {milady.image && (
          <Image
            src={milady.image}
            alt={milady.name}
            fill
            sizes="400px"
            className="object-cover object-[50%_15%] scale-105"
          />
        )}
      </div>

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-2 py-1 border-t border-black/10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-black/80">
            #{milady.id}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] text-black/40 uppercase">
              {milady.primaryTheme.slice(0, 4)}
            </span>
            <span className="font-mono text-[9px] text-black/50 border border-black/20 px-1">
              {milady.dripGrade}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

'use client';

import Image from 'next/image';
import { MiladyClassification } from '@/lib/milady/drip';
import { CropPreset, CardSize, getLabelCode } from '@/lib/milady/layoutRhythm';

interface MiladyCardProps {
  milady: MiladyClassification;
  cropPreset: CropPreset;
  size: CardSize;
  onClick?: () => void;
}

export function MiladyCard({ milady, cropPreset, size, onClick }: MiladyCardProps) {
  const labelCode = getLabelCode(milady.id);
  
  // Size classes
  const aspectClass = {
    sm: 'aspect-square',
    md: 'aspect-[3/4]',
    lg: 'aspect-[3/4]',
    hero: 'aspect-[4/5]',
  }[size];

  return (
    <article
      onClick={onClick}
      className={`
        group relative bg-[#e8e4dc] overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        hover:z-10
      `}
    >
      {/* Image */}
      <div className={`relative ${aspectClass} bg-neutral-200`}>
        {milady.image ? (
          <Image
            src={milady.image}
            alt={milady.name}
            fill
            sizes={size === 'hero' ? '400px' : size === 'lg' ? '300px' : '150px'}
            className={`object-cover ${cropPreset.position} ${cropPreset.scale}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-300">
            <span className="font-mono text-[8px] text-black/30">—</span>
          </div>
        )}

        {/* Match indicator */}
        {milady.hatShirtMatch && (
          <div className="absolute top-1 right-1 font-mono text-[6px] text-white bg-black/60 px-1">
            ≡ {milady.dripScore}
          </div>
        )}
      </div>

      {/* Label bar - newspaper style */}
      <div className="bg-white px-1 py-0.5 flex items-center justify-between border-t border-black/10">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] font-bold text-black/80">
            #{milady.id}
          </span>
          <span className="font-mono text-[7px] text-black/40 uppercase tracking-wide">
            {labelCode}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Drip indicator */}
          <span className="font-mono text-[7px] text-black/30 border border-black/20 px-0.5">
            {milady.dripGrade}
          </span>
          <span className="font-mono text-[7px] text-black/30">
            {milady.dripScore > 70 ? '▲' : '○'}
          </span>
        </div>
      </div>
    </article>
  );
}

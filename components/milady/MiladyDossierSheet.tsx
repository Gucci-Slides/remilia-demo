'use client';

import Image from 'next/image';
import { MiladyClassification } from '@/lib/milady/drip';
import { THEME_COLORS } from '@/lib/milady/theme';
import { ThemeChip } from './ThemeChip';
import { DripStamp, MatchStamp, StampBadge } from './StampBadge';

interface MiladyDossierSheetProps {
  milady: MiladyClassification | null;
  onClose: () => void;
}

export function MiladyDossierSheet({ milady, onClose }: MiladyDossierSheetProps) {
  if (!milady) return null;

  const colors = THEME_COLORS[milady.primaryTheme];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sheet */}
      <aside className={`
        fixed z-50 bg-[#f5f2ea] border-l-4 ${colors.border}
        
        /* Mobile: bottom sheet */
        inset-x-0 bottom-0 h-[70vh] rounded-t-xl
        
        /* Desktop: right panel */
        lg:inset-y-0 lg:right-0 lg:left-auto lg:w-96 lg:h-full lg:rounded-none
        
        overflow-y-auto shadow-xl
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-[#f5f2ea] border-b border-black/10 p-3 flex items-center justify-between">
          <div className="font-mono text-[10px] text-black/50 uppercase tracking-wider">
            DOSSIER
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[11px] text-black/40 hover:text-black/70 px-2 py-1"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Main image */}
          <div className="relative aspect-square bg-black overflow-hidden mb-4">
            {milady.image ? (
              <Image
                src={milady.image}
                alt={milady.name}
                fill
                sizes="400px"
                className="object-cover object-[50%_20%]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[10px] text-white/30">NO IMAGE</span>
              </div>
            )}

            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/30" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/30" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/30" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/30" />
          </div>

          {/* ID + Name */}
          <div className="mb-4">
            <div className="font-mono text-[24px] font-bold tracking-tight text-black">
              #{milady.id}
            </div>
            <div className="font-sans text-[13px] text-black/60 mt-0.5">
              {milady.name}
            </div>
          </div>

          {/* Classification */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <ThemeChip theme={milady.primaryTheme} size="sm" />
            <DripStamp score={milady.dripScore} grade={milady.dripGrade} />
            {milady.hatShirtMatch && <MatchStamp />}
          </div>

          {/* Thin rule */}
          <div className="h-px bg-black/10 my-4" />

          {/* Traits table */}
          <div className="mb-4">
            <div className="font-mono text-[8px] text-black/40 uppercase tracking-wider mb-2">
              ATTRIBUTES
            </div>
            <div className="space-y-1">
              {milady.traits.map((trait, i) => (
                <div key={i} className="flex justify-between items-baseline py-1 border-b border-black/5">
                  <span className="font-mono text-[9px] text-black/40">{trait.key}</span>
                  <span className="font-mono text-[10px] text-black/70">{trait.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Theme alignment */}
          <div className="mb-4">
            <div className="font-mono text-[8px] text-black/40 uppercase tracking-wider mb-2">
              THEME ALIGNMENT
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/50 p-2 border border-black/5">
                <div className="font-mono text-[8px] text-black/40 mb-1">HAT THEME</div>
                <ThemeChip theme={milady.hatTheme} size="xs" />
              </div>
              <div className="bg-white/50 p-2 border border-black/5">
                <div className="font-mono text-[8px] text-black/40 mb-1">SHIRT THEME</div>
                <ThemeChip theme={milady.shirtTheme} size="xs" />
              </div>
            </div>
            {milady.hatShirtMatch && (
              <div className="mt-2 font-mono text-[9px] text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-200">
                ✓ HAT + SHIRT ALIGNED (+5 DRIP)
              </div>
            )}
          </div>

          {/* Link */}
          <a
            href={milady.opensea_url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block w-full py-2 text-center
              font-mono text-[10px] text-black/50 uppercase tracking-wider
              border border-black/10 hover:bg-black/5 hover:text-black/70
              transition-colors
            "
          >
            VIEW ON OPENSEA →
          </a>

          {/* Footer marks */}
          <div className="mt-6 pt-4 border-t border-black/5">
            <div className="font-mono text-[7px] text-black/20 flex justify-between">
              <span>DOC: MLD-{milady.id}</span>
              <span>CLASS: {milady.primaryTheme}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

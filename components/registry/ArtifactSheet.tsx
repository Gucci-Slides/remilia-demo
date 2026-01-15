'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { MiladyRecord } from '@/lib/mock/miladies';

interface ArtifactSheetProps {
  record: MiladyRecord | null;
  onClose: () => void;
}

export function ArtifactSheet({ record, onClose }: ArtifactSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!record) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [record, onClose]);

  // Focus trap
  useEffect(() => {
    if (!record || !contentRef.current) return;
    contentRef.current.focus();
  }, [record]);

  if (!record) return null;

  const meterWidth = `${record.dripScore}%`;

  return (
    <>
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className="
          fixed inset-x-4 top-[5vh] bottom-[5vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[560px]
          bg-[#FAF8F5] border border-black/10 shadow-2xl z-50
          overflow-y-auto
          focus:outline-none
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="artifact-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="font-mono text-[9px] text-black/30 tracking-[0.2em] uppercase mb-1">
              Artifact Record
            </div>
            <h2 id="artifact-title" className="font-mono text-[24px] text-black/80 tracking-tight">
              #{record.id}
            </h2>
          </div>

          {/* Image */}
          <div className="bg-[#F5F3F0] border border-black/8 p-4 mb-8">
            {/* Corner marks */}
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-black/15" />
              <div className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-black/15" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-black/15" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-black/15" />

              <div className="relative aspect-[3/4] bg-neutral-200">
                {record.imageUrl ? (
                  <Image
                    src={record.imageUrl}
                    alt={record.name}
                    fill
                    sizes="500px"
                    className="object-cover object-[50%_25%]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-[48px] text-black/10">#{record.id}</span>
                  </div>
                )}

                {record.matchBonus && (
                  <div className="absolute top-3 right-3 bg-[#C41E3A] text-white px-2 py-1 font-mono text-[9px] tracking-wider rotate-[-3deg]">
                    +5 MATCH
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="border-t border-black/8 pt-6 mb-6">
            <div className="font-mono text-[9px] text-black/30 tracking-[0.2em] uppercase mb-4">
              Classification
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-mono text-[8px] text-black/30 uppercase">Grade</span>
                <div className="font-mono text-[20px] text-black/80">{record.dripGrade}</div>
              </div>
              <div>
                <span className="font-mono text-[8px] text-black/30 uppercase">Score</span>
                <div className="font-mono text-[20px] text-black/80">{record.dripScore}</div>
              </div>
            </div>
          </div>

          {/* Drip meter */}
          <div className="mb-6">
            <div className="h-1.5 bg-black/8 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-black/50"
                style={{ width: meterWidth }}
              />
            </div>
          </div>

          {/* Theme data */}
          <div className="border-t border-black/8 pt-6 mb-6">
            <div className="font-mono text-[9px] text-black/30 tracking-[0.2em] uppercase mb-4">
              Theme Analysis
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border border-black/8 p-3">
                <span className="font-mono text-[8px] text-black/30 uppercase">Hat</span>
                <div className="font-mono text-[12px] text-black/70 mt-1">{record.hatTheme}</div>
              </div>
              <div className="border border-black/8 p-3">
                <span className="font-mono text-[8px] text-black/30 uppercase">Shirt</span>
                <div className="font-mono text-[12px] text-black/70 mt-1">{record.shirtTheme}</div>
              </div>
            </div>
            {record.matchBonus && (
              <div className="flex items-center gap-2 py-2 px-3 bg-[#C41E3A]/5 border border-[#C41E3A]/20">
                <div className="w-2 h-2 bg-[#C41E3A]" />
                <span className="font-mono text-[9px] text-[#C41E3A]/80 tracking-wider uppercase">
                  Coordination Match +5
                </span>
              </div>
            )}
          </div>

          {/* Traits */}
          <div className="border-t border-black/8 pt-6 mb-6">
            <div className="font-mono text-[9px] text-black/30 tracking-[0.2em] uppercase mb-4">
              Trait Record
            </div>
            <div className="space-y-2">
              {record.traits.map((trait, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-black/5 last:border-0">
                  <span className="font-mono text-[9px] text-black/40 uppercase">{trait.key}</span>
                  <span className="font-mono text-[10px] text-black/60">{trait.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* External link placeholder */}
          <div className="border-t border-black/8 pt-6">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="
                block w-full py-3 border border-black/10
                font-mono text-[9px] text-black/40 text-center tracking-wider uppercase
                hover:bg-black/5 transition-colors
              "
            >
              View on OpenSea →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import Image from 'next/image';
import { MiladySubject } from '@/lib/registry/types';

interface DossierViewProps {
  subject: MiladySubject | null;
  onClose?: () => void;
}

export function DossierView({ subject }: DossierViewProps) {
  if (!subject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAF8]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border border-black/10 flex items-center justify-center">
            <span className="font-mono text-[10px] text-black/20">?</span>
          </div>
          <p className="font-mono text-[10px] text-black/25 tracking-wider uppercase">
            No Subject Selected
          </p>
          <p className="font-mono text-[9px] text-black/15 mt-2">
            Enter an ID or select from Index
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FAFAF8] overflow-y-auto">
      <div className="max-w-3xl mx-auto p-8 lg:p-12">
        {/* Registry header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-[#C41E3A]" />
          <span className="font-mono text-[9px] text-black/30 tracking-[0.2em] uppercase">
            Subject Dossier
          </span>
          <div className="flex-1 h-px bg-black/5" />
        </div>

        {/* Main portrait */}
        <div className="mb-8">
          <div className="relative aspect-[3/4] max-w-md mx-auto bg-neutral-100 border border-black/5">
            {subject.imageUrl ? (
              <Image
                src={subject.imageUrl}
                alt={subject.name}
                fill
                sizes="400px"
                className="object-cover object-[50%_25%]"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[48px] text-black/10">
                  #{subject.id}
                </span>
              </div>
            )}

            {/* Match stamp */}
            {subject.matchBonus && (
              <div className="absolute top-4 right-4 bg-[#C41E3A] text-white px-2 py-1 font-mono text-[9px] tracking-wider rotate-[-2deg]">
                +5 MATCH
              </div>
            )}

            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-black/10" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-black/10" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-black/10" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-black/10" />
          </div>
        </div>

        {/* Primary metadata */}
        <div className="mb-8 pb-8 border-b border-black/5">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase mb-1">
                Subject
              </div>
              <div className="font-mono text-[24px] text-black/70 tracking-tight">
                #{subject.id}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase mb-1">
                Grade
              </div>
              <div className="font-mono text-[24px] text-black/70 tracking-tight">
                {subject.dripGrade}
              </div>
            </div>
          </div>
        </div>

        {/* Drip meter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase">
              Drip Score
            </span>
            <span className="font-mono text-[12px] text-black/50">
              {subject.dripScore}/100
            </span>
          </div>
          <div className="h-1 bg-black/5 relative">
            <div
              className="absolute top-0 left-0 h-full bg-black/30"
              style={{ width: `${subject.dripScore}%` }}
            />
          </div>
        </div>

        {/* Theme classification */}
        <div className="mb-8 pb-8 border-b border-black/5">
          <div className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase mb-4">
            Theme Classification
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-black/8 p-4">
              <div className="font-mono text-[8px] text-black/25 uppercase mb-1">Hat</div>
              <div className="font-mono text-[12px] text-black/60">
                {subject.hatTheme || '—'}
              </div>
            </div>
            <div className="border border-black/8 p-4">
              <div className="font-mono text-[8px] text-black/25 uppercase mb-1">Shirt</div>
              <div className="font-mono text-[12px] text-black/60">
                {subject.shirtTheme || '—'}
              </div>
            </div>
          </div>
          {subject.matchBonus && (
            <div className="mt-4 flex items-center gap-2 py-2 px-3 bg-[#C41E3A]/5 border border-[#C41E3A]/15">
              <div className="w-1.5 h-1.5 bg-[#C41E3A]" />
              <span className="font-mono text-[9px] text-[#C41E3A]/70 tracking-wider uppercase">
                Theme Coordination +5
              </span>
            </div>
          )}
        </div>

        {/* Trait breakdown */}
        <div>
          <div className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase mb-4">
            Trait Record
          </div>
          <div className="space-y-2">
            {Object.entries(subject.traits).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-black/5 last:border-0"
              >
                <span className="font-mono text-[9px] text-black/35 uppercase">
                  {key}
                </span>
                <span className="font-mono text-[10px] text-black/55">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer stamp */}
        <div className="mt-12 pt-8 border-t border-black/5 flex items-center justify-between">
          <span className="font-mono text-[8px] text-black/20 tracking-widest uppercase">
            Registry Record
          </span>
          <div className="border border-black/10 px-2 py-1 rotate-[-1deg]">
            <span className="font-mono text-[8px] text-black/30 tracking-wider uppercase">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

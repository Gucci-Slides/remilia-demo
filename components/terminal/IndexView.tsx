'use client';

import Image from 'next/image';
import { MiladySubject } from '@/lib/registry/types';

interface IndexViewProps {
  subjects: MiladySubject[];
  selectedId: string | null;
  onSelect: (subject: MiladySubject) => void;
}

export function IndexView({ subjects, selectedId, onSelect }: IndexViewProps) {
  if (subjects.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAF8]">
        <div className="text-center">
          <p className="font-mono text-[10px] text-black/25 tracking-wider uppercase">
            No Subjects Found
          </p>
          <p className="font-mono text-[9px] text-black/15 mt-2">
            Adjust query parameters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FAFAF8] overflow-y-auto p-6 lg:p-8">
      {/* Index header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-black/20" />
        <span className="font-mono text-[9px] text-black/30 tracking-[0.2em] uppercase">
          Contact Index
        </span>
        <div className="flex-1 h-px bg-black/5" />
        <span className="font-mono text-[9px] text-black/20">
          {subjects.length} subjects
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {subjects.map((subject) => (
          <IndexCell
            key={subject.id}
            subject={subject}
            isSelected={selectedId === subject.id}
            onSelect={() => onSelect(subject)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
        <span className="font-mono text-[8px] text-black/20 tracking-widest uppercase">
          End of Index
        </span>
        <div className="flex gap-px">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-black/15"
              style={{ width: i % 2 === 0 ? '2px' : '1px', height: '10px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INDEX CELL
// ═══════════════════════════════════════════════════════════════

interface IndexCellProps {
  subject: MiladySubject;
  isSelected: boolean;
  onSelect: () => void;
}

function IndexCell({ subject, isSelected, onSelect }: IndexCellProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative aspect-square
        bg-white border transition-all
        focus:outline-none focus:ring-1 focus:ring-black/20
        ${isSelected
          ? 'border-black/30 ring-1 ring-black/10'
          : 'border-black/5 hover:border-black/15'
        }
      `}
    >
      {/* Image */}
      <div className="absolute inset-1 bg-neutral-100">
        {subject.imageUrl ? (
          <Image
            src={subject.imageUrl}
            alt={subject.name}
            fill
            sizes="100px"
            className="object-cover object-[50%_25%]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[9px] text-black/15">
              {subject.id}
            </span>
          </div>
        )}

        {/* Match indicator */}
        {subject.matchBonus && (
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#C41E3A]" />
        )}
      </div>

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-white/90">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[7px] text-black/50">
            #{subject.id}
          </span>
          <span className="font-mono text-[6px] text-black/30">
            {subject.dripScore}
          </span>
        </div>
      </div>
    </button>
  );
}

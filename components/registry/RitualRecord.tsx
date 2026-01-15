'use client';

import Image from 'next/image';
import { MiladyRecord } from '@/lib/mock/miladies';
import { RecordMeta } from './RecordMeta';

interface RitualRecordProps {
  record: MiladyRecord;
  index: number;
  onOpenArtifact: () => void;
}

export function RitualRecord({ record, index, onOpenArtifact }: RitualRecordProps) {
  return (
    <section
      data-record-index={index}
      className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-16"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Record container */}
      <div className="max-w-3xl mx-auto w-full">
        {/* Record number */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[10px] text-black/25 tracking-[0.2em] uppercase">
            Record {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 h-px bg-black/8" />
          <span className="font-mono text-[9px] text-black/20">
            {record.registryDate}
          </span>
        </div>

        {/* Main image mount */}
        <div 
          className="relative group cursor-pointer"
          onClick={onOpenArtifact}
        >
          {/* Archival mount frame */}
          <div className="bg-[#F5F3F0] border border-black/8 p-4 md:p-6">
            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-black/15" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-black/15" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-black/15" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-black/15" />

            {/* Image area */}
            <div className="relative aspect-[3/4] max-h-[65vh] mx-auto bg-neutral-200">
              {record.imageUrl ? (
                <Image
                  src={record.imageUrl}
                  alt={record.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 600px"
                  className="object-cover object-[50%_25%]"
                  priority={index < 3}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-[48px] text-black/10">
                      #{record.id}
                    </div>
                    <div className="font-mono text-[9px] text-black/20 mt-2">
                      IMAGE PENDING
                    </div>
                  </div>
                </div>
              )}

              {/* Match bonus stamp */}
              {record.matchBonus && (
                <div className="absolute top-4 right-4 bg-[#C41E3A] text-white px-2 py-1 font-mono text-[9px] tracking-wider rotate-[-3deg]">
                  +5 MATCH
                </div>
              )}

              {/* Hover state */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="font-mono text-[9px] text-white/90 bg-black/60 px-3 py-1.5 tracking-wider">
                  VIEW ARTIFACT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Record metadata */}
        <RecordMeta record={record} />
      </div>
    </section>
  );
}

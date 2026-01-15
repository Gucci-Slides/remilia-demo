'use client';

import Image from 'next/image';
import { MiladyRecord } from '@/lib/mock/miladies';

interface ContactStripProps {
  records: MiladyRecord[];
  onRecordClick: (record: MiladyRecord) => void;
}

export function ContactStrip({ records, onRecordClick }: ContactStripProps) {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-black/10" />
          <span className="font-mono text-[10px] text-black/30 tracking-[0.2em] uppercase">
            Contact Index
          </span>
          <div className="h-px flex-1 bg-black/10" />
        </div>
        <div className="text-center mt-3">
          <span className="font-mono text-[8px] text-black/20">
            {records.length} Records — Compressed View
          </span>
        </div>
      </div>

      {/* Strip grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {records.map((record, index) => (
            <ContactFrame
              key={record.id}
              record={record}
              index={index}
              onClick={() => onRecordClick(record)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] text-black/20 tracking-wider uppercase">
            Milady Registry
          </span>
          <div className="flex gap-px">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="w-px h-3 bg-black/20"
                style={{ marginLeft: i % 3 === 0 ? '2px' : '0' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT FRAME
// ═══════════════════════════════════════════════════════════════

interface ContactFrameProps {
  record: MiladyRecord;
  index: number;
  onClick: () => void;
}

function ContactFrame({ record, index, onClick }: ContactFrameProps) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square bg-[#F5F3F0] border border-black/8 p-0.5 hover:border-black/20 transition-colors"
    >
      {/* Image */}
      <div className="relative w-full h-full bg-neutral-200 overflow-hidden">
        {record.imageUrl ? (
          <Image
            src={record.imageUrl}
            alt={record.name}
            fill
            sizes="80px"
            className="object-cover object-[50%_25%]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[8px] text-black/20">
              {record.id}
            </span>
          </div>
        )}

        {/* Match indicator */}
        {record.matchBonus && (
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#C41E3A]" />
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="font-mono text-[7px] text-white/90 tracking-wider">
          #{record.id}
        </span>
      </div>
    </button>
  );
}

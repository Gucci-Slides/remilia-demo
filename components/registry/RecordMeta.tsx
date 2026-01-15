'use client';

import { MiladyRecord } from '@/lib/mock/miladies';

interface RecordMetaProps {
  record: MiladyRecord;
}

export function RecordMeta({ record }: RecordMetaProps) {
  // Drip meter visualization
  const meterWidth = `${record.dripScore}%`;

  return (
    <div className="mt-6 border-t border-black/8 pt-6">
      {/* Primary identification */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="font-mono text-[10px] text-black/30 tracking-[0.15em] uppercase mb-1">
            Identifier
          </div>
          <div className="font-mono text-[18px] text-black/80 tracking-tight">
            #{record.id}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] text-black/30 tracking-[0.15em] uppercase mb-1">
            Grade
          </div>
          <div className="font-mono text-[18px] text-black/80 tracking-tight">
            {record.dripGrade}
          </div>
        </div>
      </div>

      {/* Drip meter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase">
            Drip Score
          </span>
          <span className="font-mono text-[10px] text-black/50">
            {record.dripScore}/100
          </span>
        </div>
        <div className="h-1 bg-black/8 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-black/40"
            style={{ width: meterWidth }}
          />
          {/* Score threshold markers */}
          <div className="absolute top-0 left-[50%] w-px h-2 bg-black/10 -translate-y-0.5" />
          <div className="absolute top-0 left-[80%] w-px h-2 bg-black/10 -translate-y-0.5" />
          <div className="absolute top-0 left-[95%] w-px h-2 bg-black/10 -translate-y-0.5" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[7px] text-black/20">0</span>
          <span className="font-mono text-[7px] text-black/20">50</span>
          <span className="font-mono text-[7px] text-black/20">80</span>
          <span className="font-mono text-[7px] text-black/20">95</span>
          <span className="font-mono text-[7px] text-black/20">100</span>
        </div>
      </div>

      {/* Theme classification */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase mb-1">
            Hat Theme
          </div>
          <div className="font-mono text-[11px] text-black/60">
            {record.hatTheme}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] text-black/30 tracking-[0.15em] uppercase mb-1">
            Shirt Theme
          </div>
          <div className="font-mono text-[11px] text-black/60">
            {record.shirtTheme}
          </div>
        </div>
      </div>

      {/* Match status */}
      {record.matchBonus && (
        <div className="flex items-center gap-3 py-3 border-t border-b border-black/8">
          <div className="w-2 h-2 bg-[#C41E3A]" />
          <span className="font-mono text-[9px] text-black/50 tracking-wider uppercase">
            Theme Coordination Confirmed — +5 Bonus Applied
          </span>
        </div>
      )}
    </div>
  );
}

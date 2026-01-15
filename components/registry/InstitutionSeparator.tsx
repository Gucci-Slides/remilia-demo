'use client';

type SeparatorType = 'end_of_record' | 'redacted' | 'time_marker' | 'stamp' | 'thin_rule';

interface InstitutionSeparatorProps {
  type: SeparatorType;
  index?: number;
}

export function InstitutionSeparator({ type, index = 0 }: InstitutionSeparatorProps) {
  switch (type) {
    case 'end_of_record':
      return (
        <div className="py-16 flex flex-col items-center gap-4">
          <div className="w-32 h-px bg-black/10" />
          <span className="font-mono text-[8px] text-black/20 tracking-[0.3em] uppercase">
            End of Record
          </span>
          <div className="w-32 h-px bg-black/10" />
        </div>
      );

    case 'redacted':
      // Deterministic widths based on index to avoid hydration mismatch
      const redactedWidths = [32, 48, 24, 56, 40];
      return (
        <div className="py-12 flex justify-center">
          <div className="flex gap-2">
            {redactedWidths.map((width, i) => (
              <div 
                key={i}
                className="bg-black/80 h-3"
                style={{ width: width + ((index * 7 + i * 3) % 20) }}
              />
            ))}
          </div>
        </div>
      );

    case 'time_marker':
      return (
        <div className="py-20 flex items-center justify-center gap-4">
          <div className="flex-1 max-w-24 h-px bg-black/8" />
          <span className="font-mono text-[9px] text-black/25 tracking-wider">
            {String(index + 1).padStart(2, '0')}:00:00
          </span>
          <div className="flex-1 max-w-24 h-px bg-black/8" />
        </div>
      );

    case 'stamp':
      return (
        <div className="py-16 flex justify-center">
          <div className="border border-[#C41E3A]/30 px-4 py-2 rotate-[-2deg]">
            <span className="font-mono text-[9px] text-[#C41E3A]/60 tracking-[0.2em] uppercase">
              Approved — Internal
            </span>
          </div>
        </div>
      );

    case 'thin_rule':
    default:
      return (
        <div className="py-8 flex justify-center">
          <div className="w-full max-w-xs h-px bg-black/5" />
        </div>
      );
  }
}

// Deterministic separator selection
export function getSeparatorType(index: number): SeparatorType {
  const pattern: SeparatorType[] = [
    'end_of_record',
    'thin_rule',
    'stamp',
    'thin_rule',
    'time_marker',
    'thin_rule',
    'redacted',
    'thin_rule',
  ];
  return pattern[index % pattern.length];
}

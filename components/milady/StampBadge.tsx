'use client';

interface StampBadgeProps {
  label: string;
  value?: string | number;
  variant?: 'drip' | 'match' | 'id' | 'default';
}

export function StampBadge({ label, value, variant = 'default' }: StampBadgeProps) {
  const variantClasses = {
    drip: 'border-black/30 text-black/70',
    match: 'border-emerald-500 text-emerald-600 bg-emerald-50',
    id: 'border-black/20 text-black/40',
    default: 'border-black/20 text-black/50',
  };

  return (
    <div className={`
      inline-flex items-baseline gap-1
      font-mono text-[8px] tracking-wide uppercase
      border px-1 py-0.5
      ${variantClasses[variant]}
    `}>
      <span className="opacity-60">{label}</span>
      {value !== undefined && <span className="font-medium">{value}</span>}
    </div>
  );
}

interface DripStampProps {
  score: number;
  grade: string;
}

export function DripStamp({ score, grade }: DripStampProps) {
  // Color based on grade
  let colorClass = 'text-black/50 border-black/20';
  if (score >= 85) colorClass = 'text-amber-600 border-amber-400 bg-amber-50';
  else if (score >= 70) colorClass = 'text-emerald-600 border-emerald-400 bg-emerald-50';
  else if (score >= 55) colorClass = 'text-blue-600 border-blue-400 bg-blue-50';

  return (
    <div className={`
      inline-flex items-center gap-1
      font-mono text-[9px] tracking-tight
      border px-1 py-0.5
      ${colorClass}
    `}>
      <span className="font-bold">{grade}</span>
      <span className="text-[7px] opacity-60">{score}</span>
    </div>
  );
}

export function MatchStamp() {
  return (
    <div className="
      inline-flex items-center
      font-mono text-[7px] tracking-wider uppercase
      border border-emerald-500 text-emerald-600 bg-emerald-50
      px-1 py-0.5
    ">
      +5 MATCH
    </div>
  );
}

'use client';

interface RegistryHeaderProps {
  totalItems: number;
  filteredCount: number;
  lastSync?: Date;
}

export function RegistryHeader({ 
  totalItems, 
  filteredCount, 
  lastSync 
}: RegistryHeaderProps) {
  const syncAgo = lastSync 
    ? Math.floor((Date.now() - lastSync.getTime()) / 60000)
    : 0;
  const syncText = syncAgo === 0 ? 'JUST NOW' : `${syncAgo} MIN AGO`;

  return (
    <header className="sticky top-0 z-50 bg-[#f5f2ea] border-b border-black/10">
      <div className="px-3 py-1 flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-baseline gap-3">
          <h1 className="font-sans text-[12px] font-bold tracking-tight text-black uppercase">
            Milady Registry
          </h1>
          <span className="font-mono text-[9px] text-black/40">v2.1</span>
          <span className="font-mono text-[8px] text-black/25 hidden sm:inline tracking-wider">
            CIESTED {filteredCount} LUN ASG
          </span>
        </div>

        {/* Right: Sync status */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-black/40 hidden sm:inline">
            SYNCED {syncText}
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[8px] text-black/30">
              {filteredCount}.{totalItems}
            </span>
            <span className="font-mono text-[8px] text-black/20 ml-1">★</span>
          </div>
        </div>
      </div>
    </header>
  );
}

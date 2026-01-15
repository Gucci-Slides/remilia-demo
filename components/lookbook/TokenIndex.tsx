import { MiladyNFT } from '@/lib/milady';
import { formatTokenName, COLLECTION_META } from '@/lib/lookbook';

interface TokenIndexProps {
  tokens: MiladyNFT[];
}

export function TokenIndex({ tokens }: TokenIndexProps) {
  return (
    <section className="bg-black text-white">
      <div className="px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="font-sans text-[14px] font-medium tracking-tight">
              INDEX
            </div>
            <div className="font-mono text-[9px] text-white/40 mt-1">
              {COLLECTION_META.name} / {tokens.length} ENTRIES
            </div>
          </div>

          {/* Grid of entries */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
            {tokens.map((token) => (
              <a
                key={token.id}
                href={token.opensea_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between py-1 border-b border-white/10 hover:border-white/30 transition-colors"
              >
                <span className="font-mono text-[10px] text-white/70 group-hover:text-white truncate pr-2">
                  {formatTokenName(token)}
                </span>
                <span className="font-mono text-[9px] text-white/30 flex-shrink-0">
                  #{token.id}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

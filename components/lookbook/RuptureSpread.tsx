// This file is kept for backwards compatibility
// New interruption component is in LookSpread.tsx

export { Interruption as RuptureSpread } from './LookSpread';

interface BreatherSpreadProps {
  variant: string;
}

export function BreatherSpread({ variant }: BreatherSpreadProps) {
  return (
    <article className="py-6 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="font-mono text-[9px] text-black/25 tracking-widest">
          · · ·
        </div>
      </div>
    </article>
  );
}

interface ContactSheetProps {
  images: string[];
}

export function ContactSheet({ images }: ContactSheetProps) {
  const displayImages = images.slice(0, 6);

  return (
    <article className="py-8 px-4 md:px-6 bg-neutral-100">
      <div className="flex gap-1 justify-center flex-wrap">
        {displayImages.map((src, i) => (
          <div
            key={i}
            className="w-16 h-16 md:w-20 md:h-20 bg-black overflow-hidden"
          >
            {src ? (
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

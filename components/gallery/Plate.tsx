'use client';

import Image from 'next/image';

interface PlateProps {
  src: string;
  alt: string;
  subject?: string;
  index?: string;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
  priority?: boolean;
}

export function Plate({ 
  src, 
  alt, 
  subject, 
  index,
  aspectRatio = 'portrait',
  priority = false 
}: PlateProps) {
  const aspectClass = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
  }[aspectRatio];

  return (
    <figure className="flex flex-col">
      {/* Image plate */}
      <div className={`relative ${aspectClass} bg-neutral-100`}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 80vw, 30vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-light text-[10px] text-neutral-300 tracking-widest uppercase">
              {alt}
            </span>
          </div>
        )}

        {/* Optional very subtle grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Metadata — outside the image, minimal */}
      {(subject || index) && (
        <figcaption className="mt-4 space-y-1">
          {subject && (
            <p className="font-light text-[11px] tracking-[0.08em] text-neutral-500">
              {subject}
            </p>
          )}
          {index && (
            <p className="font-light text-[9px] tracking-[0.2em] text-neutral-300 uppercase">
              {index}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

'use client';

import { Plate } from './Plate';

interface SpreadImage {
  src: string;
  alt: string;
  subject?: string;
  index?: string;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
}

interface SpreadProps {
  images: SpreadImage[];
  layout: 'single' | 'double' | 'triple' | 'staggered';
  priority?: boolean;
}

export function Spread({ images, layout, priority = false }: SpreadProps) {
  // Single image — full authority
  if (layout === 'single' || images.length === 1) {
    return (
      <section className="min-h-screen flex items-center justify-center px-[15vw] md:px-[20vw] py-24">
        <div className="w-full max-w-xl">
          <Plate {...images[0]} priority={priority} />
        </div>
      </section>
    );
  }

  // Double — asymmetric pair
  if (layout === 'double' && images.length >= 2) {
    return (
      <section className="min-h-screen flex items-end justify-center px-[10vw] py-24 gap-[8vw]">
        <div className="w-[28vw] max-w-sm pb-16">
          <Plate {...images[0]} priority={priority} />
        </div>
        <div className="w-[32vw] max-w-md">
          <Plate {...images[1]} priority={priority} />
        </div>
      </section>
    );
  }

  // Triple — editorial rhythm
  if (layout === 'triple' && images.length >= 3) {
    return (
      <section className="min-h-screen flex items-end justify-center px-[8vw] py-24 gap-[5vw]">
        <div className="w-[24vw] max-w-xs self-start pt-12">
          <Plate {...images[0]} priority={priority} />
        </div>
        <div className="w-[22vw] max-w-xs pb-8">
          <Plate {...images[1]} />
        </div>
        <div className="w-[26vw] max-w-sm self-start">
          <Plate {...images[2]} />
        </div>
      </section>
    );
  }

  // Staggered — uneven vertical rhythm
  if (layout === 'staggered' && images.length >= 2) {
    return (
      <section className="min-h-screen flex items-center justify-center px-[10vw] py-24 gap-[10vw]">
        <div className="w-[26vw] max-w-sm -mt-24">
          <Plate {...images[0]} priority={priority} />
        </div>
        <div className="w-[30vw] max-w-md mt-32">
          <Plate {...images[1]} />
        </div>
      </section>
    );
  }

  // Fallback
  return (
    <section className="min-h-screen flex items-center justify-center px-[15vw] py-24">
      <div className="w-full max-w-xl">
        <Plate {...images[0]} priority={priority} />
      </div>
    </section>
  );
}

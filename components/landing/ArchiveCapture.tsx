'use client';

import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVE CAPTURE — Registry artifact fragment
// 
// This is EVIDENCE of "Network State" — not decoration.
// Must read as: a scan, a registry pull, a bureaucratic artifact.
// 
// Crop shows ONLY a fragment:
// - Upper credential header
// - One ID line
// - Name field
// - Partial QR edge
// 
// Do NOT show: full card, full avatar, full layout, centered composition.
// The crop must feel INCOMPLETE and PROCEDURAL.
// ─────────────────────────────────────────────────────────────────────────────

export function ArchiveCapture() {
  return (
    <div className="flex flex-col items-start">
      {/* Artifact container — fragmentary, cold, procedural */}
      <div 
        className="relative w-[260px] md:w-[300px] lg:w-[340px] max-w-[360px] overflow-hidden"
        style={{
          // Wider aspect — feels like a cropped fragment, not a card
          aspectRatio: '7 / 5',
          // Cold neutral border
          border: '1px solid #d4d4d4',
          // Faint inner edge only
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.025)',
          background: '#f9f9f8',
          // Imperceptible skew — feels captured, not placed
          transform: 'rotate(-0.25deg)',
        }}
      >
        {/* Image layer — TIGHT FRAGMENT CROP */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            // Cold treatment: grayscale, boosted contrast, slight blur
            filter: 'grayscale(100%) contrast(1.08) brightness(0.93) blur(0.25px)',
          }}
        >
          <Image
            src="/milady-demo-1.png"
            alt="RML-NET-0001"
            fill
            className="object-cover"
            style={{
              // FRAGMENT CROP: shows upper credential header + one ID line + name + partial QR
              // Cuts off avatar body, cuts off bottom content
              // Feels incomplete and procedural
              objectPosition: '52% 0%',
              transform: 'scale(2.4) translateX(-4%) translateY(12%)',
              opacity: 0.91,
            }}
            sizes="(max-width: 768px) 260px, 340px"
            priority={false}
          />
        </div>
        
        {/* Grain overlay — scanned document texture */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.06,
            mixBlendMode: 'multiply',
          }}
          aria-hidden="true"
        />
      </div>
      
      {/* Caption — filing label (not marketing) */}
      <div 
        className="mt-2"
        style={{
          textAlign: 'left',
          lineHeight: 1.3,
        }}
      >
        <p 
          className="uppercase text-black/55"
          style={{ 
            fontSize: '9px', 
            letterSpacing: '0.12em',
            fontWeight: 500,
          }}
        >
          ARCHIVE CAPTURE · RML-NET-0001
        </p>
        <p 
          className="uppercase text-black/45 mt-0.5"
          style={{ 
            fontSize: '8px', 
            letterSpacing: '0.10em',
          }}
        >
          IDENTITY REGISTRY SNAPSHOT
        </p>
        <p 
          className="uppercase text-black/40 mt-0.5"
          style={{ 
            fontSize: '8px', 
            letterSpacing: '0.10em',
          }}
        >
          SOURCE: REMILIA.NET
        </p>
      </div>
    </div>
  );
}

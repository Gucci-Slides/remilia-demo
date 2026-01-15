// ═══════════════════════════════════════════════════════════════════════════
// ACT III CLOSER — "Contact."
// 
// ARCHITECTURE:
// ─────────────
// - Minimal contact closer
// - Clean, quiet terminal state
// - Left: copy block / Right: email address (no card)
// - Single mount, no duplicates
// - No animation (calm endpoint)
// ═══════════════════════════════════════════════════════════════════════════

export function ActIIICloser() {

  return (
    <section
      className="relative bg-white"
      style={{ 
        minHeight: '80vh', 
        paddingTop: '16vh', 
        paddingBottom: '20vh',
      }}
    >
      {/* Match Act II padding: clamp(48px, 6vw, 96px) */}
      <div 
        className="max-w-[1200px] mx-auto"
        style={{ padding: '0 clamp(48px, 6vw, 96px)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* ═══════════════════════════════════════════════════════════════
              LEFT COLUMN — Copy block
              ═══════════════════════════════════════════════════════════════ */}
          <div className="max-w-[560px]">
            {/* Headline */}
            <h2
              className="font-serif text-black/90 mb-8"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              Contact.
            </h2>

            {/* Body lines */}
            <div className="space-y-1">
              <p
                className="font-serif text-black/60"
                style={{
                  fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
                  lineHeight: 1.4,
                }}
              >
                For inquiries, correspondence,
              </p>
              <p
                className="font-serif text-black/60"
                style={{
                  fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
                  lineHeight: 1.4,
                }}
              >
                and ongoing collaboration.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT COLUMN — Email address only
              Plenty of negative space, no card, no imagery
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="flex flex-col items-start lg:items-end justify-center"
            style={{ minHeight: '120px' }}
          >
            {/* Email address — legible but not styled like a CTA */}
            <p
              className="font-serif text-black/75"
              style={{
                fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                letterSpacing: '0.01em',
              }}
            >
              corporate@remilia.org
            </p>

            {/* Subtle status micro text */}
            <p
              style={{
                fontSize: '7px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.25)',
                marginTop: '12px',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              STATUS: ACTIVE
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTES
// 
// This is Act III — the minimal contact closer.
// Clean, quiet terminal state with a single point of contact.
// No buttons, links, or hover effects.
// The email feels like an open door, not a sales funnel.
// 
// DOM: ONE section, renders once, no duplicates on scroll.
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import React, { memo, useState, useRef, useLayoutEffect } from 'react';
import { MotionValue } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// MONUMENT TITLE — Static title page with erasure
// 
// No scroll animation on the title itself.
// The erasure effect (smiley as subtraction) is always present.
// Hands off cleanly to Act I.
// ═══════════════════════════════════════════════════════════════════════════

interface MonumentTitleProps {
  title: string;
  scrollProgress: MotionValue<number>;
}

// Typography constants — Monument scale
const TYPOGRAPHY = {
  fontFamily: 'var(--font-editorial)',
  fontSize: 'clamp(5.5rem, 18vw, 14rem)',
  fontWeight: 400,
  lineHeight: 0.9,
  letterSpacing: '-0.03em',
} as const;

// Erasure geometry (smiley as erasure)
const ERASURE = {
  arcCenterX: 0.66,
  arcCenterY: 0.46,
  arcRadius: 0.68,
  arcStroke: 0.22,
  arcStartAngle: 190,
  arcEndAngle: 350,
  dripWidth: 0.05,
  dripHeight: 0.38,
  dripRadius: 0.025,
  leftDripX: 0.48,
  rightDripX: 0.80,
  dripY: 0.04,
} as const;

// Generate SVG arc path
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function MonumentTitleComponent({ title }: MonumentTitleProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 100 });
  const [isReady, setIsReady] = useState(false);

  // Measure text dimensions
  useLayoutEffect(() => {
    const measure = () => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        setIsReady(true);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Compute erasure geometry
  const W = dimensions.width;
  const H = dimensions.height;

  const arcCx = W * ERASURE.arcCenterX;
  const arcCy = H * ERASURE.arcCenterY;
  const arcR = H * ERASURE.arcRadius;
  const arcStroke = H * ERASURE.arcStroke;

  const dripW = H * ERASURE.dripWidth;
  const dripH = H * ERASURE.dripHeight;
  const dripR = H * ERASURE.dripRadius;
  const leftDripX = W * ERASURE.leftDripX - dripW / 2;
  const rightDripX = W * ERASURE.rightDripX - dripW / 2;
  const dripY = H * ERASURE.dripY;

  const arcPath = describeArc(arcCx, arcCy, arcR, ERASURE.arcStartAngle, ERASURE.arcEndAngle);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        marginBottom: '1.5rem',
        marginLeft: '-0.06em',
        transform: 'translateX(-2px) translateY(-1.5vh)',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          PRIMARY TEXT — The visible monument word
          ═══════════════════════════════════════════════════════════════════ */}
      <h1
        ref={textRef}
        style={{
          position: 'relative',
          ...TYPOGRAPHY,
          color: '#0a0a0a',
          display: 'inline-block',
        }}
      >
        {title}
      </h1>

      {/* ═══════════════════════════════════════════════════════════════════
          ERASURE OVERLAY — Smiley as erasure (static, misbehaving)
          ═══════════════════════════════════════════════════════════════════ */}
      {isReady && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${W} ${H}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: W,
            height: H,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <g transform={`translate(-2, 1) rotate(-0.3 ${arcCx} ${arcCy})`}>
            <path
              d={arcPath}
              fill="none"
              stroke="white"
              strokeWidth={arcStroke}
              strokeLinecap="round"
            />
            <rect
              x={leftDripX}
              y={dripY}
              width={dripW}
              height={dripH}
              rx={dripR}
              ry={dripR}
              fill="white"
            />
            <rect
              x={rightDripX}
              y={dripY}
              width={dripW}
              height={dripH}
              rx={dripR}
              ry={dripR}
              fill="white"
            />
          </g>
        </svg>
      )}
    </div>
  );
}

export const MonumentTitle = memo(MonumentTitleComponent);

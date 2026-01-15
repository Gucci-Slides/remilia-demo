'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface RitualScrollProps {
  children: ReactNode;
  onActiveIndexChange: (index: number) => void;
}

export function RitualScroll({ children, onActiveIndexChange }: RitualScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll('[data-record-index]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = parseInt(entry.target.getAttribute('data-record-index') || '0', 10);
            onActiveIndexChange(index);
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [onActiveIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const sections = container.querySelectorAll('[data-record-index]');
      const currentSection = Array.from(sections).find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight / 2;
      });

      const currentIndex = currentSection 
        ? parseInt(currentSection.getAttribute('data-record-index') || '0', 10)
        : 0;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const nextSection = sections[Math.min(currentIndex + 1, sections.length - 1)];
        nextSection?.scrollIntoView({ behavior: 'smooth' });
      }

      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prevSection = sections[Math.max(currentIndex - 1, 0)];
        prevSection?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-smooth"
      style={{
        scrollSnapType: 'y mandatory',
      }}
    >
      {children}
    </div>
  );
}

import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Hook to map scroll progress to a discrete state index.
 * 
 * @param totalStates - Number of narrative states
 * @param containerRef - Ref to the scrollable container
 * @returns Current active state index (0 to totalStates - 1)
 * 
 * Each state occupies an equal band of scroll progress.
 * Example with 11 states: state 0 = 0-9%, state 1 = 9-18%, etc.
 */
export function useScrollState(
  totalStates: number,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      // Map progress [0, 1] to state index [0, totalStates - 1]
      const index = Math.min(
        Math.floor(progress * totalStates),
        totalStates - 1
      );
      setActiveIndex(index);
    });

    return () => unsubscribe();
  }, [scrollYProgress, totalStates]);

  return { activeIndex, scrollYProgress };
}

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

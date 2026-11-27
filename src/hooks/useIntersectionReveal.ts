import { useEffect, useRef, useState } from 'react';

export interface RevealOptions {
  threshold?: number;
  delayMs?: number;
}

export function useIntersectionReveal(options: RevealOptions = {}) {
  const { threshold = 0.08, delayMs = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);
  // Default to true so components are immediately visible without relying on scroll triggers
  const [isRevealed, setIsRevealed] = useState(true);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            const timer = setTimeout(() => {
              setIsRevealed(true);
            }, delayMs);
            observer.disconnect();
            return () => clearTimeout(timer);
          } else {
            setIsRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, delayMs]);

  return { ref, isRevealed };
}

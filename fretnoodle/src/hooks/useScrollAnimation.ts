import { useEffect, useRef, RefObject } from 'react';
import { TIMING } from '../constants';

export function useScrollAnimation(
  sectionRef: RefObject<HTMLDivElement | null>,
  options?: IntersectionObserverInit
) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          el.classList.add('animate-section');
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15,
        ...options
      }
    );

    const timeoutId = setTimeout(() => observer.observe(el), TIMING.DOM_SETUP_DELAY);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [sectionRef, options]);
}

export default useScrollAnimation;

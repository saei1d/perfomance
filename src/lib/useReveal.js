import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';

export function useReveal(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(root.querySelectorAll('[data-reveal]'), { autoAlpha: 1, y: 0 });
    });

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray(root.querySelectorAll('[data-reveal]')).forEach((node) => {
          gsap.from(node, {
            y: 22,
            autoAlpha: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 90%',
            },
          });
        });
      }, root);
      return () => ctx.revert();
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => motion.revert();
  }, [rootRef]);
}

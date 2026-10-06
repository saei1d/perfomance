import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import './ProductPhotography.css';

export default function ProductPhotography() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.product-hero-title', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.product-hero',
          start: 'top 80%',
        },
      });

      gsap.from('.product-hero-image', {
        scale: 0.95,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.product-hero',
          start: 'top 80%',
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="product-photography" id="photography" aria-label="Product Photography">
      <div className="product-hero">
        <div className="product-hero-content">
          <p className="eyebrow">04 — Photography</p>
          <h2 className="product-hero-title">Still light</h2>
          <p className="product-hero-description">
            Objects, rooms, and materials, photographed with the same lighting discipline as a moving shot. One source, a reason for the shadow, and a finish that belongs on the page.
          </p>
        </div>
        <div className="product-hero-image">
          <img src={`${import.meta.env.BASE_URL}finalshot.webp`} alt="Finished product still from the studio set." />
        </div>
      </div>
    </section>
  );
}

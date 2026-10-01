import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
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
          <h1 className="product-hero-title">Product Photography</h1>
          <p className="product-hero-description">
            Transform your products into compelling visual stories. From e-commerce to advertising campaigns,
            we craft images that captivate and convert. Our approach combines technical precision with artistic vision,
            ensuring every product is showcased in its best light.
          </p>
        </div>
        <div className="product-hero-image">
          <img src="/perfomance/finalshot.webp" alt="Product photography showcase" />
        </div>
      </div>
    </section>
  );
}

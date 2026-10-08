import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import './ProductPhotography.css';

export default function ProductPhotography() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      // Staggered title reveal
      gsap.from('.hero-char', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 70%',
        },
      });

      // Image reveal with scale and rotation
      gsap.from('.product-hero-image', {
        scale: 0.8,
        rotation: -5,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 60%',
        },
      });

      // Content reveal
      gsap.from('.hero-content', {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 65%',
        },
      });

      // Eyebrow reveal
      gsap.from('.hero-eyebrow', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
        },
      });

      // Border animation
      gsap.from('.hero-border', {
        scaleX: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: root,
          start: 'top 70%',
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="product-photography" id="photography" aria-label="Product Photography">
      <div className="hero-border" />
      <div className="product-hero">
        <div className="hero-content" ref={contentRef}>
          <p className="hero-eyebrow">04 — Photography</p>
          <h2 className="product-hero-title" ref={titleRef}>
            <span className="hero-char">S</span>
            <span className="hero-char">T</span>
            <span className="hero-char">I</span>
            <span className="hero-char">L</span>
            <span className="hero-char">L</span>
            <span className="hero-char">&nbsp;</span>
            <span className="hero-char">L</span>
            <span className="hero-char">I</span>
            <span className="hero-char">G</span>
            <span className="hero-char">H</span>
            <span className="hero-char">T</span>
          </h2>
          <p className="hero-description">
            Objects, rooms, and materials, photographed with the same lighting discipline as a moving shot. One source, a reason for the shadow, and a finish that belongs on the page.
          </p>
        </div>
        <div className="product-hero-image" ref={imageRef}>
          <div className="image-wrapper">
            <img src={`${import.meta.env.BASE_URL}finalshot.webp`} alt="Finished product still from the studio set." />
            <div className="image-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}

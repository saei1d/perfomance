import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import './cinematic.css';

const STILLS = [
  { id: '01', title: 'After the Rain', meta: 'Photography' },
  { id: '02', title: 'Glass House', meta: 'Commercial' },
  { id: '03', title: 'Night Market', meta: 'Aerial' },
];

const WORK = [
  { id: '01', title: 'After the Rain', role: 'Cinematography', year: '2025', tone: 'cool' },
  { id: '02', title: 'North Shore', role: 'Edit and grade', year: '2025', tone: 'warm' },
  { id: '03', title: 'Glass House', role: 'Commercial', year: '2024', tone: 'neutral' },
  { id: '04', title: 'Night Market', role: 'Aerial and edit', year: '2024', tone: 'amber' },
];

const REEL = ['Direction', 'Edit', 'Grade', 'Aerial', 'Sound', 'Commercial'];

function formatTimecode(frame) {
  const ff = frame % 24;
  const totalSeconds = Math.floor(frame / 24);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  return [hh, mm, ss, ff].map((part) => String(part).padStart(2, '0')).join(':');
}

export default function CinematicPortfolio() {
  const rootRef = useRef(null);
  const timecodeRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(root.querySelectorAll('.cine-title-line, .work-row, .cine-rule'), {
        autoAlpha: 1,
        y: 0,
        scaleX: 1,
      });
    });

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.cine-title-line', {
          y: 54,
          autoAlpha: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.08,
        });

        gsap.from('.cine-rule', {
          scaleX: 0,
          duration: 1.1,
          ease: 'power2.out',
          delay: 0.45,
        });

        gsap.to('.cine-hero-copy', {
          y: -48,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cine-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.utils.toArray('.work-row').forEach((row) => {
          gsap.from(row, {
            y: 36,
            autoAlpha: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }, root);

      return () => ctx.revert();
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => motion.revert();
  }, []);

  useEffect(() => {
    const node = timecodeRef.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frameId = 0;
    const start = performance.now();

    const tick = (now) => {
      if (!document.hidden) {
        node.textContent = formatTimecode(Math.floor(((now - start) / 1000) * 24));
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const loop = [...REEL, ...REEL];

  return (
    <div ref={rootRef} className="cine" id="top">
      <section className="cine-hero" aria-label="Introduction">
        <div className="sprocket" aria-hidden="true" />

        <div className="cine-hero-copy">
          <p className="eyebrow">Toronto — Film and post</p>
          <h1 className="cine-title">
            <span className="cine-title-line">Capture</span>
            <span className="cine-title-line cine-title-italic">the</span>
            <span className="cine-title-line">story.</span>
          </h1>
          <span className="cine-rule" aria-hidden="true" />
          <p className="lede">
            Cinematography, editing, and aerial for pictures that feel directed. Light first. Then the cut.
          </p>
        </div>

        <aside className="cine-stills" aria-label="Featured frames">
          {STILLS.map((still) => (
            <a key={still.id} className={`still still-${still.id}`} href="#work">
              <span className="still-index">{still.id}</span>
              <span className="still-meta">
                <strong>{still.title}</strong>
                <em>{still.meta}</em>
              </span>
            </a>
          ))}
        </aside>

        <div className="letterbox">
          <span>01 — Portfolio</span>
          <span ref={timecodeRef} className="timecode">00:00:00:00</span>
          <span className="rec"><i /> Rec</span>
        </div>

        <svg className="grain" aria-hidden="true">
          <filter id="cine-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cine-grain)" />
        </svg>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="work" id="work" aria-label="Selected work">
        <header className="work-head">
          <p className="eyebrow">Selected pictures</p>
          <h2>Work that holds.</h2>
        </header>

        <div className="work-list">
          {WORK.map((piece) => (
            <article key={piece.id} className="work-row">
              <span className="work-index">{piece.id}</span>
              <div className={`work-still tone-${piece.tone}`} aria-hidden="true">
                <span />
              </div>
              <div className="work-copy">
                <h3>{piece.title}</h3>
                <p>{piece.role}</p>
              </div>
              <span className="work-year">{piece.year}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="cine-close" aria-label="Studio note">
        <p>From the first frame to the final grade.</p>
      </section>
    </div>
  );
}

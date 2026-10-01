import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import './cinematic.css';

const STILLS = [];

const WORK = [
  { id: '01', title: 'Project One', role: 'Cinematography', year: '2025', tone: 'cool' },
  { id: '02', title: 'Project Two', role: 'Edit and grade', year: '2025', tone: 'warm' },
  { id: '03', title: 'Project Three', role: 'Commercial', year: '2024', tone: 'neutral' },
  { id: '04', title: 'Project Four', role: 'Aerial and edit', year: '2024', tone: 'amber' },
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

function VideoEditorFrame() {
  const videoRef = useRef(null);
  const playheadRef = useRef(null);
  const timeDisplayRef = useRef(null);
  const isResettingRef = useRef(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  useLayoutEffect(() => {
    const video = videoRef.current;
    const playhead = playheadRef.current;
    const timeDisplay = timeDisplayRef.current;
    if (!video || !playhead || !timeDisplay) return;

    const START_TIME = 9;

    const initVideo = async () => {
      video.currentTime = START_TIME;
      video.style.opacity = '1';
      try {
        await video.play();
      } catch (e) {
        console.log('Autoplay prevented');
      }
    };

    const handleTimeUpdate = () => {
      if (isResettingRef.current) return;

      if (video.currentTime >= video.duration - 0.1) {
        isResettingRef.current = true;
        video.style.transition = 'opacity 0.3s ease';
        video.style.opacity = '0';

        setTimeout(() => {
          video.currentTime = START_TIME;
          video.style.transition = 'opacity 0.3s ease';
          video.style.opacity = '1';

          setTimeout(() => {
            isResettingRef.current = false;
            video.play();
          }, 300);
        }, 300);
      } else {
        const progress = (video.currentTime / video.duration) * 100;
        playhead.style.left = `${progress}%`;
        timeDisplay.textContent = formatTime(video.currentTime);
      }
    };

    initVideo();
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <div className="video-editor-frame">
      <div className="editor-viewport">
        <video
          ref={videoRef}
          className="editor-video"
          autoPlay
          muted
          playsInline
        >
          <source src="/perfomance/showreel.mp4" type="video/mp4" />
        </video>
        <div className="editor-overlay">
          <div className="editor-metrics">
            <span className="metric">1080p</span>
            <span className="metric">24fps</span>
            <span className="metric">REC</span>
          </div>
        </div>
      </div>
      <div className="editor-timeline">
        <div className="timeline-header">
          <span ref={timeDisplayRef} className="timeline-time">00:09:00</span>
          <span className="timeline-label">Timeline</span>
        </div>
        <div className="timeline-track-container">
          <div className="timeline-track">
            <div className="timeline-ruler">
              <span className="ruler-mark">00:00</span>
              <span className="ruler-mark">00:15</span>
              <span className="ruler-mark">00:30</span>
              <span className="ruler-mark">00:45</span>
              <span className="ruler-mark">01:00</span>
            </div>
            <div ref={playheadRef} className="timeline-playhead" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CinematicPortfolio() {
  const rootRef = useRef(null);
  const timecodeRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(root.querySelectorAll('.cine-title-line, .portfolio-card, .cine-rule'), {
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

        gsap.from('.video-editor-frame', {
          scale: 0.95,
          autoAlpha: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.2,
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

        gsap.utils.toArray('.portfolio-card').forEach((card) => {
          gsap.from(card, {
            y: 36,
            autoAlpha: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
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

        <div className="cine-hero-content">
          <div className="cine-hero-copy">
            <p className="eyebrow">HYENA STUDIO — Visual storytelling</p>
            <h1 className="cine-title">
              <span className="cine-title-line">We craft</span>
              <span className="cine-title-line cine-title-italic">moments</span>
              <span className="cine-title-line">that stay.</span>
            </h1>
            <span className="cine-rule" aria-hidden="true" />
            <p className="lede">
              From the first light to the final frame. Every cut tells a story, every angle has a purpose.
            </p>
          </div>

          <VideoEditorFrame />
        </div>

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
          <p className="eyebrow">Selected work</p>
          <h2>Our portfolio</h2>
        </header>

        <div className="portfolio-grid">
          {WORK.map((piece) => (
            <article key={piece.id} className="portfolio-card">
              <div className="portfolio-image">
                <div className={`image-placeholder tone-${piece.tone}`}>
                  <span className="placeholder-text">{piece.title}</span>
                </div>
                <div className="portfolio-overlay">
                  <div className="overlay-content">
                    <span className="overlay-category">{piece.role}</span>
                    <h3 className="overlay-title">{piece.title}</h3>
                    <span className="overlay-year">{piece.year}</span>
                  </div>
                </div>
              </div>
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

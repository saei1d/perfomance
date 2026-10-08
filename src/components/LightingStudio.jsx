import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { STATUE_URL, STAGES } from './lighting/constants';
import StudioScene from './lighting/StudioScene';
import { labelOpacity } from './lighting/timeline';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { supportsWebGL } from '../lib/webgl';
import CinematicTimeline from './lighting/CinematicTimeline';
import './lighting/lighting.css';
import './lighting/cinematic-timeline.css';

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

function useCompactViewport() {
  const query = '(max-width: 900px)';
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setCompact(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return compact;
}

export default function LightingStudio() {
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const progressRef = useRef(0);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const labelRefs = useRef({});
  const meterRef = useRef(null);
  const chapterRef = useRef(null);
  const compact = useCompactViewport();
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [webgl] = useState(supportsWebGL);
  const readyRef = useRef(false);
  const paintRef = useRef(() => {});
  const invalidateRef = useRef(() => {});
  const mouseRef = useRef({ x: 0, y: 0 });

  const markReady = useCallback(() => {
    readyRef.current = true;
    setReady(true);
    paintRef.current(progressRef.current);
    invalidateRef.current();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        useGLTF.preload(STATUE_URL, false, false);
        setArmed(true);
        loader.disconnect();
      },
      { rootMargin: '50% 0px' },
    );
    loader.observe(track);
    return () => loader.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const paint = (progress) => {
      STAGES.forEach((stage) => {
        const node = labelRefs.current[stage.id];
        if (!node) return;
        const opacity = labelOpacity(progress, stage.start, stage.end);
        node.style.opacity = String(opacity);
        node.setAttribute('aria-hidden', opacity > 0.4 ? 'false' : 'true');
      });

      if (meterRef.current) {
        meterRef.current.style.transform = `scaleX(${progress})`;
      }

      if (chapterRef.current) {
        const fade = 1 - Math.min(1, Math.max(0, (progress - 0.05) / 0.15));
        chapterRef.current.style.opacity = String(fade);
      }

      // Update timeline progress state
      setTimelineProgress(progress);
    };

    paintRef.current = paint;

    const proxy = { p: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            setTimelineProgress(self.progress);
            if (readyRef.current) paintRef.current(self.progress);
            invalidateRef.current();
          },
        },
      });
    });

    paintRef.current(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  // Mouse tracking for magnetic hover effect and cursor light
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };

      // Update CSS variables for cursor light effect
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        stickyRef.current.style.setProperty('--mouse-x', `${x}%`);
        stickyRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Magnetic hover effect on labels
  useEffect(() => {
    if (!ready) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      STAGES.forEach((stage) => {
        const node = labelRefs.current[stage.id];
        if (!node) return;

        gsap.from(node, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        // Magnetic hover effect
        const onPointerMove = (e) => {
          const r = node.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.15;
          const y = (e.clientY - r.top - r.height / 2) * 0.15;
          gsap.to(node, {
            x,
            y,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const onPointerLeave = () => {
          gsap.to(node, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        node.addEventListener('pointermove', onPointerMove);
        node.addEventListener('pointerleave', onPointerLeave);

        return () => {
          node.removeEventListener('pointermove', onPointerMove);
          node.removeEventListener('pointerleave', onPointerLeave);
        };
      });
    });

    return () => ctx.revert();
  }, [ready]);

  const fallback = (
    <div className="studio-fallback">
      <p>This lighting studio needs WebGL.</p>
      <p>Try Safari, Chrome, or Firefox with hardware acceleration turned on.</p>
    </div>
  );

  return (
    <section
      id="studio"
      ref={trackRef}
      className="studio-track"
      aria-label="Lighting studio"
    >
      <div ref={stickyRef} className="studio-sticky">
        <p className="sr-only">
          Scroll to build a cinematic still: darkness, key light, light position, fill & color, and rim light.
        </p>

        {webgl && armed && (
          <SceneBoundary fallback={fallback}>
            <div className="studio-canvas">
              <Canvas
                shadows
                frameloop="demand"
                dpr={compact ? [1, 1.15] : [1, 1.5]}
                camera={{
                  position: [0.35, 1.28, 10.5],
                  fov: compact ? 30 : 28,
                  near: 0.1,
                  far: 40,
                }}
                gl={{
                  antialias: !compact,
                  alpha: false,
                  stencil: false,
                  powerPreference: 'default',
                }}
                onCreated={({ gl, invalidate }) => {
                  gl.toneMappingExposure = 1.15;
                  invalidateRef.current = invalidate;
                  invalidate();
                }}
              >
                <StudioScene
                  progressRef={progressRef}
                  compact={compact}
                  onReady={markReady}
                  mousePosition={mouseRef.current}
                />
              </Canvas>
            </div>
          </SceneBoundary>
        )}

        {!webgl && fallback}

        <div className="studio-vignette" />
        <p ref={chapterRef} className="studio-chapter">03 — Lighting</p>

        {webgl && armed && ready && (
          <CinematicTimeline
            progress={timelineProgress}
            onSeek={(newProgress) => {
              progressRef.current = newProgress;
              setTimelineProgress(newProgress);
              paintRef.current(newProgress);
              invalidateRef.current();
            }}
            stages={STAGES}
          />
        )}

        <div className="studio-ui">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              ref={(node) => {
                labelRefs.current[stage.id] = node;
              }}
              className={`studio-label studio-label--${stage.id}`}
              aria-hidden={stage.id !== 'darkness'}
            >
              {stage.kicker ? <span className="studio-kicker">{stage.kicker}</span> : null}
              <h2>{stage.title}</h2>
              {stage.subtitle ? <p>{stage.subtitle}</p> : null}
            </div>
          ))}
        </div>

        <div className="studio-particles" aria-hidden="true">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="studio-meter" aria-hidden="true">
          <span ref={meterRef} />
        </div>

        {webgl && armed && !ready && <p className="studio-status">Loading studio</p>}
      </div>
    </section>
  );
}

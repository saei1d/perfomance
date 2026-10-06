import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { STATUE_URL, STAGES } from './lighting/constants';
import StudioScene from './lighting/StudioScene';
import { labelOpacity } from './lighting/timeline';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { supportsWebGL } from '../lib/webgl';
import './lighting/lighting.css';

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
        const fade = 1 - Math.min(1, Math.max(0, (progress - 0.04) / 0.12));
        chapterRef.current.style.opacity = String(fade);
      }
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
        },
        onUpdate: () => {
          progressRef.current = proxy.p;
          if (readyRef.current) paint(proxy.p);
          invalidateRef.current();
        },
      });
    });

    paint(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

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
                  position: [0.35, 1.28, 7.4],
                  fov: compact ? 34 : 32,
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
                  gl.toneMappingExposure = 0.98;
                  invalidateRef.current = invalidate;
                  invalidate();
                }}
              >
                <StudioScene progressRef={progressRef} compact={compact} onReady={markReady} />
              </Canvas>
            </div>
          </SceneBoundary>
        )}

        {!webgl && fallback}

        <div className="studio-vignette" />
        <p ref={chapterRef} className="studio-chapter">03 — Lighting</p>

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

        <div className="studio-meter" aria-hidden="true">
          <span ref={meterRef} />
        </div>

        {webgl && armed && !ready && <p className="studio-status">Loading studio</p>}
      </div>
    </section>
  );
}

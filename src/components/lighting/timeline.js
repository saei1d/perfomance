import { LIGHT } from './constants';

const NEUTRAL = { r: 0.97, g: 0.95, b: 0.91 };
const WARM = { r: 1, g: 0.74, b: 0.55 };

export function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

/** 0 before `start`, 1 after `end`. */
export function range(progress, start, end) {
  if (end === start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
}

export function smooth(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(a, b, t, out) {
  out.r = lerp(a.r, b.r, t);
  out.g = lerp(a.g, b.g, t);
  out.b = lerp(a.b, b.b, t);
  return out;
}

/**
 * Crossfade a stage label. `end` above 1 keeps the last card on screen.
 */
export function labelOpacity(progress, start, end) {
  const fade = 0.03;
  const fadeIn = start <= 0 ? 1 : smooth(range(progress, start, start + fade));
  const fadeOut = end >= 1 ? 1 : 1 - smooth(range(progress, end - fade, end));
  return clamp01(fadeIn * fadeOut);
}

/**
 * One normalized progress value drives every light, the camera, and nothing else.
 * `compact` shortens the camera move on small screens.
 * Writes into `out` so the render loop does not allocate.
 */
export function sampleTimeline(progress, compact, out) {
  const p = clamp01(progress);
  const travel = compact ? 0.42 : 1;

  const arrive = smooth(range(p, 0.15, 0.3));
  const arc = smooth(range(p, 0.3, 0.45));
  const angle = lerp(-0.95, 0.72, arc);
  const radius = lerp(5.1, 3.35, Math.max(arrive, arc));

  out.keyIntensity = lerp(LIGHT.keyIdle, LIGHT.key, smooth(range(p, 0.12, 0.3)));
  out.keyPosition.x = Math.sin(angle) * radius;
  out.keyPosition.y = lerp(2.35, 3.45, arc);
  out.keyPosition.z = Math.cos(angle) * lerp(3.4, 2.35, arc);

  out.fillIntensity = LIGHT.fill * smooth(range(p, 0.45, 0.6));
  out.rimIntensity = LIGHT.rim * smooth(range(p, 0.6, 0.75));
  out.ambient = lerp(LIGHT.ambientStart, LIGHT.ambientEnd, smooth(range(p, 0.15, 0.75)));

  const colorMix = smooth(range(p, 0.45, 0.6));
  lerpColor(NEUTRAL, WARM, colorMix, out.keyColor);

  const glide = smooth(p) * 0.58 + smooth(range(p, 0.88, 1)) * 0.42;
  const cameraMix = glide * travel;

  // Camera views directly from front of the can - much further back
  out.camera.x = 0;
  out.camera.y = lerp(1.22, 0.98, cameraMix);
  out.camera.z = 10.0;
  out.look.x = 0;
  out.look.y = lerp(0.95, 1.0, cameraMix);
  out.look.z = 0;

  return out;
}

export function createTimelineSample() {
  return {
    keyIntensity: 0,
    keyPosition: { x: -2.6, y: 2.35, z: 3.2 },
    fillIntensity: 0,
    rimIntensity: 0,
    ambient: LIGHT.ambientStart,
    keyColor: { r: NEUTRAL.r, g: NEUTRAL.g, b: NEUTRAL.b },
    camera: { x: 0, y: 1.22, z: 10.0 },
    look: { x: 0, y: 0.95, z: 0 },
  };
}

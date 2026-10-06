let supported;

/**
 * Detect WebGL once, then release the probe.
 * A fresh context on every call (StrictMode runs initializers twice, and both
 * studios call this) is enough to push Chrome over its context limit and lose
 * the real renderer.
 */
export function supportsWebGL() {
  if (supported !== undefined) return supported;
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  try {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    supported = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    supported = false;
  }
  return supported;
}

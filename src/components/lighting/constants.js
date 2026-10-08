/** Served from /public. Vite `base` is `/perfomance/`. */
export const STATUE_URL = '/perfomance/energy_drink.glb';

/** Physically based spotlight intensities, in candela. */
export const LIGHT = {
  key: 1500,
  fill: 600,
  rim: 800,
  /** Faint key at progress 0, just enough for a silhouette. */
  keyIdle: 5,
  ambientStart: 0.08,
  ambientEnd: 0.15,
};

export const STAGES = [
  { id: 'darkness', start: 0, end: 0.2, kicker: '01', title: 'DARKNESS', subtitle: '' },
  { id: 'key', start: 0.2, end: 0.4, kicker: '02', title: 'KEY LIGHT', subtitle: 'Illuminate the product.' },
  { id: 'position', start: 0.4, end: 0.6, kicker: '03', title: 'POSITION', subtitle: 'Adjust the angle.' },
  { id: 'fillColor', start: 0.6, end: 0.8, kicker: '04', title: 'FILL & GREEN', subtitle: 'Add the green glow.' },
  { id: 'rim', start: 0.8, end: 1.0, kicker: '05', title: 'RIM LIGHT', subtitle: 'Define the edges.' },
];

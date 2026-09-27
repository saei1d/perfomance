/** Served from /public. Vite `base` is `/perfomance/`. */
export const STATUE_URL = '/perfomance/energy_drink.glb';

/** Physically based spotlight intensities, in candela. */
export const LIGHT = {
  key: 500,
  fill: 150,
  rim: 300,
  /** Faint key at progress 0, just enough for a silhouette. */
  keyIdle: 5,
  ambientStart: 0.05,
  ambientEnd: 0.1,
};

export const STAGES = [
  { id: 'darkness', start: 0, end: 0.15, kicker: '01', title: 'DARKNESS', subtitle: '' },
  { id: 'key', start: 0.15, end: 0.3, kicker: '02', title: 'KEY LIGHT', subtitle: 'Shape the subject.' },
  { id: 'position', start: 0.3, end: 0.45, kicker: '03', title: 'POSITION', subtitle: 'Change the mood.' },
  { id: 'fill', start: 0.45, end: 0.6, kicker: '04', title: 'FILL LIGHT', subtitle: 'Control the shadows.' },
  { id: 'color', start: 0.6, end: 0.75, kicker: '05', title: 'COLOR', subtitle: 'Set the tone.' },
  { id: 'rim', start: 0.75, end: 0.85, kicker: '06', title: 'RIM LIGHT', subtitle: 'Separate the subject.' },
  { id: 'story', start: 0.85, end: 1.01, kicker: '07', title: 'END STORY', subtitle: '' },
];

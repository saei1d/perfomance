/**
 * Working titles for the stills already in /public.
 * Replace title, year, role, and summary when real project names are ready.
 * Do not add clients, awards, or numbers that are not in the source material.
 */
const base = import.meta.env.BASE_URL;

export const projects = [
  {
    id: '01',
    title: 'Hearth line',
    role: 'Cinematography',
    year: '2025',
    image: `${base}partfolio1.jpg`,
    alt: 'Linear gas fireplace set into dark bookmatched stone, with several flames rising from charred logs.',
    summary:
      'A tight frame on the practical light. The stone, the glass, and the fire carry the picture.',
  },
  {
    id: '02',
    title: 'Stone study',
    role: 'Edit and grade',
    year: '2025',
    image: `${base}partfolio2.jpg`,
    alt: 'Bookmatched stone slab with a symmetrical dark and bronze pattern, filling the frame.',
    summary:
      'A material study. The grade holds the bronze in the stone without pushing it toward a filter.',
  },
  {
    id: '03',
    title: 'Shadow and vessel',
    role: 'Commercial',
    year: '2024',
    image: `${base}partfolio3.jpg`,
    alt: 'Warm interior with an olive tree casting a shadow on a tan wall beside a stone fireplace.',
    summary:
      'One practical source, a plant, and a wall. The shadow is the subject as much as the fire.',
  },
  {
    id: '04',
    title: 'The full wall',
    role: 'Interior still',
    year: '2024',
    image: `${base}partfolio4.jpg`,
    alt: 'Wide view of a living room centered on a tall bookmatched stone fireplace with a low fire.',
    summary:
      'The wide frame of the same interior. The slab, the fire, and the room held in one exposure.',
  },
  {
    id: '05',
    title: 'Finished still',
    role: 'Product photography',
    year: '2025',
    image: `${base}finalshot.webp`,
    alt: 'Finished product still from the studio photography set.',
    summary:
      'A still lit for the page. The object sits in a controlled falloff instead of a catalog wash.',
  },
];

export const projectRoles = ['All', ...new Set(projects.map((project) => project.role))];

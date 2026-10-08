import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import Drone3D from './Drone3D.jsx';
import './EquipmentSection.css';

const EQUIPMENT = [
  {
    id: '01',
    name: 'Cameras',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
    description: 'Sony FX3, RED Komodo, ARRI Alexa Mini'
  },
  {
    id: '02',
    name: 'Lenses',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    description: 'Zeiss Supreme, Canon CN-E, Sigma Cine'
  },
  {
    id: '03',
    name: 'Lighting',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2v1" />
        <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        <path d="M5.6 5.6l.7.7" />
        <path d="M18.4 5.6l-.7.7" />
        <path d="M5.6 18.4l.7-.7" />
        <path d="M18.4 18.4l-.7-.7" />
      </svg>
    ),
    description: 'Aputure, Nanlux, ARRI SkyPanel'
  },
  {
    id: '04',
    name: 'Audio',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    description: 'Sennheiser, Rode, Sound Devices'
  },
  {
    id: '05',
    name: 'Gimbals',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v7" />
        <path d="M12 15v7" />
        <path d="M2 12h7" />
        <path d="M15 12h7" />
        <path d="M5.5 5.5l3.5 3.5" />
        <path d="M15 15l3.5 3.5" />
        <path d="M5.5 18.5l3.5-3.5" />
        <path d="M15 9l3.5-3.5" />
      </svg>
    ),
    description: 'DJI Ronin, Freefly MoVI'
  },
  {
    id: '06',
    name: 'Drones',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v7" />
        <path d="M12 15v7" />
        <path d="M2 12h7" />
        <path d="M15 12h7" />
        <path d="M4.93 4.93l4.95 4.95" />
        <path d="M14.12 14.12l4.95 4.95" />
        <path d="M4.93 19.07l4.95-4.95" />
        <path d="M14.12 9.88l4.95-4.95" />
      </svg>
    ),
    description: 'DJI Inspire, Mavic 3 Pro, FPV'
  },
  {
    id: '07',
    name: 'Support',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M5 21h14" />
        <path d="M5 9l7-6 7 6" />
        <path d="M4 21l16-12" />
      </svg>
    ),
    description: 'Sachtler, Manfrotto, GVM'
  },
  {
    id: '08',
    name: 'Monitoring',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    description: 'SmallHD, Atomos, Teradek'
  },
];

function EquipmentSlider() {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (sliderRef.current) {
      setCanScrollLeft(sliderRef.current.scrollLeft > 0);
      setCanScrollRight(
        sliderRef.current.scrollLeft <
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => slider.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 220;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="equipment-slider-container">
      <button
        className="slider-arrow slider-arrow-left"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <span>←</span>
      </button>
      <div className="equipment-slider" ref={sliderRef}>
        {EQUIPMENT.map((item) => (
          <div key={item.id} className="equipment-card">
            <div className="equipment-icon">{item.icon}</div>
            <h3 className="equipment-name">{item.name}</h3>
            <p className="equipment-description">{item.description}</p>
          </div>
        ))}
      </div>
      <button
        className="slider-arrow slider-arrow-right"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <span>→</span>
      </button>
    </div>
  );
}

export default function EquipmentSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      // Header animations
      gsap.from('.equipment-header .eyebrow', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });

      gsap.from('.equipment-header h2', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      gsap.from('.equipment-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
        },
      });

      // Kit section animations
      gsap.from('.equipment-slider-header', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.equipment-slider-wrapper',
          start: 'top 80%',
        },
      });

      // Staggered card reveal
      gsap.from('.equipment-card', {
        x: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.equipment-slider-wrapper',
          start: 'top 75%',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="equipment" className="equipment-section" aria-label="Equipment">
      <div className="equipment-header">
        <p className="eyebrow">05 — Equipment</p>
        <h2>In the air</h2>
        <p className="equipment-subtitle">
          The aircraft the studio flies, then the rest of the kit.
        </p>
      </div>

      <div className="equipment-drone-section">
        <Drone3D />
      </div>

      <div className="equipment-slider-wrapper">
        <div className="equipment-slider-header">
          <h3>The kit</h3>
          <p>Cameras, light, sound, and aircraft the studio actually carries.</p>
        </div>
        <EquipmentSlider />
      </div>
    </section>
  );
}

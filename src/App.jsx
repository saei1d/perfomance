import { useEffect, useRef, useState } from 'react';
import CinematicPortfolio from './components/cinematic/CinematicPortfolio';
import Drone3D from './components/Drone3D';
import LightingStudio from './components/LightingStudio';
import Footer from './components/Footer';
import TrustedBy from './components/TrustedBy';
import './App.css';

function AerialSection() {
  const stageRef = useRef(null);
  const [showDrone, setShowDrone] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShowDrone(true);
        observer.disconnect();
      },
      { rootMargin: '60% 0px' },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="aerial" className="aerial" aria-label="Aerial and drone">
      <div className="aerial-copy">
        <p className="eyebrow">02 — Aerial</p>
        <h2>A modern eye.</h2>
        <p>
          The aircraft is part of the picture. Orbit the body, spin the rotors, and treat the tool like a camera.
        </p>
      </div>
      <div className="aerial-stage" ref={stageRef}>
        <span className="aerial-corner aerial-corner-tl" aria-hidden="true" />
        <span className="aerial-corner aerial-corner-tr" aria-hidden="true" />
        <span className="aerial-corner aerial-corner-bl" aria-hidden="true" />
        <span className="aerial-corner aerial-corner-br" aria-hidden="true" />
        {showDrone ? <Drone3D /> : <p className="aerial-hold">Aerial unit</p>}
      </div>
    </section>
  );
}

function SectionTransition({ title, description, dark = false, id }) {
  return (
    <section id={id} className={`section-transition ${dark ? 'section-transition--dark' : ''}`}>
      <div className="section-transition-content">
        <h2 className="section-transition-title">{title}</h2>
        <p className="section-transition-description">{description}</p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <header className="nav">
        <a className="wordmark" href="#top">HYENA studio</a>
        <nav aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#aerial">Aerial</a>
        </nav>
      </header>
      <main>
        <CinematicPortfolio />
        <LightingStudio />
        <SectionTransition
          id="product-photography"
          title="Product Photography"
          description="Master the art of light and shadow. Our studio creates cinematic stills that transform products into visual stories, using precise lighting techniques to reveal texture, form, and emotion in every shot."
        />
        <AerialSection />
        <SectionTransition
          id="aerial-cinematography"
          title="Modern Aerial Cinematography"
          description="Elevate your perspective with cutting-edge drone technology. From sweeping aerial landscapes to dynamic product shots, we capture the world from angles that inspire and amaze, bringing a new dimension to visual storytelling."
          dark
        />
      </main>
      <TrustedBy />
      <Footer />
    </>
  );
}

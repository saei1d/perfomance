import { useState, useEffect } from "react";
import DroneAnimation from "./components/drone/DroneAnimation";
import Drone3D from "./components/Drone3D";
import ProjectCards from "./components/ProjectCards";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import "./App.css";

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll position for smooth animations
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min(scrollTop / docHeight, 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="cinematic-prototype">
      {/* Fixed Background Animation */}
      <DroneAnimation />

      {/* SECTION 1: Hero with Drone */}
      <section className="section section-1">
        <div className="hero-content">
          <p className="brand-subtitle">TORONTO-BASED VIDEO PRODUCTION</p>
          <h1 className="brand-title">
            <span className="title-line">CAPTURE</span>
            <span className="title-line">YOUR</span>
            <span className="title-line">STORY</span>
          </h1>
          <p className="scroll-hint">Scroll to explore</p>
        </div>
      </section>

      {/* SECTION 2: About */}
      <section className="section section-2">
        <About />
      </section>

      {/* SECTION 3: Services */}
      <section className="section section-3">
        <Services />
      </section>

      {/* SECTION 4: 3D Drone */}
      <section className="section section-4">
        <Drone3D />
      </section>

      {/* SECTION 5: Selected Work */}
      <section className="section section-5">
        <ProjectCards />
      </section>

      {/* SECTION 6: Contact */}
      <section className="section section-6">
        <Contact />
      </section>
    </main>
  );
}

export default App;

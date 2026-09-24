import { useEffect, useState } from "react";
import "./drone.css";

/**
 * DroneAnimation Component
 * 
 * Lightweight CSS-based drone animation using scroll position
 * No Three.js, no GPU-heavy rendering
 * 
 * NOTE: For the final version, replace with:
 * - Real drone footage video (company's actual aerial shots)
 * - Or high-quality PNG/WebP drone image with transparency
 * 
 * Current implementation uses CSS transforms for smooth cinematic movement
 */
export default function DroneAnimation() {
  const [scrollProgress, setScrollProgress] = useState(0);

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
    <div className="drone-animation">
      {/* Drone placeholder - will be replaced with real footage */}
      <div 
        className="drone-placeholder"
        style={{
          transform: `translateY(${scrollProgress * 200}px) scale(${1 + scrollProgress * 0.3})`,
          opacity: 1 - scrollProgress * 0.5
        }}
      >
        <div className="drone-icon">
          <svg viewBox="0 0 100 100" fill="none">
            {/* Simple drone silhouette */}
            <rect x="30" y="45" width="40" height="10" rx="2" fill="#333" />
            <circle cx="50" cy="55" r="8" fill="#222" />
            <line x1="30" y1="50" x2="15" y2="30" stroke="#444" strokeWidth="3" />
            <line x1="70" y1="50" x2="85" y2="30" stroke="#444" strokeWidth="3" />
            <line x1="30" y1="50" x2="15" y2="70" stroke="#444" strokeWidth="3" />
            <line x1="70" y1="50" x2="85" y2="70" stroke="#444" strokeWidth="3" />
            <circle cx="15" cy="30" r="6" fill="#222" />
            <circle cx="85" cy="30" r="6" fill="#222" />
            <circle cx="15" cy="70" r="6" fill="#222" />
            <circle cx="85" cy="70" r="6" fill="#222" />
          </svg>
        </div>
      </div>

      {/* Cinematic background layers */}
      <div 
        className="background-layer layer-1"
        style={{ transform: `translateY(${scrollProgress * 50}px)` }}
      />
      <div 
        className="background-layer layer-2"
        style={{ transform: `translateY(${scrollProgress * 100}px)` }}
      />
    </div>
  );
}

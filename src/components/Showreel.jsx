/**
 * Showreel Component
 * 
 * NOTE: This is a placeholder for the showreel section.
 * For the final version, replace with:
 * - A real video player with cinematic showreel
 * - Or a high-quality cinematic image with video overlay
 * - Custom video controls with minimal design
 * 
 * Recommended video specs:
 * - 16:9 aspect ratio
 * - 4K or 1080p resolution
 * - H.264 codec for web compatibility
 * - Cinematic color grading
 * - Duration: 60-90 seconds
 * 
 * For placeholder, using a gradient with cinematic feel
 */
export default function Showreel() {
  return (
    <div className="showreel-container">
      <div className="showreel-placeholder">
        <div className="showreel-gradient" />
        <div className="showreel-content">
          <h2 className="showreel-title">SHOWREEL</h2>
          <p className="showreel-subtitle">Our Best Work</p>
          <div className="play-button">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.1)" />
              <path d="M32 25L60 40L32 55V25Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

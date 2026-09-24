/**
 * About Component
 * 
 * Introduces the Toronto-based videographer and editor team
 */
export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <p className="about-subtitle">ABOUT US</p>
        <h2 className="about-title">
          <span className="about-title-line">TORONTO'S</span>
          <span className="about-title-line">PREMIER</span>
          <span className="about-title-line">VIDEO TEAM</span>
        </h2>
        <p className="about-description">
          We are a passionate team of videographers and editors based in Toronto, 
          specializing in cinematic storytelling. With years of experience in commercial 
          production, documentary filmmaking, and aerial cinematography, we bring your 
          vision to life with precision and creativity.
        </p>
        <p className="about-description">
          From concept to delivery, we handle every aspect of video production with 
          professional equipment and expert craftsmanship. Our team combines technical 
          excellence with artistic vision to create compelling visual narratives.
        </p>
        <div className="about-stats">
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}

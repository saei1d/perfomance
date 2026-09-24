/**
 * Contact Component
 * 
 * Contact information and call-to-action for Toronto-based team
 */
export default function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <p className="contact-subtitle">GET IN TOUCH</p>
        <h2 className="contact-title">LET'S CREATE TOGETHER</h2>
        <p className="contact-description">
          Ready to bring your vision to life? Contact us to discuss your project 
          and discover how we can help tell your story through powerful visual content.
        </p>
        
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div className="contact-details">
              <h4 className="contact-label">Location</h4>
              <p className="contact-value">Toronto, Ontario, Canada</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">📧</div>
            <div className="contact-details">
              <h4 className="contact-label">Email</h4>
              <p className="contact-value">hello@videoteam.com</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">📱</div>
            <div className="contact-details">
              <h4 className="contact-label">Phone</h4>
              <p className="contact-value">+1 (416) 555-0123</p>
            </div>
          </div>
        </div>

        <button className="contact-button">
          START YOUR PROJECT
        </button>
      </div>
    </div>
  );
}

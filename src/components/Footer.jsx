import { useState } from 'react';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">HYENA studio</h3>
            <p className="footer-tagline">Professional cinematography, editing, and aerial production studio.</p>
          </div>

          <div className="footer-links">
            <div className="footer-link-group">
              <h4 className="footer-link-title">Work</h4>
              <ul className="footer-link-list">
                <li><a href="#work">Portfolio</a></li>
                <li><a href="#aerial">Aerial</a></li>
                <li><a href="#studio">Studio</a></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="footer-link-title">Connect</h4>
              <ul className="footer-link-list">
                <li><a href="mailto:hello@hyenastudio.com">Email</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Vimeo</a></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="footer-link-title">Studio</h4>
              <ul className="footer-link-list">
                <li>Iran</li>
                <li><a href="tel:+989123456789">+98 912 345 6789</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4 className="footer-link-title">Stay updated</h4>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            <p className="newsletter-note">Get the latest work and updates directly to your inbox.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">© 2025 HYENA studio. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-gradient"></div>
    </footer>
  );
}
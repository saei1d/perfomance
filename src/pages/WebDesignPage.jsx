import { useEffect, useRef, useState } from 'react';
import { Link } from '../lib/router';
import './WebDesignPage.css';

export default function WebDesignPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [robotY, setRobotY] = useState(0);
  const laptopRef = useRef(null);
  const robotRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobotY(Math.sin(Date.now() / 1000) * 10);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <article className="page web-design-page">
      <div className="web-design-hero">
        <div className="hero-content">
          <p className="kicker">Web Design Services</p>
          <h1 className="page-title">
            Build Your Digital Future
          </h1>
          <p className="page-lede">
            Custom websites, web applications, AI chatbots, and web scrapers. 
            We bring your ideas to life from anywhere in the world.
          </p>
          <div className="hero-cta">
            <Link to="/web-design#contact" className="btn btn-solid btn-large">
              Start Your Project
            </Link>
          </div>
        </div>

        <div className="hero-visuals">
          <div 
            className="laptop-container"
            ref={laptopRef}
            style={{
              transform: `rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 5}deg)`,
            }}
          >
            <svg className="laptop" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="180" height="110" rx="8" fill="#1a1a1a" stroke="#ffb901" strokeWidth="2"/>
              <rect x="15" y="15" width="170" height="100" rx="4" fill="#0a0a0a"/>
              <rect x="20" y="20" width="160" height="90" rx="2" fill="#1e1e1e">
                <animate attributeName="fill" values="#1e1e1e;#2a2a2a;#1e1e1e" dur="3s" repeatCount="indefinite"/>
              </rect>
              <rect x="70" y="120" width="60" height="8" rx="2" fill="#333"/>
              <rect x="20" y="128" width="160" height="4" rx="2" fill="#222"/>
              <circle cx="30" cy="25" r="2" fill="#ffb901">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="40" cy="25" r="2" fill="#e8e2d6">
                <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

          <div 
            className="robot-container"
            ref={robotRef}
            style={{
              transform: `translateY(${robotY}px)`,
            }}
          >
            <svg className="robot" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="35" y="10" width="30" height="25" rx="8" fill="#1a1a1a" stroke="#ffb901" strokeWidth="2"/>
              <circle cx="45" cy="22" r="4" fill="#ffb901">
                <animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="55" cy="22" r="4" fill="#ffb901">
                <animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
              </circle>
              <rect x="40" y="35" width="20" height="30" rx="4" fill="#222" stroke="#ffb901" strokeWidth="1"/>
              <rect x="25" y="40" width="15" height="8" rx="2" fill="#1a1a1a" stroke="#ffb901" strokeWidth="1">
                <animate attributeName="rotate" values="-10 32 44;10 32 44;-10 32 44" dur="2s" repeatCount="indefinite"/>
              </rect>
              <rect x="60" y="40" width="15" height="8" rx="2" fill="#1a1a1a" stroke="#ffb901" strokeWidth="1">
                <animate attributeName="rotate" values="10 67 44;-10 67 44;10 67 44" dur="2s" repeatCount="indefinite"/>
              </rect>
              <rect x="30" y="65" width="40" height="35" rx="6" fill="#1a1a1a" stroke="#ffb901" strokeWidth="2"/>
              <rect x="35" y="70" width="30" height="5" rx="2" fill="#ffb901">
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
              </rect>
              <rect x="35" y="80" width="30" height="5" rx="2" fill="#ffb901">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
              </rect>
              <rect x="35" y="90" width="30" height="5" rx="2" fill="#ffb901">
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
              </rect>
            </svg>
          </div>

          <div className="floating-code">
            <code>{`{ "service": "web", "global": true }`}</code>
          </div>
        </div>
      </div>

      <section className="services-section">
        <h2>What We Build</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>Custom Websites</h3>
            <p>Bespoke designs tailored to your brand and goals.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">⚛️</div>
            <h3>Web Applications</h3>
            <p>React, Vue, Next.js - modern and scalable solutions.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h3>AI Chatbots</h3>
            <p>Intelligent conversational agents for your business.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🕷️</div>
            <h3>Web Scrapers</h3>
            <p>Data extraction and automation solutions.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎨</div>
            <h3>UI/UX Design</h3>
            <p>User-centered design that converts visitors to customers.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🚀</div>
            <h3>Performance</h3>
            <p>Fast, SEO-optimized, and accessible web experiences.</p>
          </div>
        </div>
      </section>

      <section className="global-section">
        <div className="global-content">
          <h2>Worldwide Services</h2>
          <p>
            We accept projects from clients around the globe. Distance is not a barrier 
            to building exceptional digital products together.
          </p>
          <div className="global-badges">
            <span className="badge">🌍 Global Reach</span>
            <span className="badge">💻 Remote Work</span>
            <span className="badge">🕐 24/7 Support</span>
            <span className="badge">🔒 Secure</span>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>Start Your Project</h2>
        <p>Fill out the form below and we'll get back to you within 24 hours.</p>
        
        <form className="web-design-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="your@email.com" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Type</label>
            <select id="service" required>
              <option value="">Select a service</option>
              <option value="website">Custom Website</option>
              <option value="webapp">Web Application</option>
              <option value="chatbot">AI Chatbot</option>
              <option value="scraper">Web Scraper</option>
              <option value="design">UI/UX Design</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget Range</label>
            <select id="budget" required>
              <option value="">Select budget</option>
              <option value="small">$500 - $2,000</option>
              <option value="medium">$2,000 - $5,000</option>
              <option value="large">$5,000 - $10,000</option>
              <option value="enterprise">$10,000+</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Project Details</label>
            <textarea 
              id="message" 
              rows={5} 
              placeholder="Tell us about your project..."
              required
            />
          </div>

          <button type="submit" className="btn btn-solid btn-large">
            Submit Inquiry
          </button>
        </form>
      </section>
    </article>
  );
}

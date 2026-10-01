import { useState } from 'react';
import './navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Work', href: '#work' },
    { name: 'Studio', href: '#studio' },
    { name: 'Photography', href: '#photography' },
    { name: 'Equipment', href: '#equipment' },
  ];

  return (
    <header className="modern-nav">
      <div className="nav-container">
        <div className="nav-content">
          <a href="#top" className="nav-logo">
            HYENA STUDIO
          </a>

          <nav className="nav-desktop" aria-label="Main navigation">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="nav-link"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <button
            className="nav-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className={`hamburger ${isOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="nav-mobile" aria-label="Mobile navigation">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="nav-mobile-link"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

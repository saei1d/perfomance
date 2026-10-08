import { useEffect, useId, useRef, useState } from 'react';
import { Link } from '../../lib/router';
import { useRoute } from '../../lib/route-context';
import { nav, studio } from '../../data/site';
import './shell.css';

export default function SiteNav() {
  const { path } = useRoute();
  const [menuPath, setMenuPath] = useState(null);
  const open = menuPath === path;
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);
  const panelId = useId();
  const closeRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') setMenuPath(null);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`site-nav${scrolled || open ? ' is-solid' : ''}`}>
      <div className="site-nav-bar">
        <Link to="/" className="wordmark">
          {studio.name}
        </Link>

        <nav className="site-nav-desktop" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="site-nav-link">
              {item.label}
            </Link>
          ))}
          <Link to="/collaborate" className="nav-cta">
            Start a project
          </Link>
        </nav>

        <button
          ref={closeRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setMenuPath((current) => (current === path ? null : path))}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div
        id={panelId}
        className={`site-nav-panel${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="panel-link" onClick={() => setMenuPath(null)}>
              {item.label}
            </Link>
          ))}
          <Link to="/collaborate" className="panel-link panel-link-cta" onClick={() => setMenuPath(null)}>
            Start a project
          </Link>
        </nav>
        <p className="panel-meta">{studio.city}</p>
      </div>
    </header>
  );
}

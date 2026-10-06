import { useRef } from 'react';
import { Link } from '../lib/router';
import { useReveal } from '../lib/useReveal';
import { namedCollaboration, studio } from '../data/site';
import './pages.css';

export default function ContactPage() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <article ref={rootRef} className="page contact-page">
      <header className="page-hero">
        <p className="kicker" data-reveal>
          Contact
        </p>
        <h1 className="page-title" data-reveal>
          Write to the studio.
        </h1>
        <p className="page-lede" data-reveal>
          A short note is enough to begin. If the work fits, we reply and set a time to talk about the picture, the schedule, and the finish.
        </p>
      </header>

      <a className="email-display" href={`mailto:${studio.email}`} data-reveal>
        <span>Email</span>
        {studio.email}
      </a>

      <dl className="contact-facts" data-reveal>
        <div>
          <dt>Studio</dt>
          <dd>
            {studio.city}, {studio.region}
          </dd>
        </div>
        <div>
          <dt>Work</dt>
          <dd>Film, edit, grade, aerial, stills</dd>
        </div>
        <div>
          <dt>Collaboration</dt>
          <dd>{namedCollaboration}</dd>
        </div>
      </dl>

      <section className="contact-paths" aria-label="Ways to continue">
        <Link to="/collaborate" className="path-card" data-reveal>
          <span>01</span>
          <h2>Send a brief</h2>
          <p>Project type, budget, timing, and a description of the picture.</p>
        </Link>
        <Link to="/work" className="path-card" data-reveal>
          <span>02</span>
          <h2>See the stills</h2>
          <p>A short archive of interiors and product photographs from the studio.</p>
        </Link>
      </section>
    </article>
  );
}

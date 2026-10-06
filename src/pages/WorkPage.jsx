import { useMemo, useRef, useState } from 'react';
import { Link } from '../lib/router';
import { useReveal } from '../lib/useReveal';
import { projectRoles, projects } from '../data/projects';
import './pages.css';

export default function WorkPage() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  const [role, setRole] = useState('All');

  const visible = useMemo(
    () => (role === 'All' ? projects : projects.filter((project) => project.role === role)),
    [role],
  );

  const [feature, ...rest] = visible;

  return (
    <article ref={rootRef} className="page work-page">
      <header className="page-hero work-hero">
        <div>
          <p className="kicker" data-reveal>
            Selected work
          </p>
          <h1 className="page-title" data-reveal>
            Pictures from the studio.
          </h1>
        </div>
        <p className="page-lede" data-reveal>
          A short set of stills already in the studio archive. Titles are working titles until the final project names replace them. The showreel on the homepage is the moving image.
        </p>
      </header>

      <div className="filters" role="toolbar" aria-label="Filter by role">
        {projectRoles.map((item) => (
          <button
            key={item}
            type="button"
            className="filter"
            aria-pressed={role === item}
            onClick={() => setRole(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {feature ? (
        <article className="feature" id={feature.id} data-reveal>
          <div className="feature-media">
            <img src={feature.image} alt={feature.alt} />
          </div>
          <div className="feature-copy">
            <div>
              <p>
                {feature.id} — {feature.role}
              </p>
              <h2>{feature.title}</h2>
              <p>{feature.summary}</p>
            </div>
            <p className="feature-year">{feature.year}</p>
          </div>
        </article>
      ) : (
        <p className="empty-work">Nothing in this cut yet.</p>
      )}

      <div className="work-stack">
        {rest.map((project, index) => (
          <article
            key={project.id}
            id={project.id}
            className={`stack-piece${index % 2 ? ' is-flip' : ''}`}
            data-reveal
          >
            <div className="stack-media">
              <img src={project.image} alt={project.alt} />
            </div>
            <div className="stack-copy">
              <p>
                {project.id} — {project.year}
              </p>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <p className="stack-role">{project.role}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="page-end" data-reveal>
        <p className="kicker">A picture of your own</p>
        <h2>Tell us what the frame has to do.</h2>
        <Link to="/collaborate" className="btn btn-solid">
          Start a project
        </Link>
      </section>
    </article>
  );
}

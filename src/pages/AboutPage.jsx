import { useRef } from 'react';
import { Link } from '../lib/router';
import { useReveal } from '../lib/useReveal';
import { disciplines, method, principles, studio } from '../data/site';
import { projects } from '../data/projects';
import './pages.css';

export default function AboutPage() {
  const rootRef = useRef(null);
  useReveal(rootRef);
  const still = projects[2];

  return (
    <article ref={rootRef} className="page about-page">
      <header className="page-hero">
        <p className="kicker" data-reveal>
          {studio.city} — About the studio
        </p>
        <h1 className="page-title" data-reveal>
          We shoot it.
          <em> We finish it.</em>
        </h1>
        <p className="page-lede" data-reveal>
          Hyena Studio is a film and post studio in Toronto. Cinematography, editing, grade, aerial, and still photography live in one place, so the picture does not change hands halfway through.
        </p>
      </header>

      <figure className="about-still" data-reveal>
        <img src={still.image} alt={still.alt} />
        <figcaption>
          <span>{still.id}</span>
          {still.title} — {still.role}
        </figcaption>
      </figure>

      <section className="belief" aria-labelledby="belief-title">
        <p className="kicker" data-reveal>
          What we believe
        </p>
        <h2 id="belief-title" data-reveal>
          The frame should still make sense with the sound off.
        </h2>
        <div className="belief-copy" data-reveal>
          <p>
            A moving image is a series of decisions about light, time, and what to leave out. We would rather hold one clear shot than cover a scene with ten indifferent ones.
          </p>
          <p>
            Clients come to us when the picture has to carry the idea — a product, a room, a place, a person — and the finish has to match the exposure.
          </p>
        </div>
      </section>

      <section className="split-list" aria-labelledby="principles-title">
        <h2 id="principles-title" data-reveal>
          How we decide
        </h2>
        <ol>
          {principles.map((item) => (
            <li key={item.id} data-reveal>
              <span>{item.id}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="discipline-band" aria-labelledby="practice-title">
        <div className="discipline-intro" data-reveal>
          <p className="kicker">The practice</p>
          <h2 id="practice-title">Four ways the studio works.</h2>
        </div>
        <ul>
          {disciplines.map((item) => (
            <li key={item.id} data-reveal>
              <span>{item.id}</span>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="split-list" aria-labelledby="method-title">
        <h2 id="method-title" data-reveal>
          A project, in order
        </h2>
        <ol>
          {method.map((item) => (
            <li key={item.id} data-reveal>
              <span>{item.id}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-end" data-reveal>
        <p className="kicker">Work with the studio</p>
        <h2>Bring the picture, not a deck of adjectives.</h2>
        <Link to="/collaborate" className="btn btn-solid">
          Start a project
        </Link>
      </section>
    </article>
  );
}

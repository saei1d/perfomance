import { Link } from '../../lib/router';
import { footerStudio, footerVisit, namedCollaboration, studio } from '../../data/site';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-close">
        <p className="kicker">Next</p>
        <h2>If the picture matters, start with a note.</h2>
        <div className="footer-actions">
          <a className="btn btn-solid" href={`mailto:${studio.email}`}>
            {studio.email}
          </a>
          <Link to="/collaborate" className="btn btn-line">
            Send a brief
          </Link>
        </div>
      </div>

      <div className="footer-grid">
        <div>
          <p className="footer-label">Visit</p>
          <ul>
            {footerVisit.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-label">On this site</p>
          <ul>
            {footerStudio.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-label">Studio</p>
          <ul>
            <li>{studio.location}</li>
            <li>
              <a href={`mailto:${studio.email}`}>{studio.email}</a>
            </li>
            <li>Collaboration — {namedCollaboration}</li>
          </ul>
        </div>
      </div>

      <div className="footer-end">
        <p>
          © {year} {studio.name}
        </p>
        <p>Film, edit, aerial. {studio.city}.</p>
      </div>
    </footer>
  );
}

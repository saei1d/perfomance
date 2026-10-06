import { Link } from '../lib/router';
import './pages.css';

export default function NotFoundPage() {
  return (
    <article className="page">
      <header className="page-hero">
        <p className="kicker">Missing frame</p>
        <h1 className="page-title">This page is not in the cut.</h1>
        <p className="page-lede">The address does not match a page on the studio site.</p>
        <Link to="/" className="btn btn-solid">
          Back to the studio
        </Link>
      </header>
    </article>
  );
}

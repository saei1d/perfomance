import { lazy, Suspense, useEffect } from 'react';
import SiteNav from './components/layout/SiteNav';
import SiteFooter from './components/layout/SiteFooter';
import { Router } from './lib/router';
import { useRoute } from './lib/route-context';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CollaboratePage = lazy(() => import('./pages/CollaboratePage'));
import './App.css';
import './components/layout/shell.css';

const PAGES = {
  '/': HomePage,
  '/about': AboutPage,
  '/work': WorkPage,
  '/contact': ContactPage,
  '/collaborate': CollaboratePage,
};

const TITLES = {
  '/': 'Hyena Studio — Film, Edit, Aerial',
  '/about': 'About — Hyena Studio',
  '/work': 'Work — Hyena Studio',
  '/contact': 'Contact — Hyena Studio',
  '/collaborate': 'Start a project — Hyena Studio',
};

function PageView() {
  const { path } = useRoute();
  const Page = PAGES[path] || NotFoundPage;

  useEffect(() => {
    document.title = TITLES[path] || 'Hyena Studio';
  }, [path]);

  return (
    <div key={path} className="page-view">
      <Suspense fallback={<section className="lazy-slot" aria-live="polite">Loading</section>}>
        <Page />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <a className="skip" href="#main">Skip to content</a>
      <SiteNav />
      <main id="main">
        <PageView />
      </main>
      <SiteFooter />
    </Router>
  );
}

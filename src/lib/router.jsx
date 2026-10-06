import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteContext, useRoute } from './route-context';

function basePath() {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

function normalizePath(pathname) {
  const base = basePath();
  let path = pathname || '/';
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollToHash(hash) {
  const node = document.querySelector(hash);
  if (!node) return;
  node.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

export function Router({ children }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPop = () => {
      const next = normalizePath(window.location.pathname);
      setPath(next);
      if (window.location.hash) {
        window.requestAnimationFrame(() => scrollToHash(window.location.hash));
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!window.location.hash) return undefined;
    const id = window.requestAnimationFrame(() => scrollToHash(window.location.hash));
    return () => window.cancelAnimationFrame(id);
  }, [path]);

  const navigate = useCallback((to) => {
    const hashIndex = to.indexOf('#');
    const pathPart = hashIndex >= 0 ? to.slice(0, hashIndex) || '/' : to;
    const hash = hashIndex >= 0 ? to.slice(hashIndex) : '';
    const url = `${basePath()}${pathPart === '/' ? '/' : pathPart}${hash}`;
    window.history.pushState({}, '', url);
    setPath(normalizePath(window.location.pathname));
    if (hash) {
      window.requestAnimationFrame(() => scrollToHash(hash));
      return;
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function Link({ to, className, children, onClick, ...rest }) {
  const { navigate, path } = useRoute();
  const hashIndex = to.indexOf('#');
  const pathPart = hashIndex >= 0 ? to.slice(0, hashIndex) || '/' : to;
  const href = `${basePath()}${pathPart === '/' ? '/' : pathPart}${hashIndex >= 0 ? to.slice(hashIndex) : ''}`;
  const current = path === pathPart && hashIndex === -1;

  return (
    <a
      href={href}
      className={className}
      aria-current={current ? 'page' : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

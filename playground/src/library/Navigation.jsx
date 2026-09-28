import { useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';

const collectionNames = {
  '/library': 'Notes par wapas',
  '/paths': 'Learning path par wapas',
  '/saved': 'Bookmarks par wapas',
  '/interview': 'Questions par wapas',
  '/visuals': 'Visual lab par wapas',
  '/': 'Overview par wapas',
};

// Keep the collection URL and history entry alongside a chapter link.
export function NoteLink({ children, ...props }) {
  const location = useLocation();
  const from = collectionNames[location.pathname]
    ? {
        url: location.pathname + location.search,
        key: location.key,
        label: collectionNames[location.pathname],
      }
    : location.state?.from;
  return (
    <Link {...props} state={{ from }}>
      {children}
    </Link>
  );
}

// Runs only after the lazy page resolves, so long pages can restore their position.
export function RouteViewport({ children, positions }) {
  const location = useLocation();
  const action = useNavigationType();
  const previous = useRef(null);
  useLayoutEffect(() => {
    const samePage = previous.current?.pathname === location.pathname;
    const restoreKey = action === 'POP' ? location.key : location.state?.restoreKey;
    if (restoreKey && positions.current.has(restoreKey)) {
      window.scrollTo({ top: positions.current.get(restoreKey), behavior: 'instant' });
    } else if (!samePage && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (!samePage) {
      const heading = document.querySelector('#main-content h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        document.title = `${heading.textContent.trim()} · Shortnotes`;
      }
    }
    if (location.hash) {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        id = '';
      }
      document.getElementById(id)?.scrollIntoView?.();
    }
    previous.current = location;
    const remember = () => {
      positions.current.set(location.key, window.scrollY);
      if (positions.current.size > 100)
        positions.current.delete(positions.current.keys().next().value);
    };
    remember();
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, [location, action, positions]);
  return children;
}

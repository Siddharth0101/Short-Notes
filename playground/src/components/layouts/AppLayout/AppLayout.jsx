import { useLocation, matchPath } from 'react-router-dom';
import TopNav from '../../organisms/TopNav/TopNav.jsx';
import { getDomainById, getNodeBySplatPath } from '../../../registry/index.js';
import './AppLayout.css';

export default function AppLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Match recursive path templates
  const domainMatch = matchPath({ path: '/domain/:domainId', end: true }, location.pathname);
  const dirMatch = matchPath({ path: '/domain/:domainId/dir/*', end: true }, location.pathname);
  const fileMatch = matchPath({ path: '/domain/:domainId/file/*', end: true }, location.pathname);

  let paths = [];

  const getBreadcrumbs = (domainId, splat) => {
    const domainData = getDomainById(domainId);
    if (!domainData) return [];

    if (!splat) {
      return [{ label: domainData.name }];
    }

    const breadcrumbs = [
      { label: domainData.name, to: `/domain/${domainId}` }
    ];

    const segments = splat.split('/').filter(Boolean);
    let accumulatedPath = '';

    segments.forEach((segment, idx) => {
      const isLast = idx === segments.length - 1;
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${segment}` : segment;
      
      const node = getNodeBySplatPath(domainId, accumulatedPath);
      if (node) {
        if (isLast) {
          breadcrumbs.push({ label: node.name || node.title });
        } else {
          breadcrumbs.push({
            label: node.name || node.title,
            to: `/domain/${domainId}/dir/${accumulatedPath}`
          });
        }
      }
    });

    return breadcrumbs;
  };

  if (domainMatch) {
    paths = getBreadcrumbs(domainMatch.params.domainId, '');
  } else if (dirMatch) {
    paths = getBreadcrumbs(dirMatch.params.domainId, dirMatch.params['*']);
  } else if (fileMatch) {
    paths = getBreadcrumbs(fileMatch.params.domainId, fileMatch.params['*']);
  }

  return (
    <div className="app-layout">
      {!isHome && <TopNav paths={paths} />}
      <main className="app-layout__content">
        {children}
      </main>
    </div>
  );
}

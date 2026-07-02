import { useLocation, matchPath } from 'react-router-dom';
import TopNav from '../../organisms/TopNav/TopNav.jsx';
import { getDomainById, getTopicBySlug } from '../../../registry/index.js';
import './AppLayout.css';

export default function AppLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Match path templates
  const domainMatch = matchPath({ path: '/domain/:domainId', end: true }, location.pathname);
  const topicMatch = matchPath({ path: '/domain/:domainId/topic/:topicSlug', end: true }, location.pathname);
  const scenarioMatch = matchPath({ path: '/domain/:domainId/topic/:topicSlug/:scenarioId', end: true }, location.pathname);

  let paths = [];

  if (domainMatch) {
    const domainData = getDomainById(domainMatch.params.domainId);
    if (domainData) {
      paths = [
        { label: domainData.name }
      ];
    }
  } else if (topicMatch) {
    const domainData = getDomainById(topicMatch.params.domainId);
    const topicData = getTopicBySlug(topicMatch.params.domainId, topicMatch.params.topicSlug);
    if (domainData && topicData) {
      paths = [
        { label: domainData.name, to: `/domain/${domainData.id}` },
        { label: topicData.topic }
      ];
    }
  } else if (scenarioMatch) {
    const domainData = getDomainById(scenarioMatch.params.domainId);
    const topicData = getTopicBySlug(scenarioMatch.params.domainId, scenarioMatch.params.topicSlug);
    const scenario = topicData?.scenarios.find(s => s.id === scenarioMatch.params.scenarioId);
    if (domainData && topicData && scenario) {
      paths = [
        { label: domainData.name, to: `/domain/${domainData.id}` },
        { label: topicData.topic, to: `/domain/${domainData.id}/topic/${topicData.slug}` },
        { label: scenario.title }
      ];
    }
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

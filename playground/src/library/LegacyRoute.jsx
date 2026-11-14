import { Suspense, lazy } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getNodeBySplatPath } from '../registry/index.js';
import { archive } from '../data/catalog.js';
import { useLang } from '../lib/langContext.js';
const Domain = lazy(() => import('../components/pages/Domain/Domain.jsx'));
const NoteSandbox = lazy(() => import('../components/organisms/NoteSandbox/NoteSandbox.jsx'));
export default function LegacyRoute() {
  const { domainId, '*': splat = '' } = useParams();
  const { t } = useLang();
  if (!splat.startsWith('file/')) return <Domain />;
  const note = getNodeBySplatPath(domainId, splat.slice(5));
  if (!note || note.type !== 'file')
    return (
      <div className="empty-state">
        <h2>{t('legacy.notFound')}</h2>
        <Link to="/library">{t('legacy.browse')}</Link>
      </div>
    );
  const reference = archive.find((item) => item.source === note.source);
  const Visualizer = note.component;
  if (note.source?.endsWith('.java')) {
    if (reference) return <Navigate to={`/notes/${reference.id}`} replace />;
  }
  return (
    <div className="legacy-view">
      <Link
        className="text-button"
        to={
          reference?.chapterId ? `/notes/${reference.chapterId}#source-${reference.id}` : '/library'
        }
      >
        {t('legacy.back')}
      </Link>
      <Suspense fallback={<p>{t('legacy.loading')}</p>}>
        {Visualizer ? (
          <Visualizer />
        ) : (
          <NoteSandbox title={note.title} fetchFile={note.fetchFile} />
        )}
      </Suspense>
    </div>
  );
}

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import HeroHeader from '../../organisms/HeroHeader/HeroHeader.jsx';
import TopicFolder from '../../molecules/TopicFolder/TopicFolder.jsx';
import ScenarioCard from '../../molecules/ScenarioCard/ScenarioCard.jsx';
import { getDomainById, getNodeBySplatPath, getContentsSorted, countFiles } from '../../../registry/index.js';
import './Domain.css';

export default function Domain() {
  const { domainId } = useParams();
  const splat = useParams()['*'] || '';
  
  const domainData = getDomainById(domainId);
  const currentNode = getNodeBySplatPath(domainId, splat);

  if (!domainData || !currentNode) {
    return (
      <div className="domain-page">
        <HeroHeader title="Directory Not Found 😢" subtitle="The requested folder could not be located in the notes index." />
        <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to Playground
        </Link>
      </div>
    );
  }

  const items = getContentsSorted(currentNode);
  const folders = items.filter((item) => item.type === 'directory');
  const files = items.filter((item) => item.type === 'file');

  const titleText = splat ? currentNode.name : domainData.name;
  const subtitleText = splat 
    ? `Explore notes inside the directory folder level: ${splat.replace(/-/g, ' ')}.` 
    : domainData.description;

  return (
    <div className="domain-page">
      <HeroHeader title={titleText} subtitle={subtitleText} />

      {/* Render subfolders list */}
      {folders.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 className="section-title">Subdirectories</h3>
          <div className="folders-grid">
            {folders.map((folder) => {
              const targetPath = splat ? `${splat}/${folder.slug}` : folder.slug;
              return (
                <TopicFolder
                  key={folder.slug}
                  name={folder.name}
                  to={`/domain/${domainId}/dir/${targetPath}`}
                  count={countFiles(folder)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Render files grid */}
      {files.length > 0 && (
        <div>
          <h3 className="section-title">Notes & Sandboxes</h3>
          <div className="scenarios-grid">
            {files.map((file) => {
              const targetPath = splat ? `${splat}/${file.id}` : file.id;
              return (
                <ScenarioCard
                  key={file.id}
                  title={file.title}
                  description={file.description}
                  tag={file.tag}
                  readTime={file.readTime}
                  to={`/domain/${domainId}/file/${targetPath}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {folders.length === 0 && files.length === 0 && (
        <div style={{ padding: '32px', textAlign: 'center', opacity: 0.6 }}>
          This folder is empty.
        </div>
      )}
    </div>
  );
}

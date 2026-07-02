import React from 'react';
import { useParams, Link } from 'react-router-dom';
import HeroHeader from '../../organisms/HeroHeader/HeroHeader.jsx';
import TopicFolder from '../../molecules/TopicFolder/TopicFolder.jsx';
import { getDomainById } from '../../../registry/index.js';
import './Domain.css';

export default function Domain() {
  const { domainId } = useParams();
  const domainData = getDomainById(domainId);

  if (!domainData) {
    return (
      <div className="domain-page">
        <HeroHeader title="Domain Not Found 😢" subtitle="The requested domain could not be found." />
        <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to Playground
        </Link>
      </div>
    );
  }

  return (
    <div className="domain-page">
      <HeroHeader
        title={domainData.name}
        subtitle={domainData.description}
      />
      <div className="folders-grid">
        {domainData.topics.map((topic) => (
          <TopicFolder key={topic.slug} topic={topic} domainId={domainId} />
        ))}
      </div>
    </div>
  );
}

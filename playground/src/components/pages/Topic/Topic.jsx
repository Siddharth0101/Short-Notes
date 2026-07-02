import React from 'react';
import { useParams, Link } from 'react-router-dom';
import HeroHeader from '../../organisms/HeroHeader/HeroHeader.jsx';
import ScenarioGrid from '../../organisms/ScenarioGrid/ScenarioGrid.jsx';
import { getTopicBySlug } from '../../../registry/index.js';
import './Topic.css';

export default function Topic() {
  const { domainId, topicSlug } = useParams();
  const topicData = getTopicBySlug(domainId, topicSlug);

  if (!topicData) {
    return (
      <div className="topic-page">
        <HeroHeader title="Topic Not Found 😢" subtitle="The requested interview topic could not be found in the playground." />
        <Link to={`/domain/${domainId}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to Domain Folder
        </Link>
      </div>
    );
  }

  return (
    <div className="topic-page">
      <HeroHeader
        title={topicData.topic}
        subtitle={`Practice and run sandbox exercises for ${topicData.topic.toLowerCase()}.`}
      />
      <ScenarioGrid scenarios={topicData.scenarios} badge={topicData.topic} topicSlug={topicData.slug} domainId={domainId} />
    </div>
  );
}

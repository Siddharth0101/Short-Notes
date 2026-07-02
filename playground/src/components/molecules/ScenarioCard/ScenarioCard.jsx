import Badge from '../../atoms/Badge/Badge.jsx';
import LinkButton from '../../atoms/LinkButton/LinkButton.jsx';
import './ScenarioCard.css';

export default function ScenarioCard({ scenario }) {
  return (
    <article className="scenario-card">
      <div className="scenario-card__badge">
        <Badge>{scenario.badge}</Badge>
      </div>
      <h2 className="scenario-card__title">{scenario.title}</h2>
      <p className="scenario-card__desc">{scenario.description}</p>
      <div className="scenario-card__meta">
        <span>🏷️ {scenario.tag}</span>
        <span>⏱️ {scenario.readTime}</span>
      </div>
      <LinkButton to={`/domain/${scenario.domainId}/topic/${scenario.topicSlug}/${scenario.id}`} variant="primary">
        Run Sandbox
      </LinkButton>
    </article>
  );
}

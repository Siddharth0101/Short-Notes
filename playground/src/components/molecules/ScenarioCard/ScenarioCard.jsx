import LinkButton from '../../atoms/LinkButton/LinkButton.jsx';
import './ScenarioCard.css';

export default function ScenarioCard({ title, description, tag, readTime, to }) {
  return (
    <article className="scenario-card">
      <h2 className="scenario-card__title">{title}</h2>
      <p className="scenario-card__desc">{description}</p>
      <div className="scenario-card__meta">
        <span>🏷️ {tag}</span>
        <span>⏱️ {readTime}</span>
      </div>
      <LinkButton to={to} variant="primary">
        Run Sandbox
      </LinkButton>
    </article>
  );
}

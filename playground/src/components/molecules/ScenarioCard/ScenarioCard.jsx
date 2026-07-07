import LinkButton from '../../atoms/LinkButton/LinkButton.jsx';
import './ScenarioCard.css';

export default function ScenarioCard({ title, description, tag, readTime, to, hasVisual }) {
  return (
    <article className="scenario-card">
      <h2 className="scenario-card__title">{title}</h2>
      <p className="scenario-card__desc">{description}</p>
      <div className="scenario-card__meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>🏷️ {tag}</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span>⏱️ {readTime}</span>
          {hasVisual && (
            <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px', letterSpacing: '0.05em' }}>
              ⚡ VISUAL
            </span>
          )}
        </div>
      </div>
      <LinkButton to={to} variant="primary">
        Run Sandbox
      </LinkButton>
    </article>
  );
}

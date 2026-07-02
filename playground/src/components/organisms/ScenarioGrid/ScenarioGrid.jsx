import ScenarioCard from '../../molecules/ScenarioCard/ScenarioCard.jsx';
import './ScenarioGrid.css';

export default function ScenarioGrid({ scenarios, badge, topicSlug, domainId }) {
  return (
    <section className="scenario-grid">
      {scenarios.map((scenario) => (
        <ScenarioCard 
          key={scenario.id} 
          scenario={{ 
            ...scenario, 
            badge: badge || scenario.badge,
            topicSlug: topicSlug || scenario.topicSlug,
            domainId: domainId || scenario.domainId
          }} 
        />
      ))}
    </section>
  );
}

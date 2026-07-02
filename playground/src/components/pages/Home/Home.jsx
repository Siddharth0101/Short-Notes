import React from 'react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../organisms/HeroHeader/HeroHeader.jsx';
import { DOMAIN_LIST } from '../../../registry/index.js';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <HeroHeader
        title="Scenario Playground 🚀"
        subtitle="Select a domain below to explore interactive visualizers and sandboxed coding questions."
      />
      <div className="domains-grid">
        {DOMAIN_LIST.map((domain) => (
          <Link key={domain.id} to={`/domain/${domain.id}`} className="domain-card">
            <div className="domain-card__icon">{domain.icon}</div>
            <h3 className="domain-card__title">{domain.name}</h3>
            <p className="domain-card__desc">{domain.description}</p>
            <div className="domain-card__action">
              Explore Topics →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

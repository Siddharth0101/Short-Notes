import React from 'react';
import { Link } from 'react-router-dom';
import './TopicFolder.css';

export default function TopicFolder({ name, to, count }) {
  return (
    <Link to={to} className="topic-folder">
      <div className="topic-folder__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div className="topic-folder__content">
        <span className="topic-folder__title">{name}</span>
        <span className="topic-folder__count">{count} {count === 1 ? 'file' : 'files'}</span>
      </div>
    </Link>
  );
}

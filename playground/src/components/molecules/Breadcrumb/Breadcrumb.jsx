import React from 'react';
import { Link } from 'react-router-dom';
import LinkButton from '../../atoms/LinkButton/LinkButton.jsx';
import './Breadcrumb.css';

export default function Breadcrumb({ paths = [] }) {
  return (
    <div className="breadcrumb">
      <LinkButton to="/" variant="ghost">← Playground</LinkButton>
      {paths.map((path, idx) => (
        <React.Fragment key={idx}>
          <span className="breadcrumb__divider">/</span>
          {path.to ? (
            <Link to={path.to} className="breadcrumb__link">
              {path.label}
            </Link>
          ) : (
            <span className="breadcrumb__title">{path.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

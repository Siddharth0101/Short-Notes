import React from 'react';
import { useParams, Link } from 'react-router-dom';
import HeroHeader from '../../organisms/HeroHeader/HeroHeader.jsx';
import TopicFolder from '../../molecules/TopicFolder/TopicFolder.jsx';
import ScenarioCard from '../../molecules/ScenarioCard/ScenarioCard.jsx';
import { getDomainById, getNodeBySplatPath, getContentsSorted, countFiles } from '../../../registry/index.js';
import './Domain.css';

function hasCustomSimulator(sId, splatPath) {
  const id = (sId || '').toLowerCase();
  const splat = (splatPath || '').toLowerCase();
  const isNoSql = splat.includes('/07-no-sql/') || splat.includes('/07_no_sql/') || splat.includes('no_sql');

  if (id === 'how-web-works' || id === 'web-backend-fundamentals') return true;
  if (splat.includes('oops') || id === 'constructor-function' || id === 'classes' || id === 'call-apply-bind-methods' || id === 'this-keyword') return true;
  if (splat.includes('regex') || id === 'regular-expressions') return true;
  if (splat.includes('async') || id === 'promises' || id === 'eventloop' || id === 'promises-async-await-node') return true;
  if (splat.includes('sorting') || id === 'sorting-algorithms' || id === 'bubble-sort-visualizer') return true;
  if (splat.includes('searching') || id === 'searching-algorithms') return true;
  if (splat.includes('recursion') || id === 'recursion-backtracking') return true;
  if (splat.includes('trees') || id === 'trees-bst-traversal') return true;
  if (splat.includes('graphs') || id === 'graphs-traversal-dijkstra' || id === 'http-client-flow') return true;
  if (splat.includes('dynamic-programming') || id === 'dynamic-programming') return true;
  if (splat.includes('linked-lists') || splat.includes('stacks-queues') || id === 'singly-doubly-linked-list' || id === 'stacks-queues') return true;
  if (splat.includes('patterns') || id === 'common-problem-solving-patterns' || id === 'problem-solving-approach') return true;
  if (splat.includes('heaps') || id === 'binary-heaps-priority-queue') return true;
  if (splat.includes('hash-tables') || id === 'hash-tables') return true;
  if (splat.includes('advanced') || splat.includes('cheatsheets') || id === 'dsa-interview-cheat-sheet' || id === 'advanced-dsa-concepts') return true;
  if (splat.includes('css') || id === 'vw-vh-rem-px') return true;
  if (splat.includes('node-foundations') || id === 'node-npm-core-modules') return true;
  if (splat.includes('node-internals') || id === 'node-internals-event-loop-streams') return true;
  if (isNoSql && (id === 'mongodb-mongoose-basics' || id === 'data-modeling-advanced-mongoose' || splat.includes('database') || splat.includes('mongoose'))) return true;
  if (splat.includes('deployment') || id === 'git-deployment-production' || id === 'jonas-node-course-map' || id === 'node-backend-cheat-sheet') return true;
  if (splat.includes('express') || id === 'express-rest-api-natours' || (isNoSql && (id === 'express-error-handling' || id === 'auth-authorization-security' || id === 'pug-server-side-rendering' || id === 'payments-email-file-uploads' || splat.includes('error-handling') || splat.includes('auth-security') || splat.includes('server-rendering') || splat.includes('advanced-features')))) return true;
  if (['closure-visualizer', 'jira-modal-persist'].includes(id)) return true;
  return false;
}

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
                  hasVisual={hasCustomSimulator(file.id, splat)}
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

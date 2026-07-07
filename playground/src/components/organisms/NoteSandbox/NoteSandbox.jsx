import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../atoms/Spinner/Spinner.jsx';
import {
  RegexSimulator,
  CssUnitsSimulator,
  ArraySearchSimulator,
  SortingAlgorithmsSimulator,
  RecursionVisualizer,
  BstTreeSimulator,
  GraphVisualizer,
  BigOVisualizer,
  DpVisualizer,
  ListSimulator,
  ScopeTrackerSimulator,
  EventLoopSimulator,
  HttpRouteSimulator,
  WebFundamentalsSimulator,
  NodeFoundationsSimulator,
  NodeInternalsSimulator,
  MongooseMongoSimulator,
  DeploymentSimulator,
  PatternsSimulator,
  HeapSimulator,
  HashTableSimulator,
  CheatSheetSimulator
} from './simulators/Simulators.jsx';
import './NoteSandbox.css';

// Intercepts and executes JavaScript code in browser scope, returning logs output
function executeCode(code) {
  const logs = [];
  const customConsole = {
    log: (...args) => {
      logs.push(
        args
          .map((arg) => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ')
      );
    },
    error: (...args) => {
      logs.push('❌ Error: ' + args.join(' '));
    },
    warn: (...args) => {
      logs.push('⚠️ Warning: ' + args.join(' '));
    }
  };

  try {
    const executor = new Function('console', 'window', 'global', `
      return (function() {
        ${code}
      }).call(this);
    `);
    executor.call(undefined, customConsole, window, window);
  } catch (err) {
    customConsole.error(err.message);
  }

  return logs;
}

// Parses raw JS note text into groups of explanations and code blocks
function parseNoteFile(rawText) {
  let cleanText = rawText.replace(/^\s*['"]use strict['"];?\s*/i, '');

  const sections = [];
  const commentRegex = /\/\/\*([\s\S]*?)\*\//g; // standard JS comments parsing
  const blockCommentRegex = /\/\*\*([\s\S]*?)\*\//g;
  
  let match;
  let lastIndex = 0;
  
  // Use block comments regex to extract text explanations
  while ((match = blockCommentRegex.exec(cleanText)) !== null) {
    const codeBefore = cleanText.substring(lastIndex, match.index).trim();
    if (codeBefore) {
      sections.push({ type: 'code', content: codeBefore });
    }
    
    const commentContent = match[1];
    sections.push({ type: 'text', content: cleanComment(commentContent) });
    
    lastIndex = blockCommentRegex.lastIndex;
  }
  
  const codeAfter = cleanText.substring(lastIndex).trim();
  if (codeAfter) {
    sections.push({ type: 'code', content: codeAfter });
  }

  const blocks = [];
  let currentBlock = { text: '', code: '' };
  
  sections.forEach((sec) => {
    if (sec.type === 'text') {
      if (currentBlock.text || currentBlock.code) {
        blocks.push(currentBlock);
        currentBlock = { text: '', code: '' };
      }
      currentBlock.text = sec.content;
    } else if (sec.type === 'code') {
      currentBlock.code = sec.content;
      blocks.push(currentBlock);
      currentBlock = { text: '', code: '' };
    }
  });
  
  if (currentBlock.text || currentBlock.code) {
    blocks.push(currentBlock);
  }
  
  return blocks;
}

function cleanComment(comment) {
  return comment
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .replace(/^[\s=*|-]+$/gm, '')
    .trim();
}

function CodePlayground({ initialCode }) {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState([]);
  const [hasRun, setHasRun] = useState(false);

  const runCode = () => {
    const outputs = executeCode(code);
    setLogs(outputs);
    setHasRun(true);
  };

  return (
    <div className="note-block__code-section">
      <div className="note-block__editor-container">
        <div className="note-block__editor-header">
          <span className="note-block__editor-title">Editable Script Sandbox</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="note-block__textarea"
          spellCheck="false"
        />
      </div>

      <div className="note-block__actions">
        <button onClick={runCode} className="note-block__btn-run">
          Run Code
        </button>
      </div>

      {hasRun && (
        <div className="note-block__console">
          <div className="note-block__console-title">Console Output</div>
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div
                key={idx}
                className={log.startsWith('❌') ? 'note-block__console--error' : ''}
              >
                {log}
              </div>
            ))
          ) : (
            <div style={{ fontStyle: 'italic', opacity: 0.5 }}>code executed with no console output</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NoteSandbox({ title, fetchFile }) {
  const { domainId } = useParams();
  const splat = useParams()['*'] || '';

  const segments = splat.split('/').filter(Boolean);
  const scenarioId = segments[segments.length - 1] || '';
  const topicSlug = segments[segments.length - 2] || '';

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedSim, setSelectedSim] = useState('');

  // Get simulators strictly relevant to the current note file
  const getSimulatorsForFile = (scenId, topSlug) => {
    const sId = (scenId || '').toLowerCase();
    const tSlug = (topSlug || '').toLowerCase();
    const isNoSql = splat.includes('/07-no-sql/') || splat.includes('/07_no_sql/');

    // 1. Client-Server request / How the Web Works
    if (sId === 'how-web-works' || sId === 'web-backend-fundamentals') {
      return [
        { id: 'web', label: '🌐 How Web Works', component: <WebFundamentalsSimulator /> }
      ];
    }

    // 2. JavaScript OOP / Scopes / Prototypes
    if (
      tSlug.includes('oops') ||
      sId === 'constructor-function' ||
      sId === 'classes' ||
      sId === 'call-apply-bind-methods' ||
      sId === 'this-keyword'
    ) {
      return [
        { id: 'scope', label: '🟨 Scope & Prototypes', component: <ScopeTrackerSimulator /> }
      ];
    }

    // 3. Regex
    if (tSlug.includes('regex') || sId === 'regular-expressions') {
      return [
        { id: 'regex', label: '🔍 Regex Matcher', component: <RegexSimulator /> }
      ];
    }

    // 4. Async Event Loop
    if (
      tSlug.includes('async') ||
      sId === 'promises' ||
      sId === 'eventloop' ||
      sId === 'promises-async-await-node'
    ) {
      return [
        { id: 'eventloop', label: '⏳ Event Loop', component: <EventLoopSimulator /> }
      ];
    }

    // 5. DSA Sorting
    if (tSlug.includes('sorting') || sId === 'sorting-algorithms' || sId === 'bubble-sort-visualizer') {
      return [
        { id: 'sorting', label: '📊 Sorting Algorithms', component: <SortingAlgorithmsSimulator /> }
      ];
    }

    // 6. DSA Searching
    if (tSlug.includes('searching') || sId === 'searching-algorithms') {
      return [
        { id: 'search', label: '🔎 Binary Search', component: <ArraySearchSimulator /> }
      ];
    }

    // 7. DSA Recursion
    if (tSlug.includes('recursion') || sId === 'recursion-backtracking') {
      return [
        { id: 'recursion', label: '🔁 Recursion Tree', component: <RecursionVisualizer /> }
      ];
    }

    // 8. DSA Trees
    if (tSlug.includes('trees') || sId === 'trees-bst-traversal') {
      return [
        { id: 'trees', label: '🌲 Binary Tree', component: <BstTreeSimulator /> }
      ];
    }

    // 9. DSA Graphs
    if (tSlug.includes('graphs') || sId === 'graphs-traversal-dijkstra' || sId === 'http-client-flow') {
      return [
        { id: 'graphs', label: '🕸️ Graph Pathfinder', component: <GraphVisualizer /> }
      ];
    }

    // 10. DSA DP
    if (tSlug.includes('dynamic-programming') || sId === 'dynamic-programming') {
      return [
        { id: 'dp', label: '🗂️ DP Memoization', component: <DpVisualizer /> }
      ];
    }

    // 11. DSA Lists
    if (
      tSlug.includes('linked-lists') ||
      tSlug.includes('stacks-queues') ||
      sId === 'singly-doubly-linked-list' ||
      sId === 'stacks-queues'
    ) {
      return [
        { id: 'lists', label: '🔗 Stacks & Queues', component: <ListSimulator /> }
      ];
    }

    // 12. DSA Patterns
    if (tSlug.includes('patterns') || sId === 'common-problem-solving-patterns' || sId === 'problem-solving-approach') {
      return [
        { id: 'patterns', label: '🔀 Algorithmic Patterns', component: <PatternsSimulator /> }
      ];
    }

    // 13. DSA Heaps
    if (tSlug.includes('heaps') || sId === 'binary-heaps-priority-queue') {
      return [
        { id: 'heaps', label: '💎 Binary Heap', component: <HeapSimulator /> }
      ];
    }

    // 14. DSA Hash Tables
    if (tSlug.includes('hash-tables') || sId === 'hash-tables') {
      return [
        { id: 'hash', label: '🗄️ Hash Buckets', component: <HashTableSimulator /> }
      ];
    }

    // 15. DSA Cheatsheets
    if (
      tSlug.includes('advanced') ||
      tSlug.includes('cheatsheets') ||
      sId === 'dsa-interview-cheat-sheet' ||
      sId === 'advanced-dsa-concepts'
    ) {
      return [
        { id: 'cards', label: '🃏 Interview Flashcards', component: <CheatSheetSimulator /> }
      ];
    }

    // 16. CSS Units Sizing
    if (tSlug.includes('css') || sId === 'vw-vh-rem-px') {
      return [
        { id: 'css', label: '📐 CSS Units', component: <CssUnitsSimulator /> }
      ];
    }

    // 17. Node modules require
    if (tSlug.includes('node-foundations') || sId === 'node-npm-core-modules') {
      return [
        { id: 'modules', label: '📦 require() Bindings', component: <NodeFoundationsSimulator /> }
      ];
    }

    // 18. Node Internals
    if (tSlug.includes('node-internals') || sId === 'node-internals-event-loop-streams') {
      return [
        { id: 'internals', label: '⚙️ Libuv Thread Pool', component: <NodeInternalsSimulator /> }
      ];
    }

    // 19. Mongoose & DB Basics
    if (
      isNoSql && 
      (sId === 'mongodb-mongoose-basics' || sId === 'data-modeling-advanced-mongoose' || tSlug.includes('database') || tSlug.includes('mongoose'))
    ) {
      return [
        { id: 'mongoose', label: '🗄️ Mongoose Schemas', component: <MongooseMongoSimulator /> }
      ];
    }

    // 20. Deployments & Cheat Sheets
    if (
      tSlug.includes('deployment') ||
      sId === 'git-deployment-production' ||
      sId === 'jonas-node-course-map' ||
      sId === 'node-backend-cheat-sheet'
    ) {
      return [
        { id: 'deployment', label: '🚀 CI/CD Deployments', component: <DeploymentSimulator /> }
      ];
    }

    // 21. Express Pipeline (including error handlers, auth filters, Pug templates rendering)
    if (
      tSlug.includes('express') || 
      sId === 'express-rest-api-natours' ||
      (isNoSql && (
        sId === 'express-error-handling' ||
        sId === 'auth-authorization-security' ||
        sId === 'pug-server-side-rendering' ||
        sId === 'payments-email-file-uploads' ||
        tSlug.includes('error-handling') ||
        tSlug.includes('auth-security') ||
        tSlug.includes('server-rendering') ||
        tSlug.includes('advanced-features')
      ))
    ) {
      return [
        { id: 'express', label: '⬇️ Express Pipeline', component: <HttpRouteSimulator /> }
      ];
    }

    // Fallback: General Big O
    return [
      { id: 'bigo', label: '📈 Big O Complexity', component: <BigOVisualizer /> }
    ];
  };

  const simsList = getSimulatorsForFile(scenarioId, topicSlug);
  const currentSimObj = simsList.find((s) => s.id === selectedSim) || simsList[0];

  // Auto-initialize visualizer tab based on notes category
  useEffect(() => {
    const slug = (topicSlug || '').toLowerCase();
    let defaultSim = '';
    
    if (domainId === 'javascript') {
      if (slug.includes('regex')) defaultSim = 'regex';
      else if (slug.includes('async') || scenarioId === 'promises' || scenarioId === 'eventloop') defaultSim = 'eventloop';
      else defaultSim = 'scope';
    } else if (domainId === 'dsa') {
      if (slug.includes('sorting')) defaultSim = 'sorting';
      else if (slug.includes('searching')) defaultSim = 'search';
      else if (slug.includes('recursion')) defaultSim = 'recursion';
      else if (slug.includes('trees')) defaultSim = 'trees';
      else if (slug.includes('graphs')) defaultSim = 'graphs';
      else if (slug.includes('dynamic-programming')) defaultSim = 'dp';
      else if (slug.includes('linked-lists') || slug.includes('stacks-queues')) defaultSim = 'lists';
      else if (slug.includes('patterns')) defaultSim = 'patterns';
      else if (slug.includes('heaps')) defaultSim = 'heaps';
      else if (slug.includes('hash-tables')) defaultSim = 'hash';
      else defaultSim = 'bigo';
    } else if (domainId === 'backend') {
      const isNoSql = splat.includes('/07-no-sql/') || splat.includes('/07_no_sql/');
      if (slug.includes('course-overview') || slug.includes('backend-foundations') || scenarioId === 'how-web-works') {
        defaultSim = 'web';
      } else if (slug.includes('node-foundations')) {
        defaultSim = 'modules';
      } else if (slug.includes('node-internals')) {
        defaultSim = 'internals';
      } else if (isNoSql) {
        if (slug.includes('database') || slug.includes('mongoose')) {
          defaultSim = 'mongoose';
        } else {
          defaultSim = 'express';
        }
      } else if (slug.includes('deployment') || slug.includes('cheatsheets')) {
        defaultSim = 'deployment';
      } else {
        defaultSim = 'express';
      }
    } else if (domainId === 'frontend') {
      defaultSim = 'css';
    }

    setSelectedSim(defaultSim);
  }, [splat, domainId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setActiveTab('notes');

    fetchFile()
      .then((module) => {
        if (!active) return;
        const textContent = module.default || module;
        if (typeof textContent !== 'string') {
          throw new Error('Import did not resolve to a string value');
        }
        const parsed = parseNoteFile(textContent);
        setBlocks(parsed);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchFile]);

  if (loading) {
    return <Spinner label={`Loading notes: ${title}...`} />;
  }

  if (error) {
    return (
      <div className="note-sandbox">
        <h2>Error Loading Sandbox</h2>
        <p style={{ color: '#ef4444', marginTop: '12px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="note-sandbox">
      <h2>{title}</h2>
      <p className="note-sandbox__subtitle">Read Hinglish explanations and edit & run JS scripts live in the browser.</p>

      {/* Tab Navigation */}
      <div className="note-sandbox__tabs">
        <button
          onClick={() => setActiveTab('notes')}
          className={`note-sandbox__tab ${activeTab === 'notes' ? 'note-sandbox__tab--active' : ''}`}
        >
          📖 Notes & Scripts
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`note-sandbox__tab ${activeTab === 'simulator' ? 'note-sandbox__tab--active' : ''}`}
        >
          ⚡ Visual Simulator
        </button>
      </div>

      {activeTab === 'notes' ? (
        <div className="note-sandbox__blocks">
          {blocks.map((block, idx) => (
            <div key={idx} className="note-block">
              {block.text && (
                <div className="note-block__text" style={{ position: 'relative' }}>
                  {block.text.includes('[⚡ VISUAL]') ? (
                    <>
                      <span className="visual-highlight-chip">
                        ⚡ VISUAL
                      </span>
                      {block.text.replace(' [⚡ VISUAL]', '').replace('[⚡ VISUAL]', '')}
                    </>
                  ) : (
                    block.text
                  )}
                </div>
              )}
              {block.code && <CodePlayground initialCode={block.code} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="note-sandbox__simulator">
          {simsList.length > 0 && (
            <div>
              {/* Show select buttons ONLY if the note has multiple relevant simulators */}
              {simsList.length > 1 && (
                <div className="note-sandbox__visual-selector">
                  <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', color: 'var(--text)', whiteSpace: 'nowrap', marginRight: '8px' }}>
                    Select Visual:
                  </span>
                  {simsList.map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => setSelectedSim(sim.id)}
                      className={`sim-btn ${selectedSim === sim.id ? '' : 'sim-btn--secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                    >
                      {sim.label}
                    </button>
                  ))}
                </div>
              )}
              {currentSimObj ? currentSimObj.component : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

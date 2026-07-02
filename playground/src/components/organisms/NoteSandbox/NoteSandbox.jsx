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
  HttpRouteSimulator
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
    // Run the code safely by intercepting console
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
  // Strip 'use strict' declarations
  let cleanText = rawText.replace(/^\s*['"]use strict['"];?\s*/i, '');

  const sections = [];
  const commentRegex = /\/\*\*([\s\S]*?)\*\//g;
  
  let match;
  let lastIndex = 0;
  
  while ((match = commentRegex.exec(cleanText)) !== null) {
    const codeBefore = cleanText.substring(lastIndex, match.index).trim();
    if (codeBefore) {
      sections.push({ type: 'code', content: codeBefore });
    }
    
    const commentContent = match[1];
    sections.push({ type: 'text', content: cleanComment(commentContent) });
    
    lastIndex = commentRegex.lastIndex;
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
    // Remove formatting dividers of equals or dashes
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
  const { domainId, topicSlug, scenarioId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');

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

  const renderSimulator = () => {
    const slug = (topicSlug || '').toLowerCase();
    
    if (slug.includes('regex')) return <RegexSimulator />;
    if (slug.includes('css')) return <CssUnitsSimulator />;
    
    if (
      slug.includes('async') ||
      scenarioId === 'eventloop' ||
      scenarioId === 'promises'
    ) {
      return <EventLoopSimulator />;
    }
    
    if (slug.includes('sorting')) {
      return <SortingAlgorithmsSimulator />;
    }
    
    if (slug.includes('searching')) {
      return <ArraySearchSimulator />;
    }
    
    if (slug.includes('recursion')) {
      return <RecursionVisualizer />;
    }
    
    if (slug.includes('trees')) {
      return <BstTreeSimulator />;
    }
    
    if (slug.includes('graphs')) {
      return <GraphVisualizer />;
    }
    
    if (slug.includes('foundations')) {
      return <BigOVisualizer />;
    }
    
    if (slug.includes('dynamic-programming')) {
      return <DpVisualizer />;
    }
    
    if (
      slug.includes('linked-lists') ||
      slug.includes('stacks-queues')
    ) {
      return <ListSimulator />;
    }
    
    if (slug.includes('node') || domainId === 'backend') {
      return <HttpRouteSimulator />;
    }
    
    return <ScopeTrackerSimulator />;
  };

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
              {block.text && <div className="note-block__text">{block.text}</div>}
              {block.code && <CodePlayground initialCode={block.code} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="note-sandbox__simulator">
          {renderSimulator()}
        </div>
      )}
    </div>
  );
}

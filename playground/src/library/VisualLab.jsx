import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { VISUALS } from '../data/visuals.js';
import { notes, trackById } from '../data/catalog.js';
import {
  binarySearchTrace,
  bubbleSortTrace,
  bfsTrace,
  fibonacciTrace,
  GRAPH,
} from '../lib/traces.js';
import Icon from './Icons.jsx';
import Markdown from './Markdown.jsx';

function GraphView({ frame }) {
  const points = {
    A: [180, 45],
    B: [85, 130],
    C: [285, 130],
    D: [35, 225],
    E: [155, 225],
    F: [285, 225],
  };
  return (
    <div className="graph-display">
      <svg
        viewBox="0 0 360 280"
        role="img"
        aria-label={`BFS graph. Current node ${frame.active || 'none'}. Visited ${frame.order?.join(', ') || 'none'}.`}
      >
        <g>
          {Object.entries(GRAPH).flatMap(([from, targets]) =>
            targets
              .filter((to) => from < to)
              .map((to) => (
                <line
                  key={`${from}-${to}`}
                  x1={points[from][0]}
                  y1={points[from][1]}
                  x2={points[to][0]}
                  y2={points[to][1]}
                  stroke="var(--border-strong)"
                  strokeWidth="2"
                />
              )),
          )}
        </g>
        {Object.entries(points).map(([name, [x, y]]) => (
          <g key={name}>
            <circle
              cx={x}
              cy={y}
              r="24"
              className={`graph-node ${frame.active === name ? 'active' : frame.seen?.includes(name) ? 'found' : ''}`}
            />
            <text x={x} y={y + 5} textAnchor="middle">
              {name}
            </text>
          </g>
        ))}
      </svg>
      <div className="graph-queues">
        <div>
          <span>QUEUE · FRONT → BACK</span>
          <strong>{frame.queue?.join(' → ') || 'empty'}</strong>
        </div>
        <div>
          <span>VISITED ORDER</span>
          <strong>{frame.order?.join(' → ') || 'not started'}</strong>
        </div>
      </div>
    </div>
  );
}

function Simulator({ visual }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [target, setTarget] = useState(42);
  const [variant, setVariant] = useState(false);
  const [indexMode, setIndexMode] = useState(true);
  const frames = useMemo(() => {
    if (visual.id === 'binary-search')
      return binarySearchTrace([3, 8, 15, 23, 31, 42, 56, 71, 89], target);
    if (visual.id === 'sorting')
      return bubbleSortTrace(variant ? [25, 75, 40, 90, 55, 15] : [65, 30, 85, 45, 20, 55]);
    if (visual.id === 'bfs') return bfsTrace();
    if (visual.id === 'dynamic-programming') return fibonacciTrace(variant ? 8 : 6);
    if (visual.id === 'mongo-index') {
      const values = [3, 8, 15, 23, 31, 42, 56, 71, 89];
      if (indexMode)
        return [
          ...binarySearchTrace(values, 42),
          {
            title: 'Fetch the matching document',
            explanation:
              'Index entry se document reference mila. A non-covered query fetches that document. This simplified unique-SKU example returns one match.',
            lanes: [
              { name: 'Index', items: ['sku: 42 → document #6'] },
              { name: 'Collection', items: ['{ sku: 42, name: "Notebook" }'] },
            ],
            metrics: ['1 matching document', 'illustrative index seek'],
          },
        ];
      return values.slice(0, 6).map((value, i) => ({
        title: value === 42 ? 'Found the matching document' : `Scan document ${i + 1}`,
        explanation:
          value === 42
            ? 'findOne-style lookup can stop at the first match. A general find query may continue scanning for more matches.'
            : 'No supporting index in this example. Har document ko check karna pad raha hai.',
        cells: values.map((v, j) => ({
          value: v,
          label: `doc ${j + 1}`,
          status: j === i ? (value === 42 ? 'found' : 'active') : j < i ? 'muted' : 'idle',
        })),
        metrics: [`${i + 1} documents examined`, 'illustrative collection scan'],
      }));
    }
    return visual.frames;
  }, [visual, target, variant, indexMode]);
  const frame = frames[Math.min(step, frames.length - 1)];
  const end = step >= frames.length - 1;
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (step < frames.length - 1) setStep(step + 1);
      else setPlaying(false);
    }, speed);
    return () => clearTimeout(timer);
  }, [playing, step, frames.length, speed]);
  function reset() {
    setStep(0);
    setPlaying(false);
  }
  function play() {
    if (end) setStep(0);
    setPlaying(!playing);
  }
  return (
    <div className="simulator">
      <div className="simulator-top">
        <div>
          <span className="card-overline">AN INTERACTIVE MENTAL MODEL</span>
          <h2>{visual.name}</h2>
        </div>
        <span className="simulation-pill">
          <span /> {playing ? 'Playing' : end ? 'Complete' : 'Ready to explore'}
        </span>
      </div>
      <div className="simulator-options">
        {visual.id === 'binary-search' && (
          <label>
            Find value{' '}
            <select
              aria-label="Binary search target"
              value={target}
              onChange={(event) => {
                reset();
                setTarget(Number(event.target.value));
              }}
            >
              <option value="42">42 · middle-right</option>
              <option value="3">3 · first element</option>
              <option value="89">89 · last element</option>
              <option value="44">44 · not present</option>
            </select>
          </label>
        )}
        {['sorting', 'dynamic-programming'].includes(visual.id) && (
          <button
            className="subtle-button"
            onClick={() => {
              reset();
              setVariant(!variant);
            }}
          >
            <Icon name="shuffle" size={14} />
            {visual.id === 'sorting' ? 'Try another array' : `Try n = ${variant ? 6 : 8}`}
          </button>
        )}
        {visual.id === 'mongo-index' && (
          <div className="segmented">
            <button
              className={indexMode ? 'active' : ''}
              onClick={() => {
                reset();
                setIndexMode(true);
              }}
            >
              With index
            </button>
            <button
              className={!indexMode ? 'active' : ''}
              onClick={() => {
                reset();
                setIndexMode(false);
              }}
            >
              Collection scan
            </button>
          </div>
        )}
        <span className="simulation-legend">
          <i /> Current <i className="legend-found" /> Resolved
        </span>
      </div>
      <div className="simulation-canvas">
        {frame.lanes && (
          <div className="simulation-lanes">
            {frame.lanes.map((lane, i) => (
              <div className="simulation-lane" key={lane.name}>
                <span className="lane-label">
                  {String(i + 1).padStart(2, '0')} / {lane.name}
                </span>
                <div className="lane-items">
                  {lane.items.length ? (
                    lane.items.map((item, j) => (
                      <div key={`${item}-${j}`} className="lane-item">
                        <span className="lane-dot" />
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="lane-empty">empty</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {frame.cells && (
          <div className="simulation-cells">
            {frame.cells.map((cell, i) => (
              <div key={i} className={`simulation-cell ${cell.status}`}>
                <strong>{cell.value}</strong>
                <span>{cell.label}</span>
              </div>
            ))}
          </div>
        )}
        {frame.bars && (
          <div className="sort-bars">
            {frame.bars.map((bar, i) => (
              <div
                key={bar.value}
                className={`sort-bar ${bar.status}`}
                style={{
                  height: `${bar.value * 2}px`,
                  left: `calc(${(i * 100) / frame.bars.length}% + 5px)`,
                  width: `calc(${100 / frame.bars.length}% - 10px)`,
                }}
              >
                <strong>{bar.value}</strong>
              </div>
            ))}
          </div>
        )}
        {frame.graph && <GraphView frame={frame} />}
        {frame.metrics && (
          <div className="simulation-metrics">
            {frame.metrics.map((metric) => (
              <code key={metric}>{metric}</code>
            ))}
          </div>
        )}
      </div>
      <div className="step-explanation" aria-live="polite" aria-atomic="true">
        <span>{String(step + 1).padStart(2, '0')}</span>
        <div>
          <h3>{frame.title}</h3>
          <p>{frame.explanation}</p>
        </div>
      </div>
      <div className="simulation-controls">
        <div className="button-group">
          <button className="icon-button" aria-label="Reset visualization" onClick={reset}>
            <Icon name="reset" size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Previous step"
            disabled={step === 0}
            onClick={() => {
              setPlaying(false);
              setStep(step - 1);
            }}
          >
            <Icon name="previous" size={18} />
          </button>
          <button
            className="primary-button"
            aria-label={playing ? 'Pause visualization' : 'Play visualization'}
            onClick={play}
          >
            <Icon name={playing ? 'pause' : 'play'} size={16} />
            {playing ? 'Pause' : end ? 'Replay' : 'Play'}
          </button>
          <button
            className="subtle-button"
            disabled={end}
            onClick={() => {
              setPlaying(false);
              setStep(step + 1);
            }}
          >
            Next step <Icon name="next" size={16} />
          </button>
        </div>
        <div className="step-position">
          <span>
            {step + 1} / {frames.length}
          </span>
          <input
            aria-label="Visualization step"
            type="range"
            min="0"
            max={frames.length - 1}
            value={step}
            onChange={(event) => {
              setPlaying(false);
              setStep(Number(event.target.value));
            }}
          />
        </div>
        <select
          aria-label="Animation speed"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        >
          <option value="2400">0.5× speed</option>
          <option value="1200">1× speed</option>
          <option value="600">2× speed</option>
        </select>
      </div>
      <div className="visual-takeaway">
        <Icon name="sparkles" size={20} />
        <div>
          <strong>The idea to take with you</strong>
          <p>{visual.takeaway}</p>
          {visual.source && (
            <a href={visual.source} target="_blank" rel="noreferrer">
              Read the official reference ↗
            </a>
          )}
        </div>
      </div>
      <details className="visual-code">
        <summary>
          <Icon name="code" size={16} /> See the code behind the concept
        </summary>
        <Markdown>
          {'```' +
            (visual.language ||
              (['java-memory', 'thread-sync', 'gc-sweep'].includes(visual.id)
                ? 'java'
                : ['request-flow', 'caching', 'aggregation-pipeline', 'outbox-pattern'].includes(
                      visual.id,
                    )
                  ? 'text'
                  : 'javascript')) +
            '\n' +
            visual.code +
            '\n```'}
        </Markdown>
      </details>
    </div>
  );
}

export default function VisualLab({ embedded = false, topic }) {
  const [params, setParams] = useSearchParams();
  const track = params.get('track') || 'all';
  const requested = topic || params.get('topic') || 'event-loop';
  const visual = VISUALS.find((item) => item.id === requested) || VISUALS[0];
  const related = notes.filter((note) => note.visual === visual.id).slice(0, 3);
  return (
    <div className={`visual-lab page-enter ${embedded ? 'embedded' : ''}`}>
      {!embedded && (
        <>
          <div className="page-eyebrow">
            <span className="small-line" /> LESS ABSTRACT. MORE AHA.
          </div>
          <div className="page-heading">
            <div>
              <h1>
                See the idea come alive<span>.</span>
              </h1>
              <p>Press play. Slow it down. Follow what changes, and understand why.</p>
            </div>
            <span className="count-pill">{VISUALS.length} interactive concepts</span>
          </div>
          <label className="visual-track-filter">
            Explore a subject
            <select
              aria-label="Visualization subject"
              value={track}
              onChange={(event) => {
                const nextTrack = event.target.value;
                const first = VISUALS.find(
                  (item) => nextTrack === 'all' || item.track === nextTrack,
                );
                setParams({ track: nextTrack, topic: first.id });
              }}
            >
              <option value="all">All subjects</option>
              {Object.values(trackById)
                .filter((item) => VISUALS.some((v) => v.track === item.id))
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.shortName || item.name}
                  </option>
                ))}
            </select>
          </label>
          <div className="visual-picker">
            {VISUALS.filter((item) => track === 'all' || item.track === track).map((item) => (
              <button
                key={item.id}
                className={visual.id === item.id ? 'active' : ''}
                aria-pressed={visual.id === item.id}
                onClick={() => setParams({ topic: item.id, track })}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <Simulator key={visual.id} visual={visual} />
      {!embedded && related.length > 0 && (
        <section className="related-notes">
          <div className="section-heading">
            <h2>Connect it to your notes</h2>
            <span className="muted">{trackById[visual.track].name}</span>
          </div>
          {related.map((note) => (
            <Link key={note.id} to={`/notes/${note.id}`} className="recent-row">
              <Icon name="book" size={18} />
              <span>{note.title}</span>
              <Icon name="arrow" size={17} />
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

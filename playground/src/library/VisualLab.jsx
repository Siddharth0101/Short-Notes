import { NoteLink } from './Navigation.jsx';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VISUALS } from '../data/visuals.js';
import { localizeVisual } from '../data/visuals.en.js';
import { trackById } from '../data/catalog.js';
import {
  binarySearchTrace,
  bubbleSortTrace,
  bfsTrace,
  fibonacciTrace,
  GRAPH,
} from '../lib/traces.js';
import { useLang } from '../lib/langContext.js';
import { useCatalog } from '../lib/catalogContext.js';
import { usePlay } from '../lib/playContext.js';
import Icon from './Icons.jsx';
import Markdown from './Markdown.jsx';

const BFS_LAYOUT = {
  points: {
    A: [180, 45],
    B: [85, 130],
    C: [285, 130],
    D: [35, 225],
    E: [155, 225],
    F: [285, 225],
  },
  edges: Object.entries(GRAPH).flatMap(([from, targets]) =>
    targets.filter((to) => from < to).map((to) => [from, to]),
  ),
};

// Node-and-edge view shared by graph and tree traces; a frame may bring its own layout.
function GraphView({ frame }) {
  const { t } = useLang();
  const { points, edges } = frame.graph === true ? BFS_LAYOUT : frame.graph;
  return (
    <div className="graph-display">
      <svg
        viewBox="0 0 360 280"
        role="img"
        aria-label={t('visual.graphLabel', {
          active: frame.active || t('visual.none'),
          visited: frame.order?.join(', ') || t('visual.none'),
        })}
      >
        <g>
          {edges.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              x1={points[from][0]}
              y1={points[from][1]}
              x2={points[to][0]}
              y2={points[to][1]}
              stroke="var(--border-strong)"
              strokeWidth="2"
            />
          ))}
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
          <span>{frame.listLabel || t('visual.queue')}</span>
          <strong>{frame.queue?.join(' → ') || t('visual.empty')}</strong>
        </div>
        <div>
          <span>{frame.orderLabel || t('visual.visitedOrder')}</span>
          <strong>{frame.order?.join(' → ') || t('visual.notStarted')}</strong>
        </div>
      </div>
    </div>
  );
}

const INDEX_VALUES = [3, 8, 15, 23, 31, 42, 56, 71, 89];

// Mongo index demo: an index seek modelled on a sorted array, against a collection scan.
function mongoFrames(indexMode, lang) {
  const say = (hinglish, english) => (lang === 'en' ? english : hinglish);
  if (indexMode)
    return [
      ...binarySearchTrace(INDEX_VALUES, 42, lang),
      {
        title: say('Matching document fetch karo', 'Fetch the matching document'),
        explanation: say(
          'Index entry se document reference mila. Non-covered query us document ko fetch karti hai. Is simplified unique-SKU example mein ek match hai.',
          'The index entry gave a reference to the document. A non-covered query then fetches that document. This simplified unique-SKU example has one match.',
        ),
        lanes: [
          { name: 'Index', items: ['sku: 42 → document #6'] },
          { name: 'Collection', items: ['{ sku: 42, name: "Notebook" }'] },
        ],
        metrics: ['1 matching document', 'illustrative index seek'],
      },
    ];
  return INDEX_VALUES.slice(0, 6).map((value, i) => ({
    title:
      value === 42
        ? say('Matching document mil gaya', 'Found the matching document')
        : `Scan document ${i + 1}`,
    explanation:
      value === 42
        ? say(
            'findOne-style lookup pehle match par ruk sakta hai. General find query aur matches ke liye scan continue kar sakti hai.',
            'A findOne-style lookup can stop at the first match. A general find query may keep scanning for more matches.',
          )
        : say(
            'Is example mein supporting index nahi hai. Har document check karna pad raha hai.',
            'This example has no supporting index, so every document has to be checked.',
          ),
    cells: INDEX_VALUES.map((v, j) => ({
      value: v,
      label: `doc ${j + 1}`,
      status: j === i ? (value === 42 ? 'found' : 'active') : j < i ? 'muted' : 'idle',
    })),
    metrics: [`${i + 1} documents examined`, 'illustrative collection scan'],
  }));
}

function Simulator({ visual }) {
  const { lang, t } = useLang();
  const { finishVisual } = usePlay();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [target, setTarget] = useState(42);
  const [variant, setVariant] = useState(false);
  const [indexMode, setIndexMode] = useState(true);
  const frames = useMemo(() => {
    if (visual.id === 'binary-search') return binarySearchTrace(INDEX_VALUES, target, lang);
    if (visual.id === 'sorting')
      return bubbleSortTrace(variant ? [25, 75, 40, 90, 55, 15] : [65, 30, 85, 45, 20, 55], lang);
    if (visual.id === 'bfs') return bfsTrace(undefined, undefined, lang);
    if (visual.id === 'dynamic-programming') return fibonacciTrace(variant ? 8 : 6, lang);
    if (visual.id === 'mongo-index') return mongoFrames(indexMode, lang);
    if (visual.trace) return visual.trace(lang, variant);
    return visual.frames;
  }, [visual, target, variant, indexMode, lang]);
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
  // Reaching the last step of a visual counts once towards arcade progress.
  useEffect(() => {
    if (end) finishVisual(visual.id);
  }, [end, visual.id, finishVisual]);
  function reset() {
    setStep(0);
    setPlaying(false);
  }
  function play() {
    if (end) setStep(0);
    setPlaying(!playing);
  }
  const hasVariant = ['sorting', 'dynamic-programming'].includes(visual.id) || visual.variants;
  return (
    <div className="simulator">
      <div className="simulator-top">
        <div>
          <span className="card-overline">{t('visual.overline')}</span>
          <h2>{visual.name}</h2>
        </div>
        <span className="simulation-pill">
          <span />{' '}
          {playing
            ? t('visual.status.playing')
            : end
              ? t('visual.status.complete')
              : t('visual.status.ready')}
        </span>
      </div>
      <div className="simulator-options">
        {visual.id === 'binary-search' && (
          <label>
            {t('visual.findValue')}{' '}
            <select
              aria-label={t('visual.targetLabel')}
              value={target}
              onChange={(event) => {
                reset();
                setTarget(Number(event.target.value));
              }}
            >
              <option value="42">{t('visual.target.middle')}</option>
              <option value="3">{t('visual.target.first')}</option>
              <option value="89">{t('visual.target.last')}</option>
              <option value="44">{t('visual.target.missing')}</option>
            </select>
          </label>
        )}
        {hasVariant && (
          <button
            className="subtle-button"
            onClick={() => {
              reset();
              setVariant(!variant);
            }}
          >
            <Icon name="shuffle" size={14} />
            {visual.id === 'sorting'
              ? t('visual.anotherArray')
              : visual.id === 'dynamic-programming'
                ? t('visual.tryN', { n: variant ? 6 : 8 })
                : t('visual.anotherInput')}
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
              {t('visual.withIndex')}
            </button>
            <button
              className={!indexMode ? 'active' : ''}
              onClick={() => {
                reset();
                setIndexMode(false);
              }}
            >
              {t('visual.collectionScan')}
            </button>
          </div>
        )}
        <span className="simulation-legend">
          <i /> {t('visual.legendCurrent')} <i className="legend-found" />{' '}
          {t('visual.legendResolved')}
        </span>
      </div>
      <div className="simulation-canvas">
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
                    <div className="lane-empty">{t('visual.empty')}</div>
                  )}
                </div>
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
          <button className="icon-button" aria-label={t('visual.reset')} onClick={reset}>
            <Icon name="reset" size={18} />
          </button>
          <button
            className="icon-button"
            aria-label={t('visual.previous')}
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
            aria-label={playing ? t('visual.pauseLabel') : t('visual.playLabel')}
            onClick={play}
          >
            <Icon name={playing ? 'pause' : 'play'} size={16} />
            {playing ? t('visual.pause') : end ? t('visual.replay') : t('visual.play')}
          </button>
          <button
            className="subtle-button"
            disabled={end}
            onClick={() => {
              setPlaying(false);
              setStep(step + 1);
            }}
          >
            {t('visual.next')} <Icon name="next" size={16} />
          </button>
        </div>
        <div className="step-position">
          <span>
            {step + 1} / {frames.length}
          </span>
          <input
            aria-label={t('visual.stepLabel')}
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
          aria-label={t('visual.speedLabel')}
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
        >
          <option value="2400">{t('visual.speed', { value: '0.5' })}</option>
          <option value="1200">{t('visual.speed', { value: '1' })}</option>
          <option value="600">{t('visual.speed', { value: '2' })}</option>
        </select>
      </div>
      <div className="visual-takeaway">
        <Icon name="sparkles" size={20} />
        <div>
          <strong>{t('visual.takeaway')}</strong>
          <p>{visual.takeaway}</p>
          {visual.source && (
            <a href={visual.source} target="_blank" rel="noreferrer">
              {t('visual.reference')}
            </a>
          )}
        </div>
      </div>
      <details className="visual-code">
        <summary>
          <Icon name="code" size={16} /> {t('visual.code')}
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
  const { lang, t } = useLang();
  const { notes } = useCatalog();
  const track = VISUALS.some((item) => item.track === params.get('track'))
    ? params.get('track')
    : 'all';
  const choices = VISUALS.filter((item) => embedded || track === 'all' || item.track === track);
  const requested = topic || params.get('topic') || 'event-loop';
  const selected = choices.find((item) => item.id === requested) || choices[0];
  const visual = useMemo(() => localizeVisual(selected, lang), [selected, lang]);
  const related = notes.filter((note) => note.visual === visual.id).slice(0, 3);
  return (
    <div className={`visual-lab page-enter ${embedded ? 'embedded' : ''}`}>
      {!embedded && (
        <>
          <div className="page-eyebrow">
            <span className="small-line" /> {t('visual.eyebrow')}
          </div>
          <div className="page-heading">
            <div>
              <h1>
                {t('visual.title')}
                <span>.</span>
              </h1>
              <p>{t('visual.lead')}</p>
            </div>
            <span className="count-pill">{t('visual.count', { count: VISUALS.length })}</span>
          </div>
          <label className="visual-track-filter">
            {t('visual.exploreSubject')}
            <select
              aria-label={t('visual.subjectLabel')}
              value={track}
              onChange={(event) => {
                const nextTrack = event.target.value;
                const first = VISUALS.find(
                  (item) => nextTrack === 'all' || item.track === nextTrack,
                );
                setParams({ track: nextTrack, topic: first.id });
              }}
            >
              <option value="all">{t('visual.allSubjects')}</option>
              {Object.values(trackById)
                .filter((item) => VISUALS.some((v) => v.track === item.id))
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.shortName || item.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="mobile-visual-picker">
            {t('visual.chooseConcept')}
            <select
              aria-label={t('visual.conceptLabel')}
              value={visual.id}
              onChange={(event) => setParams({ topic: event.target.value, track })}
            >
              {choices.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="visual-picker">
            {choices.map((item) => (
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
            <h2>{t('visual.connect')}</h2>
            <span className="muted">{trackById[visual.track].name}</span>
          </div>
          {related.map((note) => (
            <NoteLink key={note.id} to={`/notes/${note.id}`} className="recent-row">
              <Icon name="book" size={18} />
              <span>{note.title}</span>
              <Icon name="arrow" size={17} />
            </NoteLink>
          ))}
        </section>
      )}
    </div>
  );
}

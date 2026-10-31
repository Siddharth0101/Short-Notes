import { Children, isValidElement, useEffect, useId, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { headingId } from '../lib/content.js';
import Icon from './Icons.jsx';
const exampleFiles = import.meta.glob('../../../examples/*/*.md', {
  query: '?raw',
  import: 'default',
});

function ExampleLink({ href, children }) {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const load = exampleFiles[`../../../${href.replace(/^\.\.\/\.\.\//, '')}`];
  if (!load) return <a href={href}>{children}</a>;
  async function toggle() {
    if (content) {
      setOpen(!open);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      setContent(await load());
      setOpen(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <button
        className="example-disclosure"
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-expanded={open}
      >
        {loading ? 'Example khul raha hai…' : children}
      </button>
      {error && <span role="status"> Load nahi hua; dobara try karo.</span>}
      {open && <Markdown idPrefix="code-example">{content}</Markdown>}
    </>
  );
}
function textContent(children) {
  return Children.toArray(children)
    .map((child) =>
      typeof child === 'string'
        ? child
        : isValidElement(child)
          ? textContent(child.props.children)
          : String(child),
    )
    .join('');
}
function CodeBlock({ children }) {
  const [status, setStatus] = useState('Copy');
  useEffect(() => {
    if (status === 'Copy') return;
    const timer = setTimeout(() => setStatus('Copy'), 3000);
    return () => clearTimeout(timer);
  }, [status]);
  const code = textContent(children);
  const element = Children.toArray(children)[0];
  const language = element?.props?.className?.replace('language-', '') || 'text';
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('Copied');
    } catch {
      setStatus('Select code to copy');
    }
  }
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>
          <Icon name="code" size={14} />
          {language}
        </span>
        <button onClick={copy} aria-label="Copy code">
          <Icon name={status === 'Copied' ? 'check' : 'copy'} size={13} />
          <span role="status">{status}</span>
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}
function chapterNotesPlugin({ recall = true } = {}) {
  const nodeText = (node) => node.value || (node.children || []).map(nodeText).join('');
  return (tree) => {
    let inRecall = false;
    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth === 2) {
        inRecall = /^Recall aur practice$/i.test(nodeText(node).trim());
      }
      if (node.type !== 'list') continue;
      let terms = 0;
      for (const item of node.children) {
        if (recall && inRecall && /^Jawaab\s*[—–-]/i.test(nodeText(item).trim())) {
          item.data = {
            ...item.data,
            hProperties: { ...item.data?.hProperties, 'data-recall-answer': true },
          };
        }
        // Give the existing “term — meaning” format a clear scanning rhythm.
        const paragraph = item.children[0];
        if (paragraph?.type !== 'paragraph') continue;
        const separator = paragraph.children.findIndex(
          (child) => child.type === 'text' && child.value.includes(' — '),
        );
        if (separator < 0) continue;
        const child = paragraph.children[separator];
        const dash = child.value.indexOf(' — ');
        const term = [
          ...paragraph.children.slice(0, separator),
          { type: 'text', value: child.value.slice(0, dash) },
        ];
        if (term.map(nodeText).join('').length > 80) continue;
        terms++;
        paragraph.children = [
          { type: 'strong', children: term },
          {
            type: 'termMeaning',
            data: { hName: 'span', hProperties: { className: ['term-meaning'] } },
            children: [
              {
                type: 'termSeparator',
                data: { hName: 'span', hProperties: { className: ['term-sep'] } },
                children: [{ type: 'text', value: ' — ' }],
              },
              { type: 'text', value: child.value.slice(dash + 3) },
              ...paragraph.children.slice(separator + 1),
            ],
          },
        ];
      }
      // Lists made of `term — meaning` rows read like a glossary on wide screens.
      if (terms && terms * 2 >= node.children.length) {
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, className: ['term-list'] },
        };
      }
    }
  };
}
function RecallListItem({ children, node }) {
  const [revealed, setRevealed] = useState(false);
  const answerId = useId();
  if (!node.properties['data-recall-answer']) return <li>{children}</li>;
  return (
    <li className="recall-answer">
      <div className="recall-answer-prompt">
        <span>Pehle apna answer bolo ya likho.</span>
        <button
          type="button"
          aria-expanded={revealed}
          aria-controls={answerId}
          onClick={() => setRevealed(!revealed)}
        >
          <Icon name={revealed ? 'check' : 'down'} size={15} />
          {revealed ? 'Jawaab chhupao' : 'Jawaab dekho'}
        </button>
      </div>
      <div id={answerId} className="recall-answer-content" hidden={!revealed}>
        {children}
      </div>
    </li>
  );
}
const components = {
  pre: CodeBlock,
  h2: ({ children }) => <h2 id={headingId(textContent(children))}>{children}</h2>,
  table: ({ children }) => (
    <div className="table-scroll">
      <table>{children}</table>
    </div>
  ),
  a: ({ href, children }) =>
    href?.startsWith('../../examples/') ? (
      <ExampleLink href={href}>{children}</ExampleLink>
    ) : (
      <a href={href} target={href?.startsWith('https://') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    ),
};
export default function Markdown({
  children,
  idPrefix = '',
  recallAnswers = false,
  terms = false,
}) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={
          recallAnswers || terms
            ? [remarkGfm, [chapterNotesPlugin, { recall: recallAnswers }]]
            : [remarkGfm]
        }
        components={{
          ...components,
          ...(recallAnswers ? { li: RecallListItem } : {}),
          ...(idPrefix
            ? {
                h2: ({ children }) => (
                  <h2 id={`${idPrefix}-${headingId(textContent(children))}`}>{children}</h2>
                ),
              }
            : {}),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

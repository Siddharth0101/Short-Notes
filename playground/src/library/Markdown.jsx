import { Children, isValidElement, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { headingId } from '../lib/content.js';
import Icon from './Icons.jsx';
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
          {status}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
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
  a: ({ href, children }) => (
    <a href={href} target={href?.startsWith('https://') ? '_blank' : undefined} rel="noreferrer">
      {children}
    </a>
  ),
};
export default function Markdown({ children, idPrefix = '' }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={
          idPrefix
            ? {
                ...components,
                h2: ({ children }) => (
                  <h2 id={`${idPrefix}-${headingId(textContent(children))}`}>{children}</h2>
                ),
              }
            : components
        }
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

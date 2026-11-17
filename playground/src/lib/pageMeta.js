import { useEffect } from 'react';

// The text search results show under a page's title. index.html holds the site-wide one; a page
// with its own summary (a chapter) swaps it in while open and puts the site-wide one back after.
export function usePageDescription(text) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    if (!meta || !text) return undefined;
    const site = meta.getAttribute('content');
    meta.setAttribute('content', text);
    return () => meta.setAttribute('content', site);
  }, [text]);
}

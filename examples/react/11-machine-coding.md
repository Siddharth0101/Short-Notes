# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A latest-request guard

```jsx
import { useEffect, useState } from 'react';

export function useResults(query) {
  const [state, setState] = useState({ query: '', status: 'idle', items: [] });
  useEffect(() => {
    let current = true;
    const controller = new AbortController();
    if (!query.trim()) return () => { current = false; };
    async function load() {
      setState({ query, status: 'loading', items: [] });
      try {
        const response = await fetch('/api/search?q=' + encodeURIComponent(query), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Search failed');
        const items = await response.json(); // Validate the API shape in production.
        if (current) setState({ query, status: 'success', items });
      } catch (error) {
        if (current && !controller.signal.aborted) {
          setState({ query, status: 'error', items: [], message: error.message });
        }
      }
    }
    load();
    return () => { current = false; controller.abort(); };
  }, [query]);
  if (!query.trim()) return { status: 'idle', items: [] };
  return state.query === query ? state : { status: 'loading', items: [] };
}
```

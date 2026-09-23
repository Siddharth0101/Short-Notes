# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Coding drill

```jsx
useEffect(() => {
  let active = true;
  const controller = new AbortController();
  setStatus('loading');
  loadResults(query, { signal: controller.signal })
    .then(data => {
      if (!active) return;
      setResults(data);
      setStatus('success');
    })
    .catch(error => {
      if (!active || error.name === 'AbortError') return;
      setStatus('error');
    });
  return () => {
    active = false;
    controller.abort();
  };
}, [query]); // assume loadResults is a stable imported function
```

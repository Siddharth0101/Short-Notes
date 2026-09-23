# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A cancellable data effect

```jsx
import { useEffect, useState } from "react";

export function useTopic(id) {
  const [result, setResult] = useState({ status: "loading", data: null });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setResult({ status: "loading", data: null });
    async function load() {
      try {
        const response = await fetch(`/api/topics/${encodeURIComponent(id)}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const data = await response.json();
        if (active) setResult({ status: "success", data });
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setResult({ status: "error", data: null, error });
        }
      }
    }
    load();
    return () => { active = false; controller.abort(); };
  }, [id]);
  return result;
}
```

## Refs and custom hooks

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Sirf best-effort preference demo; save fail ho sakta hai, durable-save success claim mat karo
    }
  }, [key, value]);

  return [value, setValue];
}
```

```jsx
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId); // Har keystroke par purana timer cancel hota hai
  }, [value, delayMs]);
  return debounced;
}
```

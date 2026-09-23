# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Preference ko safely decode karo

```js
function decodePreferences(raw) {
  const fallback = () => ({ version: 2, theme: 'system', completed: [] });
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback();
    if (![1, 2].includes(value.version)) return fallback();
    const theme = ['light', 'dark', 'system'].includes(value.theme) ? value.theme : 'system';
    const completed = Array.isArray(value.completed)
      ? [...new Set(value.completed.filter(id => typeof id === 'string' && id.length > 0))]
      : [];
    return { version: 2, theme, completed };
  } catch {
    return fallback();
  }
}
console.log(decodePreferences('{"version":1,"theme":"dark","completed":["js-1","js-1",3]}'));
// { version: 2, theme: 'dark', completed: ['js-1'] }
```

# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Make invalid states harder to represent

```typescript
type Topic = { id: string; title: string };
type Result =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'success'; items: Topic[] }
  | { status: 'error'; message: string };

function message(result: Result): string {
  switch (result.status) {
    case 'idle': return 'Start searching';
    case 'loading': return `Searching for ${result.query}`;
    case 'success': return `${result.items.length} topics`;
    case 'error': return result.message;
    default: {
      const impossible: never = result;
      return impossible;
    }
  }
}
```

## Parse at the boundary

```typescript
function isTopic(value: unknown): value is Topic {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && typeof value.id === 'string'
    && 'title' in value && typeof value.title === 'string';
}
function parseTopics(value: unknown): Topic[] {
  if (!Array.isArray(value) || !value.every(isTopic)) {
    throw new Error('Invalid topic response');
  }
  return value;
}
```

## Research notes: Make omitted states visible to the compiler

```ts
type Save = { kind: 'idle' } | { kind: 'failed'; message: string };
function label(state: Save): string {
  switch (state.kind) {
    case 'idle': return 'Save';
    case 'failed': return state.message;
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}
```

## Depth walkthrough — andar kya ho raha hai?

```ts
type LoadResult =
  | { status: 'loading' }
  | { status: 'success'; title: string }
  | { status: 'error'; message: string };

function describe(result: LoadResult): string {
  switch (result.status) {
    case 'loading': return 'Load ho raha hai';
    case 'success': return result.title;
    case 'error': return result.message;
    default: {
      const unreachable: never = result;
      return unreachable;
    }
  }
}
```

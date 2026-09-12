---
id: react-typescript-contracts
title: TypeScript contracts for React applications
track: react
order: 9
level: Advanced
minutes: 25
summary: Represent valid UI states and validate unknown data at runtime boundaries.
tags: typescript, state, narrowing, api, testing
---

## Mental model

TypeScript compile time par JavaScript contracts check karta hai. Browser receives JavaScript, so a type annotation cannot prove that a server actually sent the expected response. Think of two boundaries: runtime parsing protects external input; static types help trusted code use the parsed result correctly.

## Make invalid states harder to represent

Independent booleans like loading, failed and ready allow contradictory combinations. A discriminated union ties each status to the data available in that state.

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

Adding a new union member now forces this switch to account for it. This is valuable for UI states such as offline or refreshing, where forgetting a branch otherwise creates an invisible product bug. Do not use a type assertion to silence the exhaustive check; it is evidence that a design decision remains.

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

A predicate is executable logic and can itself contain bugs. Test malformed payloads. Use a schema validator for larger nested contracts, following the installed library's documentation. An assertion such as response as Topic[] checks nothing at runtime.

## Component contract decisions

Prefer explicit props that describe domain actions, such as onSelect(topicId), rather than passing a state setter to every child. A generic component is justified when callers share a real structure and behavior; avoid making every small component generic merely to demonstrate syntax.

unknown forces narrowing before use. any opts out of checking and can spread silently through a codebase. Optional props deserve defaults only when absence has a defined meaning. An optional monetary amount should not silently become zero if missing data represents an API failure.

## Practice

Add a refreshing state that preserves old items and an offline state with a retry action. Update every renderer without assertions. Feed parseTopics null, an object, a mixed array and an empty array. Explain which inputs should succeed and why. Finally type an editable row whose onSave returns a Promise and explicitly handle pending and rejection in the UI.

## Interview questions

**Does readonly mean immutable at runtime?** No. It restricts permitted assignments through that TypeScript view; aliases and runtime mutation still require careful design.

**Why prefer a union over optional data and optional error?** The union expresses which combinations are valid and lets control-flow narrowing enforce branch-specific access.

## Sources

[TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) documents control-flow analysis and discriminated unions.

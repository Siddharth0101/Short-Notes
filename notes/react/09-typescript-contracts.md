---
id: react-typescript-contracts
title: TypeScript contracts for React applications
track: react
order: 9
level: Advanced
minutes: 25
summary: Static types trusted program values describe karte hain; external data ko runtime par validate karna padta hai.
tags: typescript, state, narrowing, api, testing
---

## Mental model — simple soch

TypeScript compile time par JavaScript contracts check karta hai. Browser receives JavaScript, so a type annotation cannot prove that a server actually sent the expected response. Think of two boundaries: runtime parsing protects external input; static types help trusted code use the parsed result correctly.

> **Core takeaway:** Static types trusted program values describe karte hain; external data ko runtime par validate karna padta hai.

## Make invalid states harder to represent

Loading/failed/ready ke independent booleans contradictory combinations allow karte hain. Discriminated union har status ko us state ke valid data se jodta hai.

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

New union member add karne par switch ko uska case handle karna padega. Offline/refreshing branch bhoolne ka UI bug compiler expose kar sakta hai. Exhaustive error assertion se chupao mat; woh pending design decision dikha raha hai.

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

Predicate executable logic hai; usmein bhi bug ho sakta hai. Malformed payloads test karo. Large nested contracts ke liye installed schema validator ki docs follow karo. `response as Topic[]` runtime par kuch check nahi karta.

## Component contract decisions

onSelect(topicId) jaise domain-action props prefer karo; har child ko raw setter dena zaroori nahi. Generic component tab useful hai jab callers real shared structure/behavior use karte hon. Sirf syntax dikhane ke liye har component generic mat banao.

unknown use se pehle narrowing maangta hai; any checking bypass karke silently spread ho sakta hai. Optional prop ka default tab do jab absence ka defined meaning ho. Missing monetary amount API failure ho toh silently zero mat banao.

## Practice

Old items preserve karne wala refreshing aur retry wala offline state add karo. Assertions ke bina all renderers update karo. parseTopics ko null, object, mixed array aur [] do; valid/invalid explain karo. Promise-returning onSave wali typed row mein pending/rejection handle karo.

## Interview questions — bolkar practice karo

**readonly runtime immutable banata hai?** Nahi. TypeScript view ke through assignments restrict hoti hain; aliases/runtime mutation ka design phir bhi chahiye.

**Optional data/error se union better kyun?** Union valid combinations express karta hai; narrowing har branch ko uske valid fields use karne deta hai.

## Research notes: Make omitted states visible to the compiler

Discriminated union state ko valid fields se jodta hai. Exhaustive narrowing missing cases expose karti hai.

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

saving member add karo; jab tak uska case handle nahi hota, exhaustive default type-check fail karega.

**Interview check:** External JSON ko Save assert karne se content validate hota hai?

**Answer:** Nahi. Type assertion runtime check nahi karti. Boundary par untrusted data validate karke application ko typed union do.

**Practice:** Saved ID wala success case add karke har decision point update karo.

[Source yahan padho — TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** API `{"minutes":"ten"}` bhejti hai, interface minutes:number bolta hai. Assertion kyun nahi bachaegi? Boundary kya return kare?

> **Hint:** Type assertion response inspect ya convert nahi karti.

**Answer guide — compare after attempting:** External JSON unknown lo, object shape aur numeric fields inspect karo. Validated data ya explicit parse failure return karo; given response reject karo. Contract ke hisaab se missing, null, negative aur malformed values test karo.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) mein control-flow analysis aur discriminated unions padho.

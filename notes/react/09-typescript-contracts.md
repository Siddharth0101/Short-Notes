---
id: react-typescript-contracts
title: TypeScript contracts for React applications
track: react
order: 9
level: Advanced
minutes: 3
summary: TypeScript — compile-time checks; runtime input validation alag hai.
tags: typescript, state, narrowing, api, testing
---

## Quick revision

> Revision target — Types se allowed states model karo; external JSON ko runtime check ke baad trusted data banao.

- TypeScript — compile-time checks; runtime input validation alag hai.
- Props type — required/optional fields aur callback contract define karo.
- Union — allowed alternatives; literal `status` se state narrow karo.
- Discriminated union — impossible loading/success/error combinations rokta hai.
- `unknown` — pehle validate/narrow; `any` checks bypass karta hai.
- Generic — type relation preserve; unnecessary flexible API mat banao.
- Event type — actual element/event ka type use karo.
- API response — external JSON ko runtime schema se validate karo.
- Nullability — missing value explicitly handle; `!` se blindly silence mat karo.
- Exhaustive check — union ka har variant handle; missing branch compiler se pakdo.
- Readonly — TypeScript write restriction; runtime deep-freeze guarantee nahi.
- Type assertion — `as Type` runtime conversion/validation nahi karta.

### Edge cases aur reasoning

- Type versus value — interface/type compile ke baad erase; runtime checks ke liye actual schema/predicate chahiye.
- Optional property — absent aur explicit undefined ka contract compiler options/serialization se affect; API input normalization define karo.
- Callback relation — generic callback input/output type connection preserve; caller ko unrelated type return karne ki accidental permission mat do.

## Research notes: Make omitted states visible to the compiler

- Discriminated union state ko valid fields se jodta hai.

## Example se samjho

```ts
type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: string[] };

function countLabel(state: LoadState): string {
  if (state.status === "success") return `${state.items.length} items`;
  if (state.status === "error") return state.message;
  return "Loading";
}
```

- Trace — discriminator check ke baad related fields available hain; loading state ko fake `items` dene ki need nahi.
- Catch — server JSON par `as LoadState` likhna validation nahi; shape aur accepted status verify karo.
- Check — new variant add karte waqt exhaustive handling review karo; optional fields se invalid combinations silently allow mat karo.

## Recall aur practice

- Sawal — const user = json as User invalid server payload ko safe kyun nahi banata?
- Jawaab — Assertion compiler belief badalta hai, runtime data nahi; validate karke trusted model construct karo.
- Khud try karo — Request state union aur exhaustive renderer likho; success missing data compile fail aur malformed JSON runtime reject verify karo.

## Practice questions

### Easy · `any` vs `unknown`

```ts
const data: unknown = JSON.parse(text);
data.name.toUpperCase(); // ?
```

<details>
<summary>Answer</summary>

- `unknown` — compile error; use karne se pehle narrow karna padta hai.
- `any` — compile ho jaata, runtime par crash ho sakta tha; type checking band.
- Narrow — `if (typeof data === 'object' && data !== null && 'name' in data && typeof data.name === 'string') {...}`.

</details>

### Easy · Button props type

`Button` ke props type karo: optional `variant: 'primary' | 'ghost'`, required `children`, aur native button ke saare props (`onClick`, `disabled`, `type`).

<details>
<summary>Answer</summary>

```tsx
type ButtonProps = {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'>;

function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button className={`btn btn--${variant}`} {...rest} />;
}
```

- Literal union — galat variant compile time par pakda jaata hai.
- `ComponentPropsWithoutRef<'button'>` — native attributes bina dobara likhe.

</details>

### Medium · Discriminated union for request state

Loading/success/error state ko aisa type karo ki `data` sirf success mein aur `error` sirf error mein accessible ho, aur naya status add karne par compiler yaad dilaye.

<details>
<summary>Answer</summary>

```tsx
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

function View({ state }: { state: State }) {
  switch (state.status) {
    case 'idle': return null;
    case 'loading': return <Spinner />;
    case 'success': return <Profile user={state.data} />;
    case 'error': return <p role="alert">{state.error}</p>;
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}
```

- Narrowing — `status` check ke baad TS ko pata hai kaunse fields hain.
- Impossible states — `loading: true` + `error` saath mein ban hi nahi sakte.
- `never` — naya variant add kiya aur case bhool gaye toh compile error.

</details>

### Medium · `as User` safe nahi hai

```ts
const user = (await res.json()) as User;
```

Problem kya hai aur safer option?

<details>
<summary>Answer</summary>

- Problem — assertion sirf compiler ko chup karata hai; runtime par API kuch bhi bhej sakti hai (missing field, `null`).
- Safer — boundary par runtime validation: schema library (Zod/Valibot) ya manual type guard `isUser(value): value is User`.
- Rule — external data (`fetch`, `localStorage`, URL) ko `unknown` maano, validate karke type do.

</details>

### Hard · Generic `List<T>` component

Generic list banao jo kisi bhi item type ke saath chale: `items`, `getKey`, `renderItem`, aur empty state. Caller ko `renderItem` mein sahi type mile.

<details>
<summary>Answer</summary>

```tsx
type ListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
  empty?: React.ReactNode;
};

function List<T>({ items, getKey, renderItem, empty = 'Kuch nahi mila' }: ListProps<T>) {
  if (!items.length) return <p>{empty}</p>;
  return <ul>{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

<List items={users} getKey={(u) => u.id} renderItem={(u) => u.name} />;
```

- Inference — `items={users}` se `T = User`; `renderItem` mein `u` automatically `User`.
- `readonly T[]` — component list mutate nahi karega, aur readonly arrays bhi accept honge.
- `getKey` — caller stable identity choose karta hai; index key ka default nahi diya.

</details>

## Sources — aur padhne ke liye

- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/09-typescript-contracts.md)

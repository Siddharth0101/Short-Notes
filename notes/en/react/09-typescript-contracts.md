---
id: react-typescript-contracts
title: TypeScript contracts for React applications
track: react
order: 9
level: Advanced
minutes: 3
summary: TypeScript — compile-time checks; runtime input validation is separate.
tags: typescript, state, narrowing, api, testing
---

## Quick revision

> Revision target — Model the allowed states with types; turn external JSON into trusted data only after a runtime check.

- TypeScript — compile-time checks; runtime input validation is separate.
- Props type — define the required/optional fields and the callback contract.
- Union — the allowed alternatives; narrow the state with a literal `status`.
- Discriminated union — prevents impossible loading/success/error combinations.
- `unknown` — validate/narrow first; `any` bypasses the checks.
- Generic — preserves a type relation; do not build an unnecessarily flexible API.
- Event type — use the type of the actual element/event.
- API response — validate external JSON with a runtime schema.
- Nullability — handle a missing value explicitly; do not blindly silence it with `!`.
- Exhaustive check — handle every variant of the union; let the compiler catch a missing branch.
- Readonly — a TypeScript write restriction; not a runtime deep-freeze guarantee.
- Type assertion — `as Type` does no runtime conversion or validation.

### Edge cases and reasoning

- Type versus value — an interface/type is erased after compilation; runtime checks need an actual schema/predicate.
- Optional property — the contract for absent versus explicit undefined is affected by compiler options/serialization; define the API's input normalization.
- Callback relation — preserve the type connection between a generic callback's input and output; do not accidentally allow the caller to return an unrelated type.

## Research notes: Make omitted states visible to the compiler

- A discriminated union ties a state to its valid fields.

## Understand it with an example

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

- Trace — after the discriminator check the related fields are available; there is no need to give the loading state fake `items`.
- Catch — writing `as LoadState` on server JSON is not validation; verify the shape and the accepted status.
- Check — review exhaustive handling when adding a new variant; do not silently allow invalid combinations through optional fields.

## Recall and practice

- Question — Why does const user = json as User not make an invalid server payload safe?
- Answer — An assertion changes what the compiler believes, not the runtime data; validate and then construct a trusted model.
- Try it yourself — Write a request-state union and an exhaustive renderer; verify that success without data fails to compile and malformed JSON is rejected at runtime.

## Practice questions

### Easy · `any` vs `unknown`

```ts
const data: unknown = JSON.parse(text);
data.name.toUpperCase(); // ?
```

<details>
<summary>Answer</summary>

- `unknown` — a compile error; you must narrow before using it.
- `any` — it compiles and could crash at runtime; type checking is off.
- Narrow — `if (typeof data === 'object' && data !== null && 'name' in data && typeof data.name === 'string') {...}`.

</details>

### Easy · Button props type

Type the props of `Button`: an optional `variant: 'primary' | 'ghost'`, required `children`, and all the props of a native button (`onClick`, `disabled`, `type`).

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

- Literal union — a wrong variant is caught at compile time.
- `ComponentPropsWithoutRef<'button'>` — the native attributes without writing them again.

</details>

### Medium · Discriminated union for request state

Type the loading/success/error state so that `data` is accessible only in success and `error` only in error, and the compiler reminds you when a new status is added.

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

- Narrowing — after the `status` check TS knows which fields exist.
- Impossible states — `loading: true` together with an `error` cannot even be constructed.
- `never` — add a new variant and forget its case, and you get a compile error.

</details>

### Medium · `as User` is not safe

```ts
const user = (await res.json()) as User;
```

What is the problem, and what is the safer option?

<details>
<summary>Answer</summary>

- Problem — an assertion only silences the compiler; at runtime the API can send anything (a missing field, `null`).
- Safer — runtime validation at the boundary: a schema library (Zod/Valibot) or a manual type guard `isUser(value): value is User`.
- Rule — treat external data (`fetch`, `localStorage`, the URL) as `unknown`; validate it, then give it a type.

</details>

### Hard · Generic `List<T>` component

Build a generic list that works with any item type: `items`, `getKey`, `renderItem`, and an empty state. The caller must get the correct type in `renderItem`.

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

- Inference — from `items={users}`, `T = User`; in `renderItem`, `u` is automatically a `User`.
- `readonly T[]` — the component will not mutate the list, and readonly arrays are accepted too.
- `getKey` — the caller chooses a stable identity; no index-key default is provided.

</details>

## Sources — further reading

- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/09-typescript-contracts.md)

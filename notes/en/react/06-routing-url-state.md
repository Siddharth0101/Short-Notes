---
id: react-routing-url-state
title: Routing nested layouts and URL state
track: react
order: 6
level: Intermediate
minutes: 3
summary: Router — maps a URL to a screen and layout.
tags: router, url, loaders, navigation, routing
---

## Quick revision

> Revision target — Model shareable filters in the URL; keep defined behaviour for reload, Back and invalid query values.

- Router — maps a URL to a screen/layout.
- Path param — the identity of a resource; query param — filters, sort and page.
- Nested route — a child route rendered inside a shared layout.
- URL state — keep shareable/bookmarkable state in the URL.
- Navigation — use a link; a button is for an action.
- Loader — fetches the route's data; define the error/pending handling.
- Protected route — it is a UI guard; backend authorization is still required.
- Back/forward — derive state from the URL, so a duplicate local copy does not drift.
- Replace navigation — replaces the current history entry; push creates a new entry.
- 404 handling — give a useful fallback for an unknown route and for resource-not-found.
- URL encoding — encode user values; do not concatenate raw text into the path/query.

### Deep-link modal

- Modal identity — the ticket ID in the query; on a page reload resolve the selected entity from the server.
- Deleted ticket — a deep link can have valid syntax while the resource is missing; show a useful error/close action.
- Close history — define the push/replace/back choice; preserve unrelated query filters.

### Edge cases and reasoning

- Query normalization — validate and default an invalid page/filter; the URL string is not directly trusted application state.
- Navigation cancellation — cancel/ignore a route data request once it is obsolete; do not show the old screen's error on the current route.
- Unsaved navigation — define the draft recovery/blocking contract; test the constraints of a browser reload and of internal navigation separately.

## Understand it with an example

```js
const params = new URLSearchParams("?q=effects&page=2");
const query = params.get("q") ?? "";
const parsed = Number(params.get("page") ?? "1");
const page = Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
```

- Trace — the same query/page can be reconstructed from the URL on reload; input parsing gives a fallback for an invalid negative/fractional page.
- Catch — once the total pages are known, apply the policy for an out-of-range upper bound separately.
- Check — the page resets on a filter change, unrelated parameters are preserved, and the controls stay in sync with the URL on browser Back.

## Recall and practice

- Question — With Page=99 and only two pages, how should a URL-driven table behave?
- Answer — Clamp/redirect by a defined policy, or return a valid empty response; the controls and the URL must not be in a contradictory state.
- Try it yourself — Implement filter/page URL state; verify the same visible results on a direct reload, with encoded text, an invalid page and back/forward.

## Practice questions

### Easy · A path param is a string

The route is `/users/:id`. How do you read `id` in the component, and what do you do for `/users/abc`?

<details>
<summary>Answer</summary>

```jsx
const { id } = useParams();
const userId = Number(id);
if (!Number.isInteger(userId) || userId <= 0) return <NotFound />;
```

- Type — URL params are always strings (or missing).
- Validate — do not send an API call for an invalid id; show the 404 UI directly.

</details>

### Easy · The Back button after logout

After logout you called `navigate('/login')`. When the user presses Back, the dashboard flashes. The fix?

<details>
<summary>Answer</summary>

- `navigate('/login', { replace: true })` — the current history entry is replaced, so Back does not return to the protected page.
- Along with it — protected routes check auth on every render and the server rejects the session too; a history trick is not security.

</details>

### Medium · Keep the filters in the URL

The product list's `q`, `sort` and `page` filters currently live in `useState`. Why and how would you keep them in the URL while preserving the other params?

<details>
<summary>Answer</summary>

```jsx
const [params, setParams] = useSearchParams();
const sort = params.get('sort') ?? 'newest';
function updateSort(value) {
  setParams((prev) => {
    const next = new URLSearchParams(prev);
    next.set('sort', value);
    next.delete('page'); // the filter changed, so back to page 1
    return next;
  });
}
```

- Benefits — refresh, a shared link and Back/Forward all keep the filter state.
- Normalize — do not write default values into the URL; map invalid values to the default.
- Typing — use `replace: true` on every keystroke so the history is not spammed.

</details>

### Medium · A protected route that returns you after login

<details>
<summary>Answer</summary>

```jsx
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
// On login success:
navigate(location.state?.from?.pathname ?? '/', { replace: true });
```

- `loading` — do not redirect until the auth check is done, or even a logged-in user sees the login page flash.
- `state.from` — remember the original URL; allow only internal paths to avoid an open redirect.

</details>

### Hard · Block navigation on unsaved changes

The editor has an unsaved draft. You need to confirm on both an in-app link click and a tab close/refresh. How?

<details>
<summary>Answer</summary>

```jsx
const blocker = useBlocker(
  ({ currentLocation, nextLocation }) =>
    isDirty && currentLocation.pathname !== nextLocation.pathname,
);
useEffect(() => {
  if (!isDirty) return;
  const onBeforeUnload = (event) => event.preventDefault();
  window.addEventListener('beforeunload', onBeforeUnload);
  return () => window.removeEventListener('beforeunload', onBeforeUnload);
}, [isDirty]);
// when blocker.state === 'blocked', show your own dialog: blocker.proceed() / blocker.reset()
```

- In-app — `useBlocker` (needs a data router) blocks client navigation and lets you show a custom dialog.
- Tab close/refresh — only `beforeunload`; the browser shows its own generic message, not custom text.
- After saving — set `isDirty` to false, or the redirect right after the save will be blocked too.

</details>

## Sources — further reading

- [React Router Data Mode routing](https://reactrouter.com/start/data/routing)
- [React Router framework routing](https://reactrouter.com/start/framework/routing)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/06-routing-url-state.md)

---
id: react-routing-url-state
title: Routing nested layouts and URL state
track: react
order: 6
level: Intermediate
minutes: 3
summary: Router — URL ko screen/layout se map karta hai.
tags: router, url, loaders, navigation, routing
---

## Quick revision

> Revision target — Shareable filters URL mein model karo; reload, Back aur invalid query values ka defined behavior rakho.

- Router — URL ko screen/layout se map karta hai.
- Path param — resource identity; query param — filters, sort aur page.
- Nested route — shared layout ke andar child route render.
- URL state — shareable/bookmarkable state URL mein rakho.
- Navigation — link use karo; button action ke liye.
- Loader — route data fetch; error/pending handling define karo.
- Protected route — UI guard hai; backend authorization phir bhi chahiye.
- Back/forward — URL se state derive karo, duplicate local copy drift na kare.
- Replace navigation — current history entry replace; push nayi entry banata hai.
- 404 handling — unknown route aur resource-not-found ko useful fallback do.
- URL encoding — user values encode karo; raw text ko path/query mein concatenate mat karo.

### Deep-link modal

- Modal identity — query mein ticket ID; page reload par selected entity server se resolve karo.
- Deleted ticket — deep link valid syntax ho sakta hai but resource missing; useful error/close action.
- Close history — push/replace/back choice define; unrelated query filters preserve karo.

### Edge cases aur reasoning

- Query normalization — invalid page/filter ko validate aur default karo; URL string directly trusted application state nahi.
- Navigation cancellation — route data request obsolete ho toh cancel/ignore; purani screen ka error current route par mat dikhao.
- Unsaved navigation — draft recovery/blocking contract define; browser reload aur internal navigation ke constraints alag test karo.

## Example se samjho

```js
const params = new URLSearchParams("?q=effects&page=2");
const query = params.get("q") ?? "";
const parsed = Number(params.get("page") ?? "1");
const page = Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
```

- Trace — URL se same query/page reload par reconstruct ho sakte hain; input parsing invalid negative/fractional page ko fallback deti hai.
- Catch — total pages pata chalne ke baad out-of-range upper bound ka policy alag apply karo.
- Check — filter change par page reset, unrelated parameters preserve, aur browser Back par controls URL ke saath sync hon.

## Recall aur practice

- Sawal — Page=99 aur only two pages ho toh URL-driven table ka kya behavior hona chahiye?
- Jawaab — Defined policy se clamp/redirect ya valid empty response; controls aur URL contradictory state mein nahi hone chahiye.
- Khud try karo — Filter/page URL state implement karo; direct reload, encoded text, invalid page aur back/forward par same visible results verify karo.

## Practice questions

### Easy · Path param string hota hai

Route `/users/:id` hai. Component mein `id` kaise padhoge aur `/users/abc` par kya karoge?

<details>
<summary>Answer</summary>

```jsx
const { id } = useParams();
const userId = Number(id);
if (!Number.isInteger(userId) || userId <= 0) return <NotFound />;
```

- Type — URL params hamesha string (ya missing) hote hain.
- Validate — invalid id par API call mat bhejo; seedha 404 UI.

</details>

### Easy · Logout ke baad Back button

Logout ke baad `navigate('/login')` kiya. User Back dabata hai toh dashboard flash hota hai. Fix?

<details>
<summary>Answer</summary>

- `navigate('/login', { replace: true })` — current history entry replace hoti hai, Back se protected page par nahi lautoge.
- Saath mein — protected routes har render par auth check karein aur server bhi session reject kare; history trick security nahi hai.

</details>

### Medium · Filters URL mein rakho

Product list ke `q`, `sort`, `page` filters abhi `useState` mein hain. URL mein kyun aur kaise rakhoge, baaki params preserve karte hue?

<details>
<summary>Answer</summary>

```jsx
const [params, setParams] = useSearchParams();
const sort = params.get('sort') ?? 'newest';
function updateSort(value) {
  setParams((prev) => {
    const next = new URLSearchParams(prev);
    next.set('sort', value);
    next.delete('page'); // filter badla toh page 1
    return next;
  });
}
```

- Fayde — refresh, share link, Back/Forward sab filter state rakhte hain.
- Normalize — default values URL mein mat likho; invalid values ko default par map karo.
- Typing — har keystroke par `replace: true` use karo taaki history spam na ho.

</details>

### Medium · Protected route jo login ke baad wapas laaye

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
// Login success par:
navigate(location.state?.from?.pathname ?? '/', { replace: true });
```

- `loading` — auth check hone tak redirect mat karo, warna logged-in user bhi login page flash dekhega.
- `state.from` — original URL yaad rakho; open redirect se bachne ke liye sirf internal paths allow karo.

</details>

### Hard · Unsaved changes par navigation roko

Editor mein unsaved draft hai. In-app link click aur tab close/refresh — dono par confirm karna hai. Kaise?

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
// blocker.state === 'blocked' par apna dialog: blocker.proceed() / blocker.reset()
```

- In-app — `useBlocker` (data router chahiye) client navigation rokta hai aur custom dialog dikhane deta hai.
- Tab close/refresh — sirf `beforeunload`; browser apna generic message dikhata hai, custom text nahi.
- Save ke baad — `isDirty` false karo, warna save ke turant baad wala redirect bhi block hoga.

</details>

## Sources — aur padhne ke liye

- [React Router Data Mode routing](https://reactrouter.com/start/data/routing)
- [React Router framework routing](https://reactrouter.com/start/framework/routing)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/06-routing-url-state.md)

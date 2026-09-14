---
id: react-routing-url-state
title: Routing nested layouts and URL state
track: react
order: 6
level: Intermediate
minutes: 26
summary: Jo state refresh aur sharing ke baad bachni chahiye, uske liye URL useful owner hai.
tags: router, url, loaders, navigation, routing
---

## Mental model — simple soch

URL app state ka shareable address hai. Route path resource/page identify karta hai; search params filters, sort aur page jaise shareable view choices store kar sakte hain. Router URL ko component/layout tree se match karta hai. Local modal state ko har baar URL mein rakhna necessary nahi, lekin refresh/back/share behavior important ho to URL ownership consider karo.

> **Core takeaway:** Jo state refresh aur sharing ke baad bachni chahiye, uske liye URL useful owner hai.

## A nested route tree

```jsx
// React Router v7 Data Mode example; components are application imports.
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { TopicPage, TopicError, LibraryHome } from "./pages";

function LibraryLayout() {
  return <main><h1>Study library</h1><Outlet /></main>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LibraryLayout />,
    children: [
      { index: true, element: <LibraryHome /> },
      {
        path: "topics/:topicId",
        loader: async ({ params, request }) => {
          const response = await fetch(`/api/topics/${encodeURIComponent(params.topicId)}`, {
            signal: request.signal
          });
          if (!response.ok) throw new Response("Topic unavailable", { status: response.status });
          return response.json();
        },
        element: <TopicPage />,
        errorElement: <TopicError />
      }
    ]
  }
]);

export default function App() { return <RouterProvider router={router} />; }
```

Parent Outlet matched child render karta hai. Index route parent URL ka default child hai. Dynamic segment ko params se read karo. Example Data Mode ka hai; Declarative Mode aur Framework Mode ki setup APIs ko mix mat karo. Existing repository ke legacy notes React Router v6 style imports show kar sakte hain; project package version ke matching docs choose karo.

## Data and navigation

Link/NavLink normal in-app navigation semantics provide karte hain; programmatic navigate successful workflow jaise form completion ke baad useful hai. Loader route data loading boundary deta hai. Actions mutations coordinate kar sakti hain, aur router revalidation next UI fresh rakh sakti hai. Pending navigation aur route-level error states explicitly design karo. Loader authentication hint de sakta hai, lekin backend ko har protected operation independently authorize karna hoga.

Search params strings hote hain. Page ko Number mein convert karke positive integer validate karo. Unknown filter values ke safe defaults choose karo. Typing ke har keystroke par push karoge to back history noisy ho sakti hai; transient updates mein replace aur deliberate navigation mein push useful distinction hai.

```jsx
import { useSearchParams } from "react-router";

function TopicFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const track = searchParams.get("track") ?? "all";
  const sort = searchParams.get("sort") ?? "order";

  function updateTrack(nextTrack) {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      if (nextTrack === "all") next.delete("track");
      else next.set("track", nextTrack);
      return next;
    }, { replace: true }); // filter change history ko clutter na kare
  }

  return (
    <select value={track} onChange={event => updateTrack(event.target.value)}>
      <option value="all">All tracks</option>
      <option value="react">React</option>
      <option value="java">Java</option>
    </select>
  );
}
```

`searchParams.get(...)` `null` return karta hai jab param absent ho, isliye nullish coalescing se safe default do. `setSearchParams` ko updater function dena current params ke basis par safe merge allow karta hai, jabki plain object dena existing unrelated params (jaise `sort`) ko accidentally clear kar sakta hai.

Route ko authentication ke peeche protect karna common requirement hai. Loader ke andar redirect throw karna ek standard approach hai:

```jsx
{
  path: "dashboard",
  loader: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect("/login");
    }
    return { session };
  },
  element: <Dashboard />
}
```

Yeh sirf navigation-level gate hai — agar `Dashboard` component ke andar koi direct API call ho, us API ko bhi independently apna authorization check karna chahiye, warna kisi ne agar directly fetch call kar li (dev tools ya script se) to loader bypass ho jaayega.

## Gotchas

- BrowserRouter app ko direct deep URL se open karne par static server ko SPA entry fallback chahiye. API routes ko fallback HTML mat bhejo.
- Client-side hidden page security boundary nahi hai — route element render na hona sirf UI decision hai, actual data access backend authorization se hi secure hota hai.
- Parent layout mein Outlet missing ho to matching child visible nahi hoga; blank page dekh kar route config check karo, component logic nahi.
- Hardcoded relative paths nested routes ke saath surprising ho sakte hain; route-relative versus path-relative navigation understand karo.
- Dynamic segment ka param string hota hai, chahe woh numeric id ho. `params.topicId === 5` jaisi comparison hamesha false rahegi; explicit conversion (`Number(params.topicId)`) karo.
- Search param update karte waqt naya `URLSearchParams` object banana bhoolna — existing object ko mutate karke wahi reference wapas dena kabhi navigation trigger nahi karega, kyunki router ko identity change nahi dikhti.

## Where this shows up in a real app

E-commerce listing page mein filter (category, price range), sort order aur page number sab URL mein rehte hain — isse user link copy-paste karke exact same filtered view kisi aur ko bhej sakta hai, browser back button se previous filter par wapas aa sakta hai, aur refresh karne par bhi state khoti nahi. Agar yeh sab local component state mein hota (URL ke bahar), to share/refresh/back sab broken feel karte — yehi practical reason hai ki "shareable filter" state ko URL ka owner banaya jaata hai, Redux ya local state ka nahi.

## Practice

`/topics?track=react&sort=minutes` page banao. Filter change, refresh, copy URL aur browser back se same view recover hona chahiye. Invalid topic id aur request cancellation cases handle karo. `useSearchParams` se ek page-number control banao jisme page filter change hone par 1 par reset ho jaaye, aur pagination click replace ke bajaye push kare (taaki back button page-by-page navigate kare).

## Interview questions — bolkar practice karo

**Q. Filter Redux mein ya URL mein?** Shareable/navigation state ho to URL strong default hai. Ephemeral local UI state local rakho; same state ke two competing owners mat banao.

**Q. ProtectedRoute backend security replace karta hai?** Nahi. Woh UX control hai; authorization server-side resource access par enforce hoti hai.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Search page par query, page number, selected row aur unsaved draft hain. URL mein kya rahega? Query change par page kya karega?

> **Hint:** Shareable navigation aur temporary editing ko alag samjho.

**Answer guide — compare after attempting:** Query/page URL params mein; unsaved draft local ya deliberate draft store mein rakho. Selected row tab URL mein ho jab linkable chahiye. Query change par page reset, malformed params validate, aur Back se previous view restore hona verify karo.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[React Router Data Mode routing](https://reactrouter.com/start/data/routing) router setup ka reference hai. [React Router framework routing](https://reactrouter.com/start/framework/routing) nested route concepts aur mode-specific APIs explain karta hai.

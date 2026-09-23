# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

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

## Data and navigation

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

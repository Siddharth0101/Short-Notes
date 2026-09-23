# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Query key defines identity

```jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchTopics(track, signal) {
  const response = await fetch(`/api/topics?track=${encodeURIComponent(track)}`, { signal });
  if (!response.ok) throw new Error("Could not load topics");
  return response.json();
}

export function useTopics(track) {
  return useQuery({
    queryKey: ["topics", { track }],
    queryFn: ({ signal }) => fetchTopics(track, signal),
    staleTime: 60_000
  });
}

export function useCreateTopic() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async input => {
      const response = await fetch("/api/topics", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Save failed");
      return response.json();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["topics"] })
  });
}
```

## Dependent and paginated queries

```jsx
function useTopicDetails(topicId) {
  return useQuery({
    queryKey: ["topic", topicId],
    queryFn: () => fetchTopicDetails(topicId),
    enabled: Boolean(topicId) // topicId null/undefined hote hue query fire hi nahi hogi
  });
}
```

```jsx
import { keepPreviousData, useQuery } from "@tanstack/react-query";

function useTopicsPage(page) {
  return useQuery({
    queryKey: ["topics", { page }],
    queryFn: () => fetchTopicsPage(page),
    placeholderData: keepPreviousData
  });
}
```

## Supabase boundary

```jsx
async function fetchMyTopics(userId) {
  const { data, error } = await supabase
    .from("topics")
    .select("id, title, minutes")
    .eq("owner_id", userId);
  if (error) throw new Error(error.message); // Galat: { data, error } ko silently ignore karke sirf `data` return karna
  return data;
}
```

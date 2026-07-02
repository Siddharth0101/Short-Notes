# Interview Short Notes & Scenarios

This directory contains scenario-based questions, machine coding problems, and standard interview preparation notes — organized by **topic folders**.

## Folder Structure

```
05_Interview/
  03_Frontend/
    01_React_Routing/         ← React Router, URL state, navigation patterns
    02_State_Management/      ← Redux, Context API, Zustand (future)
    03_Performance/           ← Memoization, debouncing, lazy loading (future)
```

## Suggested Reading Order

### React & Routing

1. `03_Frontend/01_React_Routing/Jira_Modal_Refresh_Persist.jsx` — Jira-style modal reopen on page refresh using URL search params

## How to Add a New Question

1. Pick or create a topic folder under `03_Frontend/` (e.g., `02_State_Management/`).
2. Add your `.jsx` file inside that folder.
3. Register it in `playground/src/scenarios/index.js` under the matching topic.
4. Run the playground (`cd playground && npm run dev`) to test it live.

## Main Coverage

- URL state management & deep linking
- System design and machine coding patterns

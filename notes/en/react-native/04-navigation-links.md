---
id: rn-navigation-links
title: Navigation, Expo Router and deep links
track: react-native
order: 4
level: Intermediate
minutes: 4
summary: Navigation — a stack for detail flows, tabs for main sections; decide the history behaviour first.
tags: react-native, mobile, expo, navigation-links
visual: navigation-stack
---

## Quick revision

> Revision target — Reason through the complete cold-start path of a deep link, authentication and navigation history.

### Routes

- Navigation — a stack for detail flows, tabs for main sections; decide the history behaviour first.
- Expo Router — file-based navigation; route files live in the app or src/app directory.
- Layout route — `_layout.tsx` holds the shared navigator/providers; do not duplicate the root setup in every screen.
- Dynamic route — `[id].tsx` is a path parameter; a `(group)` grouping adds no URL segment.
- Route params — small serializable identifiers; do not send a full mutable object or a secret token in the URL.
- Push/replace/back — a new history entry / replace the current one / the previous route; handle login/logout history intentionally.

### Lifecycle and links

- Screen focus — a screen can stay mounted while blurred; use the navigation focus lifecycle for focus-scoped work.
- Focus cleanup — clean up the subscription/request on blur/unmount; a mount-only assumption can cause duplicate work.
- Deep link — opens a screen from a URL; test both the cold-launch and the already-open app paths.
- Auth boundary — a protected screen gate is useful; the backend enforces the actual data authorization.
- Link validation — external params are untrusted; validate the ID/schema and authorize the resource access.
- Android back — coordinate with the navigation history; keep a deliberate confirmation policy for unsaved changes.

### Link delivery and guarded navigation

- Initial URL — Linking.getInitialURL gives the cold-start link; a running app needs a subscription to the url event.
- Universal/App Links — the app opens through a verified HTTPS domain association; a separate setup from registering a custom scheme.
- openURL — launching an external URL can fail/reject; handle the supported scheme and a fallback.
- canOpenURL — the platform manifest/scheme configuration can affect the result; do not treat the result as an authorization check.
- usePreventRemove — a guard against removing a route with unsaved state; cover navigation actions including gestures/header back.
- Process exit — a navigation guard does not stop an OS kill; persist an important draft in good time.

### Edge cases and reasoning

- Auth restoration gate — do not treat a pending initial secure-storage read as logged out; hold the deep link identity and resolve the route once auth is ready.
- Deep-link replay — the same initial URL/event can be processed twice; avoid unintended repeated side effects with a route/action identity.
- Screen lifetime authority — keeping camera/polling active on a mounted screen that is in the background/blurred is waste; define the combined ownership of focus plus app visibility.

## Understand it with an example

- Scenario — a logged-out user opens `/orders/42` from a notification.
- Trace — preserve the pending destination until app boot/auth restore completes; after login fetch the order with the current user's access.
- Decision — the detail screen for an allowed resource; a useful recovery and a safe back destination for a deleted/forbidden resource.
- Catch — receiving a route parameter is not proof of resource access; do not treat a notification payload as an authorization instruction.
- Check — no duplicate screens or bypass on a cold launch, an existing app, a cancelled login and an expired session.

## Recall and practice

- Question — After a logged-out protected deep link, where do you send the user on a successful login?
- Answer — Preserve the validated intended destination, recheck authorization and resolve the route; give a recovery for a missing/forbidden resource.
- Try it yourself — Test cold/warm deep links; verify an auth load delay, a malformed ID, a deleted resource, a duplicate event and the Android back history.

## Practice questions

### Easy · `push` vs `replace` vs `back`

After a successful login you go to home and Back must not return to the login screen. Which method?

<details>
<summary>Answer</summary>

- `router.replace('/home')` — replaces the current screen in the stack; Back does not go to login.
- `router.push` — a new screen on the stack (Back is possible).
- `router.back()` — the previous screen; check when the stack may be empty (`router.canGoBack()`).

</details>

### Easy · Dynamic route param

The file is `app/user/[id].tsx`. How do you read `id`, and what is its type?

<details>
<summary>Answer</summary>

```tsx
const { id } = useLocalSearchParams<{ id: string }>();
```

- Type — a string from the URL (it can also be `string[]` for a repeated param).
- Validate — if a number is needed, parse it + a not-found UI when invalid; anything can arrive from a deep link.

</details>

### Medium · Refreshing data on return

In a stack, Orders list → Order detail; the status changed on the detail. On going Back the list shows old data. Why, and what is the fix?

<details>
<summary>Answer</summary>

- Why — the previous screen of a stack does not unmount; its `useEffect([], ...)` does not run again.
- Fix — `useFocusEffect(useCallback(() => { refetch(); }, [refetch]))` runs on focus and cleans up on blur.
- Better — invalidate after the mutation in a shared server cache (TanStack Query); the list is fresh automatically.

</details>

### Medium · Do not trust a deep link

The link `myapp://orders/123?coupon=FREE100` arrived. Which checks are needed?

<details>
<summary>Answer</summary>

- Validate params — is `123` a valid id format? allowlist/server-validate `coupon`; do not apply a discount on the client.
- Auth — if logged out, go to the target after login; the server checks whether the order belongs to the user.
- Unknown route — a not-found screen, not a crash.
- Verified links — HTTPS Universal/App Links with domain verification; any app can claim a custom scheme.

</details>

### Hard · Auth restore and deep link replay

On a cold start the app restores the session from SecureStore. A deep link targets a protected screen. How do you avoid both a login flash and a lost target?

<details>
<summary>Answer</summary>

- Gate — `authState: 'restoring' | 'signedIn' | 'signedOut'`; while `restoring` keep the splash and do not redirect.
- Pending target — if signed out, remember the incoming URL (memory/state) and `replace` to the login screen.
- Replay — on a successful login `replace` to the validated pending target; otherwise home.
- Edge — a failed restore (token expired) → signed out; replay the target only once, then clear it.

</details>

## Sources — further reading

- [React Native — Linking](https://reactnative.dev/docs/linking)
- [React Navigation — prevent removal](https://reactnavigation.org/docs/preventing-going-back/)

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Route notation](https://docs.expo.dev/router/basics/notation/)
- [Router navigation](https://docs.expo.dev/router/basics/navigation/)
- [Navigation lifecycle](https://reactnavigation.org/docs/navigation-lifecycle/)
- [Mobile security](https://reactnative.dev/docs/security)

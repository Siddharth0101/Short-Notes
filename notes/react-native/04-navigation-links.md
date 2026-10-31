---
id: rn-navigation-links
title: Navigation Expo Router aur deep links
track: react-native
order: 4
level: Intermediate
minutes: 4
summary: Navigation — stack detail-flow ke liye, tabs main sections ke liye; history behavior pehle decide karo.
tags: react-native, mobile, expo, navigation-links
---

## Quick revision

> Revision target — Deep link, authentication aur navigation history ka complete cold-start path reason karo.

### Routes

- Navigation — stack detail-flow ke liye, tabs main sections ke liye; history behavior pehle decide karo.
- Expo Router — file-based navigation; route files app ya src/app directory mein.
- Layout route — `_layout.tsx` shared navigator/providers; har screen mein duplicate root setup mat karo.
- Dynamic route — `[id].tsx` path parameter; `(group)` grouping URL segment add nahi karti.
- Route params — small serializable identifiers; full mutable object ya secret token URL mein mat bhejo.
- Push/replace/back — new history entry / current replace / previous route; login/logout history intentionally handle karo.

### Lifecycle aur links

- Screen focus — screen mounted rehkar blur ho sakti hai; focus-scoped work ke liye navigation focus lifecycle use karo.
- Focus cleanup — blur/unmount par subscription/request cleanup; mount-only assumption duplicate work kara sakti hai.
- Deep link — URL se screen open; cold launch aur already-open app dono paths test karo.
- Auth boundary — protected screen gate useful; actual data authorization backend enforce karta hai.
- Link validation — external params untrusted; ID/schema validate karke resource access authorize karo.
- Android back — navigation history ke saath coordinate; unsaved changes par deliberate confirmation policy rakho.

### Link delivery aur guarded navigation

- Initial URL — Linking.getInitialURL cold-start link deta hai; running app ke liye url event subscription chahiye.
- Universal/App Links — verified HTTPS domain association se app khule; custom scheme registration se alag setup.
- openURL — external URL launch fail/reject ho sakta hai; supported scheme aur fallback handle karo.
- canOpenURL — platform manifest/scheme configuration result affect kar sakti hai; result ko authorization check mat samjho.
- usePreventRemove — unsaved state par route removal guard; gestures/header back samet navigation actions cover karo.
- Process exit — navigation guard OS kill ko stop nahi karta; important draft ko timely persist karo.

### Edge cases aur reasoning

- Auth restoration gate — initial secure storage read pending ko logged-out mat samjho; deep link identity hold karke auth-ready route resolve karo.
- Deep-link replay — same initial URL/event duplicate processing possible; route/action identity se unintended repeated side effects avoid karo.
- Screen lifetime authority — mounted screen background/blur par camera/polling active rakhna waste; focus plus app visibility ka combined ownership define karo.

## Example se samjho

- Scenario — logged-out user notification se `/orders/42` open karta hai.
- Trace — app boot/auth restore complete hone tak pending destination preserve; login ke baad current user ke access se order fetch karo.
- Decision — allowed resource par detail screen; deleted/forbidden resource par useful recovery aur safe back destination do.
- Catch — route parameter milna resource access ka proof nahi; notification payload ko authorization instruction mat samjho.
- Check — cold launch, existing app, login cancel aur expired session mein duplicate screens ya bypass na ho.

## Recall aur practice

- Sawal — Logged-out protected deep link ke baad login success par user ko kahan bhejoge?
- Jawaab — Validated intended destination preserve karo, authorization recheck karke route resolve; missing/forbidden resource ka recovery do.
- Khud try karo — Cold/warm deep links test karo; auth load delay, malformed ID, deleted resource, duplicate event aur Android back history verify karo.

## Practice questions

### Easy · `push` vs `replace` vs `back`

Login success ke baad home par jaana hai aur Back se login screen par nahi lautna. Kaunsa method?

<details>
<summary>Answer</summary>

- `router.replace('/home')` — current screen stack mein replace; Back login par nahi jaata.
- `router.push` — naya screen stack par (Back possible).
- `router.back()` — pichli screen; stack khaali ho toh check karo (`router.canGoBack()`).

</details>

### Easy · Dynamic route param

File `app/user/[id].tsx` hai. `id` kaise padhoge aur type kya hogi?

<details>
<summary>Answer</summary>

```tsx
const { id } = useLocalSearchParams<{ id: string }>();
```

- Type — URL se aaya string (repeated param ho toh `string[]` bhi ho sakta hai).
- Validate — number chahiye toh parse + invalid par not-found UI; deep link se kuch bhi aa sakta hai.

</details>

### Medium · Wapas aane par data refresh

Stack mein Orders list → Order detail; detail par status badla. Back aane par list purani dikhti hai. Kyun aur fix?

<details>
<summary>Answer</summary>

- Kyun — stack ki pichli screen unmount nahi hoti; uska `useEffect([], ...)` dobara nahi chalta.
- Fix — `useFocusEffect(useCallback(() => { refetch(); }, [refetch]))` focus par chalta hai aur blur par cleanup.
- Better — shared server cache (TanStack Query) mein mutation ke baad invalidate; list automatically fresh.

</details>

### Medium · Deep link ko trust mat karo

`myapp://orders/123?coupon=FREE100` link aaya. Kya checks chahiye?

<details>
<summary>Answer</summary>

- Params validate — `123` valid id format? `coupon` allowlist/server validate; client par discount apply mat karo.
- Auth — logged out ho toh login ke baad target par jao; order user ka hai ya nahi, server check kare.
- Unknown route — not-found screen, crash nahi.
- Verified links — HTTPS Universal/App Links domain verification ke saath; custom schemes koi bhi app claim kar sakti hai.

</details>

### Hard · Auth restore aur deep link replay

App cold start par SecureStore se session restore karti hai. Deep link protected screen par aaya. Login flash aur lost target dono kaise avoid karoge?

<details>
<summary>Answer</summary>

- Gate — `authState: 'restoring' | 'signedIn' | 'signedOut'`; `restoring` mein splash rakho, redirect mat karo.
- Pending target — signed out ho toh incoming URL yaad rakho (memory/state), login screen par `replace`.
- Replay — login success par validated pending target par `replace`; nahi toh home.
- Edge — restore fail (token expired) → signed out; target ek hi baar replay ho, phir clear.

</details>

## Sources — aur padhne ke liye

- [React Native — Linking](https://reactnative.dev/docs/linking)
- [React Navigation — prevent removal](https://reactnavigation.org/docs/preventing-going-back/)

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Route notation](https://docs.expo.dev/router/basics/notation/)
- [Router navigation](https://docs.expo.dev/router/basics/navigation/)
- [Navigation lifecycle](https://reactnavigation.org/docs/navigation-lifecycle/)
- [Mobile security](https://reactnative.dev/docs/security)

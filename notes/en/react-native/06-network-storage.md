---
id: rn-network-storage
title: Networking, offline storage and auth
track: react-native
order: 6
level: Intermediate
minutes: 5
summary: Fetch — check response.ok; HTTP 4xx/5xx is not automatically a network exception.
tags: react-native, mobile, expo, network-storage
---

## Quick revision

> Revision target — Bind a network result to the current session identity; trace the races of offline replay and logout.

### Requests

- Fetch — check response.ok; HTTP 4xx/5xx is not automatically a network exception.
- Request race — cleanup/abort and a latest-request guard; an old response must not overwrite the current screen.
- Native networking — the browser's CORS model does not apply the same way to a native app; HTTPS and server auth are still required.
- Localhost — on a physical phone it is the phone itself; configure a reachable development host for a local backend.
- Offline — a connectivity hint does not guarantee API success; handle timeout, retry and a stale-data UI too.
- Offline writes — a queued operation ID and a conflict policy; do not blindly duplicate a POST on reconnect.

### Persistence and identity

- AsyncStorage — async, unencrypted key-value persistence; for non-sensitive preferences/cache.
- SecureStore — platform-backed encrypted storage for small sensitive values; not a whole offline database.
- Storage recovery — handle read/write failure and missing credentials; do not make the local store the only backup of irreplaceable data.
- App secrets — bundled JS/env values can be extracted; keep private service keys on the backend.
- Token expiry — one coordinated refresh flow; on logout clear the user cache and the stored credentials.
- Schema version — validate/migrate persisted JSON; give a safe fallback for corrupt or newer data.

### Mobile server-state integration

- QueryClient — a stable cache instance for the app's lifecycle; a new client on every render resets the cache.
- Query key — include the user ID, filters and resource identity; the server cache of different users must not be shared by accident.
- onlineManager — wire reconnect awareness from NetInfo/expo-network events; keep the subscription cleanup.
- focusManager — the app focus signal from AppState active/background; browser window events are not enough in a native app.
- Screen refetch — screen focus and app focus are different; refetch according to the stale-data policy, not on every render.

### Local database and OAuth

- SQLite — for structured offline rows/queries; a different access model from a key-value store.
- SQL binding — bind untrusted values with prepared parameters; do not concatenate user text in execAsync.
- SQLite transaction — related writes are atomic; in withTransactionAsync other async queries can interleave, so check whether an exclusive scope is needed.
- OAuth redirect — the app scheme/verified link must match the redirect registered with the provider; handle both the auth result and a cancellation.
- PKCE — binds the authorization code to the initiating client's verifier; do not keep a confidential client secret in the mobile bundle.

### Edge cases and reasoning

- SecureStore reinstall — an Android uninstall removes the data; the iOS Keychain can persist across a reinstall of the same bundle, so do not make it a guaranteed recovery policy.
- Refresh/logout race — an old refresh response must not restore credentials after logout; check the auth generation/session identity.
- Offline queue ownership — pending operations are scoped to the user/tenant; on an account switch do not replay the old user's writes with the new credentials.

## Understand it with an example

- Scenario — user A's token refresh is pending; A logs out and B logs in.
- Trace — A's late refresh response now belongs to an obsolete session; even a success response cannot overwrite the current credentials.
- Decision — capture the auth generation when the request starts; match it against the current generation/user before committing.
- Catch — offline writes must be owner-scoped too; replaying A's pending operation with B's token can break the data boundary.
- Check — verify the cleanup of the private cache and pending work after logout; give a clear sign-in recovery after a failed refresh.

## Recall and practice

- Question — If a token refresh is pending and the user logs out, how do you handle the later refresh success?
- Answer — Compare the captured auth generation; if the session is obsolete, ignore the response and do not restore the credentials/cache.
- Try it yourself — Test an offline queue plus an auth flow; verify safe recovery for missing state after a reinstall, a refresh/logout race, a user switch and a failed migration.

## Practice questions

### Easy · The phone cannot reach the `localhost` API

<details>
<summary>Answer</summary>

- Why — on the device `localhost` is the phone itself, not the laptop.
- Physical device — the laptop's LAN IP (`http://192.168.x.x:3000`) on the same Wi-Fi, or a tunnel.
- Android emulator — `10.0.2.2` is the host machine; the iOS simulator shares `localhost`.
- Note — for HTTP (non-HTTPS) the platform security settings may also need to allow it.

</details>

### Easy · Where do you keep the token?

<details>
<summary>Answer</summary>

- `SecureStore` (Keychain/Keystore) — tokens and secrets.
- `AsyncStorage` — unencrypted key-value; preferences/cache.
- App bundle — keep no secret in it; the bundle can be extracted. Server-side secrets stay on the server.

</details>

### Medium · Several 401s at once → several refresh calls

The access token expired; 5 parallel requests get a 401 and refresh runs 5 times (and fails because the refresh token rotates). Write the fix.

<details>
<summary>Answer</summary>

```js
let refreshing = null;
async function getFreshToken() {
  refreshing ??= refreshToken().finally(() => { refreshing = null; });
  return refreshing;
}
async function authFetch(url, options = {}) {
  let res = await fetch(url, withToken(options, await getToken()));
  if (res.status !== 401) return res;
  const token = await getFreshToken();
  return fetch(url, withToken(options, token));
}
```

- Single flight — all the 401s wait on the same refresh promise.
- One retry — if it is still a 401 after the refresh, log out; no infinite loop.
- Logout race — a refresh running during logout must not save a new token (a generation counter).

</details>

### Medium · Refetch when the app returns to the foreground

On the web, TanStack Query refetches on window focus. How do you refetch in React Native when the app returns from the background?

<details>
<summary>Answer</summary>

```js
import { AppState } from 'react-native';
import { focusManager } from '@tanstack/react-query';

AppState.addEventListener('change', (status) => {
  focusManager.setFocused(status === 'active');
});
```

- Online — connect `onlineManager.setEventListener` to NetInfo so queries pause while offline.
- Cleanup — keep the subscription in an effect at the app root and call `remove()`.

</details>

### Hard · Safe and atomic writes in SQLite

An offline notes app: a note + its tags must be saved in two tables. Avoid both SQL injection and a half-write.

<details>
<summary>Answer</summary>

```js
await db.withTransactionAsync(async () => {
  const result = await db.runAsync('INSERT INTO notes (title, body) VALUES (?, ?)', [title, body]);
  for (const tag of tags) {
    await db.runAsync('INSERT INTO note_tags (note_id, tag) VALUES (?, ?)', [result.lastInsertRowId, tag]);
  }
});
```

- Binding (`?`) — values are not concatenated into the query text; no injection.
- Transaction — if an error occurs in between, both tables roll back; no half note is left.
- Schema version — track migrations with `PRAGMA user_version`.

</details>

## Sources — further reading

- [Expo SecureStore persistence limits](https://docs.expo.dev/versions/latest/sdk/securestore/)

- [TanStack Query — cache keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

- [TanStack Query — React Native](https://tanstack.com/query/latest/docs/framework/react/react-native?from=reactQueryV3)
- [Expo — SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo — OAuth/OIDC](https://docs.expo.dev/guides/authentication/)

- [Networking](https://reactnative.dev/docs/network)
- [Mobile security](https://reactnative.dev/docs/security)

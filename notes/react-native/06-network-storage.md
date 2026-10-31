---
id: rn-network-storage
title: Networking offline storage aur auth
track: react-native
order: 6
level: Intermediate
minutes: 5
summary: Fetch — response.ok check; HTTP 4xx/5xx automatically network exception nahi.
tags: react-native, mobile, expo, network-storage
---

## Quick revision

> Revision target — Network result ko current session identity se bind karo; offline replay aur logout ke races trace karo.

### Requests

- Fetch — response.ok check; HTTP 4xx/5xx automatically network exception nahi.
- Request race — cleanup/abort aur latest-request guard; purana response current screen overwrite na kare.
- Native networking — browser CORS model native app par same nahi; HTTPS aur server auth phir bhi chahiye.
- Localhost — physical phone par phone khud; local backend ke liye reachable development host configure karo.
- Offline — connectivity hint API success guarantee nahi; timeout, retry aur stale-data UI bhi handle karo.
- Offline writes — queued operation ID aur conflict policy; reconnect par blind duplicate POST mat karo.

### Persistence aur identity

- AsyncStorage — async unencrypted key-value persistence; non-sensitive preferences/cache ke liye.
- SecureStore — small sensitive values ke liye platform-backed encrypted storage; poora offline database nahi.
- Storage recovery — read/write failure aur missing credentials handle; local store ko irreplaceable data ka only backup mat banao.
- App secrets — bundled JS/env values extract ho sakti hain; private service keys backend par rakho.
- Token expiry — one coordinated refresh flow; logout par user cache aur stored credentials clear karo.
- Schema version — persisted JSON validate/migrate; corrupt ya newer data ka safe fallback do.

### Mobile server-state integration

- QueryClient — app lifecycle ke liye stable cache instance; har render par naya client cache reset karega.
- Query key — user ID, filters aur resource identity include; different users ka server cache accidentally share na ho.
- onlineManager — NetInfo/expo-network events se reconnect awareness wire; subscription cleanup rakho.
- focusManager — AppState active/background se app focus signal; browser window events native app mein enough nahi.
- Screen refetch — screen focus aur app focus alag; stale data policy ke hisaab se refetch, har render par nahi.

### Local database aur OAuth

- SQLite — structured offline rows/queries ke liye; key-value store se different access model.
- SQL binding — untrusted values prepared parameters se bind; execAsync mein user text concatenate mat karo.
- SQLite transaction — related writes atomic; withTransactionAsync mein other async queries interleave ho sakti hain, exclusive scope ki need check karo.
- OAuth redirect — app scheme/verified link provider ke registered redirect se match; auth result/cancellation dono handle karo.
- PKCE — authorization code ko initiating client ke verifier se bind; mobile bundle mein confidential client secret mat rakho.

### Edge cases aur reasoning

- SecureStore reinstall — Android uninstall data remove karta; iOS Keychain same bundle reinstall par persist ho sakti, guaranteed recovery policy mat banao.
- Refresh/logout race — old refresh response logout ke baad credentials restore na kare; auth generation/session identity check karo.
- Offline queue ownership — pending operations user/tenant scoped; account switch par old user's writes new credentials se replay mat karo.

## Example se samjho

- Scenario — user A ka token refresh pending hai; A logout karta aur B login karta hai.
- Trace — A ka late refresh response ab obsolete session ka hai; success response bhi current credentials overwrite nahi kar sakta.
- Decision — request start par auth generation capture; commit se pehle current generation/user se match karo.
- Catch — offline writes bhi owner-scoped hon; A ki pending operation B ke token se replay karna data boundary tod sakta hai.
- Check — logout ke baad private cache aur pending work cleanup verify; failed refresh se clear sign-in recovery do.

## Recall aur practice

- Sawal — Token refresh pending ho aur user logout kare toh later refresh success kaise handle karoge?
- Jawaab — Captured auth generation compare; session obsolete ho toh response ignore, credentials/cache dobara restore mat karo.
- Khud try karo — Offline queue plus auth flow test karo; reinstall missing state, refresh/logout race, user switch aur failed migration mein safe recovery verify karo.

## Practice questions

### Easy · Phone se `localhost` API nahi milti

<details>
<summary>Answer</summary>

- Kyun — device par `localhost` phone khud hai, laptop nahi.
- Physical device — laptop ka LAN IP (`http://192.168.x.x:3000`) same Wi-Fi par, ya tunnel.
- Android emulator — `10.0.2.2` host machine hai; iOS simulator `localhost` share karta hai.
- Note — HTTP (non-HTTPS) ke liye platform security settings bhi allow karni pad sakti hain.

</details>

### Easy · Token kahan rakhoge?

<details>
<summary>Answer</summary>

- `SecureStore` (Keychain/Keystore) — tokens aur secrets.
- `AsyncStorage` — unencrypted key-value; preferences/cache.
- App bundle — koi secret mat rakho; bundle extract ho sakta hai. Server-side secrets server par hi.

</details>

### Medium · Ek saath kai 401 → kai refresh calls

Access token expire hua; 5 parallel requests 401 laati hain aur 5 baar refresh hota hai (aur refresh token rotate hokar fail hota hai). Fix likho.

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

- Single flight — saare 401 same refresh promise ka wait karte hain.
- Ek retry — refresh ke baad bhi 401 ho toh logout; infinite loop nahi.
- Logout race — logout ke dauran chal raha refresh naya token save na kare (generation counter).

</details>

### Medium · App foreground par refetch

TanStack Query web par window focus par refetch karta hai. React Native mein app background se wapas aane par refetch kaise?

<details>
<summary>Answer</summary>

```js
import { AppState } from 'react-native';
import { focusManager } from '@tanstack/react-query';

AppState.addEventListener('change', (status) => {
  focusManager.setFocused(status === 'active');
});
```

- Online — `onlineManager.setEventListener` ko NetInfo se jodo taaki offline par queries pause hon.
- Cleanup — subscription ko app root ke effect mein rakho aur `remove()` karo.

</details>

### Hard · SQLite mein safe aur atomic writes

Offline notes app: note + uske tags do tables mein save karne hain. SQL injection aur half-write dono avoid karo.

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

- Binding (`?`) — values query text mein concatenate nahi hoti; injection nahi.
- Transaction — beech mein error aaye toh dono tables rollback; half note nahi bachta.
- Schema version — `PRAGMA user_version` se migrations track karo.

</details>

## Sources — aur padhne ke liye

- [Expo SecureStore persistence limits](https://docs.expo.dev/versions/latest/sdk/securestore/)

- [TanStack Query — cache keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

- [TanStack Query — React Native](https://tanstack.com/query/latest/docs/framework/react/react-native?from=reactQueryV3)
- [Expo — SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo — OAuth/OIDC](https://docs.expo.dev/guides/authentication/)

- [Networking](https://reactnative.dev/docs/network)
- [Mobile security](https://reactnative.dev/docs/security)

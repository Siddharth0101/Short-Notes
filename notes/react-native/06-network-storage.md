---
id: rn-network-storage
title: Networking offline storage aur auth
track: react-native
order: 6
level: Intermediate
minutes: 2
summary: Fetch — response.ok check; HTTP 4xx/5xx automatically network exception nahi.
tags: react-native, mobile, expo, network-storage
---

## Quick revision

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

## Sources — aur padhne ke liye

- [TanStack Query — cache keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

- [TanStack Query — React Native](https://tanstack.com/query/latest/docs/framework/react/react-native?from=reactQueryV3)
- [Expo — SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo — OAuth/OIDC](https://docs.expo.dev/guides/authentication/)

- [Networking](https://reactnative.dev/docs/network)
- [Mobile security](https://reactnative.dev/docs/security)
- [SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

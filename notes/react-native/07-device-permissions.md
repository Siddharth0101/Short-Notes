---
id: rn-device-permissions
title: Permissions device APIs aur app lifecycle
track: react-native
order: 7
level: Intermediate
minutes: 5
summary: Permission request — feature use ke context mein reason batao; startup par sab permissions mat maango.
tags: react-native, mobile, expo, device-permissions
---

## Quick revision

### Permission flows

- Permission request — feature use ke context mein reason batao; startup par sab permissions mat maango.
- Native configuration — runtime prompt ke saath Android manifest/iOS usage descriptions bhi required ho sakte hain.
- Denied permission — alternative UI do; cannot-ask-again state mein settings route explain karo.
- Limited access — photos/location access partial ho sakta hai; granted ko unlimited access assume mat karo.
- Camera/location — module availability aur permission check; screen chhodne par owned capture/watch stop karo.
- Native config change — permission/plugin settings badlein toh naya native build chahiye; JS refresh enough nahi.

### Background aur notifications

- AppState — active/background transitions observe; listeners cleanup karo, resume par stale data recheck karo.
- Background work — OS app suspend/kill kar sakta hai; JS interval reliable background scheduler nahi.
- Push token — device/app registration identity; login user ke saath backend association maintain karo.
- Notification permission — delivery guaranteed nahi; denied/offline cases mein in-app source of truth rakho.
- Notification tap — payload validate karke route open; auth readiness aur cold launch handle karo.
- Device cleanup — subscriptions/timers/watchers ka owner define; blur, logout aur unmount boundaries test karo.

### Media location aur biometrics

- Foreground/background location — separate permission/capability boundaries; foreground grant se background access automatically nahi milta.
- Location accuracy — precise vs approximate result respect; higher frequency/accuracy battery cost badha sakti hai.
- Stale location — timestamp/accuracy inspect; last-known coordinate ko fresh GPS fix assume mat karo.
- Image picker cancel — canceled result check karke hi assets padho; selection cancellation normal user action hai.
- Picker URI — local asset reference; backend URL nahi, upload aur durable-copy policy separately define karo.
- Biometric availability — hardware aur enrolled credentials check; unavailable/cancel/lockout paths ka fallback do.
- Local authentication — device user verification; backend resource authorization ka substitute nahi.

### Notification delivery details

- Local vs remote notification — device schedule / server push; permission aur delivery paths alag test karo.
- Android channel — notification importance/sound ke channel settings; user ki channel preferences respect karo.
- Foreground notification — handler se display policy decide; receipt automatically visible banner guarantee nahi.
- Token rotation — registration token change par backend update; invalid registrations remove aur logout association clear karo.

### Edge cases aur reasoning

- Permission recheck — user settings mein revoke kar sakta; app resume/feature use par permission capability dobara inspect karo.
- Capture state machine — permission pending, unavailable, capturing, stopping aur error separate; repeated taps duplicate capture/start na karein.
- Notification payload trust — push data command authority nahi; resource ID validate aur current logged-in user's authorization se fetch karo.

## Recall aur practice

- Sawal — Kal granted camera permission aaj app open par automatically available assume karoge?
- Jawaab — Nahi; settings/OS policy change ho sakti. Feature entry/resume par current permission/capability check aur usable fallback do.
- Khud try karo — Camera flow test karo; denial, settings revoke, repeated start/stop, screen blur aur notification to forbidden resource par cleanup/access verify karo.

## Sources — aur padhne ke liye

- [Expo — location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo — image picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo — local authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

- [Expo permissions](https://docs.expo.dev/guides/permissions/)
- [AppState](https://reactnative.dev/docs/appstate)
- [Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Background tasks](https://docs.expo.dev/versions/latest/sdk/background-task/)

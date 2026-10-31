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

> Revision target — Permission ko changing capability samjho; denial, resume aur capture cleanup ke states define karo.

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

## Example se samjho

- Scenario — camera screen permission grant ke baad chalti hai; user Settings mein access revoke karke app par lautta hai.
- Trace — previous grant stale ho sakta hai; resume/feature entry par current permission aur device capability inspect karo.
- Decision — camera unavailable ho toh capture stop, clear explanation aur applicable settings/manual fallback do.
- Catch — repeated prompt loop user ko trap kar sakta hai; cannot-ask-again state ka separate recovery rakho.
- Check — rapid Start/Stop, screen blur, denial aur app background par duplicate sessions ya retained camera na rahe.

## Recall aur practice

- Sawal — Kal granted camera permission aaj app open par automatically available assume karoge?
- Jawaab — Nahi; settings/OS policy change ho sakti. Feature entry/resume par current permission/capability check aur usable fallback do.
- Khud try karo — Camera flow test karo; denial, settings revoke, repeated start/stop, screen blur aur notification to forbidden resource par cleanup/access verify karo.

## Practice questions

### Easy · Permission permanently denied

Camera permission ka status `denied` hai aur `canAskAgain: false`. Ab kya karoge?

<details>
<summary>Answer</summary>

- System dialog dobara nahi aayega.
- UX — explain karo kyun chahiye aur "Settings kholo" button do: `Linking.openSettings()`.
- Settings se wapas aane par (AppState `active`) permission re-check karo.

</details>

### Easy · iOS par camera kholte hi crash

<details>
<summary>Answer</summary>

- Common cause — `Info.plist` mein `NSCameraUsageDescription` missing; iOS bina usage text ke app terminate karta hai.
- Expo — `app.json` mein plugin/`ios.infoPlist` se set karo.
- Native config change — naya build chahiye; OTA update se nahi aata.

</details>

### Medium · Background/foreground handle karo

Video call screen background mein jaaye toh camera band, wapas aaye toh permissions aur data refresh. Kaise?

<details>
<summary>Answer</summary>

```jsx
useEffect(() => {
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') recheckAndResume();
    else pauseCamera();
  });
  return () => sub.remove();
}, []);
```

- States — `active`, `background`, iOS par `inactive` (control center, call).
- Cleanup — listener remove; warna har mount par duplicate handlers.

</details>

### Medium · Notification tap se screen kholna

Push notification tap karne par order detail khulni chahiye — app background mein ho ya fully killed. Kaise?

<details>
<summary>Answer</summary>

- Running app — `Notifications.addNotificationResponseReceivedListener` se tap response.
- Cold start — `Notifications.getLastNotificationResponseAsync()` app start par check karo.
- Payload trust — `data.orderId` validate karo aur server se fetch karo; payload ko authorization mat maano.
- Navigation — auth/session restore ke baad navigate karo, warna route guard redirect kar dega.

</details>

### Hard · Location feature ka permission flow

Delivery tracking ke liye location chahiye. Foreground vs background, accuracy aur stale location — design batao.

<details>
<summary>Answer</summary>

- Foreground first — sirf jab feature use ho tab maango; background permission alag, justification ke saath (stores strict hain).
- Accuracy — high accuracy battery khaati hai; user approximate de sakta hai (iOS) — app ko degrade gracefully karna chahiye.
- Stale — last known location ka timestamp check karo; purana ho toh fresh fix lo ya UI mein "approximate" dikhao.
- Lifecycle — subscription unmount/background par stop; denied par manual address option.

</details>

## Sources — aur padhne ke liye

- [Expo — location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo — image picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo — local authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

- [Expo permissions](https://docs.expo.dev/guides/permissions/)
- [AppState](https://reactnative.dev/docs/appstate)
- [Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Background tasks](https://docs.expo.dev/versions/latest/sdk/background-task/)

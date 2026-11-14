---
id: rn-device-permissions
title: Permissions, device APIs and the app lifecycle
track: react-native
order: 7
level: Intermediate
minutes: 5
summary: Permission request — give the reason in the context of using the feature; do not ask for every permission at startup.
tags: react-native, mobile, expo, device-permissions
---

## Quick revision

> Revision target — Treat a permission as a capability that can change; define the states for denial, resume and capture cleanup.

### Permission flows

- Permission request — give the reason in the context of using the feature; do not ask for every permission at startup.
- Native configuration — besides the runtime prompt, the Android manifest/iOS usage descriptions may also be required.
- Denied permission — give an alternative UI; in the cannot-ask-again state explain the route to Settings.
- Limited access — photos/location access can be partial; do not assume granted means unlimited access.
- Camera/location — check module availability and the permission; stop the capture/watch you own when leaving the screen.
- Native config change — if the permission/plugin settings change, a new native build is needed; a JS refresh is not enough.

### Background and notifications

- AppState — observe the active/background transitions; clean up listeners and recheck stale data on resume.
- Background work — the OS can suspend/kill the app; a JS interval is not a reliable background scheduler.
- Push token — the registration identity of a device/app; maintain its association with the logged-in user on the backend.
- Notification permission — delivery is not guaranteed; keep an in-app source of truth for the denied/offline cases.
- Notification tap — validate the payload and open the route; handle auth readiness and a cold launch.
- Device cleanup — define the owner of subscriptions/timers/watchers; test the blur, logout and unmount boundaries.

### Media, location and biometrics

- Foreground/background location — separate permission/capability boundaries; a foreground grant does not automatically give background access.
- Location accuracy — respect a precise vs approximate result; higher frequency/accuracy can raise the battery cost.
- Stale location — inspect the timestamp/accuracy; do not assume the last-known coordinate is a fresh GPS fix.
- Image picker cancel — read the assets only after checking the canceled result; cancelling a selection is a normal user action.
- Picker URI — a local asset reference, not a backend URL; define the upload and durable-copy policy separately.
- Biometric availability — check the hardware and enrolled credentials; give a fallback for the unavailable/cancel/lockout paths.
- Local authentication — verifies the device user; not a substitute for backend resource authorization.

### Notification delivery details

- Local vs remote notification — a device schedule / a server push; test the permission and delivery paths separately.
- Android channel — channel settings for notification importance/sound; respect the user's channel preferences.
- Foreground notification — decide the display policy in the handler; receipt does not automatically guarantee a visible banner.
- Token rotation — update the backend when the registration token changes; remove invalid registrations and clear the association on logout.

### Edge cases and reasoning

- Permission recheck — the user can revoke it in Settings; inspect the permission capability again on app resume/feature use.
- Capture state machine — keep permission pending, unavailable, capturing, stopping and error separate; repeated taps must not start a duplicate capture.
- Notification payload trust — push data is not a command authority; validate the resource ID and fetch with the currently logged-in user's authorization.

## Understand it with an example

- Scenario — the camera screen works after the permission is granted; the user revokes access in Settings and returns to the app.
- Trace — the previous grant can be stale; inspect the current permission and device capability on resume/feature entry.
- Decision — if the camera is unavailable, stop the capture and give a clear explanation and the applicable Settings/manual fallback.
- Catch — a repeated prompt loop can trap the user; keep a separate recovery for the cannot-ask-again state.
- Check — no duplicate sessions or retained camera on a rapid Start/Stop, a screen blur, a denial or the app going to the background.

## Recall and practice

- Question — Will you assume that a camera permission granted yesterday is automatically available when the app opens today?
- Answer — No; the settings/OS policy can change. Check the current permission/capability on feature entry/resume and give a usable fallback.
- Try it yourself — Test a camera flow; verify cleanup/access for a denial, a revoke in Settings, a repeated start/stop, a screen blur and a notification to a forbidden resource.

## Practice questions

### Easy · Permission permanently denied

The camera permission status is `denied` with `canAskAgain: false`. What do you do now?

<details>
<summary>Answer</summary>

- The system dialog will not appear again.
- UX — explain why it is needed and give an "Open Settings" button: `Linking.openSettings()`.
- On returning from Settings (AppState `active`) re-check the permission.

</details>

### Easy · A crash as soon as the camera opens on iOS

<details>
<summary>Answer</summary>

- Common cause — `NSCameraUsageDescription` is missing from `Info.plist`; iOS terminates the app without the usage text.
- Expo — set it through a plugin/`ios.infoPlist` in `app.json`.
- Native config change — a new build is needed; it does not arrive through an OTA update.

</details>

### Medium · Handle background/foreground

When a video call screen goes to the background the camera stops; when it returns, refresh the permissions and data. How?

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

- States — `active`, `background`, and `inactive` on iOS (control center, a call).
- Cleanup — remove the listener; otherwise there are duplicate handlers on every mount.

</details>

### Medium · Open a screen from a notification tap

Tapping a push notification should open the order detail — whether the app is in the background or fully killed. How?

<details>
<summary>Answer</summary>

- Running app — the tap response through `Notifications.addNotificationResponseReceivedListener`.
- Cold start — check `Notifications.getLastNotificationResponseAsync()` when the app starts.
- Payload trust — validate `data.orderId` and fetch from the server; do not treat the payload as authorization.
- Navigation — navigate after the auth/session restore, or the route guard will redirect.

</details>

### Hard · The permission flow of a location feature

Delivery tracking needs location. Foreground vs background, accuracy and a stale location — describe the design.

<details>
<summary>Answer</summary>

- Foreground first — ask only when the feature is used; the background permission is separate and needs justification (the stores are strict).
- Accuracy — high accuracy drains the battery; the user can grant approximate (iOS) — the app should degrade gracefully.
- Stale — check the timestamp of the last known location; if it is old, take a fresh fix or show "approximate" in the UI.
- Lifecycle — stop the subscription on unmount/background; a manual address option when denied.

</details>

## Sources — further reading

- [Expo — location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo — image picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo — local authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

- [Expo permissions](https://docs.expo.dev/guides/permissions/)
- [AppState](https://reactnative.dev/docs/appstate)
- [Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Background tasks](https://docs.expo.dev/versions/latest/sdk/background-task/)

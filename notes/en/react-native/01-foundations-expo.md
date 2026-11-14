---
id: rn-foundations-expo
title: React Native basics and the Expo workflow
track: react-native
order: 1
level: Foundation
minutes: 4
summary: React Native — build Android/iOS native UI from React components; no browser DOM is used.
tags: react-native, mobile, expo, foundations-expo
---

## Quick revision

> Revision target — Understand the separate roles of the JS bundle and the native binary; test a feature with the runtime it requires.

### Mobile foundation

- React Native — build Android/iOS native UI from React components; no browser DOM is used.
- React knowledge — props, state, Hooks and component identity are the same concepts; the UI primitives are the mobile ones.
- Native vs web — View/Text/Pressable instead of div/button; do not assume web-only packages are directly compatible.
- Platform code — Platform.select for a small difference; .ios.tsx/.android.tsx files for a bigger one.
- Metro — bundles the JavaScript modules in development; building the native binary is a separate step.

### Expo workflow

- Expo — an ecosystem of tools, SDK modules and build/update services for React Native.
- Expo Go — a starter client with fixed native libraries; you cannot add arbitrary custom native modules.
- Development build — a debug app with your own native libraries/config; a native dependency change needs a rebuild.
- Expo install — use `npx expo install package-name` for the SDK-compatible package version.
- Fast Refresh — edits show up quickly; test a full cold start and persisted-state behaviour separately.
- Device testing — check on Android and iOS; success on a simulator is not proof of physical-device behaviour.

### Native project ownership

- Prebuild — generates the android/ios projects from the Expo app config; with CNG do not make the generated files the permanent source of truth.
- Config plugin — express native settings as a repeatable config transformation; manual edits to generated files can be overwritten.
- Prebuild clean — regenerates the native folders; migrate/preserve unmanaged custom native changes first.
- Manual native project — you can maintain the Xcode/Gradle files yourself; CNG is not mandatory for using Expo services.
- Native vs JS dependency — a package with native code has to be included in the binary build; JS-only changes follow a different workflow.
- Upgrade compatibility — upgrade/test the Expo SDK, React Native and native library versions as a compatible set.

### Edge cases and reasoning

- Backend boundary — Expo app tooling does not automatically implement backend authorization/storage; define the server API and credential ownership separately.
- Native support matrix — Android/iOS/web exports and platform behaviour differ; installing a package does not prove every target is supported.
- Build reproducibility — record the lockfile, SDK, config plugins and native toolchain versions; local Metro success is not proof of a CI native build.

## Understand it with an example

- Scenario — a text change on the screen shows up through Fast Refresh, but a newly added native camera integration is unavailable.
- Trace — JS changes can load into the existing runtime; a missing native implementation is not added to the binary by a JS refresh.
- Decision — verify dependency compatibility/configuration and use a development build with the required native modules.
- Catch — do not call a capability missing from Expo Go a limitation of the whole Expo ecosystem.
- Check — verify module loading and permissions on the actual target Android/iOS build; simulator-only success is not enough evidence.

## Recall and practice

- Question — Will Fast Refresh fix a custom native module that is missing in Expo Go?
- Answer — No; the client binary does not contain the module. A development build with a compatible native dependency is needed.
- Try it yourself — Compare a JS edit and a native dependency edit in a starter app; document the reload versus rebuild requirement and the Android/iOS smoke checks.

## Practice questions

### Easy · Where can you write text?

```jsx
export default function App() {
  return <View>Hello mobile</View>;
}
```

<details>
<summary>Answer</summary>

- Result — an error: "Text strings must be rendered within a `<Text>` component".
- Rule — in React Native, raw text goes only inside `<Text>`; `<View>` is a layout box (like a web `div`, but it does not hold text).
- Fix — `<View><Text>Hello mobile</Text></View>`.

</details>

### Easy · When is Expo Go not enough?

<details>
<summary>Answer</summary>

- Expo Go — a prebuilt app with a fixed set of native modules; fast for JS-only changes and the bundled Expo SDK modules.
- Development build — when you need a custom native module, a config plugin, or native config (permission texts, a URL scheme).
- Rule — use a development build to test like production; Expo Go is a sandbox, not your app.

</details>

### Medium · Three ways to write platform-specific code

You need a shadow on iOS and elevation on Android. How do you write it?

<details>
<summary>Answer</summary>

```jsx
const styles = StyleSheet.create({
  card: Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    android: { elevation: 4 },
    default: {},
  }),
});
```

- `Platform.OS` — for small `if` checks.
- `Platform.select` — for choosing a style/value.
- File extensions — `Button.ios.tsx` / `Button.android.tsx`; the bundler picks the file by platform, for when the whole component differs.

</details>

### Medium · Why `npx expo install`?

The app crashes after `npm install react-native-reanimated`, but not with `npx expo install react-native-reanimated`. Why?

<details>
<summary>Answer</summary>

- Why — `expo install` chooses the compatible version tested with your Expo SDK; a plain `npm install` brings the latest, which can mismatch the SDK's native code.
- Native library change — a new development build is needed; a JS reload alone is not enough.
- Check — `npx expo-doctor` reports mismatched versions.

</details>

### Hard · `prebuild --clean` wiped the native changes

You edited `android/app/src/main/AndroidManifest.xml` by hand. A teammate ran `npx expo prebuild --clean` and the change vanished. Why, and what is the right way?

<details>
<summary>Answer</summary>

- Why — with Continuous Native Generation the `android/`/`ios/` folders are generated from `app.json` + config plugins; `--clean` builds them again.
- Right — keep the change in `app.json` (e.g. `android.permissions`, `ios.infoPlist`) or in a custom config plugin, so it is reproduced on every prebuild.
- Alternative — commit the native folders and maintain them manually (the bare workflow), but then do not treat prebuild as the source of truth.

</details>

## Sources — further reading

- [Expo — native generation](https://docs.expo.dev/workflow/continuous-native-generation/)
- [Expo — config plugins](https://docs.expo.dev/config-plugins/introduction/)

- [React Native introduction](https://reactnative.dev/docs/getting-started)
- [Platform-specific code](https://reactnative.dev/docs/platform-specific-code)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)

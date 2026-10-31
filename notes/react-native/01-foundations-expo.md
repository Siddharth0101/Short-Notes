---
id: rn-foundations-expo
title: React Native basics aur Expo workflow
track: react-native
order: 1
level: Foundation
minutes: 4
summary: React Native — React components se Android/iOS native UI banao; browser DOM use nahi hota.
tags: react-native, mobile, expo, foundations-expo
---

## Quick revision

> Revision target — JS bundle aur native binary ka role alag samjho; feature ko required runtime ke saath test karo.

### Mobile foundation

- React Native — React components se Android/iOS native UI banao; browser DOM use nahi hota.
- React knowledge — props, state, Hooks aur component identity same concepts; UI primitives mobile wale hain.
- Native vs web — div/button ki jagah View/Text/Pressable; web-only packages direct compatible assume mat karo.
- Platform code — small difference par Platform.select; bigger difference par .ios.tsx/.android.tsx files.
- Metro — development mein JavaScript modules bundle karta hai; native binary build alag step hai.

### Expo workflow

- Expo — React Native ke tools, SDK modules aur build/update services ka ecosystem.
- Expo Go — fixed native libraries wala starter client; arbitrary custom native modules add nahi kar sakte.
- Development build — apni native libraries/config wala debug app; native dependency change par rebuild chahiye.
- Expo install — SDK-compatible package version ke liye `npx expo install package-name` use karo.
- Fast Refresh — edits jaldi reflect; full cold start aur persisted-state behavior separately test karo.
- Device testing — Android aur iOS par check; simulator success physical-device behavior ka proof nahi.

### Native project ownership

- Prebuild — Expo app config se android/ios projects generate; CNG mein generated files ko permanent source of truth mat banao.
- Config plugin — native settings ko repeatable config transformation mein express; manual generated-file edits overwrite ho sakti hain.
- Prebuild clean — native folders regenerate karta hai; unmanaged custom native changes pehle migrate/preserve karo.
- Manual native project — Xcode/Gradle files khud maintain kar sakte ho; Expo services use karne ke liye CNG mandatory nahi.
- Native vs JS dependency — native code wali package ko binary build mein include karna padta hai; JS-only changes ka workflow alag.
- Upgrade compatibility — Expo SDK, React Native aur native library versions ko compatible set mein upgrade/test karo.

### Edge cases aur reasoning

- Backend boundary — Expo app tooling backend authorization/storage automatically implement nahi karta; server API aur credential ownership separately define karo.
- Native support matrix — Android/iOS/web exports/platform behavior differ; package install se all targets supported prove nahi.
- Build reproducibility — lockfile, SDK, config plugins aur native toolchain versions record; local Metro success CI native build proof nahi.

## Example se samjho

- Scenario — screen ka text change Fast Refresh se dikh raha hai, par newly added native camera integration unavailable hai.
- Trace — JS changes existing runtime mein load ho sakte hain; missing native implementation JS refresh se binary mein add nahi hoti.
- Decision — dependency compatibility/configuration verify karke required native modules wali development build use karo.
- Catch — Expo Go mein unavailable capability ko poore Expo ecosystem ki limitation mat bolo.
- Check — actual target Android/iOS build par module loading aur permissions verify; simulator-only success enough evidence nahi.

## Recall aur practice

- Sawal — Expo Go mein missing custom native module ko Fast Refresh fix karega?
- Jawaab — Nahi; client binary module contain nahi karti. Compatible native dependency ke saath development build chahiye.
- Khud try karo — Starter app ka JS edit aur native dependency edit compare karo; reload versus rebuild requirement aur Android/iOS smoke checks document karo.

## Practice questions

### Easy · Text kahan likh sakte ho?

```jsx
export default function App() {
  return <View>Hello mobile</View>;
}
```

<details>
<summary>Answer</summary>

- Result — error: "Text strings must be rendered within a `<Text>` component".
- Rule — React Native mein raw text sirf `<Text>` ke andar; `<View>` layout box hai (web `div` jaisa, par text nahi rakhta).
- Fix — `<View><Text>Hello mobile</Text></View>`.

</details>

### Easy · Expo Go kab kaafi nahi?

<details>
<summary>Answer</summary>

- Expo Go — fixed set of native modules ke saath prebuilt app; JS-only changes aur bundled Expo SDK modules ke liye fast.
- Development build — jab custom native module, config plugin, ya native config (permissions text, URL scheme) chahiye.
- Rule — production jaisa test karna ho toh development build; Expo Go ek sandbox hai, tumhari app nahi.

</details>

### Medium · Platform-specific code ke teen tareeke

iOS par shadow aur Android par elevation chahiye. Kaise likhoge?

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

- `Platform.OS` — chhote `if` checks ke liye.
- `Platform.select` — style/value choose karne ke liye.
- File extensions — `Button.ios.tsx` / `Button.android.tsx`; bundler platform ke hisaab se file pick karta hai, jab poora component alag ho.

</details>

### Medium · `npx expo install` kyun?

`npm install react-native-reanimated` ke baad app crash karti hai, par `npx expo install react-native-reanimated` se nahi. Kyun?

<details>
<summary>Answer</summary>

- Kyun — `expo install` tumhare Expo SDK ke saath tested compatible version choose karta hai; plain `npm install` latest le aata hai jo SDK ke native code se mismatch kar sakta hai.
- Native library change — naya development build chahiye; sirf JS reload kaafi nahi.
- Check — `npx expo-doctor` mismatched versions report karta hai.

</details>

### Hard · `prebuild --clean` ne native changes mita diye

Tumne `android/app/src/main/AndroidManifest.xml` haath se edit kiya. Teammate ne `npx expo prebuild --clean` chalaya aur change gayab. Kyun, aur sahi tareeka?

<details>
<summary>Answer</summary>

- Kyun — Continuous Native Generation mein `android/`/`ios/` folders `app.json` + config plugins se generate hote hain; `--clean` unhe dobara banata hai.
- Sahi — change ko `app.json` (e.g. `android.permissions`, `ios.infoPlist`) ya custom config plugin mein rakho, taaki har prebuild par reproduce ho.
- Alternative — native folders commit karke manually maintain karo (bare workflow), par tab prebuild ko source of truth mat maano.

</details>

## Sources — aur padhne ke liye

- [Expo — native generation](https://docs.expo.dev/workflow/continuous-native-generation/)
- [Expo — config plugins](https://docs.expo.dev/config-plugins/introduction/)

- [React Native introduction](https://reactnative.dev/docs/getting-started)
- [Platform-specific code](https://reactnative.dev/docs/platform-specific-code)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)

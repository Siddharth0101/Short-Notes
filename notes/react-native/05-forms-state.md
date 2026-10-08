---
id: rn-forms-state
title: Forms keyboard aur shared state
track: react-native
order: 5
level: Intermediate
minutes: 4
summary: TextInput — controlled value aur onChangeText se draft state update karo.
tags: react-native, mobile, expo, forms-state
---

## Quick revision

### Input

- TextInput — controlled value aur onChangeText se draft state update karo.
- Input value — numeric keyboard sirf input aid; text parse/validate karna phir bhi zaroori.
- Password field — secureTextEntry display mask karta hai; storage/network encryption automatically nahi deta.
- Switch — boolean input; value aur onValueChange use karo.
- KeyboardAvoidingView — keyboard se hidden form adjust; platform behavior aur header offset test karo.
- Form feedback — field error readable rakho; invalid submit par input preserve aur relevant field focus karo.

### State ownership

- Local draft — form/component ke paas rakho; har keystroke global store mein bhejna zaroori nahi.
- Context/reducer — shared app state aur explicit transitions; server cache ko alag freshness policy do.
- Functional setter — previous value par next state depend kare toh updater use karo.
- Submit guard — pending state + request guard; repeated tap se duplicate action roko.
- Optimistic action — temporary result dikhaye toh failure rollback/retry aur stable request identity define karo.
- State restore — disk se load complete hone tak loading gate; default value saved preference ko overwrite na kare.

### Keyboard aur input details

- Keyboard taps — keyboardShouldPersistTaps se decide karo child tap keyboard dismiss kare ya action tak jaaye.
- Keyboard dismissal — keyboardDismissMode scroll behavior control; iOS/Android support differences test karo.
- Input focus — TextInput ref ki focus/blur methods; ref update khud rerender schedule nahi karta.
- Submit behavior — multiline/newline aur submitBehavior explicitly choose; deprecated blurOnSubmit ko blindly copy mat karo.
- Autofill — autoComplete/textContentType field meaning bataye; password/OTP flow physical device par verify karo.
- Length limits — maxLength input-side cap; complete business validation phir bhi submit/server par karo.

### Edge cases aur reasoning

- Validation parsing — numeric keyboard paste/locale text prevent nahi; whitespace, decimals, sign aur range policy explicitly parse karo.
- Submit identity — disabled button visual guard hai; same-render rapid taps/ref-based in-flight check aur backend operation ID duplicate write rokein.
- Persistence write order — async draft writes out-of-order settle ho sakti; serialized writes/version contract se latest text preserve karo.

## Recall aur practice

- Sawal — Keyboard numeric ho toh server amount field ko without validation accept kar sakta hai?
- Jawaab — Nahi; pasted/manipulated input possible, keyboard input aid hai. Client/server full numeric domain validate kare.
- Khud try karo — Amount form build karo; rapid tap, failure draft retention, keyboard covering last field aur reversed autosave completions verify karo.

## Sources — aur padhne ke liye

- [React Native — ScrollView](https://reactnative.dev/docs/scrollview)

- [Text input](https://reactnative.dev/docs/handling-text-input)
- [TextInput API](https://reactnative.dev/docs/textinput)
- [Keyboard avoidance](https://reactnative.dev/docs/keyboardavoidingview)
- [State ownership](https://react.dev/learn/sharing-state-between-components)

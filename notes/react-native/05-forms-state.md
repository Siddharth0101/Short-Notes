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

> Revision target — Draft, validated value aur submission state alag rakho; keyboard aur network failure se input na khoye.

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

## Example se samjho

- Scenario — amount field mein user `12.` type karta hai; submit se pehle edit abhi incomplete hai.
- Trace — raw text draft retain karo; har keystroke par numeric conversion partial input ko distort kar sakti hai.
- Decision — accepted number format/range validate karke submit payload banao; pending state duplicate submissions ko control kare.
- Catch — numeric keyboard paste ya manipulated request ko validate nahi karta; server contract bhi enforce karo.
- Check — empty, partial decimal, negative, rejected submit aur keyboard-covered error par draft aur correction path usable rahein.

## Recall aur practice

- Sawal — Keyboard numeric ho toh server amount field ko without validation accept kar sakta hai?
- Jawaab — Nahi; pasted/manipulated input possible, keyboard input aid hai. Client/server full numeric domain validate kare.
- Khud try karo — Amount form build karo; rapid tap, failure draft retention, keyboard covering last field aur reversed autosave completions verify karo.

## Practice questions

### Easy · Numeric keyboard phir bhi string deta hai

```jsx
<TextInput keyboardType="numeric" onChangeText={setAge} value={age} />
```

`age + 1` kya dega agar user ne `5` type kiya?

<details>
<summary>Answer</summary>

- Result — `'51'`; `onChangeText` hamesha string deta hai.
- Keyboard type — sirf keyboard layout hint; paste se letters bhi aa sakte hain.
- Fix — submit par `Number(age)` + integer/range validation; state mein raw string rakhna theek hai (editing ke liye).

</details>

### Easy · Keyboard open hai, button do baar tap karna padta hai

<details>
<summary>Answer</summary>

- Kyun — `ScrollView` pehla tap keyboard dismiss karne mein use karta hai.
- Fix — `<ScrollView keyboardShouldPersistTaps="handled">`; button pehle hi tap mein press hota hai.
- Covered input — `KeyboardAvoidingView` (`behavior="padding"` iOS par) ya keyboard-aware scroll library.

</details>

### Medium · Next field par focus

Name → Email → Password form mein keyboard ka "Next" button agle field par jaaye aur last par submit kare.

<details>
<summary>Answer</summary>

```jsx
const emailRef = useRef(null);
const passwordRef = useRef(null);
<TextInput returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} submitBehavior="submit" />
<TextInput ref={emailRef} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} submitBehavior="submit" />
<TextInput ref={passwordRef} returnKeyType="done" secureTextEntry onSubmitEditing={handleSubmit} />
```

- `submitBehavior="submit"` — keyboard band kiye bina next par focus (purane versions mein `blurOnSubmit={false}`).
- Autofill — `textContentType`/`autoComplete` (`email`, `password`) set karo.

</details>

### Medium · Double tap se do orders

"Place order" par jaldi do tap se do orders ban gaye. Client aur server dono side fix?

<details>
<summary>Answer</summary>

- Client — `submitting` state; pending ke dauran button disabled + spinner; ref guard turant block ke liye.
- Server — har submit ke saath idempotency key (UUID) bhejo; same key dobara aaye toh pehla result return.
- Kyun dono — network retry/timeout client guard ko bypass kar sakta hai; server final defence hai.

</details>

### Hard · Draft persistence

Long feedback form ka draft app kill hone ke baad bhi wapas aana chahiye. Design batao.

<details>
<summary>Answer</summary>

```jsx
const KEY = 'feedbackDraft:v1';
useEffect(() => {
  AsyncStorage.getItem(KEY).then((raw) => raw && setForm(JSON.parse(raw))).catch(() => {});
}, []);
useEffect(() => {
  const id = setTimeout(() => AsyncStorage.setItem(KEY, JSON.stringify(form)), 500);
  return () => clearTimeout(id);
}, [form]);
// submit success: await AsyncStorage.removeItem(KEY)
```

- Debounce — har keystroke par disk write nahi.
- Restore race — restore complete hone tak save mat karo, warna empty form purane draft ko overwrite karega (`restored` flag).
- Sensitive — passwords/card data persist mat karo; versioned key se schema change safe.

</details>

## Sources — aur padhne ke liye

- [React Native — ScrollView](https://reactnative.dev/docs/scrollview)

- [Text input](https://reactnative.dev/docs/handling-text-input)
- [TextInput API](https://reactnative.dev/docs/textinput)
- [Keyboard avoidance](https://reactnative.dev/docs/keyboardavoidingview)
- [State ownership](https://react.dev/learn/sharing-state-between-components)

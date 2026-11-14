---
id: rn-forms-state
title: Forms, the keyboard and shared state
track: react-native
order: 5
level: Intermediate
minutes: 4
summary: TextInput — update the draft state through a controlled value and onChangeText.
tags: react-native, mobile, expo, forms-state
---

## Quick revision

> Revision target — Keep the draft, the validated value and the submission state separate; input must not be lost to the keyboard or a network failure.

### Input

- TextInput — update the draft state through a controlled value and onChangeText.
- Input value — a numeric keyboard is only an input aid; parsing/validating the text is still required.
- Password field — secureTextEntry masks the display; it does not automatically give storage/network encryption.
- Switch — a boolean input; use value and onValueChange.
- KeyboardAvoidingView — adjusts a form hidden by the keyboard; test the platform behaviour and the header offset.
- Form feedback — keep a field error readable; on an invalid submit preserve the input and focus the relevant field.

### State ownership

- Local draft — keep it with the form/component; sending every keystroke to a global store is not necessary.
- Context/reducer — shared app state and explicit transitions; give the server cache a separate freshness policy.
- Functional setter — use the updater when the next state depends on the previous value.
- Submit guard — a pending state + a request guard; stop a duplicate action from a repeated tap.
- Optimistic action — if you show a temporary result, define the failure rollback/retry and a stable request identity.
- State restore — a loading gate until the load from disk completes; a default value must not overwrite a saved preference.

### Keyboard and input details

- Keyboard taps — with keyboardShouldPersistTaps decide whether a child tap dismisses the keyboard or reaches the action.
- Keyboard dismissal — keyboardDismissMode controls the scroll behaviour; test the iOS/Android support differences.
- Input focus — the focus/blur methods of a TextInput ref; a ref update does not itself schedule a rerender.
- Submit behavior — choose multiline/newline and submitBehavior explicitly; do not blindly copy the deprecated blurOnSubmit.
- Autofill — autoComplete/textContentType tell the meaning of a field; verify the password/OTP flow on a physical device.
- Length limits — maxLength is an input-side cap; do the complete business validation on submit/the server anyway.

### Edge cases and reasoning

- Validation parsing — a numeric keyboard does not prevent pasted/locale text; parse an explicit policy for whitespace, decimals, sign and range.
- Submit identity — a disabled button is a visual guard; a same-render rapid-tap/ref-based in-flight check and a backend operation ID stop a duplicate write.
- Persistence write order — async draft writes can settle out of order; preserve the latest text with serialized writes/a version contract.

## Understand it with an example

- Scenario — the user types `12.` in the amount field; before submit the edit is still incomplete.
- Trace — retain the raw text draft; a numeric conversion on every keystroke can distort partial input.
- Decision — build the submit payload after validating the accepted number format/range; the pending state controls duplicate submissions.
- Catch — a numeric keyboard does not validate a paste or a manipulated request; enforce the server contract too.
- Check — the draft and the correction path stay usable for empty, a partial decimal, a negative, a rejected submit and an error covered by the keyboard.

## Recall and practice

- Question — If the keyboard is numeric, can the server accept the amount field without validation?
- Answer — No; pasted/manipulated input is possible, and the keyboard is an input aid. The client/server validate the full numeric domain.
- Try it yourself — Build an amount form; verify a rapid tap, draft retention on failure, the keyboard covering the last field and reversed autosave completions.

## Practice questions

### Easy · A numeric keyboard still gives a string

```jsx
<TextInput keyboardType="numeric" onChangeText={setAge} value={age} />
```

What does `age + 1` give if the user typed `5`?

<details>
<summary>Answer</summary>

- Result — `'51'`; `onChangeText` always gives a string.
- Keyboard type — only a keyboard layout hint; letters can still arrive through paste.
- Fix — `Number(age)` + integer/range validation on submit; keeping the raw string in state is fine (for editing).

</details>

### Easy · The keyboard is open and the button needs two taps

<details>
<summary>Answer</summary>

- Why — the `ScrollView` uses the first tap to dismiss the keyboard.
- Fix — `<ScrollView keyboardShouldPersistTaps="handled">`; the button is pressed on the very first tap.
- Covered input — `KeyboardAvoidingView` (`behavior="padding"` on iOS) or a keyboard-aware scroll library.

</details>

### Medium · Focus the next field

In a Name → Email → Password form, the keyboard's "Next" button should move to the next field and submit on the last one.

<details>
<summary>Answer</summary>

```jsx
const emailRef = useRef(null);
const passwordRef = useRef(null);
<TextInput returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} submitBehavior="submit" />
<TextInput ref={emailRef} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} submitBehavior="submit" />
<TextInput ref={passwordRef} returnKeyType="done" secureTextEntry onSubmitEditing={handleSubmit} />
```

- `submitBehavior="submit"` — focuses the next field without closing the keyboard (`blurOnSubmit={false}` in older versions).
- Autofill — set `textContentType`/`autoComplete` (`email`, `password`).

</details>

### Medium · Two orders from a double tap

Two quick taps on "Place order" created two orders. The fix on both the client and the server side?

<details>
<summary>Answer</summary>

- Client — a `submitting` state; the button is disabled + a spinner while pending; a ref guard to block immediately.
- Server — send an idempotency key (UUID) with every submit; if the same key arrives again, return the first result.
- Why both — a network retry/timeout can bypass the client guard; the server is the final defence.

</details>

### Hard · Draft persistence

The draft of a long feedback form should come back even after the app is killed. Describe the design.

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

- Debounce — no disk write on every keystroke.
- Restore race — do not save until the restore completes, or the empty form overwrites the old draft (a `restored` flag).
- Sensitive — do not persist passwords/card data; a versioned key keeps a schema change safe.

</details>

## Sources — further reading

- [React Native — ScrollView](https://reactnative.dev/docs/scrollview)

- [Text input](https://reactnative.dev/docs/handling-text-input)
- [TextInput API](https://reactnative.dev/docs/textinput)
- [Keyboard avoidance](https://reactnative.dev/docs/keyboardavoidingview)
- [State ownership](https://react.dev/learn/sharing-state-between-components)

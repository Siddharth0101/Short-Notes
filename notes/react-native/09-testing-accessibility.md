---
id: rn-testing-accessibility
title: Testing debugging aur mobile accessibility
track: react-native
order: 9
level: Intermediate
minutes: 4
summary: Unit test — validation/reducer jaise pure logic fast check; device integration ka replacement nahi.
tags: react-native, mobile, expo, testing-accessibility
---

## Quick revision

> Revision target — Fast logic tests aur actual device evidence ka scope alag rakho; accessibility ko full journey mein check karo.

### Tests aur debugging

- Unit test — validation/reducer jaise pure logic fast check; device integration ka replacement nahi.
- Component test — user-visible text/role aur interaction assert; implementation internals par overfit mat karo.
- Native mocks — mocked camera/storage test JS behavior; actual permissions/native wiring device par verify karo.
- E2E — login, navigation, back aur persistence journey emulator/device par run karo.
- Failure matrix — offline, expired session, denied permission, rotation aur app resume cases cover karo.
- Debugging — JS error aur native crash alag evidence; stack traces, device logs aur network status inspect karo.

### Inclusive UI

- Accessible name — icon-only action ko accessibilityLabel; role aur disabled/selected state expose karo.
- Screen readers — Android TalkBack aur iOS VoiceOver se reading order/actions manually check karo.
- Font scaling — larger system text par truncation/overlap test; critical content fixed-height box mein trap mat karo.
- Touch target — tappable area aur spacing usable rakho; tiny icon ko tiny hit-area tak restrict mat karo.
- Visual feedback — color ke saath text/state indicator bhi; success/error sirf red/green se mat batao.
- Reduced motion — user preference respect; essential meaning animation alone mein mat rakho.

### React Native Testing Library

- getBy query — abhi exactly one matching element expected; missing/multiple par fail.
- queryBy query — absence assert karne ke liye null mile; multiple matches phir bhi error.
- findBy query — async UI appear hone ka awaited query; arbitrary sleep se test slow/flaky mat banao.
- Accessible queries — role/name se user-observable contract check; testID tab jab meaningful semantic query na mile.
- Hidden elements — default accessibility queries hidden UI exclude; expected visible state ke against assertion rakho.

### Diagnostics ki layers

- Repeated-flow test — screen open/close cycles ke baad memory trend dekho; single snapshot leak prove nahi karta.
- Allocation evidence — retained allocations aur release path trace; har memory spike ko leak label mat karo.

### Edge cases aur reasoning

- Accessible focus — modal/error/navigation ke baad screen reader focus meaningful element par; visual focus alone full accessibility proof nahi.
- E2E synchronization — stable UI/state conditions await; arbitrary sleeps slow device par flaky aur fast device par wasted time.
- Upgrade testing — fresh-install happy path stored-schema upgrade test nahi; previous-version data se boot/auth/draft recovery verify karo.

## Example se samjho

- Scenario — mocked camera permission test pass hai, lekin actual build par capture feature fail hota hai.
- Trace — mock JS success/denial branch verify karta hai; native module, configuration aur OS prompt us test mein run nahi hue.
- Decision — device par real grant/deny/resume journey test karo; logs se native setup aur JS error separate identify karo.
- Catch — visual success screen reader reading order ya action naming prove nahi karti.
- Check — TalkBack/VoiceOver, large fonts, offline retry aur draft restore ke saath same user journey repeat karo.

## Recall aur practice

- Sawal — Mocked permission test pass ho toh Android/iOS usage-description wiring prove hoti hai?
- Jawaab — Nahi; mock JS branch check karta. Native configuration, actual prompt aur device denial path separately verify karo.
- Khud try karo — Login→detail→saved draft journey run karo; TalkBack/VoiceOver, large fonts, offline resume aur previous-version state migration acceptance do.

## Practice questions

### Easy · Icon-only button ko accessible banao

<details>
<summary>Answer</summary>

```jsx
<Pressable accessibilityRole="button" accessibilityLabel="Delete message" onPress={remove}>
  <TrashIcon />
</Pressable>
```

- Screen reader — "Delete message, button" bolega.
- State — toggle ho toh `accessibilityState={{ selected }}`; disabled ho toh `{ disabled: true }`.

</details>

### Easy · Font scaling band karna sahi hai?

Designer bolta hai bade system font se layout tootta hai, `allowFontScaling={false}` laga do.

<details>
<summary>Answer</summary>

- Nahi — low-vision users ke liye bada text zaroori; band karna accessibility todta hai.
- Fix — layout flexible banao (wrap, no fixed heights), aur sirf tight elements par `maxFontSizeMultiplier`.
- Test — largest accessibility text size par screens check karo.

</details>

### Medium · Component test with React Native Testing Library

Counter: "Increase" button press par "Count: 1" dikhe.

<details>
<summary>Answer</summary>

```jsx
test('increments', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.press(screen.getByRole('button', { name: 'Increase' }));
  expect(screen.getByText('Count: 1')).toBeOnTheScreen();
});
```

- Role + name query — test aur accessibility dono verify.
- Native modules — camera/storage jaise modules ko Jest mein mock karna padta hai.

</details>

### Medium · Async content aur absence

Screen load par "Loading" aata hai, phir list. Absence kaise test karoge?

<details>
<summary>Answer</summary>

- Wait — `await screen.findByText('Order #1')` (findBy async wait karta hai).
- Absence — uske baad `expect(screen.queryByText('Loading')).toBeNull()` / `not.toBeOnTheScreen()`.
- Order — pehle absence check karoge toh loading start hone se pehle hi pass ho sakta hai.

</details>

### Hard · Flaky E2E test

Detox/Maestro login test CI mein kabhi fail hota hai. Common causes aur stable design?

<details>
<summary>Answer</summary>

- Sync — fixed `sleep` ki jagah element/state ka wait; animations ya polling sync tod sakte hain.
- Data — deterministic test backend/seeded user; shared account parallel runs mein clash karta hai.
- Selectors — stable `testID` ya accessible labels, text copy par depend nahi.
- Matrix — offline, permission denied, slow network jaise cases alag tests mein; retries sirf infra flakiness ke liye, bugs chhupane ke liye nahi.

</details>

## Sources — aur padhne ke liye

- [Callstack — testing queries](https://oss.callstack.com/react-native-testing-library/docs/api/queries)
- [Callstack — profiling native internals](https://www.callstack.com/blog/profiling-react-native-internals-with-tracy-for-peak-performance)

- [Testing](https://reactnative.dev/docs/testing-overview)
- [Accessibility](https://reactnative.dev/docs/accessibility)
- [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [Debugging](https://reactnative.dev/docs/debugging)

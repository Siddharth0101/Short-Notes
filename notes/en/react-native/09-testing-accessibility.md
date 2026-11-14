---
id: rn-testing-accessibility
title: Testing, debugging and mobile accessibility
track: react-native
order: 9
level: Intermediate
minutes: 4
summary: Unit test — a fast check for pure logic such as validation or a reducer; not a replacement for device integration.
tags: react-native, mobile, expo, testing-accessibility
---

## Quick revision

> Revision target — Keep the scope of fast logic tests and of actual device evidence separate; check accessibility across the full journey.

### Tests and debugging

- Unit test — a fast check for pure logic such as validation/a reducer; not a replacement for device integration.
- Component test — assert user-visible text/role and interaction; do not overfit to implementation internals.
- Native mocks — a mocked camera/storage tests JS behaviour; verify actual permissions/native wiring on a device.
- E2E — run the login, navigation, back and persistence journey on an emulator/device.
- Failure matrix — cover offline, an expired session, a denied permission, rotation and app resume.
- Debugging — a JS error and a native crash are different evidence; inspect stack traces, device logs and the network status.

### Inclusive UI

- Accessible name — an accessibilityLabel for an icon-only action; expose the role and the disabled/selected state.
- Screen readers — check the reading order/actions manually with Android TalkBack and iOS VoiceOver.
- Font scaling — test truncation/overlap with larger system text; do not trap critical content in a fixed-height box.
- Touch target — keep the tappable area and spacing usable; do not restrict a tiny icon to a tiny hit area.
- Visual feedback — a text/state indicator along with colour; do not signal success/error with red/green alone.
- Reduced motion — respect the user's preference; do not keep essential meaning in animation alone.

### React Native Testing Library

- getBy query — exactly one matching element is expected right now; it fails on missing/multiple.
- queryBy query — returns null, for asserting absence; multiple matches are still an error.
- findBy query — an awaited query for async UI to appear; do not make a test slow/flaky with an arbitrary sleep.
- Accessible queries — check the user-observable contract by role/name; a testID only when no meaningful semantic query exists.
- Hidden elements — the default accessibility queries exclude hidden UI; write the assertion against the expected visible state.

### Layers of diagnostics

- Repeated-flow test — watch the memory trend after cycles of opening/closing a screen; a single snapshot does not prove a leak.
- Allocation evidence — trace the retained allocations and the release path; do not label every memory spike a leak.

### Edge cases and reasoning

- Accessible focus — after a modal/error/navigation, screen reader focus lands on a meaningful element; visual focus alone is not full accessibility proof.
- E2E synchronization — await stable UI/state conditions; arbitrary sleeps are flaky on a slow device and wasted time on a fast one.
- Upgrade testing — a fresh-install happy path does not test a stored-schema upgrade; verify boot/auth/draft recovery with previous-version data.

## Understand it with an example

- Scenario — a mocked camera-permission test passes, but the capture feature fails on the actual build.
- Trace — the mock verifies the JS success/denial branch; the native module, configuration and OS prompt did not run in that test.
- Decision — test the real grant/deny/resume journey on a device; use the logs to tell native setup apart from a JS error.
- Catch — visual success does not prove the screen reader's reading order or action naming.
- Check — repeat the same user journey with TalkBack/VoiceOver, large fonts, an offline retry and a draft restore.

## Recall and practice

- Question — If a mocked permission test passes, does it prove the Android/iOS usage-description wiring?
- Answer — No; the mock checks the JS branch. Verify the native configuration, the actual prompt and the device denial path separately.
- Try it yourself — Run a login→detail→saved draft journey; give acceptance for TalkBack/VoiceOver, large fonts, an offline resume and a previous-version state migration.

## Practice questions

### Easy · Make an icon-only button accessible

<details>
<summary>Answer</summary>

```jsx
<Pressable accessibilityRole="button" accessibilityLabel="Delete message" onPress={remove}>
  <TrashIcon />
</Pressable>
```

- Screen reader — it will say "Delete message, button".
- State — for a toggle, `accessibilityState={{ selected }}`; when disabled, `{ disabled: true }`.

</details>

### Easy · Is turning off font scaling right?

The designer says a large system font breaks the layout, so just add `allowFontScaling={false}`.

<details>
<summary>Answer</summary>

- No — large text is essential for low-vision users; turning it off breaks accessibility.
- Fix — make the layout flexible (wrap, no fixed heights), and use `maxFontSizeMultiplier` only on tight elements.
- Test — check the screens at the largest accessibility text size.

</details>

### Medium · Component test with React Native Testing Library

Counter: pressing the "Increase" button should show "Count: 1".

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

- Role + name query — verifies both the test and accessibility.
- Native modules — modules such as camera/storage have to be mocked in Jest.

</details>

### Medium · Async content and absence

On screen load "Loading" appears, then the list. How do you test the absence?

<details>
<summary>Answer</summary>

- Wait — `await screen.findByText('Order #1')` (findBy waits asynchronously).
- Absence — after that `expect(screen.queryByText('Loading')).toBeNull()` / `not.toBeOnTheScreen()`.
- Order — check absence first and it can pass before loading has even started.

</details>

### Hard · A flaky E2E test

A Detox/Maestro login test sometimes fails in CI. Common causes and a stable design?

<details>
<summary>Answer</summary>

- Sync — wait for an element/state instead of a fixed `sleep`; animations or polling can break the sync.
- Data — a deterministic test backend/seeded user; a shared account clashes in parallel runs.
- Selectors — a stable `testID` or accessible labels, not a dependence on text copy.
- Matrix — cases such as offline, permission denied and a slow network in separate tests; retries only for infra flakiness, not to hide bugs.

</details>

## Sources — further reading

- [Callstack — testing queries](https://oss.callstack.com/react-native-testing-library/docs/api/queries)
- [Callstack — profiling native internals](https://www.callstack.com/blog/profiling-react-native-internals-with-tracy-for-peak-performance)

- [Testing](https://reactnative.dev/docs/testing-overview)
- [Accessibility](https://reactnative.dev/docs/accessibility)
- [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [Debugging](https://reactnative.dev/docs/debugging)

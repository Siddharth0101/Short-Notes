---
id: react-testing-accessibility
title: React testing — verify user behaviour and accessibility
track: react
order: 12
level: Intermediate
minutes: 3
summary: Testing Library — write tests from the behaviour the user can see.
tags: testing, accessibility, forms, react
---

## Quick revision

> Revision target — Take confidence from visible behaviour and the keyboard journey; do not treat snapshots as proof of interaction.

- Testing Library — write tests from the behaviour the user can see.
- Query — prefer the accessible role/name; avoid implementation selectors.
- User event — realistic typing/clicks; await the async interaction.
- `findBy` — async appearance; `queryBy` — an absence check.
- Mock network — cover loading, error, retry and an out-of-order response.
- Accessibility — semantic HTML, labels, contrast and keyboard flow.
- Focus — after a modal/route/error, focus should land somewhere meaningful.
- Coverage — user journeys and failure cases matter more than a line percentage.
- `useId` — for creating accessible label/description IDs; use a data ID for list keys.
- Accessible name — the visible label and the control's name must match; give an icon-only button a label.
- Test cleanup — mounted UI, mocks and fake timers must not leak into the next test.

### Keyboard and dialogs

- Dialog focus — focus inside on open, a Tab trap in a modal, close on Escape and return focus to the trigger.
- Live region — announces status changes; alert only for an urgent update, and avoid noisy repeated announcements.

### Edge cases and reasoning

- Browser test boundary — jsdom does not prove actual layout, paint or complete browser accessibility behaviour; keep real-browser checks separately.
- Async absence — an immediate queryBy absence does not prove a future disappearance; use a suitable wait for the transition to complete.
- Test user ownership — choose a control by its label/name; if labels are duplicated, scope with a within query on the related region.

## Understand it with an example

- Scenario — the Save action opens a dialog; the user wants to cancel with the keyboard and return to the editor.
- Acceptance — verify opening the dialog from the opener, a meaningful initial focus, the Tab/Shift+Tab boundary, close on Escape and focus restoration to the opener.
- Semantic check — the dialog has an accessible name and the buttons have clear labels; a visible error must be discoverable by assistive technology.
- Catch — a DOM snapshot can show that an element exists; exercise actual focus movement and keyboard behaviour separately.
- Check — if the opener unmounts, choose a sensible fallback focus; closing must not leave a keyboard dead end.

## Recall and practice

- Question — Does a passing snapshot test prove that a modal is keyboard accessible?
- Answer — No; focus movement, the Tab boundary, Escape and restoration have to be checked through interaction.
- Try it yourself — Test a form journey; a role/name query, an invalid-submit message, a failed retry and a successful submit; verify focus/zoom manually in a browser.

## Practice questions

### Easy · Which query first?

`getByRole`, `getByLabelText`, `getByText`, `getByTestId` — what is the order of preference, and why?

<details>
<summary>Answer</summary>

- Order — role (with its accessible name) → label → text → test id as the last resort.
- Why — users and assistive tech see the page through roles/labels; if a role query fails you have found an a11y bug too.
- Example — `screen.getByRole('button', { name: /save/i })`.

</details>

### Easy · `getBy` vs `queryBy` vs `findBy`

<details>
<summary>Answer</summary>

- `getBy` — needed right now; throws if not found.
- `queryBy` — `null` if not found; for asserting absence.
- `findBy` — a Promise; waits for the element to appear asynchronously (default ~1s); `await` is required.

</details>

### Medium · Test a form submit the way a user does it

A login form: type the email and password, then Submit. `onSubmit` must be called with the right values.

<details>
<summary>Answer</summary>

```jsx
test('submits credentials', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  await user.type(screen.getByLabelText(/email/i), 'a@b.com');
  await user.type(screen.getByLabelText(/password/i), 'secret1');
  await user.click(screen.getByRole('button', { name: /log in/i }));
  expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret1' });
});
```

- `user-event` — simulates the real keyboard/click sequence (focus, input events); more realistic than `fireEvent`.
- Query by labels — the test itself proves the fields are labelled.

</details>

### Medium · Asserting that the spinner disappears

After the data loads, "Loading…" should go away and the list should show. How do you write the test?

<details>
<summary>Answer</summary>

```jsx
render(<Users />);
expect(screen.getByText(/loading/i)).toBeInTheDocument();
expect(await screen.findByRole('list')).toBeInTheDocument();
expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
```

- Network — mock `/api/users` with MSW, not a real server.
- Async absence — wait for something positive first (`findBy`), then check absence with `queryBy`; a direct absence check can pass immediately for the wrong reason.
- Alternative — `await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))`.

</details>

### Hard · Dialog focus behaviour test

The "Delete" button opens a dialog. Test that: the dialog is found by its name, focus moves inside, Esc closes it, and focus returns to the trigger.

<details>
<summary>Answer</summary>

```jsx
test('dialog manages focus', async () => {
  const user = userEvent.setup();
  render(<DeleteFlow />);
  const trigger = screen.getByRole('button', { name: /delete/i });
  await user.click(trigger);
  const dialog = screen.getByRole('dialog', { name: /delete file/i });
  expect(dialog).toContainElement(document.activeElement);
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
```

- Accessible name — the dialog gets it from the title through `aria-labelledby`; the test finds it by that.
- jsdom limit — no real layout/focus-visible styling; verify critical flows with a browser test (Playwright) too.

</details>

## Sources — further reading

- [React useId](https://react.dev/reference/react/useId)

- [Testing Library principles](https://testing-library.com/docs/guiding-principles/)
- [queries](https://testing-library.com/docs/queries/about/)
- [user-event](https://testing-library.com/docs/user-event/intro/)

## Code practice

- [Examples — when you want to revise the code](../../../examples/react/12-testing-accessibility.md)

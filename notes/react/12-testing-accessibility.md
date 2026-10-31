---
id: react-testing-accessibility
title: React testing — user behavior aur accessibility verify karo
track: react
order: 12
level: Intermediate
minutes: 3
summary: Testing Library — user ke visible behavior se tests likho.
tags: testing, accessibility, forms, react
---

## Quick revision

> Revision target — Visible behavior aur keyboard journey se confidence lo; snapshots ko interaction proof mat samjho.

- Testing Library — user ke visible behavior se tests likho.
- Query — accessible role/name prefer; implementation selector se bacho.
- User event — realistic typing/click; async interaction await karo.
- `findBy` — async appearance; `queryBy` — absence check.
- Mock network — loading, error, retry aur out-of-order response cover karo.
- Accessibility — semantic HTML, labels, contrast aur keyboard flow.
- Focus — modal/route/error ke baad focus meaningful jagah par rahe.
- Coverage — line percentage se zyada important user journeys aur failure cases.
- `useId` — accessible label/description IDs banane ke liye; list keys ke liye data ID use karo.
- Accessible name — visible label aur control name match; icon-only button ko label do.
- Test cleanup — mounted UI, mocks aur fake timers next test mein leak na hon.

### Keyboard aur dialogs

- Dialog focus — open par andar focus, modal mein Tab trap, Escape close aur trigger par focus return.
- Live region — status changes announce; alert sirf urgent update, noisy repeated announcements avoid.

### Edge cases aur reasoning

- Browser test boundary — jsdom actual layout, paint aur complete browser accessibility behavior prove nahi; real-browser checks separately rakho.
- Async absence — immediate queryBy absence future disappearance prove nahi; transition complete hone ka suitable wait use karo.
- Test user ownership — label/name se control choose karo; duplicate labels ho toh related region within query se scope karo.

## Example se samjho

- Scenario — Save action dialog kholta hai; user keyboard se cancel karke editor par lautna chahta hai.
- Acceptance — opener se dialog open, meaningful initial focus, Tab/Shift+Tab boundary, Escape close aur opener par focus restoration verify karo.
- Semantic check — dialog ka accessible name aur buttons ke clear labels hon; visible error assistive technology se discover ho.
- Catch — DOM snapshot element existence dikha sakta hai; actual focus movement aur keyboard behavior separately exercise karo.
- Check — opener unmount ho jaye toh sensible fallback focus choose karo; close ke baad keyboard dead end na bane.

## Recall aur practice

- Sawal — Snapshot test pass hone se modal keyboard accessibility prove hoti hai?
- Jawaab — Nahi; focus movement, Tab boundary, Escape aur restoration ko interaction se check karna hoga.
- Khud try karo — Form journey test karo; role/name query, invalid submit message, failed retry aur successful submit; browser mein focus/zoom manually verify karo.

## Practice questions

### Easy · Kaunsi query pehle?

`getByRole`, `getByLabelText`, `getByText`, `getByTestId` — preference order aur kyun?

<details>
<summary>Answer</summary>

- Order — role (accessible name ke saath) → label → text → test id last resort.
- Kyun — users aur assistive tech page ko roles/labels se dekhte hain; role query fail ho toh a11y bug bhi milta hai.
- Example — `screen.getByRole('button', { name: /save/i })`.

</details>

### Easy · `getBy` vs `queryBy` vs `findBy`

<details>
<summary>Answer</summary>

- `getBy` — turant chahiye; na mile toh throw.
- `queryBy` — na mile toh `null`; absence assert karne ke liye.
- `findBy` — Promise; element async aane tak wait (default ~1s); `await` zaroori.

</details>

### Medium · Form submit ko user ki tarah test karo

Login form: email, password type karke Submit. `onSubmit` sahi values ke saath call hona chahiye.

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

- `user-event` — real keyboard/click sequence (focus, input events) simulate karta hai; `fireEvent` se zyada realistic.
- Labels se query — test khud prove karta hai ki fields labelled hain.

</details>

### Medium · Spinner gayab hone ka assert

Data load hone ke baad "Loading…" hatna chahiye aur list dikhni chahiye. Test kaise likhoge?

<details>
<summary>Answer</summary>

```jsx
render(<Users />);
expect(screen.getByText(/loading/i)).toBeInTheDocument();
expect(await screen.findByRole('list')).toBeInTheDocument();
expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
```

- Network — MSW se `/api/users` mock karo, real server nahi.
- Async absence — pehle positive cheez ka wait karo (`findBy`), phir `queryBy` se absence; seedha absence check turant pass ho sakta hai galat reason se.
- Alternative — `await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))`.

</details>

### Hard · Dialog focus behaviour test

"Delete" button dialog kholta hai. Test karo: dialog name se milta hai, focus andar jaata hai, Esc band karta hai, focus trigger par lautta hai.

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

- Accessible name — dialog ka `aria-labelledby` title se; test usi se dhundta hai.
- jsdom limit — real layout/focus-visible styling nahi; critical flows ko browser test (Playwright) se bhi verify karo.

</details>

## Sources — aur padhne ke liye

- [React useId](https://react.dev/reference/react/useId)

- [Testing Library principles](https://testing-library.com/docs/guiding-principles/)
- [queries](https://testing-library.com/docs/queries/about/)
- [user-event](https://testing-library.com/docs/user-event/intro/)

## Code practice

- [Examples — jab code revise karna ho](../../examples/react/12-testing-accessibility.md)

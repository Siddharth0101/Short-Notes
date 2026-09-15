---
id: react-testing-accessibility
title: React testing — user behavior aur accessibility verify karo
track: react
order: 12
level: Intermediate
minutes: 33
summary: User ke accessible controls aur visible outcomes test karo; component ke internal state names par suite depend mat banao.
tags: testing, accessibility, forms, react
---

## Mental model — simple soch

Component test ek user journey ka chhota rehearsal hai. “State variable true hua?” ki jagah poochho: user ne submit kiya, ab screen par kya message aur enabled control hai? Internal implementation refactor ho sakti hai; visible contract same ho toh useful test pass rahe.

> **Core takeaway:** Label, role, interaction aur result test karo. Screenshot ya snapshot akela behavior prove nahi karta.

Is chapter se pehle state/forms, effects aur machine-coding notes padho. Testing Library runner nahi hai; runner, JSX transform aur DOM environment separately configure hote hain. Neeche example configured Vitest + jsdom + React Testing Library + user-event environment ke liye hai. Yeh dependencies is repo ke current test setup mein installed hone ka claim nahi; repo apne jsdom/Node runner se tests karta hai.

## Pehle small accessible component banao

Button ko role dene ke liye native button enough hai. Label input ke accessible name ka source hai. Status region result announce karne mein help karti hai. Yeh local form validation demo hai, persistence nahi; “ready” ka matlab backend save success nahi.

```jsx
// LessonForm.jsx
import { useState } from 'react';
export function LessonForm() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    const clean = title.trim();
    setMessage(clean ? `Ready: ${clean}` : 'Title likho');
  }
  return <form onSubmit={submit}>
    <label htmlFor="lesson-title">Lesson title</label>
    <input id="lesson-title" value={title} onChange={e => setTitle(e.target.value)} />
    <button type="submit">Check lesson</button>
    <p role="status">{message}</p>
  </form>;
}
```

```jsx
// LessonForm.test.jsx — configured Vitest/jsdom project
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonForm } from './LessonForm';

afterEach(cleanup);
test('blank title reject hota hai; valid title trim hota hai', async () => {
  const user = userEvent.setup();
  render(<LessonForm />);
  await user.click(screen.getByRole('button', { name: 'Check lesson' }));
  expect(screen.getByRole('status').textContent).toBe('Title likho');
  await user.type(screen.getByRole('textbox', { name: 'Lesson title' }), '  Closures  ');
  await user.click(screen.getByRole('button', { name: 'Check lesson' }));
  expect(screen.getByRole('status').textContent).toBe('Ready: Closures');
});
```

Test user events await karta hai. Class name, hook count ya setter invocation assert nahi ki. `getByRole` current element expect karta hai; absent hona check karne ke liye `queryByRole`; eventually appear hone wale response ke liye `findByRole`. Arbitrary timeout badhane se race ka cause solve nahi hota.

## Async UI ka behavior matrix

| Scenario | Observable result | Test control |
| --- | --- | --- |
| Request pending | Busy state aur duplicate submission policy | Promise unresolved rakho |
| Success | Confirmed data/message | Known response resolve karo |
| Validation rejection | Useful error; user input bacha rahe | Controlled API error |
| A slow, B fast search | Latest B result hi dikhe | B pehle resolve karo |
| Unmount | Owned subscription/request cleanup | Unmount ke baad resource inspect |

Network boundary fake karo, React state hooks ko fake mat karo. Real backend contract ke liye separate integration/end-to-end case rakho. Optimistic update hai toh failure par rollback ya explicit failed state check karo. Har request cancel ho hi jaayegi assume mat karo; stale result guard bhi test karo.

## DOM environment ki limit samjho

jsdom DOM behavior test karta hai, real layout engine nahi. Visible text se actual pixel overlap, CSS wrapping, focus appearance, scroll trap ya screen-reader experience prove nahi hota. Browser mein narrow width, keyboard-only journey aur zoom check karo. Automated accessibility checks helpful hain, lekin manual keyboard/screen-reader review ka replacement nahi.

Modal example mein open par meaningful focus, Tab containment, Escape close aur trigger par focus return verify karo. List update par focus kis element par bachega decide karo. Error sirf red color se communicate mat karo; text aur input association bhi chahiye.

## Practice — refactor-safe checks

Form ko custom hook mein extract karo. Test same behavior check kare aur bina internal assertions update kiye pass rahe. Phir label association todkar dekho: accessible-name query fail honi chahiye. Isse pata chalta hai test real usability contract ka hissa protect kar raha hai.

## Depth walkthrough — andar kya ho raha hai?

### Test user ke action aur visible outcome ko connect kare

Form label se input find karo, user-like typing await karo, named submit button click karo, then pending/success/error observe karo. State setter spy assert karne se refactor break ho sakta hai even when user behavior same hai. Role query accessible role/name check karti hai; complete accessibility audit prove nahi karti.

Async DOM change ke liye appropriate find/wait assertion use karo; arbitrary one-second sleep slow aur flaky hai. Mock request ko manually resolve/reject karke pending state deterministic verify kar sakte ho. Same test mein success setup aur failure assertion accidentally mix na ho.

DOM simulator layout/paint implement nahi karta jaise real browser. Keyboard focus sequence, real tab order, responsive overflow, contrast aur screen-reader flow relevant browser/manual checks maangte hain. Automated accessibility checks helpful subset hain.

**Practice:** Validation fail par field-associated error, server fail par retry, success par confirmation. Har stage par draft ka expected value assert karo. Duplicate submit se one intended operation ho; UI disable ke saath backend idempotency ka contract alag hai. Test environment ki limit test report mein clearly likho.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** getBy, queryBy aur findBy kab use karoge?

**Apply — khud try karo:** Save failure ke baad typed title preserve ho aur retry success par confirmation aaye: test plan do.

> **Hint — chhota ishara:** Network response control karo; message, input aur button state observe karo.

**Answer guide — pehle khud karo, phir compare karo:** Reject first request; error show, title same aur retry enabled assert karo. Next request resolve; confirmation assert karo. Pending state mein duplicate submissions ki chosen policy bhi verify karo.

**Exit check — aage badhne se pehle:** Ek assertion batao jo sirf implementation detail test karti hai; uska user-visible replacement do.

## Sources — aur padhne ke liye

[Testing Library principles](https://testing-library.com/docs/guiding-principles/), [queries](https://testing-library.com/docs/queries/about/) aur [user-event](https://testing-library.com/docs/user-event/intro/) padho.

## Related extension — aur samjho

- [Browser persistence aur offline behavior — save ka meaning clear karo](../javascript/19-browser-persistence.md)

# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Pehle small accessible component banao

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

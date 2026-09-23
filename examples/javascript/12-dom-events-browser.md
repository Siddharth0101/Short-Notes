# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Delegate list actions

```html
<ul id="topics">
  <li><button data-topic="closures">Read closures</button></li>
  <li><button data-topic="promises">Read promises</button></li>
</ul>
<p id="selection" role="status"></p>
```

```js
const list = document.querySelector("#topics");
const output = document.querySelector("#selection");
const controller = new AbortController();

list.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-topic]");
  if (!button || !list.contains(button)) return;
  output.textContent = `Selected ${button.dataset.topic}`;
}, { signal: controller.signal });

// Call when this view is removed:
// controller.abort();
```

## Custom events for decoupled components

```js
const cartUpdated = new CustomEvent("cart:updated", {
  detail: { itemCount: 3 },
  bubbles: true
});
document.querySelector("#cart-icon").dispatchEvent(cartUpdated);

document.addEventListener("cart:updated", event => {
  console.log(`Cart now has ${event.detail.itemCount} items`);
});
```

```html
<form id="signup" novalidate>
  <input name="email" type="email" required />
  <p id="email-error" role="alert"></p>
</form>
```

```js
const form = document.querySelector("#signup");
form.addEventListener("submit", event => {
  event.preventDefault();
  const email = form.email.value.trim();
  const error = document.querySelector("#email-error");
  if (!email.includes("@")) {
    error.textContent = "Enter a valid email";
    form.email.focus();
    return;
  }
  error.textContent = "";
  // submit via fetch here
});
```

## Research notes: Own a listener lifecycle

```js
function mountCounter(button, output) {
  const lifetime = new AbortController();
  let count = 0;
  button.addEventListener('click', () => {
    output.textContent = String(++count);
  }, { signal: lifetime.signal });
  return () => lifetime.abort();
}
```

---
id: spring-servlet-mvc
title: Servlets, JSP and Spring MVC — the runtime underneath a request
track: spring-boot
order: 12
level: Intermediate
minutes: 3
summary: Servlet — the runtime contract for handling an HTTP request and response.
tags: servlet, mvc, jsp, request-lifecycle
---

## Quick revision

> Revision target — Understand shared state in the request lifecycle and the data lifetime of a forward/redirect.

- Servlet — the runtime contract for handling an HTTP request/response.
- Concurrency — the same servlet instance can handle multiple requests.
- Request state — local variables/request scope; do not keep it in a shared instance field.
- Filter — cross-cutting behaviour around the request chain.
- DispatcherServlet — routes a Spring MVC request to its handler.
- Forward — a server-side dispatch; redirect — a new request from the client.
- JSP — server-side view rendering; escape the output.
- MVC — controller input, model data, view presentation.
- Request attribute — data within the same request dispatch; not automatically in the new request of a redirect.
- Session state — multiple tabs/requests can share it; keep mutable data concurrency-safe.
- Filter/interceptor — the servlet chain boundary / the MVC handler boundary; separate responsibilities.

### Edge cases and reasoning

- Response committed — after the headers/body are committed, a redirect/status change can fail or have no effect; keep response ownership and an early error boundary.
- Async servlet lifetime — close the completion/error/timeout paths of async request processing; thread-local/request assumptions do not propagate automatically.
- Post-redirect-get — a redirect after a successful form POST reduces resubmission on reload; business idempotency is still needed.

## Understand it with an example

- Scenario — After a successful form POST the server redirects the browser to a GET receipt URL.
- Reasoning — The browser sends a new GET request; a reload repeats the receipt GET. The original request attributes do not arrive in the new request automatically.
- Catch — Post-redirect-get reduces accidental form resubmits; handle the duplicate business effect of a network retry or a double click with server idempotency.

## Recall and practice

- Question — A forward preserves request attributes, so why does a redirect not?
- Answer — A forward is a dispatch of the same server request; a redirect makes the client send a new request. Transfer the intended data through a URL/session/flash contract.
- Try it yourself — Trace a servlet/controller flow; verify that parallel request fields are isolated, a forward attribute is visible, and the refresh behaviour of a redirect.

## Practice questions

### Easy · An instance field in a servlet

```java
public class CounterServlet extends HttpServlet {
    private int hits = 0;
    protected void doGet(HttpServletRequest req, HttpServletResponse res) { hits++; }
}
```

<details>
<summary>Answer</summary>

- Servlet — the container usually creates one instance and runs requests on many threads.
- `hits++` — a race condition; lost updates.
- Fix — request data in local variables; an `AtomicLong` or an external store for a shared counter.

</details>

### Easy · Forward vs redirect

<details>
<summary>Answer</summary>

- Forward — hands the same request to another resource inside the server; the browser URL stays the same and the request attributes are available.
- Redirect — `302/303` + `Location`; the browser sends a new request, the URL changes, and the request attributes are lost.
- After a form submit — redirect (Post-Redirect-Get).

</details>

### Medium · Filter or HandlerInterceptor?

You need to add a request-id header to every request, and an "is the account active" check on some controllers. Which goes where?

<details>
<summary>Answer</summary>

- Filter — at the servlet level, before the `DispatcherServlet`; request-id, the logging MDC, CORS, the security chain.
- Interceptor — around the Spring MVC handler; it knows the handler (the controller method/annotations), so controller-specific checks go here.
- Order — Filter → DispatcherServlet → Interceptor `preHandle` → Controller → `postHandle` → `afterCompletion`.

</details>

### Medium · The form submits again on refresh

After the order form's `POST /orders`, the confirmation page is rendered directly. When the user refreshes, there is a duplicate order. The fix?

<details>
<summary>Answer</summary>

- Post-Redirect-Get — on POST success, `303 See Other` → `/orders/42`; a refresh now repeats the GET.
- Spring MVC — `return "redirect:/orders/" + id;` and flash attributes for the message.
- Server safety — an idempotency key/unique constraint, because a double click can happen too.

</details>

### Hard · "Response already committed"

The error: `Cannot call sendError() after the response has been committed`. A CSV export endpoint failed after writing half the data. Why, and how do you handle it?

<details>
<summary>Answer</summary>

- Committed — once the buffer is flushed, the status + headers have already gone to the client; the status (500) can no longer change.
- Fix — do the validation and the failures that can be checked up front before you start writing.
- Streaming — on a failure midway, abort/close the connection or use an in-band error marker; the client should detect an incomplete file (e.g. a row count/footer).
- Logging — the actual exception in the server log, with the request id.

</details>

## Sources — further reading

- [DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Jakarta Servlet specification](https://jakarta.ee/specifications/servlet/6.1/jakarta-servlet-spec-6.1)

## Code practice

- [Examples — when you want to revise the code](../../../examples/spring-boot/12-servlet-mvc.md)

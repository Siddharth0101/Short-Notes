---
id: spring-servlet-mvc
title: Servlets, JSP aur Spring MVC — request ka underlying runtime
track: spring-boot
order: 12
level: Intermediate
minutes: 3
summary: Servlet — HTTP request/response handling ka runtime contract.
tags: servlet, mvc, jsp, request-lifecycle
---

## Quick revision

> Revision target — Request lifecycle mein shared state aur forward/redirect ka data lifetime samjho.

- Servlet — HTTP request/response handling ka runtime contract.
- Concurrency — same servlet instance multiple requests handle kar sakta hai.
- Request state — local variables/request scope; shared instance field mein mat rakho.
- Filter — request chain ke around cross-cutting behavior.
- DispatcherServlet — Spring MVC request ko handler tak route karta hai.
- Forward — server-side dispatch; redirect — client ki nayi request.
- JSP — server-side view rendering; output escape karo.
- MVC — controller input, model data, view presentation.
- Request attribute — same request dispatch mein data; redirect ki nayi request mein automatically nahi.
- Session state — multiple tabs/requests share kar sakti hain; mutable data concurrency-safe rakho.
- Filter/interceptor — servlet chain boundary / MVC handler boundary; responsibilities alag.

### Edge cases aur reasoning

- Response committed — headers/body commit ke baad redirect/status change fail/ineffective ho sakta; response ownership aur early error boundary rakho.
- Async servlet lifetime — request async processing mein completion/error/timeout paths close; thread-local/request assumptions automatically propagate nahi.
- Post-redirect-get — successful form POST ke baad redirect reload resubmission reduce karta; business idempotency phir bhi chahiye.

## Example se samjho

- Scenario — Successful form POST ke baad server browser ko GET receipt URL par redirect karta hai.
- Reasoning — Browser nayi GET request bhejta hai; reload receipt GET repeat karta hai. Original request attributes automatically nayi request mein nahi aate.
- Catch — Post-redirect-get accidental form resubmit reduce karta hai; network retry ya double click ka duplicate business effect server idempotency se handle karo.

## Recall aur practice

- Sawal — Forward request attributes preserve karta hai, redirect kyun nahi?
- Jawaab — Forward same server request dispatch; redirect client ko nayi request karata. Intended data URL/session/flash contract se transfer karo.
- Khud try karo — Servlet/controller flow trace karo; parallel request fields isolated, forward attribute visible aur redirect refresh behavior verify karo.

## Practice questions

### Easy · Servlet mein instance field

```java
public class CounterServlet extends HttpServlet {
    private int hits = 0;
    protected void doGet(HttpServletRequest req, HttpServletResponse res) { hits++; }
}
```

<details>
<summary>Answer</summary>

- Servlet — container usually ek instance banata hai aur kai threads se requests chalata hai.
- `hits++` — race condition; lost updates.
- Fix — request data local variables mein; shared counter ke liye `AtomicLong` ya external store.

</details>

### Easy · Forward vs redirect

<details>
<summary>Answer</summary>

- Forward — server ke andar doosre resource ko same request de deta hai; browser URL same, request attributes available.
- Redirect — `302/303` + `Location`; browser nayi request bhejta hai, URL badalta hai, request attributes lost.
- Form submit ke baad — redirect (Post-Redirect-Get).

</details>

### Medium · Filter ya HandlerInterceptor?

Har request ke liye request-id header add karna hai, aur kuch controllers par "account active hai" check. Kaun kahan?

<details>
<summary>Answer</summary>

- Filter — servlet level, `DispatcherServlet` se pehle; request-id, logging MDC, CORS, security chain.
- Interceptor — Spring MVC handler ke aas-paas; handler (controller method/annotations) jaanta hai, isliye controller-specific checks.
- Order — Filter → DispatcherServlet → Interceptor `preHandle` → Controller → `postHandle` → `afterCompletion`.

</details>

### Medium · Refresh par form dobara submit

Order form `POST /orders` ke baad seedha confirmation page render hota hai. User refresh karta hai toh duplicate order. Fix?

<details>
<summary>Answer</summary>

- Post-Redirect-Get — POST success par `303 See Other` → `/orders/42`; refresh ab GET dohrata hai.
- Spring MVC — `return "redirect:/orders/" + id;` aur message ke liye flash attributes.
- Server safety — idempotency key/unique constraint, kyunki double click bhi ho sakta hai.

</details>

### Hard · "Response already committed"

Error: `Cannot call sendError() after the response has been committed`. CSV export endpoint aadha data likhne ke baad fail hua. Kyun aur kaise handle?

<details>
<summary>Answer</summary>

- Committed — buffer flush hote hi status + headers client ko ja chuke; ab status (500) badal nahi sakta.
- Fix — validation aur failures jo pehle check ho sakte hain, likhna shuru karne se pehle karo.
- Streaming — beech mein failure par connection abort/close karo ya in-band error marker; client ko incomplete file detect karni chahiye (e.g. row count/footer).
- Logging — server log mein actual exception, request id ke saath.

</details>

## Sources — aur padhne ke liye

- [DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Jakarta Servlet specification](https://jakarta.ee/specifications/servlet/6.1/jakarta-servlet-spec-6.1)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/12-servlet-mvc.md)

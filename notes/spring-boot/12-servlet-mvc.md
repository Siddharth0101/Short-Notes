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

## Recall aur practice

- Sawal — Forward request attributes preserve karta hai, redirect kyun nahi?
- Jawaab — Forward same server request dispatch; redirect client ko nayi request karata. Intended data URL/session/flash contract se transfer karo.
- Khud try karo — Servlet/controller flow trace karo; parallel request fields isolated, forward attribute visible aur redirect refresh behavior verify karo.

## Sources — aur padhne ke liye

- [DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Jakarta Servlet specification](https://jakarta.ee/specifications/servlet/6.1/jakarta-servlet-spec-6.1)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/12-servlet-mvc.md)

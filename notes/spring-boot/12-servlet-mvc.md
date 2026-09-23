---
id: spring-servlet-mvc
title: Servlets, JSP aur Spring MVC — request ka underlying runtime
track: spring-boot
order: 12
level: Intermediate
minutes: 1
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

## Sources — aur padhne ke liye

- [DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Jakarta Servlet specification](https://jakarta.ee/specifications/servlet/6.1/jakarta-servlet-spec-6.1)

## Code practice

- [Examples — jab code revise karna ho](../../examples/spring-boot/12-servlet-mvc.md)

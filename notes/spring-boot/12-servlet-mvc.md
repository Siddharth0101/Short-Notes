---
id: spring-servlet-mvc
title: Servlets, JSP aur Spring MVC — request ka underlying runtime
track: spring-boot
order: 12
level: Intermediate
minutes: 29
summary: Container lifecycle, request scope aur rendering boundary samjho; shared controller fields mein request-specific user data mat rakho.
tags: servlet, mvc, jsp, request-lifecycle
---

## Mental model — simple soch

Spring MVC controller larger web runtime ka part hai. Servlet container HTTP request/response objects manage karta hai; DispatcherServlet handler locate aur response processing coordinate karta hai. Yeh chapter legacy Java source ko modern Spring controller knowledge se connect karta hai. REST, beans aur Java concurrency prerequisites hain.

> **Core takeaway:** Shared object aur per-request data ki lifetime alag hai; framework use karne ke baad bhi ownership trace karo.

Yeh servlet-based MVC model hai. WebFlux ke reactive runtime ko same thread explanation se automatically describe nahi kar sakte. Examples conceptual hain; deployment ke liye matching Jakarta APIs, container aur packaging chahiye.

## Lifecycle aur concurrent requests

Container initialize karta hai, requests service hoti hain aur shutdown par destroy lifecycle aati hai. Common deployment mein same servlet instance concurrent requests handle kar sakta hai. Request parameters/local identity ko local rakho. `currentUser` instance field A request set kare, B overwrite kare, phir A resume ho toh wrong user data leak ho sakta hai.

Spring singleton controller mein mutable request-specific field same risk deti hai. Session scope bhi one-thread-at-a-time guarantee nahi: same user ke multiple tabs concurrent requests bhej sakte hain. Session mutation ka invariant separately protect karo.

```text
GET /lessons?topic=java
  -> container request/response
  -> configured filters (security, correlation, ...)
  -> DispatcherServlet
  -> handler mapping + adapter
  -> controller -> service -> repository
  -> body conversion OR model + view rendering
  -> filters unwind -> response completes
```

Security filter reject kare toh controller reach nahi hota. Configured exception resolver/advice handler failure map kar sakta hai. Streaming ke baad response committed ho toh normal status/headers replace nahi kar sakte; late errors ka protocol alag chahiye.

## Forward, redirect aur view

Forward server-side same request ko another resource tak dispatch karta hai; browser URL normally same rehti hai. Redirect browser ko new request karne bolta hai; request attributes next request mein automatically carry nahi hote. Temporary flash data, URL identifier ya persisted record choose karte waqt sensitivity/lifetime consider karo.

Post/Redirect/Get refresh par accidental form resubmission reduce karta hai, lekin retries/duplicated POST ke liye idempotency phir bhi chahiye. Status semantics matter karti hain: 303 retrieval request ka intent deta hai, 307/308 method preserve karte hain.

`@Controller` view name/model de sakti hai. `@ResponseBody` ya `@RestController` returned value ko configured message converter se response body banata hai. Same String return ka meaning annotations/configuration se decide hota hai. Untrusted arbitrary view path ko blindly accept mat karo.

## JSP ko legacy view boundary samjho

JSP servlet representation mein translate/compile hoti hai. Template mein Java scriptlets bharne se business rules, SQL aur rendering mix hote hain. Existing application modernize karte waqt service layer extract, request model prepare aur view ko presentation tak limit karo. Output escaping chosen renderer/tag library par depend karti hai; untrusted text ko safe render karo.

Old `javax.servlet` aur modern `jakarta.servlet` imports interchangeable nahi. Dependencies, filters, container aur packaging together compatible hon. Boot ki har packaging/container combination same JSP support nahi deti; selected release ki deployment guidance verify karo. Migration mein session behavior, redirects, exception responses aur browser forms ke regression cases rakho.

## Practice — two request traces

Trace 1: A shared currentUser field set karke pause; B overwrite; A response B data se banati hai. Fix authenticated request-local identity use karna hai. Entire controller synchronize karke all requests serialize karna default architecture mat banao.

Trace 2: POST receipt request attribute set karke redirect karta hai; next GET attribute absent hai. **Expected — kya hoga:** nayi request hai. Durable receipt ID se authorized lookup karo; limited display message ke liye flash mechanism consider karo. Sensitive receipt details URL mein mat daalo.

## Depth walkthrough — andar kya ho raha hai?

### Forward aur redirect browser history ko differently affect karte hain

Forward current request server ke andar another handler/view tak bhej sakta hai; browser URL necessarily change nahi hota. Redirect response client ko new request URL deta hai. New request mein old request attributes automatically transfer nahi hote.

Successful form POST ke baad redirect GET repeat refresh ko same POST resubmission se separate kar sakta hai. Yeh UX pattern duplicate network retries ko full idempotency guarantee nahi deta. Request body, session state aur persistent data ki lifetime distinct rakho.

Servlet/controller instance shared ho sakti hai; current request data fields mein rakhna leakage/race create karta hai. **Practice:** Two users simultaneously different title submit karein. Local parameter/request attributes owner identify karo. JSP output escaping aur trusted/untrusted HTML boundary deliberate ho; server-rendered view hona XSS immunity nahi.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Singleton controller aur request-local variable ki lifetimes compare karo.

**Apply — khud try karo:** Response stream start hone ke baad error aaya. Kya ordinary JSON error bhej sakte ho?

> **Hint — chhota ishara:** Headers/body pehle send ho chuke ho sakte hain.

**Answer guide — pehle khud karo, phir compare karo:** Extra JSON existing format corrupt kar sakta hai. Defined stream termination/error protocol, cancellation aur diagnostics use karo. Already committed operation aur retry safety separately handle karo.

**Exit check — aage badhne se pehle:** Forward, redirect aur body conversion ko request timeline se samjhao.

## Sources — aur padhne ke liye

[DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html) aur [Jakarta Servlet specification](https://jakarta.ee/specifications/servlet/6.1/jakarta-servlet-spec-6.1) padho.

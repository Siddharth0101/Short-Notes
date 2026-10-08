# Whole-repo revision audit

- Latest recheck — 8 October 2026; saare 118 study chapters reviewed/enhanced, 142 mapped source files aur 456 interview answers checks mein retained.
- Source audit — pehle 61 chapters mein 519 short points add kiye.
- External review — ab 20 chapters mein 94 aur points; external review ke baad 1,845 main revision bullets.
- React Native — 10 chapters mein pehle 120 points; [recheck](REACT_NATIVE_REVIEW.md) mein 78 aur add, ab 198 points aur 12 interview questions.
- Latest additions — har chapter mein at least 3 useful concept/caveat points; 362 new main revision points across all 9 tracks.
- Recall coverage — 118 chapter-specific sawal, explained jawaab aur concrete practice tasks; normal/boundary/failure acceptance checks included.
- Current total — 2,405 main revision bullets across 118 chapters; recall ke 354 bullets is concept count se separate hain.
- References — [external comparison](EXTERNAL_REVIEW.md) mein authors, official sources aur exact chapter mapping.
- Format — September additions 28 words ya kam; October concepts/recall 40-word repository limit ke andar, related topics small headings mein.
- Gaps filled — source-only HTML/CSS, SQL, regex, Node internals, AOP, Docker aur system-design case details main notes mein laaye.
- Code review — Java functional interfaces, thread states, array helpers, SQL commands aur UI edge cases ke short reminders add kiye.
- Coverage check — 1,352 distinct source-topic labels main notes mein milte hain; equivalent labels ke reviewed aliases allowed hain.
- Check limit — label presence completeness signal hai; semantic accuracy ki manual review bhi zaroori hai.

| Subject | Chapters enhanced | October concepts added | Current revision bullets |
| --- | ---: | ---: | ---: |
| JavaScript | 20 | 60 | 417 |
| React / frontend | 12 | 36 | 254 |
| Java / SQL | 19 | 57 | 386 |
| Spring Boot | 13 | 39 | 203 |
| Node / MongoDB | 9 | 27 | 169 |
| DSA | 14 | 48 | 261 |
| System design | 15 | 47 | 390 |
| Interview playbooks | 6 | 18 | 97 |
| React Native | 10 | 30 | 228 |
| Total | 118 | 362 | 2,405 |

React Native ka [4-stage syllabus](react-native/README.md) aur official chapter sources mobile additions cover karte hain.

## October pass mein depth kahan badhi

| Track | Concrete additions aur supporting chapters |
| --- | --- |
| JavaScript | [Deep clone versus JSON loss](javascript/06-js-arrays-objects.md), [optional-chain boundaries](javascript/03-js-conditionals.md), [empty Promise combinators/order](javascript/16-async-patterns.md), [cross-tab persistence races](javascript/19-browser-persistence.md) |
| React | [Queued state updates/draft retention](react/02-state-forms.md), [hydration/identity](react/03-components-rendering.md), [optimistic rollback races](react/08-query-supabase.md), [browser versus jsdom test limits](react/12-testing-accessibility.md) |
| Java / SQL | [BigDecimal equality/overflow](java/05-language-foundations.md), [copyOf/removal overloads](java/08-collections-generics.md), [unknown commit](java/13-jdbc-sql.md), [executor starvation/permit ownership](java/16-concurrency-production.md) |
| Spring Boot | [Prototype/proxy ownership](spring-boot/02-beans-di.md), [merge/bulk writes/fetch pagination](spring-boot/06-jpa-transactions.md), [commit-time tests](spring-boot/08-testing.md), [scheduler/cache crash windows](spring-boot/11-spring-background-cache.md) |
| Node / MongoDB | [UTF-8 stream boundaries](mongodb/01-node-runtime-http.md), [conditional stock writes](mongodb/03-documents-crud-modeling.md), [update-validator/query caveats](mongodb/04-mongoose-validation-relations.md), [transaction side effects](mongodb/05-indexes-aggregation-transactions.md) |
| DSA | [SCC/bridges/DSU bounds](dsa/11-graphs-and-shortest-paths.md), [LIS/edit-distance states](dsa/12-dynamic-programming.md), [weighted intervals](dsa/13-greedy-intervals.md), [Fenwick zero-index/bit-width/lazy tags](dsa/14-tries-range-bits.md) |
| System design | [Cache-fill race](system-design/02-scaling-caching.md), [idempotency payload binding](system-design/07-java-api-data.md), [replay/live handoff](system-design/12-realtime-case-study.md), [linearizability/consensus/global quota](system-design/13-consistency-limits.md) |
| React Native | [Virtual-row drafts](react-native/03-lists-images.md), [auth restoration/deep links](react-native/04-navigation-links.md), [refresh/logout race](react-native/06-network-storage.md), [OTA/storage rollback compatibility](react-native/10-build-release.md) |
| Interview playbooks | Har [subject playbook](interview/README.md) mein concrete drill, expected reasoning aur observable self-review checks; hinted work aur independent evidence distinguish kiye. |

- Reading duration — expanded revision text ke approximate minutes refresh; hands-on practice ka time separate hai.
- Stable identity — existing chapter IDs, track/order, old headings, source links aur examples retained; saved progress migration required nahi.
- Source verification — selected new API/algorithm claims official documentation se rechecked; [primary source map](RESEARCH_SOURCES.md) mein links hain.

## Missing topics ab kahan hain

- HTML — [browser essentials](javascript/11-browser-foundations.md); CSS — [layout, selectors aur sizing](react/04-composition-styling.md).
- SQL — [basics](java/13-jdbc-sql.md), [joins/windows](java/14-sql-interview-lab.md), [schema/roles](java/18-schema-migrations.md), [indexes/internals](system-design/07-java-api-data.md).
- JavaScript — [regex](javascript/10-numbers-dates-regex.md), [array helpers](javascript/07-modern-data-collections.md), [receiver/prototype](javascript/13-this-prototypes-classes.md).
- Java — [functional interfaces](java/10-streams-lambdas.md), [thread execution](java/15-concurrency.md), [generic bounds](java/08-collections-generics.md).
- Backend — [Node scheduling/streams](mongodb/01-node-runtime-http.md), [AOP](spring-boot/02-beans-di.md), [Docker](spring-boot/10-deployment-capstone.md).
- DSA — [string search](dsa/05-searching-and-binary-search.md), [graph checks](dsa/11-graphs-and-shortest-paths.md), [DP states](dsa/12-dynamic-programming.md).
- UI practice — [OTP/progress/tree/pagination](react/11-machine-coding.md), [autocomplete/feed/email](system-design/06-frontend-design-round.md).
- System design — [config UI](system-design/03-react-architecture.md), [video/assets](system-design/05-frontend-performance.md), [WebRTC/transports](system-design/15-os-network-debugging.md).

## Verification

- Format + topics + recall — `node scripts/check-revision.mjs` repo root se; missing question/answer/practice section bhi reject hoti hai.
- Full check — `npm run check --prefix playground`; curriculum, interview generators, app tests, lint aur build.
- Worked algorithms — iterative SCC aur compact Unicode edit distance examples add; tests exhaustive three-node graphs, deep path aur full-table reference se compare karte hain.
- Examples — runnable code optional hi hai; IDs, routes aur syllabus order preserve kiye.
- PDFs — 2 original slide PDFs reference material hain; har slide/lecture ka line-by-line coverage claim nahi.
- Scope — repo ke existing revision/source topics aur retained code examples; har possible interview topic ka encyclopedia nahi.
- Remaining specialization — advanced compiler design, full distributed-systems proofs, every database engine aur every vendor SDK is syllabus ka verified exhaustive scope nahi.
- Slides/course editions — supplied original PDFs reference hain; exact instructor lecture list absent ho toh every-lecture completeness certify nahi ki.

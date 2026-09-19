# Shortnotes — poora developer course Hinglish mein

Yahan concepts **simple Roman Hinglish** mein samjhaye hain. Technical terms aur code identifiers English mein hain, taaki documentation, coding aur interviews mein wahi terms pehchaan sako. Har concept ko meaning → mechanism → example → galti → practice ke order mein padho.

[Har chapter ka depth review](notes/DEPTH_REVIEW.md): 108 chapters mein detailed Hinglish walkthroughs, execution traces aur failure-case practice.

**108 chapters · 43 course stages · 142 linked source examples · 444 interview questions · 20 interactive visuals.**

Shuru karne ke liye [poora syllabus](notes/README.md) kholo. Padhai ka tareeka [study guide](notes/STUDY_GUIDE.md) mein aur difficult terms ke easy meanings [Hinglish glossary](notes/GLOSSARY_HINGLISH.md) mein milenge.

Interview ke liye [52 priority questions aur preparation plan](notes/INTERVIEW_PRIORITY_GUIDE.md) kholo.

**Machine coding practice:** [121 build rounds aur 44 top-priority questions](notes/MACHINE_CODING_PRACTICE.md) — har subject ke 11 rounds, 121 follow-ups, timeboxes, acceptance checks aur answer guides. App mein `machine-coding` search karo.

Naye additions aur remaining scope ka [repo coverage audit](notes/COVERAGE_AUDIT.md) padho.

## Kya aur kis order mein padhna hai?

| Course | Chapters | Padhai ka flow |
| --- | ---: | --- |
| JavaScript | 20 | Variables → types/operators → decisions/loops → functions → arrays/objects → scope → browser → OOP → async/tooling → testing → storage/Git |
| React | 12 | JSX/props → state → rendering/identity → composition → effects → routing/shared state → server data/types → performance/practice → behavior testing |
| Java | 19 | First program → control flow → classes → packages/interfaces → collections/JVM → builds/tests → SQL → concurrency → type metadata/schema migrations → LLD |
| Spring Boot | 13 | First app → beans/DI → configuration → REST/validation → JPA/security → testing → observability → deployment → jobs/cache → Servlet/MVC → optional AI/RAG |
| Node & MongoDB | 9 | Node/HTTP → Express → documents/CRUD → Mongoose → indexes/query plans → security → production → testing/shutdown |
| DSA | 14 | Complexity → lists/stacks/queues → hashing → search/patterns → recursion/sorting → monotonic stacks → trees/heaps → graphs/DP → greedy/advanced structures |
| System design | 15 | Requirements/scaling → React frontend → Java backend → complete case studies → consistency/limiting → API contracts → OS/network debugging |
| Interview playbooks | 6 | Related course ke baad language, application, algorithm aur design rounds |

Frontend ke liye JavaScript → React → frontend design follow karo. Backend ke liye Java → Spring Boot → backend design, ya JavaScript → Node/MongoDB route lo. DSA ko apne main track ke saath padh sakte ho. Syllabus mein har stage ke prerequisites aur checkpoint diye hain; beginner ho toh unhe skip mat karo.

## Har chapter se kaise seekhna hai?

1. Mental model padho: concept kya hai, kyun chahiye aur andar kaise chalta hai?
2. Code chalane se pehle output predict karo. Har important step par state likho.
3. Relevant visual mein next/previous controls se mechanism dekho, phir apne words mein samjhao.
4. Revision lab ka **Recall** aur **Apply** khud attempt karo. Atko toh hint lo; uske baad answer guide compare karo.
5. Ek normal case aur ek failure/boundary case check karo. Tab chapter complete mark karo.
6. Interview answer pehle bolkar do; reveal karke reasoning aur tradeoff compare karo.

Har chapter mein core takeaway aur topic-specific lab hai. Exercises output tracing se shuru hokar implementation, concurrency, recovery aur design defense tak jaati hain. Six technical course capstones mein failure scenarios/acceptance criteria aur six interview playbooks mein assessed mock rounds hain.

## App chalao

Node.js 22.12+ ya compatible newer supported release chahiye.

```bash
cd playground
npm ci
npm run dev
```

Vite terminal mein jo local URL de, browser mein kholo. Validation aur production preview ke liye:

```bash
npm run check
npm run preview
```

App mein search, numbered syllabus, learning paths, chapter ke previous/next links, bookmarks aur progress milti hai. Source examples related chapter ke andar expand hote hain; kuch examples ke apne interactive playground hain. Search chapter text, source titles/paths aur interview questions mein bhi dhundta hai.

Progress isi browser ke local storage mein rehti hai. **Bookmarks** se JSON export karke backup rakho; doosre device par import karke merge kar sakte ho. Account ya automatic server sync nahi hai. Site data clear karne se local progress delete ho jaati hai. Purane source links owning chapter par redirect hote hain; source bookmarks migrate hote hain. Sirf source complete karne se poora chapter complete mark nahi hota.

## Interview practice aur visuals

[Answered workbook](notes/INTERVIEW_WORKBOOK.md) offline revision ke liye hai. App mein subject, topic aur difficulty filters, related reading, hidden answers aur follow-ups hain. Five-question mock session mein 15-minute pausable timer, talking-point drafts aur self-review milta hai. Session chhodne par temporary mock drafts clear ho jaate hain.

Supplied checklist se 104 questions add hue aur 13 existing answers examples ke saath expand hue. Repeated topics same canonical question se linked hain. Workbook mein corrected premises aur supplied flexbox images ke original code solutions bhi hain. Practice scenarios kisi specific company mein poochhe jaane ka claim nahi karte.

20 visuals mein event loop, closures, React render/commit, Context, keys, Java references, synchronization, GC, request flow, caching, outbox, binary search, sorting, BFS, recursion, DP, Mongo indexes/aggregation, transaction race aur monotonic stack cover hote hain. Step controls, playback, reset aur speed se apni pace par dekho. Simplified model ki limits takeaway mein padho.

## Repo ka map

```text
notes/                     Ordered Hinglish course chapters
  README.md                Poora clickable syllabus
  STUDY_GUIDE.md            Session plan, rubric aur mistake log
  GLOSSARY_HINGLISH.md      Terms ke easy meanings aur examples
  COURSE_COVERAGE.md        Topic mapping aur coverage ki limits
  INTERVIEW_WORKBOOK.md     Questions, answers aur follow-ups
01_JavaScript/             Original source examples aur slides
02_Dsa/                    DSA source examples
03_Frontend/               HTML/CSS aur React references
04_Backend/                Node, SQL, MongoDB, Java aur slides
05_Interview/              Existing playgrounds aur references
06_System_Design/          System-design references
playground/                React + Vite app aur tests
scripts/                   Syllabus/workbook generators
```

Numbered folders ke original source files aur PDF slides reference material hain; PDF pages ko Hinglish mein rewrite nahi kiya gaya. Structured Hinglish learning material `notes/` aur app ke course/interview sections mein padho.

## References aur coverage

[Primary source map](notes/RESEARCH_SOURCES.md) mein 30 sources aur 34 chapters ki research mapping hai, reviewed 13 September 2026. Sources mein MDN, React, TypeScript, Java, Spring, PostgreSQL, Node, MongoDB aur doosri primary documentation hai. Exact links chapters mein diye hain.

Course routes Jonas Schmedtmann ke JavaScript/React/Node-MongoDB, Telusko ke Java aur Colt Steele ke DSA topics ke original companions hain. Instructor names reference context hain; affiliation ka claim nahi. Exact enrolled editions aur complete lecture lists available nahi the, isliye broad topic coverage ko verified every-lecture reproduction mat samjho. [Coverage guide](notes/COURSE_COVERAGE.md) mein mapping aur lecture audit ki limits hain.

App architecture ke liye [app guide](playground/README.md), aur content add karne ke liye [contribution guide](CONTRIBUTING.md) padho.

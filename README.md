# Shortnotes

A personal developer notebook with **Hinglish explanations and English technical terms**, worked examples, interview practice, and interactive visualizations.

Start with the [structured reading index](notes/README.md), or run the app for search, bookmarks, learning paths, and progress tracking. The existing source notes and PDFs remain in their original locations.

## Learn, practice, and review

Every one of the **85 chapters** now includes a concise core takeaway and an original **Revision and practice lab**: recall, a topic-specific challenge, a hint, an answer guide, and an exit check. The 85 new labs complement the existing interactive interview bank. Exercises progress from output tracing and small implementations to concurrency, failure recovery, and design defenses.

Follow the [study guide](notes/STUDY_GUIDE.md) for session plans, a self-review rubric, a mistake-log worksheet, and stage deliverables. In the app, use the chapter table of contents to jump to **Revision and practice lab**. On GitHub, the same material is readable directly in each Markdown chapter.

## Run the app

Requires Node.js 22.12+ (or a newer supported release).

```bash
cd playground
npm ci
npm run dev
```

Open the local URL printed by Vite. For validation and a production preview:

```bash
npm run check
npm run preview
```

## Follow the course order

Start with the [course syllabus](notes/README.md). Both **All notes** and **Learning paths** show the same numbered stages, prerequisites and checkpoints. Lesson numbers remain fixed when searching. Each reader shows its course stage and the previous/next lesson. Numbered filenames follow that exact sequence; source examples are integrated into their related chapters.

| Course | Lessons | Learning flow |
| --- | ---: | --- |
| JavaScript | 17 | Variables → types/operators → decisions → loops → functions → arrays/objects → collections/scope → browser → OOP → async/tooling |
| React | 11 | JSX/props → state → rendering/identity → composition → effects → routing/shared state → server data/types → performance/practice |
| Java & Spring | 19 | First program/variables → control flow → methods/arrays → classes → core Java → builds/tests → SQL → Spring/JPA/security → concurrency/operations |
| Node & MongoDB | 8 | Node/HTTP → Express → documents/CRUD → Mongoose → indexes/query plans → security → production |
| DSA | 12 | Complexity → lists/stacks/queues → hashing → patterns/search → recursion/sorting → monotonic stacks → trees/heaps → graphs/DP |
| System design | 12 | Requirements/scaling → React frontend → Java backend → integrated case studies |
| Interview playbooks | 6 | Language rounds → application rounds → algorithms and design, after the corresponding course |

**85 study chapters, 142 integrated source examples, 274 interactive interview questions, and 20 visualizations.** Counts in the app are calculated from its content rather than maintained manually.

New practical chapters add HTML/CSS, bounded async concurrency, React machine coding, TypeScript contracts, Java resource limits, SQL joins/windows, MongoDB query plans, monotonic stacks, and complete frontend/backend design rounds.

The interview section includes subject/difficulty filters, linked reading, hidden answers and follow-ups, plus a five-question mock session with a pausable 15-minute timer, written talking points, self-assessment, and an end-of-session review. Mock drafts are temporary and clear when leaving the session.

The visual lab also includes React key identity, a last-seat transaction race, and a monotonic-stack trace. The visual lab covers the event loop, closures, React render/commit, React context propagation, Java object references, thread synchronization, mark-and-sweep garbage collection, Spring request flow, cache invalidation, the transactional outbox, binary search, bubble sort, BFS, the recursion call stack, dynamic programming, index lookup, and the aggregation pipeline. Each has step controls, playback, reset, speed selection, an explanation, and a takeaway. Relevant chapters expose a **Visualize it** tab. Existing custom playgrounds are accessible inside chapter examples.

## Repository structure

```text
notes/                     New, ordered Markdown study chapters
  javascript/              JavaScript learning path
  react/                   React learning path
  java/                    Java and Spring learning path
  mongodb/                 Node, Express and MongoDB learning path
  dsa/                     Data structures and algorithms
  system-design/           React frontend and Java backend architecture
  interview/               Subject-specific interview playbooks
  README.md                Clickable chapter index
  COURSE_COVERAGE.md        Topic mapping and course-edition limits
01_JavaScript/             Preserved source notes and existing slides
02_Dsa/                    Preserved DSA examples
03_Frontend/               Preserved HTML/CSS and React material
04_Backend/                Preserved Node, SQL, MongoDB, Java and slides
05_Interview/              Existing interactive playgrounds and references
06_System_Design/          Preserved system-design references
playground/                React + Vite reading app and tests
```

Use one structured course sequence: each chapter combines explanations, code, relevant source examples, and answer-reveal interview practice. Search includes chapter text, linked source titles/paths, and interview questions. Expand source examples inside the reader, or open their interactive playground. Existing PDFs are available in the course library. Old source links redirect to their owning chapter, and source bookmarks migrate to that chapter. Source-only completion is retained without marking an entire chapter complete.

All 85 chapters include interview practice. Six technical course capstones provide failure scenarios and acceptance criteria; all six interview playbooks include an assessed mock round. The 26 new scenario questions are original practice material, with technical references where applicable, not claims about questions asked by specific companies.

## Supplied interview checklist

[Open the answered interview workbook](notes/INTERVIEW_WORKBOOK.md). The bank now includes 104 additional questions across HTML, CSS, JavaScript, React, Redux, Node, MongoDB, Java/Spring, DSA, and system design, with 13 existing answers expanded instead of duplicated. Use **Interview topic** to select a focused practice area. Output puzzles show corrected code before answer reveal; answers support formatted examples and follow-ups.

The workbook records reused questions and corrected premises, with code solutions for both supplied Drive flexbox images and additional original flexbox exercises.

## A useful study routine

1. Follow either JavaScript → React → frontend design, or Java → Spring → backend design. Study DSA alongside either track.
2. Read the mental model, trace the example, and try the exercise without looking at the answer.
3. Use the visual lab for the hidden mechanics, then explain the concept aloud.
4. Mark a chapter complete only after practicing. Use interview answers for comparison after making your own attempt.
5. Bookmark weak topics. Export progress from **Bookmarks** to keep a backup or merge it on another device.

Progress is stored in this browser's local storage. There is no account, server sync, or automatic cross-device backup. Clearing site data removes local progress; exported JSON can be imported again.

## Researched additions

[Open the curated source map](notes/RESEARCH_SOURCES.md): 30 primary sources support new explanations, worked examples and answered interview checks in 34 existing chapters across all seven courses. Reviewed 13 September 2026. Sources include MDN, React, TanStack Query, TypeScript, Oracle/Dev.java, Spring, PostgreSQL, Node, Express, MongoDB, OWASP, MIT 6.006, AWS Builders’ Library, Google SRE, Supabase and employer interview guidance. The additions appear inside the existing reader and search, with no separate course collection.

## Course references

The learning paths are original topic companions to the courses you named: Jonas Schmedtmann for JavaScript, React, and Node/MongoDB; Telusko for Java; and Colt Steele for DSA. Instructor names are reference context, not affiliation.

The exact enrolled course editions and complete lecture lists were not available. **This is broad topic coverage, not a verified every-lecture reproduction.** See [course coverage](notes/COURSE_COVERAGE.md) for the mapping and remaining lecture-audit requirements. New chapters link to primary documentation, and version-sensitive examples state their assumptions.

See [the app guide](playground/README.md) for architecture and testing, and [CONTRIBUTING.md](CONTRIBUTING.md) for adding chapters.

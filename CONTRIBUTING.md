# Adding and maintaining notes

Write clear Hinglish explanations with English technical terms. Keep headings and code identifiers in English. Prefer an original example, a reason it works, a mistake to avoid, and an exercise over a list of API names.

## Add a chapter

Create `notes/<track>/<order>-<topic>.md`. Valid tracks are `javascript`, `react`, `java`, `mongodb`, `dsa`, `system-design`, and `interview`.

```yaml
---
id: js-example-topic
title: A useful chapter title
track: javascript
order: 9
level: Intermediate
minutes: 12
summary: Ek specific concept ko example ke saath explain karo.
tags: example, runtime
visual: event-loop
---
```

Use a globally unique permanent ID, a unique positive order within its track, and `Foundation`, `Intermediate`, or `Advanced` for level. `tags` is a comma-separated line. Keep metadata on single lines; this repository uses a small frontmatter parser, not full YAML. `visual` is optional and must match `playground/src/lib/visualIds.js`.

Follow this body structure:

1. `## Mental model`: what it means and when it helps. End it with a concise `> **Core takeaway:**` that states the key mechanism or decision.
2. Concept sections: assumptions, examples, tradeoffs, and gotchas.
3. Fenced code: use `js`, `jsx`, `java`, `sql`, or `text` accurately. Label application excerpts and required dependencies.
4. `## Practice` or `## Practice and answer`: tasks that require recall and application.
5. `## Revision and practice lab`: include **Recall**, a chapter-specific **Apply** challenge, a **Hint**, an **Answer guide — compare after attempting**, and an **Exit check**. Supply an expected result, a trace, or observable acceptance criteria. State assumptions; do not reuse a generic challenge across unrelated chapters.
6. Interview questions: explain why, not just what.
7. Primary sources: link the exact documentation supporting version-sensitive claims.

Never claim a code excerpt is runnable by itself if it needs a framework, schema, component, or dependency that is not included. Avoid outdated blanket rules such as “all primitives live on the stack” or “REST APIs never need CSRF protection.”

## Add interview questions

Extend `playground/src/data/interviewQuestions.js` with a unique `id`, valid subject `track`, `level`, `question`, explanatory `answer`, challenging `followUp`, and string-array `tags`. Questions should test understanding, debugging, implementation, or tradeoffs. Keep the answer clear, using Hinglish where helpful. For practical scenarios, add a `noteId` referencing a study chapter; the app uses it for the related-reading link. The supplementary bank lives in `playground/src/data/advancedQuestions.js` and is included by the main bank.

## Add visualizations

Register the topic ID in `src/lib/visualIds.js`, add its metadata and narrative in `src/data/visuals.js`, and implement custom state rendering in `src/library/VisualLab.jsx` only when needed. Algorithm traces belong in `src/lib/traces.js`. Support pause, next/previous step, reset, and speed controls. Explain simplifications explicitly. Respect reduced-motion settings.

Test algorithm invariants and boundary cases rather than checking only one demonstration input. Never substitute an unrelated visualization for an unsupported topic.

## Preserve source material

Keep original source files under the numbered folders. Add curated chapters under `notes/` instead of replacing source references with short summaries. Correct precise errors in old notes when verified. Do not reproduce unavailable course lectures or label broad topic coverage as verified complete course coverage.

## Validate

```bash
cd playground
npm run format
npm run check
```

Update the clickable reading index in `notes/README.md` when adding or reordering chapters. Check light/dark themes, a narrow viewport, keyboard navigation, long code blocks, and direct URL reloads for UI changes.

## Keep the course order consistent

`notes/curriculum.json` defines every course stage, its prerequisite chapters, ordered lesson IDs and checkpoint. Every chapter must appear exactly once. When changing the sequence, align the chapter's numeric filename and frontmatter `order`, preserving its stable `id` so bookmarks and app links continue to work. Update relative Markdown links when moving files.

Run `node scripts/sync-curriculum.mjs` from the repository root to regenerate the main syllabus, per-course README files and coverage guide. Do not hand-edit generated syllabus documents. `npm run check` validates that generated documents, IDs, filenames and metadata agree. Course README files are navigation documents, not study chapters.

## Unified course content

Every source file discovered by `catalog.js` must have an explicit chapter owner in `playground/src/data/sourceChapters.json`. Assign by topic, including shared SQL/frontend topics across folder boundaries. The reader loads examples on expansion; do not reintroduce a separate source-note collection. Old source IDs remain aliases. Every chapter needs relevant interview practice; use an explicit `noteId` for precise placement of new questions, and include primary documentation links for externally researched concepts. New scenarios belong in `scenarioQuestions.js`; avoid unsupported company-frequency claims. Verify source mapping, old links/bookmarks, search, and inline practice with the app tests.

## Review the learning experience

Use the [study guide](notes/STUDY_GUIDE.md) as the learner-facing routine. Keep revision takeaways short and put detailed reasoning in concept sections. A lab should be solvable using the chapter and its prerequisites. Beginner exercises should not require tools or concepts introduced later without explanation.

Attempt the exercise separately from its answer guide. Check numeric examples, empty/boundary inputs, and any claimed failure outcome. Label design answers as one defensible approach when alternatives exist. Keep answers readable in both GitHub Markdown and the app; raw HTML disclosure elements are not supported by the current app Markdown renderer. Existing interview cards provide hidden answers.

## Maintain the supplied interview checklist

`playground/src/data/requestedQuestions.js` holds the original additions and targeted answer expansions keyed by existing question IDs. Reuse a canonical question when its learning objective is already covered; expand its answer when the requested example is missing. Give each addition an explicit chapter `noteId`, a topic from `interviewTopics.js`, a difficulty, an original answer, a follow-up, and a primary technical reference. Optional `promptCode` is Markdown displayed before answer reveal; label runtime assumptions and keep intended output out of the prompt.

Question answers support Markdown code fences. Use complete runnable examples when practical and label framework or multi-file excerpts. Do not present one observed timer order as a portable guarantee. Preserve stable IDs so confidence tracking continues to work.

Run `node scripts/sync-interviews.mjs` after editing the bank or checklist mappings. It regenerates `notes/INTERVIEW_WORKBOOK.md`; `npm run check` verifies it stays synchronized. Keep inaccessible image exercises explicitly pending until the actual images are available.

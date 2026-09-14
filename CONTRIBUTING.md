# Notes add aur maintain kaise karein

Explanation **simple Roman Hinglish** mein likho. Technical terms, API names aur code identifiers English mein rakho. Sirf English paragraph ke aage “samjho” lagana translation nahi hai: poori reasoning natural Hinglish mein samjhao. Original example, uske chalne ka reason, common mistake aur practice task do.

## Naya chapter

`notes/<track>/<order>-<topic>.md` banao. Valid tracks: `javascript`, `react`, `java`, `spring-boot`, `mongodb`, `dsa`, `system-design`, `interview`.

```yaml
---
id: js-example-topic
title: Ek useful chapter title
track: javascript
order: 9
level: Intermediate
minutes: 12
summary: Ek specific concept ko example ke saath explain karo.
tags: example, runtime
visual: event-loop
---
```

ID globally unique aur permanent ho. Track ke andar order positive aur unique ho. Level `Foundation`, `Intermediate` ya `Advanced` rakho; yeh machine-readable values hain. Metadata single line par rakho: parser full YAML nahi hai. `tags` comma-separated hain. Optional `visual` ko `playground/src/lib/visualIds.js` ke ID se match karna chahiye.

Chapter ka structure:

1. `## Mental model — simple soch`: kya, kyun aur kab? Ek short `> **Core takeaway:**` mein main mechanism/decision do.
2. Concept sections: assumptions, step-by-step example, tradeoff aur failure case.
3. Fenced code: sahi language (`js`, `jsx`, `java`, `sql`, `text`) aur required runtime/dependencies batao.
4. Practice: recall ke saath application karwao.
5. `## Revision and practice lab — khud karke samjho`: Recall, topic-specific Apply, Hint, attempt ke baad Answer guide aur Exit check. Expected output, trace ya observable acceptance criteria do.
6. Interview questions: answer ka “kyun” bhi samjhao.
7. Primary sources: version-sensitive claim ke supporting documentation ka exact link do.

Chapter aur prerequisites se lab solve ho sakna chahiye. Beginner exercise mein future concept bina explanation use mat karo. Same generic exercise har chapter mein repeat mat karo. Framework/schema/dependency missing ho toh excerpt ko standalone runnable mat bolo. “All primitives stack par hote hain” jaise blanket rules se bacho.

## Syllabus ka order

`notes/curriculum.json` har stage ke prerequisites, ordered lesson IDs, goal aur checkpoint define karta hai. Har chapter exactly once aaye. Sequence badle toh numeric filename aur frontmatter order align karo, stable ID preserve karo aur moved-file links update karo.

Repo root se `node scripts/sync-curriculum.mjs` chalao. Generated syllabus, per-course READMEs aur coverage guide manually edit mat karo. Course READMEs navigation hain; study chapters nahi.

## Interview bank aur workbook

Main bank `playground/src/data/interviewQuestions.js` hai. Extra scenarios `scenarioQuestions.js`, advanced questions `advancedQuestions.js`, Java/Spring additions `courseQuestions.js` aur supplied-checklist additions `requestedQuestions.js` mein hain.

Question mein unique `id`, valid `track`, `level`, `question`, deep `answer`, challenging `followUp` aur string-array `tags` do. Precise placement ke liye `noteId`, focused filter ke liye valid `topic`, researched concept ke liye primary source link do. Questions debugging, reasoning, implementation aur tradeoffs test karein.

Already covered learning objective ko canonical question se reuse karo; missing example ho toh answer expand karo. `answerAdditions` existing IDs ke targeted expansions rakhta hai. Optional `promptCode` answer reveal se pehle dikhta hai: runtime assumptions batao, intended output prompt mein leak mat karo. Code fences dono app aur GitHub mein readable honi chahiye. Ek observed timer order ko universal guarantee mat bolo. IDs preserve karo, taaki confidence tracking bachi rahe.

Bank/checklist badalne ke baad `node scripts/sync-interviews.mjs` chalao. Yeh workbook regenerate karta hai. Inaccessible source/image ko inspect kiya hua mat batao; pending status clear rakho. Employer-specific frequency ke unsupported claims mat add karo.

## Source examples aur visuals

Numbered folders mein original references rakho. Curated explanations `notes/` mein do; source ko short summary se replace mat karo. Verified precise error correct kar sakte ho. Original PDFs ki language clearly label karo. Unavailable course lectures reproduce karne ya verified every-lecture coverage ka claim mat karo.

`catalog.js` se discovered har source ka explicit owner `sourceChapters.json` mein ho. Topic ke hisaab se assign karo, folder ke hisaab se blindly nahi. Reader expansion par source load karta hai. Old IDs aliases rahenge; unrelated separate source collection mat banao. Har chapter ke saath relevant interview practice attach karo.

Visual ID `src/lib/visualIds.js` mein register karo; metadata/narrative `src/data/visuals.js` mein aur algorithm traces `src/lib/traces.js` mein rakho. Custom rendering chahiye toh `src/library/VisualLab.jsx` update karo. Previous/next, pause, reset, speed aur reduced-motion support preserve karo. Simplifications aur assumptions samjhao. Unsupported topic ke badle unrelated visual mat dikhao.

## Verify karo

```bash
cd playground
npm run format
npm run check
```

Algorithm invariants aur empty/boundary cases check karo. Exercise ko answer dekhe bina attempt karo; numeric results aur claimed failure verify karo. Design answer ko ek defensible approach bolo jab alternatives possible hain. Revision takeaway short rakho; detail concept section mein do. Raw HTML disclosure current Markdown renderer support nahi karta; hidden answers ke liye existing cards hain.

UI changes par light/dark themes, narrow viewport, keyboard, long code blocks aur direct URL reload check karo. Source mapping, old links/bookmarks, search aur inline practice tests pass hone chahiye. [Study guide](notes/STUDY_GUIDE.md) learner ki routine ka reference hai; [glossary](notes/GLOSSARY_HINGLISH.md) mein new difficult terms ke easy meanings add kar sakte ho.

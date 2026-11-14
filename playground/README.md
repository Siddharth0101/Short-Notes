# Shortnotes app — setup aur architecture

React 19, React Router aur Vite se repo ka study reader chalta hai. Markdown ke liye `react-markdown` aur GFM hain. Source-note files raw text ke roop mein load hoti hain; app code ki tarah execute nahi hoti. Existing `.jsx` visualizers React components ki tarah load hote hain.

## Local setup

Node.js 22.12+ chahiye. `playground/` ke andar commands chalao:

```bash
npm ci
npm run dev       # Terminal mein local URL milega
npm test          # Content, algorithms aur DOM interaction checks
npm run lint      # Oxlint checks
npm run build     # Production files dist/ mein
npm run check     # Generated docs, tests, lint aur build
npm run preview   # Production build locally dekho
npm run format    # App modules aur tests format karo
```

Lockfile reproducible install ke liye hai. Build parent `notes/`, `examples/` aur source directories bhi use karta hai; sirf app folder copy karna enough nahi.

## Live interviewer setup

Repository root `.env` mein `GEMINI_API_KEY` set karo; `.env.example` mein defaults hain. Key frontend ya `VITE_*` variable mein mat rakho. Code defaults `GEMINI_MODEL=gemini-3.5-flash-lite` aur `INTERVIEW_PORT=8787` hain. Current `.env` mein primary `gemini-3.8-flash` hai; `GEMINI_FALLBACK_MODELS=gemini-3.7-flash,gemini-3.5-flash-lite` quota ya temporary provider overload (502/503/504) par ordered backups use karta hai. Available backup ho toh overloaded model ko turant skip karta hai. Exhausted models cooldown mein rehte hain; same interview/memory continue hoti hai. Speech models ke limits separate hain. Automatic voice default on hai: mic permission do, interviewer ke baad bolo, live text dekho; pause par answer send hota hai. Coding mein Send & review code explicit hai. Live captions ke liye `GEMINI_LIVE_TRANSCRIPTION_MODEL=gemini-3.5-transcribe-live` use hota hai. Voice ke liye same key se `GEMINI_TRANSCRIPTION_MODEL=gemini-3.5-transcribe` aur `GEMINI_SPEECH_MODEL=gemini-3.8-flash-lite-tts` use hote hain. Recordings transcription ke liye Gemini ko jaati hain; raw audio app save nahi karta.

```sh
npm run dev:agent   # API + frontend together
npm run server      # API only
npm run test:agent  # Interview behavior tests
```

Open `http://127.0.0.1:5173/interview/live`. Microphone permission available ho toh Gemini transcription aur speech-generation tools ke saath spoken interview use karo; typed fallback bhi hai. One-hour session mein intro, theory, coding aur review rounds hain. Pause, reload recovery, hints, and final review available hain; code execution included nahi hai.

Backend Gemini Interactions API use karta hai. Local hub four specialists ko separate memories aur scoped tools ke saath coordinate karta hai. Root `.env` mein `MONGODB_URI` configured ho toh sessions aur long-term memory MongoDB mein save hoti hain; otherwise root `.interviews/` mein JSON. Root se `npm ci --prefix server` bhi chalao. Existing JSON history ko server stop karke `npm run db:migrate` se import karo; source files preserve rehti hain. `npm run db:check` synthetic data ke saath real database integration verify karta hai. [Detailed architecture and limits](../docs/INTERVIEWER_ARCHITECTURE.md) dekho. Yeh local single-user backend hai; public hosting ke liye authentication, ownership checks, aur database required honge.

## Kaunsa code kahan hai?

| File/folder | Kaam |
| --- | --- |
| `src/library/` | Navigation, dashboard, reader, interviews aur visual lab |
| `src/play/` | Arcade: hub, flashcards, rapid fire, memory match, celebration; `decks.js` cards/quiz/match banata hai |
| `src/i18n/` | UI strings: `hinglish.js`, `en.js`, `play.hinglish.js`, `play.en.js` |
| `src/lib/lang.js`, `i18n.jsx`, `langContext.js` | Language preference, translator aur provider |
| `src/lib/playState.js`, `play.jsx` | XP, levels, streak, flashcard boxes aur badges ke rules + provider |
| `src/data/localized.js`, `english.js` | English catalog overlay; `english.js` on demand load hota hai |
| `src/data/analogies.js` | Desi analogies, dono languages mein |
| `src/data/catalog.js` | Chapters discover karke source examples aur questions attach karta hai |
| `src/data/sourceChapters.json` | Har source example ka owning chapter |
| `src/data/interviewQuestions.js` | Main bank; extra question files ko bhi combine karta hai |
| `src/data/visuals.js` | Visual metadata aur explanations |
| `src/data/advancedVisuals.js` | React identity, transaction race aur monotonic stack |
| `src/data/moreVisuals.js` | Two pointers, sliding window, DFS, tree traversal, heap, hash collisions, token bucket, hoisting, prototype chain, debounce/throttle, effect lifecycle |
| `src/data/visuals.en.js` | Visuals ka English text; structure Hinglish original se aata hai |
| `src/lib/content.js` | Frontmatter, practice parsing, search, heading anchors aur progress normalization |
| `src/lib/traces.js` | Binary search, sorting, BFS aur DP ke deterministic steps |
| `src/lib/progress.jsx` | Progress provider; hook `progressContext.js` mein hai |
| `src/components/`, `src/registry/` | Existing playgrounds aur compatible old routes |
| `tests/` | Node test runner, jsdom aur Vite module runner se checks |

## Routes

| Route | Kya khulta hai? |
| --- | --- |
| `/` | Overview aur padhai continue karne ka link |
| `/library?track=react&q=effects` | Search aur subject-wise grouped chapters |
| `/library?minutes=10&sort=shortest&status=pending` | Short revision sessions; duration, sort aur progress filters |
| `/library?view=original` | Library ka compatible original-reference entry |
| `/paths` | Ordered course stages aur completion |
| `/notes/:id` | Chapter; purana source ID owning chapter par resolve hota hai |
| `/notes/:id?tab=visual` | Chapter ka linked visual |
| `/visuals?topic=binary-search` | Visual lab |
| `/play` | Arcade: scorecard, daily challenge, games, badges, activity |
| `/play/flashcards?chapter=js-scope-closures` | Flashcards; `track` ya `chapter` se deck chuno |
| `/play/quiz?track=react` | Rapid fire quiz |
| `/play/match?chapter=js-loops` | Memory match |
| `/interview?track=java` | Filtered interview practice |
| `/interview/live` | Voice or typed AI interview with subject selection |
| `/saved` | Bookmarks aur progress import/export |
| `/domain/:domainId/dir/*` | Compatible old folder route |
| `/domain/:domainId/file/*` | Existing playground; Java notes reader par jaate hain |

## Content aur state ka flow

`notes/curriculum.json` ordered stages define karta hai. `node ../scripts/sync-curriculum.mjs` main syllabus, course indexes aur coverage guide regenerate karta hai. `node ../scripts/sync-interviews.mjs` interview workbook banata hai. `--check` se pata chalta hai ki generated docs current data se match karte hain ya nahi.

Chapter IDs permanent hain: URLs, bookmarks aur progress unhe use karte hain. Title rename kar sakte ho, lekin ID badalne se old links toot sakte hain. Standard bilingual headings ke old section anchors `headingId` mein preserve kiye hain. New chapters `notes/*/*.md` se discover hote hain. Duration short revision ka approximate reading time hai.

Bookmarks, completed chapters, confident answers, clear practice questions (`practiced`, ids `chapterId#question-slug`) aur recent reads `shortnotes.progress.v1` local storage mein rehte hain. Purane saves aur backups bina `practiced` ke bhi valid hain; load par empty list add hoti hai. Import versioned JSON ko current progress se merge karta hai. Invalid import state badalne se pehle reject hota hai. Storage unavailable ho toh session memory mein app chal sakta hai; backup export karo.

Overview ka subject selector us subject ka recent unfinished chapter ya pehla pending chapter kholta hai. Saare chapters revised hon toh first chapter dobara revise kar sakte ho. Counts actual catalog/progress se aate hain. Library mein duration approximate revision time hai; sorting learning-path prerequisite order ko nahi badalti.

Reader mein reading-progress bar, chapter at-a-glance chips, glossary-style `term — meaning` rows, numbered sections aur **Bada text**, **Focus**, **Recall karo** controls hain. `## Practice questions` section `splitPractice` (`src/lib/content.js`) se parse hokar `PracticeSet.jsx` cards banta hai: level filter, hidden answer aur "clear" mark. Focus desktop sidebar/outline hide karta hai; Escape se wapas aao. Chapter ke `Recall aur practice` section ka Jawaab pehle hidden hai; reveal karke apne answer se compare karo. Interviewer messages aur optional example files ka Markdown unchanged visible rehta hai. Reading controls current chapter tak hain; completion, confidence ya progress automatically mark nahi hoti. Print mein recall answers visible rehte hain.

Mock session filtered pool se five questions leta hai. 15-minute wall-clock timer pause/resume hota hai; time khatam hone par answer discard nahi hota. Drafts aur mock self-review temporary hain, confidence toggle persistent hai.

## Language aur English content

Top bar ka Language select `shortnotes.lang` (`hinglish` ya `en`) save karta hai; default Hinglish hai. `<html lang>` bhi badalta hai aur tabs mein sync hota hai. UI text `t('key')` se aata hai; missing English key Hinglish par fallback karti hai, aur test dono dictionaries ke keys/placeholders match karwata hai.

Content mein Hinglish canonical hai. English select karne par `src/data/english.js` ek alag chunk mein load hota hai: `notes/en/<track>/*.md` (full chapters), `notes/en/curriculum.json` (stage title/goal/checkpoint), `notes/en/chapters.json` (title/summary) aur `src/data/i18n/questions.en.json` (interview answers). Jo translate nahi hua woh Hinglish mein notice ke saath dikhta hai. Translated chapter ke section anchors aur practice question IDs original se liye jaate hain, isliye links aur progress language badalne par nahi toot-te. `npm run i18n:check` structure verify karke coverage batata hai.

## Arcade ka state

Arcade ke stats `shortnotes.play.v1` mein alag rehte hain, isliye purane progress saves untouched hain. XP = chapters (50) + practice (10) + interview questions (5) + games ka earned XP; chapter un-mark karne par uska XP hat jaata hai. Streak kisi bhi din ki activity se chalti hai aur kal tak zinda rehti hai. Flashcards Leitner boxes use karte hain: sahi par agla box (1, 3, 7, 14, 30 din), galat par box 1. Card IDs `chapterId#term-slug` canonical chapter se bante hain. Daily challenge date se deterministic pick hota hai. Saved data load/import par normalize hota hai; backup import best values merge karta hai aur imported milestones ko celebrate nahi karta. Confetti `prefers-reduced-motion` mein band rehta hai.

## Visual models ko kaise samjho?

Visual lab teaching simulation hai. Browser, JVM, database ya Spring runtime actually execute nahi hota. Mongo index ka sorted-array demo analogy hai; real index implementation alag hai. Java/server snippets ko apna runtime/project setup chahiye. Algorithm ke extra snapshots teaching cost hain; unhe base algorithm ki auxiliary-space claim se alag samjho.

## Theme aur deployment

Top bar se System, Light aur Dark theme choose hoti hai. Design tokens `src/theme.css` mein, shared layout `src/design.css` mein aur reader styles `src/library/reader.css` mein hain. Preference local save hoti hai aur tabs mein sync hoti hai. System mode OS changes follow karta hai. `public/theme-init.js` React se pehle theme apply karta hai.

Root `netlify.toml` app build karke `playground/dist/` publish karta hai. Doosre hosts par SPA routes ke liye `index.html` fallback aur actual assets ke liye normal serving rakho. PDFs static assets hain aur open karne par load hote hain. Google Fonts ke saath local font fallbacks hain. Reading aur self-review features ko API key/backend nahi chahiye. Live interviewer ke liye separately running Node API aur Gemini key chahiye; static Netlify deployment us backend ko deploy nahi karti. Offline service-worker cache aur automatic cross-device sync implemented nahi hain.

## Validation ki scope

Tests metadata, links, search, progress, bookmarks, rendering, answer reveal, filters, mock timer, themes, all visual topics, algorithm boundaries aur old URL compatibility check karte hain. `tests/i18n.test.mjs` dictionaries, English overlay aur visuals ka parity dekhta hai; `tests/play.test.mjs` XP/streak/Leitner rules, decks, language switch, daily challenge, teeno games, backup import aur badge celebration cover karta hai. Build app imports verify karta hai. Notes ke illustrative snippets ek independently built complete full-stack project nahi hain. Existing legacy playground lint warnings bhi report hote hain.

UI copy badalne par desktop/narrow viewport, light/dark theme, keyboard navigation, long code aur direct reload check karo. Questions aur explanations simple Roman Hinglish mein likho; IDs, API names aur machine-readable enum values stable rakho.

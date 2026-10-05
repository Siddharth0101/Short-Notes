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
| `src/data/catalog.js` | Chapters discover karke source examples aur questions attach karta hai |
| `src/data/sourceChapters.json` | Har source example ka owning chapter |
| `src/data/interviewQuestions.js` | Main bank; extra question files ko bhi combine karta hai |
| `src/data/visuals.js` | Visual metadata aur explanations |
| `src/data/advancedVisuals.js` | React identity, transaction race aur monotonic stack |
| `src/lib/content.js` | Frontmatter, search, heading anchors aur progress normalization |
| `src/lib/traces.js` | Binary search, sorting, BFS aur DP ke deterministic steps |
| `src/lib/progress.jsx` | Progress provider; hook `progressContext.js` mein hai |
| `src/components/`, `src/registry/` | Existing playgrounds aur compatible old routes |
| `tests/` | Node test runner, jsdom aur Vite module runner se checks |

## Routes

| Route | Kya khulta hai? |
| --- | --- |
| `/` | Overview aur padhai continue karne ka link |
| `/library?track=react&q=effects` | Search aur filtered chapters |
| `/library?view=original` | Library ka compatible original-reference entry |
| `/paths` | Ordered course stages aur completion |
| `/notes/:id` | Chapter; purana source ID owning chapter par resolve hota hai |
| `/notes/:id?tab=visual` | Chapter ka linked visual |
| `/visuals?topic=binary-search` | Visual lab |
| `/interview?track=java` | Filtered interview practice |
| `/interview/live` | Voice or typed AI interview with subject selection |
| `/saved` | Bookmarks aur progress import/export |
| `/domain/:domainId/dir/*` | Compatible old folder route |
| `/domain/:domainId/file/*` | Existing playground; Java notes reader par jaate hain |

## Content aur state ka flow

`notes/curriculum.json` ordered stages define karta hai. `node ../scripts/sync-curriculum.mjs` main syllabus, course indexes aur coverage guide regenerate karta hai. `node ../scripts/sync-interviews.mjs` interview workbook banata hai. `--check` se pata chalta hai ki generated docs current data se match karte hain ya nahi.

Chapter IDs permanent hain: URLs, bookmarks aur progress unhe use karte hain. Title rename kar sakte ho, lekin ID badalne se old links toot sakte hain. Standard bilingual headings ke old section anchors `headingId` mein preserve kiye hain. New chapters `notes/*/*.md` se discover hote hain. Duration short revision ka approximate reading time hai.

Bookmarks, completed chapters, confident answers aur recent reads `shortnotes.progress.v1` local storage mein rehte hain. Import versioned JSON ko current progress se merge karta hai. Invalid import state badalne se pehle reject hota hai. Storage unavailable ho toh session memory mein app chal sakta hai; backup export karo.

Mock session filtered pool se five questions leta hai. 15-minute wall-clock timer pause/resume hota hai; time khatam hone par answer discard nahi hota. Drafts aur mock self-review temporary hain, confidence toggle persistent hai.

## Visual models ko kaise samjho?

Visual lab teaching simulation hai. Browser, JVM, database ya Spring runtime actually execute nahi hota. Mongo index ka sorted-array demo analogy hai; real index implementation alag hai. Java/server snippets ko apna runtime/project setup chahiye. Algorithm ke extra snapshots teaching cost hain; unhe base algorithm ki auxiliary-space claim se alag samjho.

## Theme aur deployment

Top bar se System, Light aur Dark theme choose hoti hai. Preference local save hoti hai aur tabs mein sync hoti hai. System mode OS changes follow karta hai. `public/theme-init.js` React se pehle theme apply karta hai; shared styles `src/theme.css` mein hain.

Root `netlify.toml` app build karke `playground/dist/` publish karta hai. Doosre hosts par SPA routes ke liye `index.html` fallback aur actual assets ke liye normal serving rakho. PDFs static assets hain aur open karne par load hote hain. Google Fonts ke saath local font fallbacks hain. Reading aur self-review features ko API key/backend nahi chahiye. Live interviewer ke liye separately running Node API aur Gemini key chahiye; static Netlify deployment us backend ko deploy nahi karti. Offline service-worker cache aur automatic cross-device sync implemented nahi hain.

## Validation ki scope

Tests metadata, links, search, progress, bookmarks, rendering, answer reveal, filters, mock timer, themes, all visual topics, algorithm boundaries aur old URL compatibility check karte hain. Build app imports verify karta hai. Notes ke illustrative snippets ek independently built complete full-stack project nahi hain. Existing legacy playground lint warnings bhi report hote hain.

UI copy badalne par desktop/narrow viewport, light/dark theme, keyboard navigation, long code aur direct reload check karo. Questions aur explanations simple Roman Hinglish mein likho; IDs, API names aur machine-readable enum values stable rakho.

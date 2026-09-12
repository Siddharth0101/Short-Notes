# Shortnotes app

React 19, React Router, and Vite power a local-first reader for the repository's study material. Markdown is rendered with `react-markdown` and GFM support. Code is displayed as text with copy controls; source-note files are imported as raw content, never imported as application code. Only the preserved `.jsx` visualizers are loaded as React components.

## Commands

```bash
npm ci
npm run dev       # Local development; Vite prints the URL
npm test          # Content, algorithm, and DOM interaction tests
npm run lint      # Oxlint; existing playground warnings are reported
npm run build     # Production files in dist/
npm run check     # Tests, lint, and build
npm run preview   # Serve the production build locally
npm run format   # Format the new app modules and tests
```

Node.js 22.12+ is required. The lockfile is committed for reproducible installs. `npm ci` runs inside `playground/`; the build requires the parent notes directories too, so do not copy this app folder on its own.

## App organization

- `src/library/`: navigation, dashboard, collections, reader, interviews, and visual lab.
- `src/data/catalog.js`: discovers Markdown chapters, integrates source examples through `sourceChapters.json`, and attaches interview questions. Old source IDs resolve to their chapter.
- `src/data/interviewQuestions.js`: question bank with answers, follow-ups, difficulty, and subject tags.
- `src/data/visuals.js`: explanatory traces and visualization metadata.
- `src/lib/content.js`: frontmatter parsing, search, section anchors, original-note conversion, progress normalization.
- `src/lib/traces.js`: deterministic binary-search, sorting, graph, and DP traces.
- `src/lib/progress.jsx`: persistent progress provider; `progressContext.js` exposes its hook.
- `src/components/` and `src/registry/`: preserved original playground components and old routes.
- `tests/`: Node's test runner; jsdom interaction tests load JSX/raw content with Vite's module runner.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Overview and continue learning |
| `/library?track=react&q=effects` | Search and filter chapters |
| `/library?view=original` | Original source notes and PDFs |
| `/paths` | Ordered subject paths with completion |
| `/notes/:id` | Chapter or original-reference reader |
| `/notes/:id?tab=visual` | A chapter's associated visualization |
| `/visuals?topic=binary-search` | Visual lab and step controls |
| `/interview?track=java` | Filterable interview practice |
| `/saved` | Bookmarks and progress import/export |
| `/domain/:domainId/dir/*` | Compatible original folder routes |
| `/domain/:domainId/file/*` | Original playgrounds; Java notes route to the reader |

## Data and behavior

Bookmarks, completed chapters, confident interview answers, and recent reads live in `shortnotes.progress.v1` in local storage. Import merges a versioned JSON backup with current progress. Invalid files are rejected before changing state. The app can keep working in memory if browser storage is unavailable.

Chapter durations are suggested study blocks, including tracing examples and attempting exercises, rather than timed reading-speed claims.

Chapter IDs are permanent identities for URLs and saved progress. Rename a title freely; changing its ID breaks old bookmarks. New content is discovered from `notes/*/*.md`. Frontmatter and visual mappings are validated by tests.

The visual lab is educational simulation, not a JVM, browser, database, or Spring runtime. The database visualization explicitly distinguishes its simplified sorted-index analogy from MongoDB's B-tree implementation. Java and server snippets require their own runtime/project setup.

## Appearance

The top bar offers System, Light, and Dark appearances. The preference is saved locally, follows operating-system changes in System mode, and synchronizes between tabs. `public/theme-init.js` applies it before React renders to avoid a flash of the wrong theme. Shared tokens in `src/theme.css` style the reader, interview practice, visual lab, and preserved playgrounds. Theme tests check text contrast, startup behavior, persistence, and switching.

## Deployment

The root `netlify.toml` builds `playground/` and publishes `playground/dist/`. SPA fallback rules keep deep links working. Other hosts must serve `index.html` for application routes while preserving actual asset requests. The supplied PDFs are emitted as static assets and load only when opened.

Google Fonts is used for typography with local font fallbacks. The app needs no API key or backend. It does not provide an offline service-worker cache or cross-device sync.

## Validation scope

Tests verify chapter metadata/links, content search, progress normalization/persistence, library tabs, note rendering, bookmarks, completion, interview reveal/filtering, all visual topics, trace edge cases, and original URL compatibility. The production build validates application imports. Illustrative code snippets inside notes are study material, not an independently built full-stack project. Existing legacy playground lint warnings predate the revamp and are still reported.

## Practical interview workspace

Interview filters determine the question pool for a five-question mock session. The 15-minute deadline uses elapsed wall time, supports pause/resume, and does not discard answers on expiry. Drafts and self-assessments are session-only; the existing confidence toggle remains persistent. Every revealed answer links back to study material.

`src/data/advancedQuestions.js` adds chapter-linked scenarios. `src/data/advancedVisuals.js` contains the React identity and SQL race walkthroughs and an algorithm-generated monotonic-stack trace. Add visual IDs to `src/lib/visualIds.js` and use chapter frontmatter to expose the Visualize it tab.

## Ordered courses

The app reads `notes/curriculum.json` to group lessons into stages. `node ../scripts/sync-curriculum.mjs --check` verifies the same order in filenames, chapter metadata and generated Markdown indexes. Stable chapter IDs preserve existing bookmarks after file reordering.

'use strict';

/**
 * ========================================================================
 * CASE STUDY 08: EMAIL CLIENT (GMAIL / OUTLOOK) [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design) + Interview Case Studies
 *
 * REQUIREMENTS:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  FUNCTIONAL                                                        │
 * │  - Inbox list view with sender, subject, preview, timestamp        │
 * │  - Thread/conversation view (grouped by subject)                    │
 * │  - Compose new email (rich text editor, attachments)                │
 * │  - Reply, Reply All, Forward                                        │
 * │  - Search emails (full-text search with filters)                    │
 * │  - Labels/Folders (Inbox, Sent, Drafts, Trash, Custom labels)       │
 * │  - Star/Flag, Mark as read/unread, Archive                          │
 * │  - Multi-select with bulk actions                                   │
 * │  - Drag-and-drop (move emails between labels)                       │
 * │  - Keyboard shortcuts (j/k navigate, e archive, r reply)           │
 * │                                                                     │
 * │  NON-FUNCTIONAL                                                    │
 * │  - Offline reading (cached emails via Service Worker + IndexedDB)   │
 * │  - Real-time new email notifications (SSE/WebSocket/Push)           │
 * │  - Fast search (< 200ms response with autocomplete suggestions)     │
 * │  - Virtualized inbox list (handle 10,000+ emails)                   │
 * │  - Accessibility (full keyboard navigation, ARIA labels)            │
 * │  - Auto-save drafts every 30 seconds                                │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 1. EMAIL CLIENT ARCHITECTURE
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                    EMAIL CLIENT LAYOUT                              │
 * │                                                                     │
 * │  ┌───────┬────────────────────┬──────────────────────┐             │
 * │  │       │                    │                      │             │
 * │  │  Side │   Email List       │  Email Detail /      │             │
 * │  │  bar  │   (Virtualized)    │  Thread View         │             │
 * │  │       │                    │                      │             │
 * │  │ Inbox │  ┌──────────────┐  │  From: Akshay Saini  │             │
 * │  │ Sent  │  │ ☐ Email #1   │  │  Subject: React SD   │             │
 * │  │ Draft │  │   Preview... │  │  ────────────────    │             │
 * │  │ Trash │  ├──────────────┤  │  Email body content  │             │
 * │  │       │  │ ☐ Email #2   │  │  with rich text      │             │
 * │  │ Label │  │   Preview... │  │                      │             │
 * │  │ Label │  ├──────────────┤  │  ┌────────────────┐  │             │
 * │  │       │  │ ☐ Email #3   │  │  │ Reply / Fwd    │  │             │
 * │  │       │  │   Preview... │  │  └────────────────┘  │             │
 * │  └───────┴──┴──────────────┴──┴──────────────────────┘             │
 * │                                                                     │
 * │  Layout: 3-Column (Sidebar | List | Detail)                        │
 * │  Mobile: Stack (Sidebar drawer | List | Detail as separate views)  │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * COMPONENT HIERARCHY:
 * ```
 * EmailApp
 * ├── Sidebar
 * │   ├── ComposeButton
 * │   ├── LabelList (Inbox, Sent, Drafts, Starred, Trash)
 * │   ├── CustomLabels
 * │   └── StorageIndicator
 * ├── EmailListPanel
 * │   ├── SearchBar (with autocomplete)
 * │   ├── BulkActionBar (select all, delete, archive, mark read)
 * │   ├── VirtualizedEmailList
 * │   │   └── EmailListItem (checkbox, star, sender, subject, preview, time)
 * │   └── PaginationControls
 * └── EmailDetailPanel
 *     ├── ThreadView
 *     │   ├── EmailMessage (collapsed)
 *     │   ├── EmailMessage (collapsed)
 *     │   └── EmailMessage (expanded, latest)
 *     ├── ActionBar (Reply, Reply All, Forward, Delete, Archive)
 *     └── ReplyComposer (rich text editor)
 * ```
 */


// ========================================================================
// 2. THREAD / CONVERSATION VIEW
// ========================================================================

/**
 * GMAIL THREAD MODEL:
 * - Emails are grouped by subject line (with "Re:", "Fwd:" stripped).
 * - A thread can have 2-100+ messages.
 * - Latest message is expanded, older ones collapsed (show sender + preview).
 * - Click collapsed message → expands to show full content.
 *
 * DATA MODEL:
 * ```javascript
 * const thread = {
 *   threadId: 'thread_1234',
 *   subject: 'System Design Interview Prep',
 *   labels: ['INBOX', 'IMPORTANT'],
 *   isRead: false,
 *   starredByUser: true,
 *   participants: ['akshay@namastedev.com', 'chirag@chakde.com', 'sidd@dev.com'],
 *   messages: [
 *     {
 *       messageId: 'msg_001',
 *       from: { name: 'Akshay Saini', email: 'akshay@namastedev.com' },
 *       to: [{ name: 'Sidd', email: 'sidd@dev.com' }],
 *       cc: [],
 *       timestamp: '2026-09-10T10:30:00Z',
 *       snippet: 'Hey Sidd, have you started with the system design...',
 *       body: '<p>Hey Sidd, have you started with the system design notes?</p>',
 *       attachments: [],
 *       isExpanded: false,
 *     },
 *     {
 *       messageId: 'msg_002',
 *       from: { name: 'Sidd', email: 'sidd@dev.com' },
 *       to: [{ name: 'Akshay Saini', email: 'akshay@namastedev.com' }],
 *       timestamp: '2026-09-10T11:15:00Z',
 *       snippet: 'Yes! Almost done with all the Chirag Goel and Namaste notes...',
 *       body: '<p>Yes! Almost done with all the Chirag Goel and Namaste notes.</p>',
 *       attachments: [{ name: 'notes.pdf', size: 245000, type: 'application/pdf' }],
 *       isExpanded: true,      // Latest message expanded by default
 *     }
 *   ],
 *   lastMessageTimestamp: '2026-09-10T11:15:00Z',
 * };
 * ```
 */


// ========================================================================
// 3. SEARCH ARCHITECTURE
// ========================================================================

/**
 * SEARCH FEATURES:
 * - Full-text search across sender, subject, body
 * - Filter by: label, date range, has attachment, is:unread, from:, to:
 * - Autocomplete suggestions (recent searches, contacts, labels)
 *
 * SEARCH QUERY SYNTAX (Gmail-style):
 * - "from:akshay@namastedev.com" — Emails from specific sender
 * - "has:attachment" — Only emails with attachments
 * - "is:unread" — Only unread emails
 * - "label:important" — Only emails with specific label
 * - "after:2026/01/01 before:2026/06/30" — Date range
 * - "subject:system design" — Search only in subject
 *
 * IMPLEMENTATION:
 * ```jsx
 * function SearchBar() {
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 300);
 *   const { suggestions } = useSuggestions(debouncedQuery);
 *
 *   function handleSearch(searchQuery) {
 *     // Parse search operators
 *     const filters = parseSearchQuery(searchQuery);
 *     // filters = { text: 'system design', from: 'akshay', hasAttachment: true }
 *     fetchSearchResults(filters);
 *   }
 * }
 * ```
 *
 * BACKEND:
 * - Elasticsearch or Algolia for full-text search
 * - Index: sender, subject, body text, labels, timestamp
 * - Frontend debounces search input (300ms)
 * - Cancel previous search request with AbortController
 */


// ========================================================================
// 4. KEYBOARD SHORTCUTS SYSTEM
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                     KEYBOARD SHORTCUTS TABLE (GMAIL-STYLE)                  │
 * ├──────────┬──────────────────────────────────────────────────────────────────┤
 * │ Key      │ Action                                                          │
 * ├──────────┼──────────────────────────────────────────────────────────────────┤
 * │ j / k    │ Move to next / previous email in list                           │
 * │ o / Enter│ Open selected email                                             │
 * │ u        │ Go back to inbox list                                           │
 * │ e        │ Archive selected email(s)                                       │
 * │ #        │ Delete selected email(s)                                        │
 * │ r        │ Reply to email                                                  │
 * │ a        │ Reply All                                                       │
 * │ f        │ Forward email                                                   │
 * │ s        │ Star / unstar email                                             │
 * │ x        │ Select / deselect email (checkbox toggle)                       │
 * │ /        │ Focus search bar                                                │
 * │ c        │ Compose new email                                               │
 * │ Shift+I  │ Mark as read                                                    │
 * │ Shift+U  │ Mark as unread                                                  │
 * │ Esc      │ Close compose / Close search                                    │
 * └──────────┴──────────────────────────────────────────────────────────────────┘
 *
 * IMPLEMENTATION:
 * ```jsx
 * function useKeyboardShortcuts(shortcuts) {
 *   useEffect(() => {
 *     function handleKeyDown(event) {
 *       // Don't trigger shortcuts when typing in input/textarea
 *       if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;
 *
 *       const key = event.key.toLowerCase();
 *       const handler = shortcuts[key];
 *       if (handler) {
 *         event.preventDefault();
 *         handler();
 *       }
 *     }
 *
 *     document.addEventListener('keydown', handleKeyDown);
 *     return () => document.removeEventListener('keydown', handleKeyDown);
 *   }, [shortcuts]);
 * }
 *
 * // Usage:
 * useKeyboardShortcuts({
 *   'j': () => selectNextEmail(),
 *   'k': () => selectPrevEmail(),
 *   'e': () => archiveSelected(),
 *   'r': () => openReplyComposer(),
 *   '/': () => focusSearchBar(),
 *   'c': () => openComposeModal(),
 * });
 * ```
 */


// ========================================================================
// 5. OFFLINE-FIRST WITH SERVICE WORKER + INDEXEDDB
// ========================================================================

/**
 * OFFLINE STRATEGY:
 * 1. Service Worker caches the app shell (HTML, CSS, JS)
 * 2. IndexedDB stores email data locally
 * 3. On load: Show cached emails first, then sync with server
 * 4. Background sync: Queue outgoing emails when offline, send when online
 *
 * INDEXEDDB SCHEMA:
 * ```javascript
 * // Object stores:
 * {
 *   emails: {
 *     keyPath: 'messageId',
 *     indexes: ['threadId', 'timestamp', 'from', 'labelIds'],
 *   },
 *   threads: {
 *     keyPath: 'threadId',
 *     indexes: ['lastMessageTimestamp', 'labelIds'],
 *   },
 *   drafts: {
 *     keyPath: 'draftId',
 *     indexes: ['lastSavedAt'],
 *   },
 *   outbox: {
 *     keyPath: 'outboxId',
 *     indexes: ['createdAt'],   // Queued emails waiting to be sent
 *   },
 * }
 * ```
 *
 * SYNC STRATEGY:
 * - On app load: Fetch /api/sync?lastSyncTimestamp=<ts>
 * - Server returns only NEW/UPDATED emails since last sync
 * - Merge into IndexedDB
 * - Show banner if sync fails: "You're viewing cached emails"
 *
 * AUTO-SAVE DRAFTS:
 * - Every 30 seconds, save current compose state to IndexedDB
 * - On reconnect, sync draft to server
 * - On compose window close, ask "Save as draft?"
 */


// ========================================================================
// 6. RICH TEXT COMPOSER
// ========================================================================

/**
 * COMPOSE EMAIL FEATURES:
 * - Rich text formatting (Bold, Italic, Underline, Lists, Links)
 * - Inline image insertion
 * - File attachments (drag-and-drop + file picker)
 * - To/CC/BCC fields with contact autocomplete
 * - Subject line
 * - Send / Schedule Send / Discard
 *
 * IMPLEMENTATION OPTIONS:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │              RICH TEXT EDITOR OPTIONS TABLE                         │
 * ├──────────────────┬─────────────────────────────────────────────────┤
 * │ Library          │ Notes                                           │
 * ├──────────────────┼─────────────────────────────────────────────────┤
 * │ TipTap           │ Headless, extensible, built on ProseMirror      │
 * │ Slate.js         │ Highly customizable, complex API                │
 * │ Draft.js (Meta)  │ Legacy, Facebook-built, heavy                   │
 * │ Lexical (Meta)   │ Modern successor to Draft.js, performant        │
 * │ Quill.js         │ Simple, good for basic rich text                │
 * │ contentEditable  │ Native browser API, no dependency, most control │
 * └──────────────────┴─────────────────────────────────────────────────┘
 *
 * ATTACHMENT UPLOAD:
 * 1. User drops file → show progress bar
 * 2. Upload to CDN/S3 → get URL back
 * 3. Attach URL reference to email payload
 * 4. On send: email body + attachment URLs sent to server
 */


// ========================================================================
// 7. REAL-TIME NOTIFICATIONS
// ========================================================================

/**
 * APPROACHES:
 * 1. WebSocket: Maintain persistent connection, receive "new email" events
 * 2. SSE: Server pushes notifications over HTTP
 * 3. Push API: Browser push notifications (even when tab is closed)
 *
 * ```javascript
 * // SSE for new email notifications
 * const eventSource = new EventSource('/api/notifications/stream');
 *
 * eventSource.addEventListener('new-email', (event) => {
 *   const email = JSON.parse(event.data);
 *   // Update unread count badge
 *   updateUnreadCount(prev => prev + 1);
 *   // Show desktop notification
 *   new Notification(`New email from ${email.from.name}`, {
 *     body: email.subject,
 *     icon: '/email-icon.png',
 *   });
 *   // Optionally prepend to inbox if currently viewing inbox
 *   if (currentLabel === 'INBOX') {
 *     prependEmailToList(email);
 *   }
 * });
 * ```
 *
 * PUSH NOTIFICATIONS (Background):
 * ```javascript
 * // Register service worker for push
 * navigator.serviceWorker.register('/sw.js');
 * const registration = await navigator.serviceWorker.ready;
 * const subscription = await registration.pushManager.subscribe({
 *   userVisibleOnly: true,
 *   applicationServerKey: VAPID_PUBLIC_KEY,
 * });
 * // Send subscription to backend
 * await fetch('/api/push/subscribe', { method: 'POST', body: JSON.stringify(subscription) });
 * ```
 */


// ========================================================================
// 8. API CONTRACTS
// ========================================================================

/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │                      EMAIL CLIENT API CONTRACTS                              │
 * ├─────────────────────────┬────────┬───────────────────────────────────────────┤
 * │ Endpoint                │ Method │ Description                               │
 * ├─────────────────────────┼────────┼───────────────────────────────────────────┤
 * │ /api/threads            │ GET    │ List threads (paginated, by label)         │
 * │ /api/threads/:id        │ GET    │ Get full thread with all messages          │
 * │ /api/threads/:id/read   │ PATCH  │ Mark thread as read                       │
 * │ /api/threads/:id/star   │ PATCH  │ Toggle star on thread                     │
 * │ /api/threads/:id/archive│ POST   │ Move thread to archive                    │
 * │ /api/threads/:id/trash  │ POST   │ Move thread to trash                      │
 * │ /api/threads/:id/labels │ PATCH  │ Add/remove labels from thread             │
 * │ /api/messages/send      │ POST   │ Send new email / reply / forward          │
 * │ /api/drafts             │ GET    │ List saved drafts                         │
 * │ /api/drafts             │ POST   │ Save new draft                            │
 * │ /api/drafts/:id         │ PUT    │ Update existing draft                     │
 * │ /api/search             │ GET    │ Full-text search with filters             │
 * │ /api/contacts/suggest   │ GET    │ Autocomplete contacts                     │
 * │ /api/attachments/upload │ POST   │ Upload file attachment                    │
 * │ /api/sync               │ GET    │ Incremental sync since timestamp          │
 * │ /api/notifications/stream│ GET   │ SSE stream for real-time notifications    │
 * └─────────────────────────┴────────┴───────────────────────────────────────────┘
 */


// ========================================================================
// SIMULATION
// ========================================================================

// Email thread simulation
const thread = {
  threadId: 'thread_42',
  subject: 'Frontend System Design Notes',
  messages: [
    { id: 'msg_1', from: 'Akshay', snippet: 'Hey, start with RADIO framework...', time: '10:30 AM', expanded: false },
    { id: 'msg_2', from: 'Chirag', snippet: 'Add HLD complete framework...', time: '11:15 AM', expanded: false },
    { id: 'msg_3', from: 'Sidd', snippet: 'Done! All notes are comprehensive...', time: '3:05 PM', expanded: true },
  ],
};

console.log('--- Email Thread View Simulation ---');
console.log(`Subject: ${thread.subject}`);
console.log(`Messages: ${thread.messages.length}\n`);
thread.messages.forEach((msg) => {
  if (msg.expanded) {
    console.log(`  📧 ${msg.from} (${msg.time}) — [EXPANDED]`);
    console.log(`     "${msg.snippet}"`);
  } else {
    console.log(`  📩 ${msg.from} (${msg.time}) — ${msg.snippet.substring(0, 30)}...`);
  }
});

// Keyboard shortcut simulation
console.log('\n--- Keyboard Shortcut Registry ---');
const shortcuts = {
  j: 'Next email', k: 'Previous email', o: 'Open email',
  e: 'Archive', '#': 'Delete', r: 'Reply',
  a: 'Reply All', f: 'Forward', s: 'Star',
  '/': 'Search', c: 'Compose', Esc: 'Close',
};
Object.entries(shortcuts).forEach(([key, action]) => {
  console.log(`  [${key}] → ${action}`);
});

// Search query parser simulation
console.log('\n--- Search Query Parsing ---');
function parseSearchQuery(query) {
  const filters = { text: '' };
  const operators = query.match(/(\w+):(\S+)/g) || [];

  operators.forEach((op) => {
    const [key, value] = op.split(':');
    filters[key] = value;
  });

  filters.text = query.replace(/\w+:\S+/g, '').trim();
  return filters;
}

const searchQueries = [
  'from:akshay has:attachment system design',
  'is:unread label:important',
  'after:2026/01/01 react interview prep',
];

searchQueries.forEach((q) => {
  console.log(`  Query: "${q}"`);
  console.log('  Parsed:', parseSearchQuery(q));
});

// Offline sync simulation
console.log('\n--- Offline Sync Strategy ---');
const syncSteps = [
  '1. App loads → Read cached emails from IndexedDB',
  '2. Show cached data immediately (instant perceived load)',
  '3. Fetch /api/sync?since=<lastSyncTimestamp> in background',
  '4. Merge new/updated emails into IndexedDB',
  '5. Update UI with fresh data',
  '6. If offline → Show "Offline mode" banner, serve cached only',
  '7. Queue outgoing emails in IndexedDB outbox',
  '8. On reconnect → Background Sync API sends queued emails',
];
syncSteps.forEach((step) => console.log(`  ${step}`));

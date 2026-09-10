'use strict';

/**
 * ========================================================================
 * CASE STUDY 07: SOCIAL / NEWS FEED (INSTAGRAM / TWITTER) [⚡ SYSTEM DESIGN]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design) + Interview Case Studies
 *
 * REQUIREMENTS:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  FUNCTIONAL                                                        │
 * │  - Infinite scrolling feed of posts (text, images, videos)         │
 * │  - Like, Comment, Share, Save interactions                          │
 * │  - Post creation (text + image/video upload)                        │
 * │  - Pull-to-refresh (mobile gesture)                                │
 * │  - Real-time new post indicator ("5 new posts — tap to load")      │
 * │  - User profile cards, follow/unfollow                              │
 * │  - Stories carousel (auto-play, tap to advance)                    │
 * │                                                                     │
 * │  NON-FUNCTIONAL                                                    │
 * │  - Lazy-load images with blur-up placeholder                       │
 * │  - Virtual scrolling for 10,000+ posts in DOM                      │
 * │  - Optimistic like/comment updates                                  │
 * │  - Offline reading of cached feed                                   │
 * │  - Accessibility (alt text, keyboard navigation, screen readers)   │
 * │  - < 100ms interaction response time (INP)                         │
 * └─────────────────────────────────────────────────────────────────────┘
 */


// ========================================================================
// 1. FEED ARCHITECTURE
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     FEED COMPONENT TREE                             │
 * │                                                                     │
 * │   ┌──────────────────────────────────────────────┐                  │
 * │   │                  FeedPage                     │                 │
 * │   ├──────────────────┬───────────────────────────┤                 │
 * │   │  StoriesCarousel │       FeedList             │                 │
 * │   │  ┌───┐ ┌───┐    │  ┌────────────────────┐   │                 │
 * │   │  │ S1│ │ S2│    │  │ PostCard            │   │                 │
 * │   │  └───┘ └───┘    │  │ ├── UserHeader      │   │                 │
 * │   │                  │  │ ├── PostMedia       │   │                 │
 * │   │ NewPostIndicator │  │ │   (Image/Video)   │   │                 │
 * │   │ "5 new posts ↑"  │  │ ├── ActionBar       │   │                 │
 * │   │                  │  │ │   (♥ 💬 ↗ 🔖)     │   │                 │
 * │   │                  │  │ ├── LikeCount       │   │                 │
 * │   │                  │  │ ├── Caption         │   │                 │
 * │   │                  │  │ └── CommentPreview  │   │                 │
 * │   │                  │  └────────────────────┘   │                 │
 * │   │                  │  ┌────────────────────┐   │                 │
 * │   │                  │  │ PostCard (next)     │   │                 │
 * │   │                  │  └────────────────────┘   │                 │
 * │   │                  │  [Infinite Scroll Sentinel│                 │
 * │   └──────────────────┴───────────────────────────┘                 │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * DATA FLOW:
 * 1. Initial load: GET /api/feed?limit=10 (first 10 posts)
 * 2. Scroll to sentinel → GET /api/feed?cursor=<lastPostId>&limit=10
 * 3. New post indicator: SSE or WebSocket pushes "new posts available"
 * 4. User taps indicator → prepend new posts to feed state
 */


// ========================================================================
// 2. FEED RANKING: CHRONOLOGICAL VS ALGORITHMIC
// ========================================================================

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                  FEED RANKING COMPARISON TABLE                              │
 * ├───────────────────┬──────────────────────┬──────────────────────────────────┤
 * │ Strategy          │ Pros                 │ Cons                             │
 * ├───────────────────┼──────────────────────┼──────────────────────────────────┤
 * │ Chronological     │ Simple, predictable  │ Miss important posts from        │
 * │ (newest first)    │ user trusts order    │ low-activity friends             │
 * ├───────────────────┼──────────────────────┼──────────────────────────────────┤
 * │ Algorithmic       │ Higher engagement    │ "Echo chamber" effect,           │
 * │ (ML ranked)       │ personalized content │ "Why am I seeing this?"          │
 * ├───────────────────┼──────────────────────┼──────────────────────────────────┤
 * │ Hybrid (Twitter/X)│ User choice: "For You│ Complex UI, multiple feeds       │
 * │                   │ vs Following" tabs   │                                  │
 * └───────────────────┴──────────────────────┴──────────────────────────────────┘
 *
 * ALGORITHMIC FEED RANKING SIGNALS:
 * 1. Recency (newer posts ranked higher)
 * 2. Relationship strength (close friends' posts boosted)
 * 3. Engagement prediction (ML model predicts like/comment probability)
 * 4. Content type affinity (user prefers videos → boost videos)
 * 5. Post quality (verified accounts, media-rich posts)
 */


// ========================================================================
// 3. INFINITE SCROLL + CURSOR-BASED PAGINATION
// ========================================================================

/**
 * IMPLEMENTATION:
 * ```jsx
 * function Feed() {
 *   const [posts, setPosts] = useState([]);
 *   const [cursor, setCursor] = useState(null);
 *   const [hasMore, setHasMore] = useState(true);
 *   const sentinelRef = useRef(null);
 *
 *   const loadMore = useCallback(async () => {
 *     const url = cursor
 *       ? `/api/feed?cursor=${cursor}&limit=10`
 *       : '/api/feed?limit=10';
 *     const data = await fetch(url).then(r => r.json());
 *
 *     setPosts(prev => [...prev, ...data.posts]);
 *     setCursor(data.nextCursor);
 *     setHasMore(data.hasMore);
 *   }, [cursor]);
 *
 *   useEffect(() => {
 *     const observer = new IntersectionObserver(
 *       ([entry]) => {
 *         if (entry.isIntersecting && hasMore) loadMore();
 *       },
 *       { rootMargin: '300px' }   // Trigger 300px before sentinel visible
 *     );
 *
 *     if (sentinelRef.current) observer.observe(sentinelRef.current);
 *     return () => observer.disconnect();
 *   }, [hasMore, loadMore]);
 *
 *   return (
 *     <div>
 *       {posts.map(post => <PostCard key={post.id} post={post} />)}
 *       {hasMore && <div ref={sentinelRef}><Spinner /></div>}
 *     </div>
 *   );
 * }
 * ```
 *
 * CURSOR-BASED PAGINATION:
 * - API returns: { posts: [...], nextCursor: "post_12345", hasMore: true }
 * - Cursor = ID of last post in current batch
 * - Next request: /api/feed?cursor=post_12345&limit=10
 * - Advantage over offset: Consistent even when new posts are added at top!
 */


// ========================================================================
// 4. OPTIMISTIC LIKE / COMMENT UPDATES
// ========================================================================

/**
 * LIKE BUTTON FLOW:
 * ```jsx
 * function LikeButton({ postId, initialLiked, initialCount }) {
 *   const [liked, setLiked] = useState(initialLiked);
 *   const [count, setCount] = useState(initialCount);
 *
 *   async function toggleLike() {
 *     // 1. Optimistic update (instant visual feedback)
 *     const newLiked = !liked;
 *     setLiked(newLiked);
 *     setCount(prev => newLiked ? prev + 1 : prev - 1);
 *
 *     try {
 *       // 2. API call
 *       await fetch(`/api/posts/${postId}/like`, {
 *         method: newLiked ? 'POST' : 'DELETE',
 *       });
 *     } catch (error) {
 *       // 3. Revert on failure
 *       setLiked(!newLiked);
 *       setCount(prev => newLiked ? prev - 1 : prev + 1);
 *       showToast('Failed to update like. Try again.');
 *     }
 *   }
 *
 *   return (
 *     <button onClick={toggleLike} aria-label={liked ? 'Unlike' : 'Like'}>
 *       {liked ? '❤️' : '🤍'} {count}
 *     </button>
 *   );
 * }
 * ```
 *
 * DOUBLE-TAP TO LIKE (Instagram pattern):
 * - Track tap timestamps
 * - If two taps within 300ms on the same post → trigger like
 * - Show heart animation overlay
 */


// ========================================================================
// 5. LAZY IMAGE LOADING WITH BLUR-UP PLACEHOLDER
// ========================================================================

/**
 * TECHNIQUE (used by Medium, Instagram, Facebook):
 *
 * 1. API returns a tiny ~20px thumbnail (base64 or BlurHash string)
 * 2. Display blurred thumbnail immediately (filter: blur(20px))
 * 3. Load full image in background
 * 4. When loaded, cross-fade from blur to sharp
 *
 * ```jsx
 * function ProgressiveImage({ thumbnailBase64, fullSrc, alt }) {
 *   const [loaded, setLoaded] = useState(false);
 *
 *   return (
 *     <div className="image-container">
 *       // Tiny blurred placeholder (always visible initially)
 *       <img
 *         src={thumbnailBase64}
 *         className={`blur-placeholder ${loaded ? 'hidden' : ''}`}
 *         alt=""
 *         aria-hidden="true"
 *       />
 *       // Full resolution image (fades in when loaded)
 *       <img
 *         src={fullSrc}
 *         className={`full-image ${loaded ? 'visible' : ''}`}
 *         alt={alt}
 *         loading="lazy"
 *         onLoad={() => setLoaded(true)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * BLURHASH:
 * - Library that encodes image into a short ~20 character hash string.
 * - Decoded client-side into a blurred canvas placeholder (no network request!).
 * - API returns: { image: "photo.jpg", blurHash: "LEHV6nWB2y..." }
 */


// ========================================================================
// 6. PULL-TO-REFRESH PATTERN
// ========================================================================

/**
 * MOBILE GESTURE IMPLEMENTATION:
 * 1. Track touchstart → touchmove → touchend events
 * 2. If scrollTop === 0 AND user pulls down > threshold (60px):
 *    Show refresh indicator, fetch latest posts
 * 3. Animate spinner, then prepend new posts to feed
 *
 * ```jsx
 * function usePullToRefresh(onRefresh) {
 *   const [refreshing, setRefreshing] = useState(false);
 *   const startY = useRef(0);
 *
 *   const handlers = {
 *     onTouchStart: (e) => { startY.current = e.touches[0].clientY; },
 *     onTouchMove: (e) => {
 *       if (window.scrollY === 0) {
 *         const diff = e.touches[0].clientY - startY.current;
 *         if (diff > 60 && !refreshing) {
 *           // Show pull indicator
 *         }
 *       }
 *     },
 *     onTouchEnd: async () => {
 *       setRefreshing(true);
 *       await onRefresh();
 *       setRefreshing(false);
 *     },
 *   };
 *
 *   return { refreshing, handlers };
 * }
 * ```
 */


// ========================================================================
// 7. REAL-TIME NEW POST NOTIFICATIONS
// ========================================================================

/**
 * APPROACH 1: SSE (Server-Sent Events) — Lightweight, unidirectional
 * ```javascript
 * const eventSource = new EventSource('/api/feed/updates');
 *
 * eventSource.addEventListener('new-posts', (event) => {
 *   const { count } = JSON.parse(event.data);
 *   setNewPostCount(count);   // Show "5 new posts" banner
 * });
 * ```
 *
 * APPROACH 2: WebSocket — For bidirectional (also handles typing indicators, etc.)
 *
 * UI PATTERN:
 * - Don't auto-inject new posts into feed (disrupts reading position!)
 * - Show a floating banner: "5 new posts — Tap to load"
 * - On tap: Prepend new posts, smooth scroll to top
 */


// ========================================================================
// 8. SKELETON UI FOR FEED LOADING
// ========================================================================

/**
 * ```jsx
 * function FeedSkeleton() {
 *   return Array.from({ length: 3 }).map((_, i) => (
 *     <div key={i} className="post-skeleton">
 *       <div className="skeleton-header">
 *         <div className="skeleton-avatar" />        // 40x40 circle
 *         <div className="skeleton-name-bar" />      // 120px wide bar
 *       </div>
 *       <div className="skeleton-image" />           // 100% wide, 300px tall
 *       <div className="skeleton-actions" />         // Button row
 *       <div className="skeleton-text-line" />       // Caption line 1
 *       <div className="skeleton-text-line short" /> // Caption line 2 (shorter)
 *     </div>
 *   ));
 * }
 * ```
 */


// ========================================================================
// SIMULATION
// ========================================================================

// Cursor-based feed pagination
class FeedPaginator {
  constructor(allPosts) {
    this.allPosts = allPosts;
  }

  getPage(cursor, limit = 3) {
    let startIdx = 0;
    if (cursor) {
      startIdx = this.allPosts.findIndex((p) => p.id === cursor) + 1;
    }

    const posts = this.allPosts.slice(startIdx, startIdx + limit);
    const lastPost = posts[posts.length - 1];
    const hasMore = startIdx + limit < this.allPosts.length;

    return {
      posts,
      nextCursor: lastPost?.id || null,
      hasMore,
    };
  }
}

const mockPosts = Array.from({ length: 10 }, (_, i) => ({
  id: `post_${i + 1}`,
  author: `user_${(i % 5) + 1}`,
  text: `This is post #${i + 1}`,
  likes: Math.floor(Math.random() * 500),
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
}));

const paginator = new FeedPaginator(mockPosts);

console.log('--- Social Feed Cursor Pagination ---');

// Page 1
const page1 = paginator.getPage(null, 3);
console.log('Page 1:', page1.posts.map((p) => p.id).join(', '));
console.log('  Next cursor:', page1.nextCursor, '| Has more:', page1.hasMore);

// Page 2
const page2 = paginator.getPage(page1.nextCursor, 3);
console.log('Page 2:', page2.posts.map((p) => p.id).join(', '));
console.log('  Next cursor:', page2.nextCursor, '| Has more:', page2.hasMore);

// Page 3
const page3 = paginator.getPage(page2.nextCursor, 3);
console.log('Page 3:', page3.posts.map((p) => p.id).join(', '));
console.log('  Next cursor:', page3.nextCursor, '| Has more:', page3.hasMore);

// Optimistic like simulation
console.log('\n--- Optimistic Like Update ---');
let likeState = { liked: false, count: 42 };

function toggleLike() {
  // Optimistic
  likeState.liked = !likeState.liked;
  likeState.count += likeState.liked ? 1 : -1;
  console.log(`  [Optimistic] Liked: ${likeState.liked}, Count: ${likeState.count}`);

  // Simulate API
  const success = Math.random() > 0.2;
  if (success) {
    console.log('  [API] ✅ Confirmed');
  } else {
    likeState.liked = !likeState.liked;
    likeState.count += likeState.liked ? 1 : -1;
    console.log(`  [API] ❌ Failed — Reverted to Liked: ${likeState.liked}, Count: ${likeState.count}`);
  }
}

toggleLike();

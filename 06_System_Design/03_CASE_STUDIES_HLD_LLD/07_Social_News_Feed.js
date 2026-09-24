/**
 * ## Quick revision
 *
 * - Feed — cursor pagination + dedupe; ranking order ko stable boundary chahiye.
 * - New posts — indicator dikhao; reading position ko unexpected shift mat karo.
 * - Media — lazy loading + dimensions + thumbnails.
 * - Optimistic reaction — local update, server reconcile/rollback.
 * - Virtualization — long list memory/render bounded.
 * - Refresh — cancellation, race guard aur scroll restoration.
 * - Ranking — relevance/freshness objective; personalized cache/auth scope.
 * - Ranking cursor — changing ranks ke beech duplicates/gaps policy; plain offset stable snapshot nahi.
 * - Media pause — off-screen video decoding/playback stop karke resources bachao.
 * - Feed ownership — personalized result ko user/permission scope ke saath cache karo.
 */

'use strict';
// 1. FEED ARCHITECTURE
// 2. FEED RANKING: CHRONOLOGICAL VS ALGORITHMIC
// 3. INFINITE SCROLL + CURSOR-BASED PAGINATION
// 4. OPTIMISTIC LIKE / COMMENT UPDATES
// 5. LAZY IMAGE LOADING WITH BLUR-UP PLACEHOLDER
// 6. PULL-TO-REFRESH PATTERN
// 7. REAL-TIME NEW POST NOTIFICATIONS
// 8. SKELETON UI FOR FEED LOADING
// SIMULATION

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

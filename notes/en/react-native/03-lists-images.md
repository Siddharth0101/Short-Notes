---
id: rn-lists-images
title: Lists, images and pagination
track: react-native
order: 3
level: Intermediate
minutes: 4
summary: ScrollView — renders its children all at once; useful for short static content.
tags: react-native, mobile, expo, lists-images
---

## Quick revision

> Revision target — Treat virtualized rows as temporary views; keep item identity, draft ownership and pagination state stable.

### List selection

- ScrollView — renders its children all at once; useful for short static content.
- FlatList — windowed rendering; controls the initial work/memory of a long list.
- SectionList — grouped data and section headers; the same virtualization caveats apply.
- keyExtractor — give a stable item ID; do not use the index as identity for reorderable data.
- List state — offscreen rows can unmount; keep an important draft/selection in the item data or external state.
- List updates — give immutable data and the required extraData; shallow-equal props can make an update be skipped.

### Loading and tuning

- Pagination guard — onEndReached can repeat; check an in-flight flag and hasMore.
- Cursor merge — deduplicate the next page by stable IDs; do not mix an old search response into the current list.
- Pull refresh — coordinate the refreshing state and onRefresh; preserve the existing useful data on failure.
- List states — keep the empty, initial loading, page loading and retry UI separate.
- getItemLayout — skips measurement for a known row size/offset; do not invent wrong values for variable heights.
- List tuning — window/batch sizes are a tradeoff between memory and blank areas; measure on the target device.
- Image sizing — do not download/decode an unnecessarily giant image for a thumbnail; reserve the aspect ratio.

### Virtualization and image reuse

- removeClippedSubviews — detaches offscreen native views; not deallocation or a guaranteed memory saving, so check for missing-content bugs.
- Batch tradeoff — bigger batches mean fewer blanks and more JS work; a smaller window means less memory and more fast-scroll blanks.
- Image cache policy — choose the lifetime of memory/disk caching; decide the account-switch cleanup for private user images.
- Image placeholder — a placeholder/transition while loading; keep the error image meaningful too.
- Recycling key — reset a reused expo-image view to stop the previous item's image from flashing.

### Edge cases and reasoning

- Nested list orientation — a virtualized list inside a plain ScrollView of the same direction can cause windowing problems; prefer a single list with a header/footer.
- Scroll-to-index failure — a jump to an unmeasured distant row fails; define a known getItemLayout or a measured bounded retry/failure fallback.
- Item draft lifetime — local state disappears when a virtual row unmounts; preserve the edits you need in a draft store keyed by item ID.

## Understand it with an example

- Scenario — in a long product list type a quantity draft in a row, scroll far down, then come back.
- Trace — an offscreen row can unmount; if the draft lives only in row-local state, retention is not guaranteed.
- Decision — key important drafts by product ID in a parent/store; render the rows by stable item IDs.
- Catch — a larger render window does not create a retention contract; the memory cost can grow.
- Check — after a reorder, a pagination append and an image failure only the correct item's draft/image placeholder is shown.

## Recall and practice

- Question — When a virtualized row unmounts offscreen, is the local draft of its TextInput guaranteed to survive?
- Answer — No; store an important draft outside the row instance under the stable item ID.
- Try it yourself — Test an edit-scroll-return flow on a paginated list; the offscreen draft is preserved, a repeated end trigger is deduped and the image placeholder belongs to the correct item.

## Practice questions

### Easy · 1000 items: `ScrollView` or `FlatList`?

<details>
<summary>Answer</summary>

- `ScrollView` — renders all its children at once; for 1000 items memory and startup are heavy.
- `FlatList` — virtualized; only the items around the visible window are rendered.
- `ScrollView` is fine — for small, fixed content (a settings form).

</details>

### Easy · Why `keyExtractor`?

<details>
<summary>Answer</summary>

- Job — a stable identity for every row; the right row is reused on a reorder/insert.
- Default — `item.key`, otherwise the index (bugs on insert/delete).
- Fix — `keyExtractor={(item) => String(item.id)}`; the key must be a string.

</details>

### Medium · The row does not update when the selection changes

```jsx
<FlatList data={items} renderItem={({ item }) => <Row item={item} selected={item.id === selectedId} />} />
```

`selectedId` changes but the highlight is stuck on the old row.

<details>
<summary>Answer</summary>

- Why — FlatList is pure; the `data` reference is the same, so it does not re-render the rows.
- Fix — pass `extraData={selectedId}`.
- Rule — whatever outside state `renderItem` reads must go into `extraData`.

</details>

### Medium · `onEndReached` brings duplicate pages

In an infinite scroll, page 2 is fetched twice and duplicate items appear.

<details>
<summary>Answer</summary>

```jsx
const loadingRef = useRef(false);
async function loadMore() {
  if (loadingRef.current || !hasMore) return;
  loadingRef.current = true;
  try {
    const page = await fetchPage(cursor);
    setItems((prev) => {
      const seen = new Set(prev.map((i) => i.id));
      return [...prev, ...page.items.filter((i) => !seen.has(i.id))];
    });
    setCursor(page.nextCursor);
    setHasMore(Boolean(page.nextCursor));
  } finally {
    loadingRef.current = false;
  }
}
```

- Guard — `onEndReached` can fire several times during a scroll/momentum; a ref blocks it immediately (a state update is async).
- Cursor — with offset pagination new inserts shift the items; a cursor is stable.
- Dedupe by id — no duplicate rows even after a race.

</details>

### Hard · Make an image-heavy feed smooth

A feed has 500 posts with 1 image each; scrolling janks. Which fixes do you try?

<details>
<summary>Answer</summary>

- Measure — a release build + the profiler; dev-mode numbers are misleading.
- Fixed height — `getItemLayout={(_, i) => ({ length: 320, offset: 320 * i, index: i })}` saves measurement and makes `scrollToIndex` reliable.
- Render cost — a stable `renderItem`, a `memo` row, fewer inline objects/functions.
- Images — resized URLs close to the display size; a cache-aware component like `expo-image`; a placeholder/blurhash.
- Tuning — adjust `initialNumToRender`, `windowSize`, `maxToRenderPerBatch`; a smaller window = less memory but a risk of blank areas.

</details>

## Sources — further reading

- [React Native FlatList contracts](https://reactnative.dev/docs/flatlist)

- [Expo — image caching/recycling](https://docs.expo.dev/versions/latest/sdk/image/)

- [ScrollView](https://reactnative.dev/docs/scrollview)
- [List tuning](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Images](https://reactnative.dev/docs/images)

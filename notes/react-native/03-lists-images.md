---
id: rn-lists-images
title: Lists images aur pagination
track: react-native
order: 3
level: Intermediate
minutes: 4
summary: ScrollView — children ek saath render; short static content ke liye useful.
tags: react-native, mobile, expo, lists-images
---

## Quick revision

> Revision target — Virtualized rows ko temporary views samjho; item identity, draft ownership aur pagination state stable rakho.

### List selection

- ScrollView — children ek saath render; short static content ke liye useful.
- FlatList — windowed rendering; long list ka initial work/memory control karta hai.
- SectionList — grouped data aur section headers; same virtualization caveats apply.
- keyExtractor — stable item ID do; reorderable data par index identity mat banao.
- List state — offscreen rows unmount ho sakti hain; important draft/selection item data ya external state mein rakho.
- List updates — immutable data aur required extraData do; shallow-equal props update skip kara sakti hain.

### Loading aur tuning

- Pagination guard — onEndReached repeat ho sakta hai; in-flight flag aur hasMore check karo.
- Cursor merge — next page stable IDs se deduplicate; old search response ko current list mein mix mat karo.
- Pull refresh — refreshing state aur onRefresh coordinate; failure par existing useful data preserve karo.
- List states — empty, initial loading, page loading aur retry UI alag rakho.
- getItemLayout — known row size/offset par measurement skip; variable heights par wrong values mat invent karo.
- List tuning — window/batch sizes memory aur blank areas ka tradeoff; target device par measure karo.
- Image sizing — thumbnail ke liye unnecessarily giant image download/decode mat karo; aspect ratio reserve karo.

### Virtualization aur image reuse

- removeClippedSubviews — offscreen native views detach; deallocation ya guaranteed memory saving nahi, missing-content bugs check karo.
- Batch tradeoff — bigger batches blanks kam, JS work zyada; smaller window memory kam, fast-scroll blanks zyada.
- Image cache policy — memory/disk caching ka lifetime choose; private user images ka account-switch cleanup decide karo.
- Image placeholder — loading ke waqt placeholder/transition; error image bhi meaningful rakho.
- Recycling key — reused expo-image view ko reset karke previous item ki image flash hone se roko.

### Edge cases aur reasoning

- Nested list orientation — same-direction plain ScrollView mein virtualized list windowing problems de sakti; single list with header/footer prefer karo.
- Scroll-to-index failure — unmeasured distant row par jump fail; known getItemLayout ya measured bounded retry/failure fallback define karo.
- Item draft lifetime — virtual row unmount par local state disappear; item-ID keyed draft store mein needed edits preserve karo.

## Example se samjho

- Scenario — long product list mein row ka quantity draft type karke bahut neeche scroll karo, phir wapas aao.
- Trace — offscreen row unmount ho sakti hai; draft sirf row-local state mein ho toh guaranteed retention nahi.
- Decision — important drafts ko parent/store mein product ID se key karo; rows stable item IDs se render karo.
- Catch — larger render window retention contract nahi banati; memory cost badh sakti hai.
- Check — reorder, pagination append aur image failure ke baad correct item ka draft/image placeholder hi dikhe.

## Recall aur practice

- Sawal — Virtualized row offscreen unmount ho toh uske TextInput ka local draft guaranteed bachega?
- Jawaab — Nahi; important draft row instance se bahar stable item ID ke under store karo.
- Khud try karo — Paginated list edit-scroll-return flow test karo; offscreen draft preserved, repeated end trigger deduped aur image placeholder correct item ka ho.

## Practice questions

### Easy · 1000 items: `ScrollView` ya `FlatList`?

<details>
<summary>Answer</summary>

- `ScrollView` — saare children ek saath render; 1000 items par memory aur startup heavy.
- `FlatList` — virtualized; visible window ke aas-paas items hi render.
- `ScrollView` theek — chhota, fixed content (settings form).

</details>

### Easy · `keyExtractor` kyun?

<details>
<summary>Answer</summary>

- Kaam — har row ki stable identity; reorder/insert par sahi row reuse ho.
- Default — `item.key`, nahi toh index (insert/delete par bugs).
- Fix — `keyExtractor={(item) => String(item.id)}`; key string honi chahiye.

</details>

### Medium · Selection change par row update nahi hoti

```jsx
<FlatList data={items} renderItem={({ item }) => <Row item={item} selected={item.id === selectedId} />} />
```

`selectedId` badalta hai par highlight purani row par atka hai.

<details>
<summary>Answer</summary>

- Kyun — FlatList pure hai; `data` reference same hai, toh woh rows re-render nahi karta.
- Fix — `extraData={selectedId}` pass karo.
- Rule — `renderItem` jo bhi bahar ki state padhe, woh `extraData` mein jaaye.

</details>

### Medium · `onEndReached` duplicate pages laata hai

Infinite scroll mein page 2 do baar fetch hota hai aur duplicate items dikhte hain.

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

- Guard — `onEndReached` scroll/momentum mein kai baar fire ho sakta hai; ref turant block karta hai (state update async hai).
- Cursor — offset pagination mein naye inserts se items shift hote hain; cursor stable.
- Dedupe by id — race ke baad bhi duplicate rows nahi.

</details>

### Hard · Image-heavy feed smooth karo

Feed mein 500 posts, har post mein 1 image; scroll par jank hai. Kaunse fixes try karoge?

<details>
<summary>Answer</summary>

- Measure — release build + profiler; dev mode numbers misleading hain.
- Fixed height — `getItemLayout={(_, i) => ({ length: 320, offset: 320 * i, index: i })}` measurement bachata hai aur `scrollToIndex` reliable banata hai.
- Render cost — `renderItem` stable, row `memo`, inline objects/functions kam.
- Images — display size ke kareeb resized URLs; `expo-image` jaisa cache-aware component; placeholder/blurhash.
- Tuning — `initialNumToRender`, `windowSize`, `maxToRenderPerBatch` adjust karo; chhota window = kam memory par blank areas ka risk.

</details>

## Sources — aur padhne ke liye

- [React Native FlatList contracts](https://reactnative.dev/docs/flatlist)

- [Expo — image caching/recycling](https://docs.expo.dev/versions/latest/sdk/image/)

- [ScrollView](https://reactnative.dev/docs/scrollview)
- [List tuning](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Images](https://reactnative.dev/docs/images)

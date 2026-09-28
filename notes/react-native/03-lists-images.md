---
id: rn-lists-images
title: Lists images aur pagination
track: react-native
order: 3
level: Intermediate
minutes: 2
summary: ScrollView — children ek saath render; short static content ke liye useful.
tags: react-native, mobile, expo, lists-images
---

## Quick revision

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

## Sources — aur padhne ke liye

- [Expo — image caching/recycling](https://docs.expo.dev/versions/latest/sdk/image/)

- [FlatList](https://reactnative.dev/docs/flatlist)
- [ScrollView](https://reactnative.dev/docs/scrollview)
- [List tuning](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Images](https://reactnative.dev/docs/images)

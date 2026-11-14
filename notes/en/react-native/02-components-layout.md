---
id: rn-components-layout
title: Native components, styling and safe areas
track: react-native
order: 2
level: Foundation
minutes: 5
summary: View — a layout container; keep visible text inside Text.
tags: react-native, mobile, expo, components-layout
---

## Quick revision

> Revision target — Verify native layout, safe-area ownership and text scaling on one screen.

### UI primitives

- View — a layout container; keep visible text inside Text.
- Text — native text rendering; nested Text gives limited text-style inheritance.
- Pressable — handles the states of a press interaction; keep disabled and the accessible role/label clear.
- Image — a local require or a remote URI; define the dimensions and loading/error behaviour of remote images.
- StyleSheet — named style objects; camelCase properties, and browser CSS selectors do not apply automatically.
- Style array — a later style overrides the same property; `[base, selected && active]` is a common pattern.

### Responsive layout

- Flex defaults — flexDirection column, flexShrink 0; do not blindly copy the web defaults.
- Axes — justifyContent is the main axis, alignItems the cross axis; switching row/column switches the axes too.
- Flex sizing — flex:1 takes the available space; the parent needs bounded dimensions.
- Spacing — padding inside, margin outside, gap between children; avoid assuming a fixed device width.
- Safe area — handle notch/system-bar insets with react-native-safe-area-context; keep the provider at the app boundary.
- Window size — useWindowDimensions updates with resize/rotation; do not lock the layout to a one-time width snapshot.

### Overlays and touch behaviour

- Modal — a native presentation above the surrounding screen; keep the visible state and the owner of dismissal clear.
- Modal back — handle onRequestClose on Android; do not expect the normal BackHandler event while a modal is open.
- Alert — a short native confirmation/message; for a complex interactive form a custom screen/modal fits better.
- hitSlop — expands the press target; the rules of parent bounds and overlapping siblings still apply.
- pointerEvents — control the touch targeting of a view and its children with auto/none/box-only/box-none.
- onLayout — gives the laid-out position/size; do not create an endless state-update loop in the layout callback.

### Theme density and RTL

- useColorScheme — subscribes to system light/dark changes; keep the rule between an app override and the system preference clear.
- Density-independent size — do not assume layout units are physical pixels; PixelRatio is useful in image-resolution calculations.
- RTL layout — prefer start/end spacing; verify directional icons, gestures and mixed-language text manually.
- RTL configuration — allowRTL/forceRTL may take effect on the next app start; do not assume an instant toggle.

### Edge cases and reasoning

- Safe-area ownership — if both the navigator and the screen apply the same inset you get double padding; define the layer responsible for each edge.
- Text clipping — dynamic font scaling with a fixed height can cut text off; test a flexible layout and the accessible large-text variants.
- Touch versus visibility — a transparent view can block touches; verify actual device interaction against the overlay's pointerEvents/z-order contract.

## Understand it with an example

- Scenario — there is an extra gap below the header and the bottom action is hidden by the keyboard.
- Trace — if both the navigator and the screen apply the top inset you get duplicate spacing; inspect who owns the keyboard overlap separately.
- Decision — keep a single owner for the safe inset of each screen edge; define the keyboard layout for scrollable content and a reachable action.
- Catch — fixed pixel tweaks can hide the problem on one device; it can break again in landscape and with larger fonts.
- Check — on a small screen, with a notch, in landscape and with system large text the title/action stay readable and reachable.

## Recall and practice

- Question — If the notch gap is doubled, what do you inspect before guessing at more/less padding?
- Answer — Who owns the safe-area providers/insets in the navigator and the screen; if the same top edge is applied twice, remove the duplicate inset.
- Try it yourself — Build a responsive modal/form; verify rotation, large fonts, the safe area, a disabled press and touches on a transparent overlay on Android/iOS.

## Practice questions

### Easy · Why are the children not side by side?

```jsx
<View>
  <Avatar />
  <Name />
</View>
```

You expected it to work like `display: flex` on the web, but the items are stacked vertically.

<details>
<summary>Answer</summary>

- Why — in React Native every `View` is a flexbox and the default is `flexDirection: 'column'`.
- Fix — `style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}`.
- More defaults — `flexShrink: 0`, `alignContent: 'flex-start'`; `flex: 1` is a number that shares the remaining space.

</details>

### Easy · Why was the text style not inherited?

```jsx
<View style={{ color: 'red' }}>
  <Text>Warning</Text>
</View>
```

<details>
<summary>Answer</summary>

- Result — the text will not be red; a `View` does not pass text styles down (`color` is not even valid on a View).
- Inheritance — only a nested `<Text>` takes style from its parent `<Text>`.
- Pattern — build a reusable `<AppText>` component that applies the theme font/colour.

</details>

### Medium · Content under the notch

The header is hidden under the iPhone notch and the Android status bar. The fix?

<details>
<summary>Answer</summary>

```jsx
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function Header() {
  const insets = useSafeAreaInsets();
  return <View style={{ paddingTop: insets.top + 8 }}>{/* ... */}</View>;
}
// App root: <SafeAreaProvider>...</SafeAreaProvider>
```

- Library — `react-native-safe-area-context` gives the insets on both platforms and on rotation.
- Ownership — only one layer applies the inset (the navigation header or the screen), otherwise you get double padding.

</details>

### Medium · A small icon button is hard to tap

Users find a 24×24 close icon hard to tap, and the screen reader does not say "button".

<details>
<summary>Answer</summary>

```jsx
<Pressable
  onPress={onClose}
  hitSlop={12}
  accessibilityRole="button"
  accessibilityLabel="Close"
  android_ripple={{ borderless: true }}
  style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
>
  <CloseIcon size={24} />
</Pressable>
```

- Target — a touch area of ~44pt (iOS) / 48dp (Android); `hitSlop` enlarges the tap area without enlarging the visual size.
- A11y — an icon-only button needs a label.
- Feedback — a pressed state or a ripple.

</details>

### Hard · Two columns on a tablet

One column on a phone, two columns at a width `>= 768`; it must update on rotation too. How?

<details>
<summary>Answer</summary>

```jsx
function ProductGrid({ items }) {
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 2 : 1;
  return (
    <FlatList
      key={columns}
      numColumns={columns}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard item={item} />}
    />
  );
}
```

- `useWindowDimensions` — re-renders on rotation/split-screen; `Dimensions.get` at module scope stays stale.
- `key={columns}` — FlatList does not support changing `numColumns` at runtime; the key mounts a fresh list.
- Units — RN numbers are density-independent points, not pixels.

</details>

## Sources — further reading

- [React Native — Modal](https://reactnative.dev/docs/modal)
- [React Native — Pressable](https://reactnative.dev/docs/pressable)
- [React Native — View](https://reactnative.dev/docs/view)
- [React Native — Alert](https://reactnative.dev/docs/alert)
- [React Native — useColorScheme](https://reactnative.dev/docs/usecolorscheme)
- [React Native — PixelRatio](https://reactnative.dev/docs/pixelratio)
- [React Native — I18nManager](https://reactnative.dev/docs/i18nmanager)

- [Core components](https://reactnative.dev/docs/components-and-apis)
- [Style](https://reactnative.dev/docs/style)
- [Flexbox](https://reactnative.dev/docs/flexbox)
- [Safe areas](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
- [Window dimensions](https://reactnative.dev/docs/usewindowdimensions)

---
id: rn-components-layout
title: Native components styling aur safe areas
track: react-native
order: 2
level: Foundation
minutes: 5
summary: View — layout container; visible text ko Text ke andar rakho.
tags: react-native, mobile, expo, components-layout
---

## Quick revision

> Revision target — Native layout, safe-area ownership aur text scaling ko ek screen par verify karo.

### UI primitives

- View — layout container; visible text ko Text ke andar rakho.
- Text — native text rendering; nested Text limited text-style inheritance deta hai.
- Pressable — press interaction ke states handle; disabled aur accessible role/label clear rakho.
- Image — local require ya remote URI; remote images ke dimensions aur loading/error behavior define karo.
- StyleSheet — named style objects; camelCase properties, browser CSS selectors automatically apply nahi hote.
- Style array — later style same property override karti hai; `[base, selected && active]` common pattern.

### Responsive layout

- Flex defaults — flexDirection column, flexShrink 0; web defaults blindly copy mat karo.
- Axes — justifyContent main axis, alignItems cross axis; row/column badalne par axes bhi badalti hain.
- Flex sizing — flex:1 available space le; parent ko bounded dimensions chahiye.
- Spacing — padding andar, margin bahar, gap children ke beech; fixed device-width assumption avoid karo.
- Safe area — react-native-safe-area-context se notch/system-bar insets handle; provider app boundary par rakho.
- Window size — useWindowDimensions resize/rotation ke saath update; one-time width snapshot par layout mat lock karo.

### Overlays aur touch behavior

- Modal — surrounding screen ke upar native presentation; visible state aur dismissal owner clear rakho.
- Modal back — Android par onRequestClose handle; modal open ho toh normal BackHandler event expect mat karo.
- Alert — short native confirmation/message; complex interactive form ke liye custom screen/modal better fit.
- hitSlop — press target expand; parent bounds aur overlapping siblings ke rules phir bhi apply.
- pointerEvents — auto/none/box-only/box-none se view aur children ka touch targeting control karo.
- onLayout — laid-out position/size mile; layout callback mein endless state-update loop mat banao.

### Theme density aur RTL

- useColorScheme — system light/dark changes subscribe; app override aur system preference ka rule clear rakho.
- Density-independent size — layout units ko physical pixels assume mat karo; PixelRatio image-resolution calculations mein useful.
- RTL layout — start/end spacing prefer; directional icons, gestures aur mixed-language text manually verify karo.
- RTL configuration — allowRTL/forceRTL ka effect next app start par ho sakta hai; instant toggle assume mat karo.

### Edge cases aur reasoning

- Safe-area ownership — navigator aur screen dono same inset apply karein toh double padding; each edge ka responsible layer define karo.
- Text clipping — dynamic font scaling with fixed height text cut kar sakti; flexible layout aur accessible large-text variants test karo.
- Touch versus visibility — transparent view touch block kar sakti; overlay pointerEvents/z-order contract ke against actual device interaction verify karo.

## Example se samjho

- Scenario — header ke neeche extra gap aur bottom action keyboard se hidden dikh raha hai.
- Trace — top inset navigator aur screen dono apply kar rahe hon toh duplicate spacing aati hai; keyboard overlap ka owner separately inspect karo.
- Decision — har screen edge ke safe inset ka single owner rakho; scrollable content aur reachable action ka keyboard layout define karo.
- Catch — fixed pixel tweaks ek device par problem chhupa sakte hain; landscape aur larger fonts par phir toot sakte hain.
- Check — small screen, notch, landscape aur system large text par title/action readable aur reachable rahein.

## Recall aur practice

- Sawal — Notch gap double ho toh padding increase/decrease guess karne se pehle kya inspect karoge?
- Jawaab — Navigator aur screen safe-area providers/insets ka ownership; same top edge twice apply toh duplicate inset remove karo.
- Khud try karo — Responsive modal/form banao; rotation, large fonts, safe area, disabled press aur transparent-overlay touches Android/iOS par verify karo.

## Practice questions

### Easy · Children side-by-side kyun nahi?

```jsx
<View>
  <Avatar />
  <Name />
</View>
```

Web par `display: flex` jaisa socha tha, par items upar-neeche aa rahe hain.

<details>
<summary>Answer</summary>

- Kyun — React Native mein har `View` flexbox hai aur default `flexDirection: 'column'`.
- Fix — `style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}`.
- Aur defaults — `flexShrink: 0`, `alignContent: 'flex-start'`; `flex: 1` ek number hai jo bachi jagah share karta hai.

</details>

### Easy · Text style inherit kyun nahi hua?

```jsx
<View style={{ color: 'red' }}>
  <Text>Warning</Text>
</View>
```

<details>
<summary>Answer</summary>

- Result — text red nahi hoga; `View` text styles inherit nahi karata (`color` View par invalid bhi hai).
- Inheritance — sirf nested `<Text>` apne parent `<Text>` se style leta hai.
- Pattern — reusable `<AppText>` component banao jo theme font/color apply kare.

</details>

### Medium · Notch ke neeche content

Header iPhone notch aur Android status bar ke neeche chhup raha hai. Fix?

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

- Library — `react-native-safe-area-context` dono platforms aur rotation par insets deta hai.
- Ownership — ek hi layer inset apply kare (navigation header ya screen), warna double padding.

</details>

### Medium · Chhota icon button tap nahi hota

24×24 close icon par users ko tap karna mushkil lagta hai aur screen reader "button" nahi bolta.

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

- Target — ~44pt (iOS) / 48dp (Android) touch area; `hitSlop` visual size badhaye bina tap area badhata hai.
- A11y — icon-only button ko label chahiye.
- Feedback — pressed state ya ripple.

</details>

### Hard · Tablet par do columns

Phone par ek column, `>= 768` width par do columns; rotation par bhi update ho. Kaise?

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

- `useWindowDimensions` — rotation/split-screen par re-render; module scope par `Dimensions.get` stale rehta hai.
- `key={columns}` — FlatList runtime par `numColumns` change support nahi karta; key se fresh list mount.
- Units — RN numbers density-independent points hain, pixels nahi.

</details>

## Sources — aur padhne ke liye

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

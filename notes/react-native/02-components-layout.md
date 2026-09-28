---
id: rn-components-layout
title: Native components styling aur safe areas
track: react-native
order: 2
level: Foundation
minutes: 2
summary: View — layout container; visible text ko Text ke andar rakho.
tags: react-native, mobile, expo, components-layout
---

## Quick revision

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

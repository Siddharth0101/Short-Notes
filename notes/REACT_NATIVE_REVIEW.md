# React Native concept recheck — 28 September 2026

- Review — saare 10 mobile chapters dobara padhe; core APIs, app workflows aur practical advanced topics compare kiye.
- Result — 78 missing points add; 120 purane points retained, ab 198 short revision points.
- Style — new points maximum 22 words; small topic groups, detailed reference external link par.
- References — Callstack optimization overview/testing docs, Software Mansion Reanimated/Gesture Handler, React Navigation, TanStack Query, React Native aur Expo.
- Reading depth — Callstack ka public overview aur linked public docs/articles review kiye; full downloadable ebook padhne ka claim nahi.
- Versions — Gesture Handler 2/3 syntax distinguish ki; deprecated input behavior ko current API se connect kiya.

| Chapter | Gaps filled | Added | Total points | Public reference |
| --- | --- | ---: | ---: | --- |
| [React Native basics aur Expo workflow](react-native/01-foundations-expo.md) | Native project ownership | 6 | 17 | [Expo — native generation](https://docs.expo.dev/workflow/continuous-native-generation/), [Expo — config plugins](https://docs.expo.dev/config-plugins/introduction/) |
| [Native components styling aur safe areas](react-native/02-components-layout.md) | Overlays aur touch behavior; Theme density aur RTL | 10 | 22 | [React Native — Modal](https://reactnative.dev/docs/modal), [React Native — Pressable](https://reactnative.dev/docs/pressable), [React Native — View](https://reactnative.dev/docs/view), [React Native — Alert](https://reactnative.dev/docs/alert), [React Native — useColorScheme](https://reactnative.dev/docs/usecolorscheme), [React Native — PixelRatio](https://reactnative.dev/docs/pixelratio), [React Native — I18nManager](https://reactnative.dev/docs/i18nmanager) |
| [Lists images aur pagination](react-native/03-lists-images.md) | Virtualization aur image reuse | 5 | 18 | [React Native — list configuration](https://reactnative.dev/docs/optimizing-flatlist-configuration), [Expo — image caching/recycling](https://docs.expo.dev/versions/latest/sdk/image/) |
| [Navigation Expo Router aur deep links](react-native/04-navigation-links.md) | Link delivery aur guarded navigation | 6 | 18 | [React Native — Linking](https://reactnative.dev/docs/linking), [React Navigation — prevent removal](https://reactnavigation.org/docs/preventing-going-back/) |
| [Forms keyboard aur shared state](react-native/05-forms-state.md) | Keyboard aur input details | 6 | 18 | [React Native — ScrollView](https://reactnative.dev/docs/scrollview), [React Native — TextInput](https://reactnative.dev/docs/textinput) |
| [Networking offline storage aur auth](react-native/06-network-storage.md) | Mobile server-state integration; Local database aur OAuth | 10 | 22 | [TanStack Query — React Native](https://tanstack.com/query/latest/docs/framework/react/react-native?from=reactQueryV3), [Expo — SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/), [Expo — OAuth/OIDC](https://docs.expo.dev/guides/authentication/) |
| [Permissions device APIs aur app lifecycle](react-native/07-device-permissions.md) | Media location aur biometrics; Notification delivery details | 11 | 23 | [Expo — location](https://docs.expo.dev/versions/latest/sdk/location/), [Expo — image picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/), [Expo — local authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/), [Expo — notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) |
| [Performance animations aur native architecture](react-native/08-performance-native.md) | Reanimated aur gesture concepts; Startup aur memory investigation | 11 | 23 | [Software Mansion — Reanimated concepts](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/), [Software Mansion — Gesture Handler 3 migration](https://docs.swmansion.com/react-native-gesture-handler/docs/guides/upgrading-to-3/), [Software Mansion — gesture relationships](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/fundamentals/gesture-composition/), [Callstack — optimization guide overview](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization), [Callstack — profiling native internals](https://www.callstack.com/blog/profiling-react-native-internals-with-tracy-for-peak-performance) |
| [Testing debugging aur mobile accessibility](react-native/09-testing-accessibility.md) | React Native Testing Library; Diagnostics ki layers | 7 | 19 | [Callstack — testing queries](https://oss.callstack.com/react-native-testing-library/docs/api/queries), [Callstack — profiling native internals](https://www.callstack.com/blog/profiling-react-native-internals-with-tracy-for-peak-performance) |
| [Build signing OTA updates aur revision traps](react-native/10-build-release.md) | Configuration aur release versions | 6 | 18 | [Expo — environment variables](https://docs.expo.dev/guides/environment-variables/), [Expo — app versions](https://docs.expo.dev/build-reference/app-versions/), [Expo — build configuration](https://docs.expo.dev/build/eas-json/) |

## Shared React foundation

React Native mein yeh concepts React wale hi hain; existing short chapters saath use karo:

- [JSX/props](react/01-react-jsx-props.md), [state/immutable updates](react/02-state-forms.md), [rendering/keys](react/03-components-rendering.md).
- [Effects/refs/cleanup](react/05-effects-custom-hooks.md), [Context/reducer/Redux](react/07-context-reducer-redux.md), [TypeScript contracts](react/09-typescript-contracts.md).

## Coverage boundary

- Covered — mobile foundation, components/layout, lists/media, navigation, forms/state, networking/storage/auth, permissions/lifecycle, animations/interop, testing/accessibility aur builds/updates.
- Optional specializations — payments, maps, Bluetooth, audio/video, widgets aur vendor SDKs app-specific hain; har third-party API ka exhaustive catalogue nahi.
- Verification — whole-repo format, source-topic mapping, curriculum links, search/reader/interview integration, tests, lint aur build via `npm run check --prefix playground`.
- Other references — [TanStack cache keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [Software Mansion runtime scheduling](https://docs.swmansion.com/react-native-worklets/docs/threading/scheduleOnRN/).

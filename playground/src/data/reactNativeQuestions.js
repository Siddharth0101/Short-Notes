// Original short revision questions; official references are attached per question.
export const reactNativeQuestions = [
  {
    "id": "iq-rn-01",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-foundations-expo",
    "level": "Foundation",
    "question": "React Native aur React web mein actual difference kya hai?",
    "answer": "- Renderer — web DOM aur native platform views alag hain.\n- Reuse — state/Hooks logic share ho sakta hai; web UI elements direct native components nahi.",
    "followUp": "Browser-only component library mobile par use karne se pehle kya check karoge?",
    "tags": [
      "react-native",
      "basics"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/components-and-apis"
      }
    ]
  },
  {
    "id": "iq-rn-02",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-foundations-expo",
    "level": "Foundation",
    "question": "Expo Go mein custom native module missing ho toh kya karoge?",
    "answer": "- Expo Go — bundled native modules fixed hain.\n- Development build — required native module include karke apna binary rebuild karo.",
    "followUp": "Sirf Metro restart karne se nayi native dependency available kyun nahi hoti?",
    "tags": [
      "react-native",
      "expo",
      "build"
    ],
    "sources": [
      {
        "title": "Expo official docs",
        "url": "https://docs.expo.dev/develop/development-builds/introduction/"
      }
    ]
  },
  {
    "id": "iq-rn-03",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-components-layout",
    "level": "Foundation",
    "question": "React Native Flexbox web CSS se kaise different hai?",
    "answer": "- Defaults — flexDirection column aur flexShrink 0 hain.\n- Alignment — justifyContent main axis, alignItems cross axis; direction ke saath axes badalti hain.",
    "followUp": "Row ko column karne par horizontal centering ka control kaise badlega?",
    "tags": [
      "react-native",
      "layout"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/flexbox"
      }
    ]
  },
  {
    "id": "iq-rn-04",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-lists-images",
    "level": "Intermediate",
    "question": "FlatList selection change par row update nahi ho rahi, kyun?",
    "answer": "- Comparison — shallow-equal props list rerender skip kara sakti hain.\n- Fix — immutable data aur renderItem ki external selection dependency extraData mein do.",
    "followUp": "Row scroll out hone par uska important draft kahan store karoge?",
    "tags": [
      "react-native",
      "flatlist",
      "rendering"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/flatlist"
      }
    ]
  },
  {
    "id": "iq-rn-05",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-lists-images",
    "level": "Intermediate",
    "question": "Mobile list mein repeated onEndReached se duplicate pages kaise rokoge?",
    "answer": "- Guard — in-flight request aur hasMore check karo.\n- Merge — item IDs deduplicate karo; search generation/cursor se stale responses reject karo.",
    "followUp": "Refresh ke beech old pagination response aaye toh expected behavior kya hai?",
    "tags": [
      "react-native",
      "pagination",
      "race"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/flatlist"
      }
    ]
  },
  {
    "id": "iq-rn-06",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-navigation-links",
    "level": "Intermediate",
    "question": "Screen se back jaane par useEffect cleanup hamesha hoti hai?",
    "answer": "- Lifecycle — navigator screen ko mounted rakh sakta hai; blur aur unmount alag events hain.\n- Ownership — focus-only work ko focus lifecycle se cleanup karo.",
    "followUp": "Tab switch par camera subscription ko kis boundary par stop karoge?",
    "tags": [
      "react-native",
      "navigation",
      "lifecycle"
    ],
    "sources": [
      {
        "title": "React Navigation lifecycle",
        "url": "https://reactnavigation.org/docs/navigation-lifecycle/"
      }
    ]
  },
  {
    "id": "iq-rn-07",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-forms-state",
    "level": "Foundation",
    "question": "Numeric keyboard ko form validation kyun nahi maan sakte?",
    "answer": "- Input — keyboard choice expected characters suggest karti hai; value abhi bhi text hai.\n- Validation — empty/invalid/range cases parse karke reject karo; server par bhi validate karo.",
    "followUp": "Empty string ko Number se convert karne par zero ka accidental bug kaise rokoge?",
    "tags": [
      "react-native",
      "forms"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/textinput"
      }
    ]
  },
  {
    "id": "iq-rn-08",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-network-storage",
    "level": "Intermediate",
    "question": "React Native mein auth token AsyncStorage mein rakhna suitable hai?",
    "answer": "- AsyncStorage — unencrypted persistence; secrets ke liye suitable nahi.\n- Storage — platform-backed secure storage evaluate karo; logout par credentials aur user cache clear karo.",
    "followUp": "App bundle ke environment variable mein private API key rakhna safe kyun nahi?",
    "tags": [
      "react-native",
      "storage",
      "security"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/security"
      }
    ]
  },
  {
    "id": "iq-rn-09",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-device-permissions",
    "level": "Intermediate",
    "question": "Camera permission permanently denied ho toh UX kya hogi?",
    "answer": "- Recovery — useful fallback aur settings guidance do; repeated prompt loop mat chalao.\n- Recheck — settings se return par permission dobara read karo; feature state update karo.",
    "followUp": "Runtime prompt ke alawa native permission configuration kyun chahiye?",
    "tags": [
      "react-native",
      "permissions"
    ],
    "sources": [
      {
        "title": "Expo official docs",
        "url": "https://docs.expo.dev/guides/permissions/"
      }
    ]
  },
  {
    "id": "iq-rn-10",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-performance-native",
    "level": "Advanced",
    "question": "Scroll smooth hai par button response slow hai, kya inspect karoge?",
    "answer": "- Thread split — native scrolling chal sakti hai jab JS busy ho.\n- Measure — release device par JS work/renders profile; long computation ko split ya suitable worker/native path par move karo.",
    "followUp": "Har component par memo lagane se issue automatically solve kyun nahi hota?",
    "tags": [
      "react-native",
      "performance"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/performance"
      }
    ]
  },
  {
    "id": "iq-rn-11",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-testing-accessibility",
    "level": "Intermediate",
    "question": "Mocked native API tests pass hain, device testing phir kyun?",
    "answer": "- Mock boundary — JS branches verify hoti hain; actual OS permission/native integration nahi.\n- Device checks — denied permission, lifecycle aur screen-reader journey real environment mein verify karo.",
    "followUp": "VoiceOver/TalkBack reading order ke liye snapshot test enough kyun nahi?",
    "tags": [
      "react-native",
      "testing",
      "accessibility"
    ],
    "sources": [
      {
        "title": "React Native official docs",
        "url": "https://reactnative.dev/docs/testing-overview"
      }
    ]
  },
  {
    "id": "iq-rn-12",
    "track": "react-native",
    "topic": "react-native",
    "noteId": "rn-build-release",
    "level": "Advanced",
    "question": "OTA update se nayi native camera library ship kar sakte ho?",
    "answer": "- Native dependency — installed binary mein module chahiye; JS update missing native code install nahi karti.\n- Compatibility — naya native build aur matching runtime version ke saath release karo.",
    "followUp": "Compatible preview build mein update test karna release risk kaise kam karta hai?",
    "tags": [
      "react-native",
      "ota",
      "release"
    ],
    "sources": [
      {
        "title": "Expo official docs",
        "url": "https://docs.expo.dev/eas-update/runtime-versions/"
      }
    ]
  }
];

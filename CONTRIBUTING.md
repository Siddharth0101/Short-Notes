# Notes ka style

- Language — simple Roman Hinglish; technical names/code English mein.
- Format — `term — seedha meaning / zaroori catch`; ek bullet mein ek concept.
- Length — usually 5–15 short bullets per chapter; long paragraph/walkthrough mat add karo.
- Accuracy — short karte waqt scope, condition, complexity ya failure caveat mat hatao.
- Example — `var — function-scoped; reassign aur redeclare ho sakta hai.`
- Code — optional snippets `examples/<track>/` mein; chapter se relative link do.
- Sources — existing official source links preserve; version-sensitive naya claim verify karo.
- Metadata — chapter IDs, track, order, tags aur visual IDs stable rakho; minutes revision reading ke hisaab se.
- Navigation — `notes/curriculum.json` canonical hai; generated README manually edit mat karo.
- Interviews — canonical question data `playground/src/data/*Questions.js`; answers mein short fact bullets.
- Practice — code, outputs, runtime assumptions aur acceptance checks preserve karo.
- Source folders — runnable/reference code hai; explanation ke liye short chapter link use karo.
- Generation — root se `node scripts/sync-curriculum.mjs`, `node scripts/sync-interviews.mjs`, `node scripts/sync-priority-interviews.mjs`, `node scripts/sync-machine-coding.mjs`.
- Verify — `cd playground` phir `npm run check`; IDs, links, examples aur app checks pass hone chahiye.

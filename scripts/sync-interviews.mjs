import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { interviewQuestions } from "../playground/src/data/interviewQuestions.js";
import {
  requestedQuestions,
  reusedChecklist,
} from "../playground/src/data/requestedQuestions.js";
import {
  INTERVIEW_TOPICS,
  questionTopic,
} from "../playground/src/data/interviewTopics.js";

const byId = new Map(interviewQuestions.map((item) => [item.id, item]));
const selectedIds = [
  ...Object.keys(reusedChecklist),
  ...requestedQuestions.map((item) => item.id),
];
if (new Set(selectedIds).size !== selectedIds.length)
  throw new Error("Repeated checklist identity");
for (const id of selectedIds)
  if (!byId.has(id)) throw new Error(`Missing question: ${id}`);
let output = `# Interview checklist and answered workbook\n\n${interviewQuestions.length} questions are available in the app. This workbook maps the supplied HTML/CSS/JavaScript/React/Redux checklist to canonical questions and includes the additional backend, DSA, and design prompts. ${requestedQuestions.length} questions were added; ${Object.keys(reusedChecklist).length} existing questions are reused here, with expanded examples where needed. Repeated requests map to the same question instead of another card.\n\nUse the app's **Interview topic** filter for HTML, CSS, JavaScript, React, Redux, Node.js, Java, Spring Boot, MongoDB, DSA, or system design. HTML/CSS stay attached to browser-foundation reading in the JavaScript course. Answers in the app remain hidden until revealed; this Markdown workbook is a readable offline reference. Code is original, and framework excerpts state their required context.\n\n## Corrections and coverage limits\n\n- Syntax/casing mistakes such as Console, SetTimeout, SetImmidiate, async fun, and mismatched promise brackets were repaired in the intended trace exercises; the answers explain that the original can fail before any intended output.\n- Node timer ordering states its context; await does not turn a timer handle into a completion promise. ES modules permit top-level await.\n- HTML AppCache is obsolete; a web app manifest does not implement offline caching. Heading ranks remain explicit.\n- Position/display are CSS properties. React coverage focuses on function components and hooks; error boundaries and connect remain relevant integration concepts. No claim is made about what every employer asks.\n- Answers and examples were written for this repository, not copied from the supplied interview sites/videos. The linked videos have not been represented as watched or transcribed. Primary links support further technical study.\n\n### Supplied image exercises

Both public Drive image previews were inspected. The first exercises flex-direction; the second exercises align-content with wrapped lines. Both have dedicated questions and original code solutions below. The extra responsive-header/card exercise is independent of those images.

- [Requested flexbox image 1](https://drive.google.com/file/d/1VQoW4glm0yzXWPDmy4LkjXjuuVaDMbmi/view) — covered by iq-added-flex-image-one.
- [Requested flexbox image 2](https://drive.google.com/file/d/1ee2q7grgqZfuqkzu1XKQkdvr9nN4Ld2_/view) — covered by iq-added-flex-image-two.

## Reused canonical questions\n\n| Topic (repetitions merged) | Canonical question |\n| --- | --- |\n`;
for (const [id, label] of Object.entries(reusedChecklist))
  output += `| ${label} | [${id}](#${id}) |\n`;
for (const topic of INTERVIEW_TOPICS) {
  const items = selectedIds
    .map((id) => byId.get(id))
    .filter((item) => questionTopic(item) === topic.id);
  if (!items.length) continue;
  output += `\n## ${topic.name} — question index\n\n`;
  for (const item of items) output += `- [${item.question}](#${item.id})\n`;
}
output +=
  "\n## Answers and follow-ups\n\nAttempt the prompt first. Compare the mechanism and edge cases, not only the final words.\n";
for (const id of selectedIds) {
  const item = byId.get(id);
  output += `\n## ${id}\n\n**${item.question}**\n\n${item.level} · ${INTERVIEW_TOPICS.find((topic) => topic.id === questionTopic(item))?.name || item.track}\n\n`;
  if (item.promptCode) output += item.promptCode + "\n\n";
  output += `**Answer**\n\n${item.answer}\n\n**Follow-up:** ${item.followUp}\n`;
  for (const source of item.sources || [])
    output += `\n[${source.title}](${source.url})\n`;
}
const file = fileURLToPath(
  new URL("../notes/INTERVIEW_WORKBOOK.md", import.meta.url),
);
if (process.argv.includes("--check")) {
  if ((await readFile(file, "utf8")) !== output)
    throw new Error("Run node scripts/sync-interviews.mjs");
} else await writeFile(file, output);
console.log(
  `Verified ${selectedIds.length} mapped workbook questions; ${interviewQuestions.length} in the full bank.`,
);

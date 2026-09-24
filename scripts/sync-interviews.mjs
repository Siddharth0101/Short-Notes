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
let output = `# Interview workbook — Hinglish mein practice aur answers

- Bank — ${interviewQuestions.length} questions; neeche supplied checklist ke mapped answers.
- Practice — subject filter karo; pehle khud answer, phir bullets compare.
- Code — snippets ki runtime/setup assumptions check karo.
- Scope — original practice; employer-frequency ranking nahi.
- Image 1 — [flex direction reference](https://drive.google.com/file/d/1VQoW4glm0yzXWPDmy4LkjXjuuVaDMbmi/view).
- Image 2 — [wrapped alignment reference](https://drive.google.com/file/d/1ee2q7grgqZfuqkzu1XKQkdvr9nN4Ld2_/view).

## Reused questions — ek topic, ek canonical entry

| Topic — repeats merge kiye hain | Question link |
| --- | --- |
`;
for (const [id, label] of Object.entries(reusedChecklist))
  output += `| ${label} | [${id}](#${id}) |\n`;
for (const topic of INTERVIEW_TOPICS) {
  const items = selectedIds
    .map((id) => byId.get(id))
    .filter((item) => questionTopic(item) === topic.id);
  if (!items.length) continue;
  output += `\n## ${topic.name} — questions ki list\n\n`;
  for (const item of items) output += `- [${item.question}](#${item.id})\n`;
}
output +=
  "\n## Answers aur follow-ups\n\nPehle question khud attempt karo. Answer se mechanism aur edge cases compare karo; sirf final words yaad mat karo.\n";
for (const id of selectedIds) {
  const item = byId.get(id);
  output += `\n## ${id}\n\n**${item.question}**\n\n${item.level} · ${INTERVIEW_TOPICS.find((topic) => topic.id === questionTopic(item))?.name || item.track}\n\n`;
  if (item.promptCode) output += item.promptCode + "\n\n";
  output += `**Answer — reasoning samjho**\n\n${item.answer}\n\n**Follow-up — aur socho:** ${item.followUp}\n`;
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

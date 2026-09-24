import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { machineCodingQuestions } from "../playground/src/data/machineCodingQuestions.js";
import { interviewQuestions } from "../playground/src/data/interviewQuestions.js";
import { INTERVIEW_TOPICS } from "../playground/src/data/interviewTopics.js";
import { parseFrontmatter, TRACKS } from "../playground/src/lib/content.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const readings = new Map();
for (const track of TRACKS) {
  for (const file of await readdir(path.join(root, "notes", track.id))) {
    if (!file.endsWith(".md") || file === "README.md") continue;
    const note = parseFrontmatter(
      await readFile(path.join(root, "notes", track.id, file), "utf8"),
    );
    readings.set(note.id, {
      file: `${track.id}/${file}`,
      title: note.title,
      track: track.id,
    });
  }
}
const top = machineCodingQuestions.filter((q) => q.priority === "P1");
const seen = new Set();
for (const q of machineCodingQuestions) {
  const reading = readings.get(q.noteId);
  if (seen.has(q.id) || !INTERVIEW_TOPICS.some((t) => t.id === q.topic))
    throw new Error(`Invalid drill identity/topic: ${q.id}`);
  seen.add(q.id);
  if (!reading || reading.track !== q.track)
    throw new Error(`Invalid prerequisite track: ${q.id}`);
  if (
    !["P1", "P2"].includes(q.priority) ||
    !Number.isInteger(q.minutes) ||
    q.minutes <= 0
  )
    throw new Error(`Invalid practice metadata: ${q.id}`);
  if (
    !q.promptCode.includes("Build contract") ||
    (q.promptCode.match(/^- /gm) || []).length < 3 ||
    !q.answer.includes("Hint") ||
    !q.answer.includes("Answer guide") ||
    !q.followUp
  )
    throw new Error(`Incomplete implementation drill: ${q.id}`);
  if (
    !interviewQuestions.some(
      (item) => item.id === q.id && item.answer === q.answer,
    )
  )
    throw new Error(`Drill missing from app bank: ${q.id}`);
}
const orderedFor = (topic) =>
  machineCodingQuestions
    .filter((q) => q.topic === topic)
    .sort((a, b) => a.priority.localeCompare(b.priority));
let out = `# Machine coding practice — har subject ke liye build rounds

${machineCodingQuestions.length} original drills · ${INTERVIEW_TOPICS.length} subjects · ${top.length} P1 practice-first questions · ${machineCodingQuestions.length} interviewer follow-ups.

[Home](../README.md) · [Study guide](STUDY_GUIDE.md) · [Concept interview priorities](INTERVIEW_PRIORITY_GUIDE.md)

- Priority — apne subject ke P1 pehle, phir P2; learning shortlist hai.
- App — machine-coding search karo; subject se filter karo.
- Setup — stated runtime/database ready rakho; setup coding timebox se alag.
- Attempt — prompt se build karo, acceptance checks verify, phir hint/answer dekho.
- Review — failed boundary case likho aur retry karo.
- Scope — guide approach deta hai; har drill ka complete runnable project nahi.

## Scorecard

- Contract/model — 4 points.
- Working core — 6 points.
- Edge cases — 4 points.
- Verification — 4 points.
- Explanation — 2 points.
- Target — 16/20; correctness bug ho toh score ke bawajood retry.

## Route

- Frontend — HTML/CSS → JS → React/Redux → design.
- Java — Java → Spring/SQL → design.
- Node — JS → Node → MongoDB → design.
- DSA — primary language mein implement; invariant + complexity bolo.

## Subject directory

| Subject | Build rounds | P1 | Follow-ups | Coding time |
| --- | ---: | ---: | ---: | ---: |
`;
for (const topic of INTERVIEW_TOPICS) {
  const questions = orderedFor(topic.id);
  if (questions.length < 11)
    throw new Error(`Incomplete subject coverage: ${topic.id}`);
  out += `| [${topic.name}](#${questions[0].id}) | ${questions.length} | ${questions.filter((q) => q.priority === "P1").length} | ${questions.length} | ${Math.min(...questions.map((q) => q.minutes))}–${Math.max(...questions.map((q) => q.minutes))} min/round |\n`;
}
out += `

## Top questions — P1 shortlist

| Subject | Pehle yeh four rounds karo |
| --- | --- |
`;
for (const topic of INTERVIEW_TOPICS) {
  const questions = top.filter((q) => q.topic === topic.id);
  if (!questions.length)
    throw new Error(`Missing machine coding shortlist: ${topic.id}`);
  out += `| ${topic.name} | ${questions.map((q) => `[${q.question.replace("Machine coding: ", "")}](#${q.id})`).join(" · ")} |\n`;
}
for (const topic of INTERVIEW_TOPICS) {
  out += `\n## ${topic.name} — build rounds\n`;
  const questions = orderedFor(topic.id);
  out +=
    "\nPehle prompt attempt karo; hint/answer neeche reference ke liye hain.\n\n";
  for (const [index, q] of questions.entries())
    out += `${index + 1}. [${q.question.replace("Machine coding: ", "")}](#${q.id}) — ${q.priority}, ${q.minutes} min\n`;
  for (const q of questions) {
    const reading = readings.get(q.noteId);
    if (!reading) throw new Error(`Missing prerequisite: ${q.id}`);
    out += `\n### ${q.id}\n\n**${q.question}**\n\n[Pehle concept padho: ${reading.title}](${reading.file})\n\n${q.promptCode}\n\n${q.answer}\n\n**Interviewer follow-up:** ${q.followUp}\n`;
  }
}
const file = path.join(root, "notes/MACHINE_CODING_PRACTICE.md");
if (process.argv.includes("--check")) {
  if ((await readFile(file, "utf8")) !== out)
    throw new Error("Run node scripts/sync-machine-coding.mjs");
} else await writeFile(file, out);
console.log(
  `Verified ${machineCodingQuestions.length} machine coding drills across ${INTERVIEW_TOPICS.length} subjects.`,
);

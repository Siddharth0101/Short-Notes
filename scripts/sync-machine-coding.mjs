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

**Top questions ka matlab:** P1 pehle karo kyunki inmein reusable state, async, data aur correctness skills practice hoti hain. Yeh learning-based shortlist hai; company-frequency ranking nahi. P2 next challenge hai. HTML/CSS, JavaScript, React/Redux, Java, Spring Boot/SQL, Node/MongoDB, DSA aur system design sab included hain. Interview playbooks ke mock rounds ke saath apne subject ka drill use karo.

App ke Interview page par search mein **machine-coding** likho; **Interview topic** se subject select karo. Sirf shortlist ke liye **practice-first** search karo. Prompt aur acceptance checks answer reveal se pehle dikhte hain; hint aur answer guide reveal ke andar hain. Yeh guide offline reference hai, executable starter project ya full reference-solution repository nahi.

## Interview jaisa session kaise chalao

1. Apne track ka prerequisite chapter padho, phir blank project se ek prompt choose karo. Existing course runtime use karo; database drill se pehle stated DB ready rakho. Setup time coding timebox se alag hai.
2. Time ka pehla 10% contract aur examples, next 60% working implementation, next 20% acceptance tests, last 10% demo/refactor ke liye rakho. Pehle hint/answer mat padho.
3. Har acceptance bullet ka repeatable test ya visible demo dikhao. UI ke liye keyboard aur failure state; backend ke liye real persistence/concurrency jahan required; data structures ke liye invariant aur complexity explain karo.
4. Interviewer role wala partner midpoint par ek boundary case de; final demo ke baad listed follow-up pooche. Solo ho toh failed scenario likhkar retest karo.
5. Answer guide se apna approach compare karo. Alternate design valid hai agar same contract aur checks satisfy hon; guide full runnable solution nahi hai.

## Scorecard — har round 20 points

| Area | Points | Evidence |
| --- | ---: | --- |
| Contract aur model | 0–4 | Assumptions, identity, state aur scope clear hain |
| Working core | 0–6 | Required operations end-to-end chalti hain |
| Edge cases aur correctness | 0–4 | Prompt ke failure/boundary checks pass hain |
| Verification | 0–4 | Repeatable tests/demo actual behavior prove karte hain |
| Explanation | 0–2 | Tradeoff aur follow-up clearly explain kiya |

16+ target rakho, lekin violated data invariant ya missing core operation ko score se hide mat karo. Incomplete drill ko same contract ke saath dobara attempt karo. First pass mein apne subject ke four P1 rounds, phir seven P2 rounds karo; saare subjects same week mein karna zaroori nahi.

## Practice sequence — apna route choose karo

- Frontend: HTML + CSS → JavaScript → React → Redux → frontend/system design rounds.
- Java backend: Java → Spring Boot (SQL/reporting included) → system design.
- Node backend: JavaScript → Node.js → MongoDB → system design.
- DSA: apni primary language mein data structures implement karo; language/framework rounds ke saath alternate karo.
- Har subject ke sessions 1–4 P1 hain; 5–11 P2 hain. Har third round ke baad ek failed round bina hint repeat karo. Cross-track sequence prerequisite comfort ke hisaab se follow karo.
- Progress ke liye app confidence tracking use karo, aur apne log mein drill ID, date, minutes used, score /20, failed check aur next retry date likho. Follow-up ko implementation ke baad 5-minute spoken question banao.

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

// Helper for translating the interview question bank to English without touching code.
//
//   node scripts/translate-questions.mjs extract <track> [from] [to]
//       writes .i18n-work/seg/q-<track>-<from>-<to>.txt — "@@ <question id>" then "N|text" lines:
//       the question, every prose line of the answer, and the follow-up (when there is one)
//   node scripts/translate-questions.mjs extract-prompts <track> [from] [to]
//       writes .i18n-work/seg/p-<track>-<from>-<to>.txt — the task text of machine-coding
//       questions (the `promptCode` field when it is prose: build contract + acceptance checks)
//   node scripts/translate-questions.mjs weave
//       reads every .i18n-work/tr/q-*.txt and p-*.txt (same layout, translated) and rewrites
//       playground/src/data/i18n/questions.en.json; entries already in that file are kept
//   node scripts/translate-questions.mjs stats
//       prints how many questions each track has and how many are translated
//
// Code fences and blank lines are copied from the Hinglish original, so an English answer keeps
// the same code and the same shape. The wording is not checked — review it.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { interviewQuestions } from "../playground/src/data/interviewQuestions.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const work = path.join(root, ".i18n-work");
const target = path.join(root, "playground/src/data/i18n/questions.en.json");
const hinglish =
  /\b(hai|hain|hota|hoti|hote|karo|karta|karti|karte|nahi|aur|mein|ke liye|ka|ki|ko|par|yeh|wala|wali|kar|ho|se|toh|bhi|sirf|pehle|baad|agar|kyun|kya)\b/;
const leftover =
  /\b(hai|hain|karo|nahi|aur|mein|hota|hoti|hote|ke liye|kya|toh|karta|karti|karte|hoga|wala|wali|sirf|agar|kyun|chahiye|phir|bhi|yeh|woh|iska|uska|apna|apni)\b/;

// Split a question into the lines that need a translation and the lines that are copied.
function plan(question) {
  const segments = [{ field: "question", text: question.question }];
  let fenced = false;
  const answer = String(question.answer || "")
    .split("\n")
    .map((line) => {
      if (line.startsWith("```")) {
        fenced = !fenced;
        return { keep: line };
      }
      if (fenced) {
        const comment = line.match(/(\/\/|#|\/\*|--)\s?(.*)$/);
        if (!comment || !hinglish.test(comment[2])) return { keep: line };
      } else if (!line.trim()) return { keep: line };
      segments.push({ field: "answer", text: line });
      return { segment: segments.length - 1 };
    });
  if (question.followUp)
    segments.push({ field: "followUp", text: question.followUp });
  return { segments, answer };
}

// Fixed lines of a machine-coding prompt have one English form and are never sent out.
const PROMPT_AUTO = new Map([
  [
    "**Build contract — kya banana hai:**",
    "**Build contract — what to build:**",
  ],
  [
    "**Acceptance checks — demo mein dikhao:**",
    "**Acceptance checks — show these in the demo:**",
  ],
]);
const TIMEBOX = /^(\*\*Timebox:\*\* \d+ min · \*\*Priority:\*\* P\d — )(.*)$/;
const PRIORITY_NOTE = new Map([
  ["pehle practice karo", "practise this first"],
  ["next challenge", "next challenge"],
]);

// A prompt that is only a code sample has nothing to translate and yields no segments.
function promptPlan(question) {
  const segments = [];
  let fenced = false;
  const lines = String(question.promptCode || "")
    .split("\n")
    .map((line) => {
      if (line.startsWith("```")) {
        fenced = !fenced;
        return { keep: line };
      }
      if (fenced || !line.trim()) return { keep: line };
      if (PROMPT_AUTO.has(line)) return { keep: PROMPT_AUTO.get(line) };
      const timebox = line.match(TIMEBOX);
      if (timebox && PRIORITY_NOTE.has(timebox[2]))
        return { keep: timebox[1] + PRIORITY_NOTE.get(timebox[2]) };
      segments.push(line);
      return { segment: segments.length - 1 };
    });
  return { segments, lines };
}

// Read every "<prefix>*.txt" translation file into { id: [line, …] }.
function readTranslations(prefix) {
  const result = {};
  let current = null;
  const parts = readdirSync(path.join(work, "tr"))
    .filter((name) => name.startsWith(prefix))
    .sort();
  for (const part of parts)
    for (const line of readFileSync(path.join(work, "tr", part), "utf8").split(
      "\n",
    )) {
      if (line.startsWith("@@ ")) {
        current = line.slice(3).trim();
        result[current] = [];
        continue;
      }
      if (!line.trim() || !current) continue;
      const match = line.match(/^(\d+)\|(.*)$/);
      if (!match)
        throw new Error(`${part}: expected "N|text": ${line.slice(0, 60)}`);
      result[current][Number(match[1]) - 1] = match[2];
    }
  return result;
}

const [command, track, a, b] = process.argv.slice(2);
const existing = JSON.parse(readFileSync(target, "utf8"));

if (command === "stats") {
  const tracks = {};
  for (const question of interviewQuestions) {
    tracks[question.track] ??= {
      total: 0,
      english: 0,
      prompts: 0,
      englishPrompts: 0,
    };
    tracks[question.track].total++;
    if (existing[question.id]) tracks[question.track].english++;
    if (promptPlan(question).segments.length) {
      tracks[question.track].prompts++;
      if (existing[question.id]?.promptCode)
        tracks[question.track].englishPrompts++;
    }
  }
  console.table(tracks);
} else if (command === "extract" && track) {
  const list = interviewQuestions.filter(
    (question) => question.track === track,
  );
  const from = Number(a || 1);
  const to = Number(b || list.length);
  mkdirSync(path.join(work, "seg"), { recursive: true });
  mkdirSync(path.join(work, "tr"), { recursive: true });
  let text = "";
  let total = 0;
  for (const question of list.slice(from - 1, to)) {
    text += `@@ ${question.id}\n`;
    plan(question).segments.forEach((segment, index) => {
      text += `${index + 1}|${segment.text}\n`;
      total++;
    });
  }
  const file = path.join(work, "seg", `q-${track}-${from}-${to}.txt`);
  writeFileSync(file, text);
  console.log(
    `${path.relative(root, file)}: ${total} lines to translate (${list.length} in track)`,
  );
} else if (command === "extract-prompts" && track) {
  const list = interviewQuestions.filter(
    (question) =>
      question.track === track && promptPlan(question).segments.length,
  );
  const from = Number(a || 1);
  const to = Number(b || list.length);
  mkdirSync(path.join(work, "seg"), { recursive: true });
  mkdirSync(path.join(work, "tr"), { recursive: true });
  let text = "";
  let total = 0;
  for (const question of list.slice(from - 1, to)) {
    text += `@@ ${question.id}\n`;
    promptPlan(question).segments.forEach((segment, index) => {
      text += `${index + 1}|${segment}\n`;
      total++;
    });
  }
  const file = path.join(work, "seg", `p-${track}-${from}-${to}.txt`);
  writeFileSync(file, text);
  console.log(
    `${path.relative(root, file)}: ${total} lines to translate (${list.length} prompts in track)`,
  );
} else if (command === "weave") {
  const translated = readTranslations("q-");
  const prompts = readTranslations("p-");
  const spans = (text) => (text.match(/`[^`]*`/g) || []).length;
  const marker = (text) => text.match(/^(\s*(?:[-*>]|\d+\.|#{1,6})?\s*)/)[1];
  const byId = Object.fromEntries(
    interviewQuestions.map((question) => [question.id, question]),
  );
  for (const id of [...Object.keys(translated), ...Object.keys(prompts)])
    if (!byId[id]) throw new Error(`unknown question id ${id}`);
  // The English task text of a machine-coding question, or undefined when it has none yet.
  const englishPrompt = (question) => {
    const lines = prompts[question.id];
    if (!lines) return existing[question.id]?.promptCode;
    const prompt = promptPlan(question);
    if (lines.length !== prompt.segments.length || lines.includes(undefined))
      throw new Error(
        `${question.id} prompt: expected ${prompt.segments.length} lines, got ${lines.filter(Boolean).length}`,
      );
    prompt.segments.forEach((segment, index) => {
      if (spans(lines[index]) !== spans(segment))
        console.warn(
          `  ! ${question.id} prompt #${index + 1}: code spans changed`,
        );
      if (marker(lines[index]) !== marker(segment))
        console.warn(
          `  ! ${question.id} prompt #${index + 1}: list marker changed`,
        );
      if (
        leftover.test(
          lines[index].replace(/`[^`]*`/g, "").replace(/"[^"]*"/g, ""),
        )
      )
        console.warn(
          `  ? ${question.id} prompt #${index + 1}: looks untranslated: ${lines[index].slice(0, 70)}`,
        );
    });
    return prompt.lines
      .map((line) =>
        line.keep !== undefined ? line.keep : lines[line.segment],
      )
      .join("\n");
  };
  const output = {};
  let woven = 0;
  for (const question of interviewQuestions) {
    const lines = translated[question.id];
    if (!lines) {
      if (existing[question.id]) {
        const prompt = englishPrompt(question);
        output[question.id] = prompt
          ? { ...existing[question.id], promptCode: prompt }
          : existing[question.id];
      }
      continue;
    }
    const { segments, answer } = plan(question);
    if (lines.length !== segments.length || lines.includes(undefined))
      throw new Error(
        `${question.id}: expected ${segments.length} lines, got ${lines.filter(Boolean).length}`,
      );
    segments.forEach((segment, index) => {
      const english = lines[index];
      if (spans(english) !== spans(segment.text))
        console.warn(`  ! ${question.id} #${index + 1}: code spans changed`);
      if (
        segment.field === "answer" &&
        marker(english) !== marker(segment.text)
      )
        console.warn(`  ! ${question.id} #${index + 1}: list marker changed`);
      if (
        leftover.test(english.replace(/`[^`]*`/g, "").replace(/"[^"]*"/g, ""))
      )
        console.warn(
          `  ? ${question.id} #${index + 1}: looks untranslated: ${english.slice(0, 70)}`,
        );
    });
    const entry = { question: lines[0] };
    entry.answer = answer
      .map((line) =>
        line.keep !== undefined ? line.keep : lines[line.segment],
      )
      .join("\n");
    if (question.followUp) entry.followUp = lines[segments.length - 1];
    const prompt = englishPrompt(question);
    if (prompt) entry.promptCode = prompt;
    output[question.id] = entry;
    woven++;
  }
  writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`);
  console.log(
    `wrote ${Object.keys(output).length}/${interviewQuestions.length} English answers (${woven} from .i18n-work/tr)`,
  );
} else {
  console.error(
    "usage: translate-questions.mjs extract <track> [from] [to] | extract-prompts <track> [from] [to] | weave | stats",
  );
  process.exit(1);
}

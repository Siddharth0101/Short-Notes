// English content must mirror the canonical Hinglish notes: same IDs, order, code, section
// count and practice set. This check keeps a translation from silently drifting; it cannot judge
// wording, so accuracy still needs a human review.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractHeadings,
  extractTerms,
  parseFrontmatter,
  splitPractice,
  TRACKS,
} from "../playground/src/lib/content.js";
import { interviewQuestions } from "../playground/src/data/interviewQuestions.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFile(path.join(root, file), "utf8");
const json = async (file) => JSON.parse(await read(file));

// Code must be identical apart from comments, which may be translated.
function codeBlocks(markdown) {
  const blocks = [];
  let current = null;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) {
      if (current) {
        blocks.push(current);
        current = null;
      } else current = { language: line.slice(3).trim(), lines: [] };
    } else if (current)
      current.lines.push(line.replace(/\s*(\/\/|#|--|\/\*).*$/, "").trimEnd());
  }
  return blocks;
}
const recallLabels = (markdown, heading) =>
  (
    markdown
      .split(/^## /m)
      .find((section) => section.startsWith(`${heading}\n`)) || ""
  )
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).split(" — ")[0]);

const chapters = new Map();
const englishHeadings = new Map();
const translated = {};
let translatedChapters = 0;
for (const track of TRACKS) {
  translated[track.id] = 0;
  for (const name of await readdir(path.join(root, "notes", track.id))) {
    if (!/^\d.*\.md$/.test(name)) continue;
    const file = `notes/${track.id}/${name}`;
    const original = parseFrontmatter(await read(file));
    chapters.set(original.id, original);
    const englishFile = `notes/en/${track.id}/${name}`;
    if (!existsSync(path.join(root, englishFile))) continue;
    const english = parseFrontmatter(await read(englishFile));
    englishHeadings.set(english.id, english);
    for (const key of ["id", "track", "order", "level", "minutes", "visual"])
      assert.deepEqual(
        english[key],
        original[key],
        `${englishFile}: ${key} must match ${file}`,
      );
    assert.deepEqual(
      english.tags,
      original.tags,
      `${englishFile}: tags must match`,
    );
    assert(
      english.title && english.summary,
      `${englishFile}: title and summary are required`,
    );
    assert(
      english.body.startsWith("## Quick revision\n"),
      `${englishFile}: missing quick revision`,
    );
    assert.equal(
      extractHeadings(english.body).length,
      extractHeadings(original.body).length,
      `${englishFile}: section count differs from ${file}`,
    );
    assert.equal(
      extractTerms(english.body).length,
      extractTerms(original.body).length,
      `${englishFile}: revision bullet count differs`,
    );
    for (const line of english.body
      .split("\n## ")[0]
      .split("\n")
      .filter((l) => l.startsWith("- "))) {
      assert(
        line.includes(" — "),
        `${englishFile}: use term — meaning: ${line}`,
      );
      assert(
        line.split(/\s+/).length <= 45,
        `${englishFile}: explanation is too long: ${line}`,
      );
    }
    assert.deepEqual(
      codeBlocks(english.body),
      codeBlocks(original.body),
      `${englishFile}: code blocks must match the original (only comments may differ)`,
    );
    assert.deepEqual(
      recallLabels(english.body, "Recall and practice"),
      ["Question", "Answer", "Try it yourself"],
      `${englishFile}: recall needs Question, Answer and Try it yourself`,
    );
    const practice = splitPractice(english.body).questions;
    const canonical = splitPractice(original.body).questions;
    assert.deepEqual(
      practice.map((question) => question.level),
      canonical.map((question) => question.level),
      `${englishFile}: practice levels must match`,
    );
    for (const question of practice)
      assert(
        question.answer.length > 20,
        `${englishFile}: "${question.title}" needs an answer`,
      );
    translated[track.id]++;
    translatedChapters++;
  }
}

const stageIds = new Set();
const curriculum = await json("notes/curriculum.json");
for (const course of Object.values(curriculum))
  for (const stage of course.stages) stageIds.add(stage.id);
const stages = await json("notes/en/curriculum.json");
for (const [id, stage] of Object.entries(stages)) {
  assert(stageIds.has(id), `notes/en/curriculum.json: unknown stage ${id}`);
  for (const key of ["title", "goal", "checkpoint"])
    assert(
      typeof stage[key] === "string" && stage[key].trim(),
      `stage ${id}: missing ${key}`,
    );
}
const meta = await json("notes/en/chapters.json");
for (const [id, entry] of Object.entries(meta)) {
  assert(chapters.has(id), `notes/en/chapters.json: unknown chapter ${id}`);
  assert(
    entry.title?.trim() && entry.summary?.trim(),
    `chapter ${id}: needs title and summary`,
  );
}
// The app lists chapters from chapters.json and never reads the title in an English chapter's
// own frontmatter, so the two must say the same thing.
for (const [id, heading] of englishHeadings)
  for (const key of ["title", "summary"])
    assert.equal(
      meta[id]?.[key],
      heading[key],
      `notes/en/chapters.json: ${id} ${key} differs from its English chapter`,
    );
const questionIds = new Set(interviewQuestions.map((question) => question.id));
const questions = await json("playground/src/data/i18n/questions.en.json");
for (const [id, entry] of Object.entries(questions)) {
  assert(questionIds.has(id), `questions.en.json: unknown question ${id}`);
  assert(
    entry.question?.trim() && entry.answer?.trim(),
    `question ${id}: needs question and answer`,
  );
}
// A machine-coding question keeps its task (build contract + acceptance checks) in `promptCode`.
// It is prose, so an English answer without an English task would still read as Hinglish.
const fences = (text) =>
  (String(text || "").match(/```[\s\S]*?```/g) || []).join("\n");
let prompts = 0;
let englishPrompts = 0;
for (const question of interviewQuestions) {
  const prose = /\*\*Build contract/.test(question.promptCode || "");
  const entry = questions[question.id];
  if (prose) prompts++;
  if (!entry) continue;
  if (prose) {
    assert(
      entry.promptCode?.trim(),
      `question ${question.id}: needs an English task (promptCode)`,
    );
    assert(
      !/kya banana hai|demo mein dikhao|pehle practice karo/.test(
        entry.promptCode || "",
      ),
      `question ${question.id}: task headings are still Hinglish`,
    );
    englishPrompts++;
  } else if (entry.promptCode !== undefined) {
    assert.equal(
      entry.promptCode,
      question.promptCode,
      `question ${question.id}: code prompt must not change`,
    );
  }
  assert.equal(
    fences(entry.answer),
    fences(question.answer),
    `question ${question.id}: answer code changed`,
  );
}

console.log("English chapters by subject:", translated);
console.log(
  `English coverage: ${translatedChapters}/${chapters.size} full chapters, ${Object.keys(meta).length}/${chapters.size} chapter titles and summaries, ${Object.keys(stages).length}/${stageIds.size} stages, ${Object.keys(questions).length}/${questionIds.size} interview answers, ${englishPrompts}/${prompts} machine-coding tasks.`,
);

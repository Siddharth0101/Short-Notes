// Builds the small chapter list the app starts with: frontmatter and counts, no chapter text.
// Chapter text and interview answers are fetched later, only by the screens that need them.
//
//   node scripts/sync-chapter-index.mjs          writes playground/src/data/chapterIndex.json
//   node scripts/sync-chapter-index.mjs --check  fails when that file is out of date
//
// Run it after adding a chapter or changing a chapter's frontmatter, practice questions or tags.
import { existsSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  chapterQuestions,
  parseFrontmatter,
  splitPractice,
  TRACKS,
} from "../playground/src/lib/content.js";
import { interviewQuestions } from "../playground/src/data/interviewQuestions.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const target = path.join(root, "playground/src/data/chapterIndex.json");
const chapters = [];
const seen = new Set();
for (const track of TRACKS) {
  const directory = path.join(root, "notes", track.id);
  const files = (await readdir(directory))
    .filter((file) => /^\d.*\.md$/.test(file))
    .sort();
  const inTrack = [];
  for (const file of files) {
    const { body, ...meta } = parseFrontmatter(
      await readFile(path.join(directory, file), "utf8"),
    );
    if (!meta.id) continue;
    if (seen.has(meta.id)) throw new Error(`Duplicate chapter id: ${meta.id}`);
    if (meta.track !== track.id)
      throw new Error(
        `${track.id}/${file}: frontmatter track is "${meta.track}"`,
      );
    seen.add(meta.id);
    inTrack.push({
      ...meta,
      source: `notes/${track.id}/${file}`,
      practiceCount: splitPractice(body).questions.length,
      questionCount: chapterQuestions(meta, interviewQuestions).length,
      // True when notes/en has the same file, so the app knows the language before loading text.
      english: existsSync(path.join(root, "notes/en", track.id, file)),
    });
  }
  chapters.push(...inTrack.sort((a, b) => a.order - b.order));
}
const output = `${JSON.stringify(
  {
    generatedBy: "scripts/sync-chapter-index.mjs — do not edit by hand",
    questionCount: interviewQuestions.length,
    chapters,
  },
  null,
  2,
)}\n`;
if (process.argv.includes("--check")) {
  const current = existsSync(target) ? await readFile(target, "utf8") : "";
  if (current !== output) {
    console.error(
      "playground/src/data/chapterIndex.json is out of date. Run: node scripts/sync-chapter-index.mjs",
    );
    process.exit(1);
  }
  console.log(`Verified the chapter index: ${chapters.length} chapters.`);
} else {
  await writeFile(target, output);
  console.log(`Wrote the chapter index: ${chapters.length} chapters.`);
}

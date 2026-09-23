import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseFrontmatter, TRACKS } from "../playground/src/lib/content.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const curriculum = JSON.parse(
  await readFile(path.join(root, "notes/curriculum.json"), "utf8"),
);
const chapters = new Map();
for (const track of TRACKS) {
  for (const file of await readdir(path.join(root, "notes", track.id))) {
    if (!file.endsWith(".md") || file === "README.md") continue;
    const note = parseFrontmatter(
      await readFile(path.join(root, "notes", track.id, file), "utf8"),
    );
    if (chapters.has(note.id)) throw new Error(`Duplicate chapter: ${note.id}`);
    chapters.set(note.id, { ...note, file, source: `${track.id}/${file}` });
  }
}
const assigned = new Set();
const outputs = new Map();
const studyRoutine = "Har chapter mein short Hinglish one-liners hain; code examples optional link par hain. Revision routine ke liye [study guide](STUDY_GUIDE.md) padho.\n\n";
let index =
  "# Revision syllabus — subject chuno\n\nHar subject easy foundation se advanced concepts tak jaata hai. Lesson 01 se number order follow karo; stage checkpoint khud complete karke aage badho. App, filenames aur index ka order same hai. Numbered source folders related examples/reference hain.\n\n**Apna route chuno:** JavaScript → React → frontend system design; Java → Spring → backend system design. JS functions/arrays ke baad DSA start karo. Async/modules ke baad Node/MongoDB. Related subject padhkar interview playbook karo.\n\nInstructor context aur lecture mapping ki limits [course coverage](COURSE_COVERAGE.md) mein padho.\n\n";
index += studyRoutine;
for (const track of TRACKS) {
  const course = curriculum[track.id];
  if (!course) throw new Error(`Missing course ${track.id}`);
  let courseText = `# ${track.name} — quick revision\n\n[Saare courses](../README.md)\n\n`;
  let section = `## ${track.name}\n\n[Is course ka syllabus kholo](${track.id}/README.md)\n\n`;
  const prerequisiteText = course.prerequisites.length
    ? `${track.id === "interview" ? "Apne subject ke liye pehle yeh padho" : "Shuru karne se pehle"}: ${course.prerequisites
        .map((id) => {
          const n = chapters.get(id);
          if (!n) throw new Error(`Unknown prerequisite ${id}`);
          return `[${n.title}](${n.source})`;
        })
        .join(" · ")}.\n\n`
    : "Pehle programming course ki zaroorat nahi. Lesson 01 se start karo.\n\n";
  section += prerequisiteText;
  courseText += prerequisiteText.replace(/\]\(([^)]+)\)/g, "](../$1)");
  courseText += studyRoutine.replace("(STUDY_GUIDE.md)", "(../STUDY_GUIDE.md)");
  let order = 0;
  for (const [stageIndex, stage] of course.stages.entries()) {
    const header = `### Stage ${stageIndex + 1}: ${stage.title}\n\n${stage.goal}\n\n`;
    section += header;
    courseText += header.replace(/^###/, "##");
    for (const id of stage.chapters) {
      const note = chapters.get(id);
      order++;
      if (!note || note.track !== track.id || assigned.has(id))
        throw new Error(`Invalid course assignment ${id}`);
      if (
        note.order !== order ||
        !note.file.startsWith(`${String(order).padStart(2, "0")}-`)
      )
        throw new Error(`Order/file mismatch: ${id}; expected ${order}`);
      assigned.add(id);
      section += `${order}. [${note.title}](${note.source})\n`;
      courseText += `${order}. [${note.title}](${note.file})\n`;
    }
    const checkpoint = `\n**Stage checkpoint — khud karke dikhao:** ${stage.checkpoint}\n\n`;
    section += checkpoint;
    courseText += checkpoint;
  }
  index += section;
  outputs.set(`notes/${track.id}/README.md`, courseText.trimEnd() + "\n");
}
if (assigned.size !== chapters.size)
  throw new Error("Unassigned chapters in curriculum");
index +=
  "## Related source examples\n\n- [JavaScript](../01_JavaScript/README.md)\n- [DSA](../02_Dsa/README.md)\n- [Frontend aur React](../03_Frontend/README.md)\n- [Node, databases aur Java](../04_Backend/README.md)\n- [Interview playgrounds](../05_Interview/README.md)\n- [System design](../06_System_Design/README.md)\n";
outputs.set("notes/README.md", index);
const coverage =
  "# Course coverage aur padhne ka order\n\n[Latest repo gap audit aur additions](COVERAGE_AUDIT.md)\n\nPadhne ka order [course syllabus](README.md) mein hai. Har course ke numbered stages, prerequisites, lessons aur checkpoints follow karo. Stable chapter IDs bookmarks/links preserve karte hain.\n\nJavaScript mein variables se async/tooling, Java mein first program se concurrency, React mein JSX se production tak seekho. DSA mein basic structures se patterns, recursion, trees, graphs aur DP tak badho. Node/MongoDB mein HTTP se deployment; system design mein requirements, frontend/backend aur integrated cases padho. Har stage previous foundation par build hoti hai.\n\n## Instructor references ka matlab\n\nYeh original notes Jonas Schmedtmann ke JavaScript/React/Node, Telusko ke Java aur Colt Steele ke DSA topics ke companions hain. Exact enrolled editions aur complete lecture lists supplied nahi thi. Repo ka syllabus ordered hai, lekin instructor ki har lecture ka verified reproduction claim nahi hai. Beginner lessons learning prerequisites fill karti hain.\n\n## Har course ka map\n\n" +
  TRACKS.map((track) => `- [${track.name}](${track.id}/README.md)`).join("\n") +
  "\n\n## Har instructor lecture verify karne ke liye kya chahiye\n\nExact course URL, edition/update date, section aur lecture titles enrolled syllabus se chahiye. Har lecture ko covered/partial/practice-only/pending map karna hoga. Instructor projects/exercises wholesale reproduce nahi kiye gaye. Original PDF slides reference files hain; Hinglish teaching chapters notes/ mein padho. Further study ke official links har chapter mein hain.\n";
outputs.set("notes/COURSE_COVERAGE.md", coverage);
const check = process.argv.includes("--check");
for (const [file, content] of outputs) {
  if (check) {
    const current = await readFile(path.join(root, file), "utf8").catch(
      () => "",
    );
    if (current !== content)
      throw new Error(`${file} is stale. Run node scripts/sync-curriculum.mjs`);
  } else await writeFile(path.join(root, file), content);
}
console.log(
  `${check ? "Verified" : "Generated"} ${outputs.size} syllabus documents for ${chapters.size} ordered lessons.`,
);

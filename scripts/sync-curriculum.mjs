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
const studyRoutine = "Each chapter includes a core takeaway and a revision lab with a challenge, hint, answer guide and exit check. Use the [study guide](STUDY_GUIDE.md) for session plans and self-review.\n\n";
let index =
  "# Course syllabus — start here\n\nEach subject follows a prerequisite-based sequence. Read lesson 01, continue in number order, and complete each stage checkpoint. The app, filenames and this index share the same order. Original source folders remain reference material, not a second course sequence.\n\n**Choose your route:** JavaScript → React → frontend system design; Java → Spring → backend system design. Begin DSA after JavaScript functions and arrays. Begin Node/MongoDB after JavaScript async and modules. Interview playbooks come after the corresponding subject.\n\nSee [course coverage](COURSE_COVERAGE.md) for instructor context and lecture-audit limits.\n\n";
index += studyRoutine;
for (const track of TRACKS) {
  const course = curriculum[track.id];
  if (!course) throw new Error(`Missing course ${track.id}`);
  let courseText = `# ${track.name} — ordered course\n\n[All courses](../README.md)\n\n`;
  let section = `## ${track.name}\n\n[Open this course syllabus](${track.id}/README.md)\n\n`;
  const prerequisiteText = course.prerequisites.length
    ? `${track.id === "interview" ? "Readiness references for the matching subject" : "Before starting"}: ${course.prerequisites
        .map((id) => {
          const n = chapters.get(id);
          if (!n) throw new Error(`Unknown prerequisite ${id}`);
          return `[${n.title}](${n.source})`;
        })
        .join(" · ")}.\n\n`
    : "No prior programming course required. Start with lesson 01.\n\n";
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
    const checkpoint = `\n**Stage checkpoint:** ${stage.checkpoint}\n\n`;
    section += checkpoint;
    courseText += checkpoint;
  }
  index += section;
  outputs.set(`notes/${track.id}/README.md`, courseText.trimEnd() + "\n");
}
if (assigned.size !== chapters.size)
  throw new Error("Unassigned chapters in curriculum");
index +=
  "## Existing source references\n\n- [JavaScript](../01_JavaScript/README.md)\n- [DSA](../02_Dsa/README.md)\n- [Frontend and React](../03_Frontend/README.md)\n- [Node, databases, and Java](../04_Backend/README.md)\n- [Interview playgrounds](../05_Interview/README.md)\n- [System design](../06_System_Design/README.md)\n";
outputs.set("notes/README.md", index);
const coverage =
  "# Course coverage and reading order\n\nThe definitive reading order is the [course syllabus](README.md). Each course now has numbered stages, prerequisites, lessons and checkpoints. Chapter filenames and frontmatter order match this syllabus; stable chapter IDs preserve app bookmarks and links.\n\nJavaScript starts with variables, types/operators, decisions, loops, functions, and arrays/objects before collections and scope. Java starts with a runnable program, typed variables, control flow, methods/arrays and classes before advanced core Java and Spring. React begins with JSX/props and state. DSA introduces linear structures and hashing before patterns, then recursion, sorting, trees, heaps, graphs and DP. Node/MongoDB progresses through HTTP, Express, documents, schemas, query performance, security and deployment. System design separates shared foundations, React architecture, Java architecture and integrated case studies.\n\n## Instructor context\n\nThese original study notes are topic companions to Jonas Schmedtmann’s JavaScript, React and Node/MongoDB courses, Telusko’s Java material, and Colt Steele’s DSA material. Exact enrolled editions and complete lecture lists were not supplied. This is a prerequisite-based learning order, not a verified reproduction of an instructor’s every lecture. The 11 new beginner lessons fill learning prerequisites; they are not claims about additional course lectures.\n\n## Course maps\n\n" +
  TRACKS.map((track) => `- [${track.name}](${track.id}/README.md)`).join("\n") +
  "\n\n## Verification still needed for every-lecture coverage\n\nRecord the exact course URL, edition/update date, section title and lecture title from the enrolled syllabus. Map each lecture to covered, partial, practice-only or pending. Instructor projects and exercise variants have not been reproduced wholesale. Existing source notes and PDFs remain preserved under their original numbered folders. Technical chapters include official documentation for further study.\n";
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

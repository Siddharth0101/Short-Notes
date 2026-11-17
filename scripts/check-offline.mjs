// Checks the offline files of a production build (run after `vite build`, from npm run check):
// the service worker's lists match the files in dist, the app shell holds every page and no
// chapter text, each language's saved copy is complete, and the install icons are real.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TRACKS } from "../playground/src/lib/content.js";

const dist = fileURLToPath(new URL("../playground/dist/", import.meta.url));
const read = (url) => readFileSync(path.join(dist, url));
const worker = read("sw.js").toString();
const start = "const OFFLINE = ";
assert(
  worker.startsWith(start),
  "dist/sw.js does not start with its build data",
);
const data = JSON.parse(worker.slice(start.length, worker.indexOf(";\n")));

for (const url of [
  ...data.shell,
  ...data.assets,
  ...data.content.hinglish,
  ...data.content.en,
])
  assert(
    existsSync(path.join(dist, url)),
    `listed in sw.js but missing from dist: ${url}`,
  );

const page = read("index.html").toString();
for (const [, url] of page.matchAll(/(?:src|href)="(\/[^"]+)"/g))
  assert(
    data.shell.includes(url),
    `index.html loads ${url}, which is not in the app shell`,
  );

const name = (url) => path.basename(url).replace(/-[\w-]{8}\.(js|css)$/, "");
const shellNames = data.shell.map(name);
for (const page of [
  "index",
  "Reader",
  "Markdown",
  "VisualLab",
  "PlayHub",
  "Flashcards",
  "Interviews",
])
  assert(
    shellNames.includes(page),
    `the app shell is missing the ${page} chunk`,
  );
for (const url of data.shell)
  assert(
    !/notes-|interviewQuestions|questions\.en|\.pdf$/.test(url),
    `chapter text or answers in the app shell: ${url}`,
  );
assert(
  !data.assets.some((url) => url.endsWith(".pdf")),
  "PDFs must not be cached",
);

const expected = (prefix) =>
  TRACKS.map((track) => `${prefix}${track.id}`).sort();
assert.deepEqual(
  data.content.hinglish
    .map(name)
    .filter((n) => n.startsWith("notes-"))
    .sort(),
  expected("notes-"),
);
assert.deepEqual(
  data.content.en
    .map(name)
    .filter((n) => n.startsWith("notes-"))
    .sort(),
  expected("notes-en-"),
);
assert(data.content.hinglish.some((url) => name(url) === "interviewQuestions"));
assert(data.content.en.some((url) => name(url) === "questions.en"));
for (const url of [...data.content.hinglish, ...data.content.en])
  assert(data.sizes[url] > 0, `no size for ${url}`);

const manifest = JSON.parse(read("manifest.webmanifest"));
assert.equal(manifest.start_url, "/");
assert.equal(manifest.display, "standalone");
for (const icon of [
  ...manifest.icons,
  { src: "/icons/apple-touch-icon.png", sizes: "180x180" },
]) {
  const png = read(icon.src);
  assert.equal(png.toString("ascii", 1, 4), "PNG", `${icon.src} is not a PNG`);
  const size = `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`;
  assert.equal(
    size,
    icon.sizes,
    `${icon.src} is ${size}, declared ${icon.sizes}`,
  );
}
assert(
  manifest.icons.some((icon) => icon.purpose === "maskable"),
  "no maskable icon",
);

const kb = (urls) =>
  Math.round(urls.reduce((sum, url) => sum + (data.sizes[url] || 0), 0) / 1024);
console.log(
  `Offline build ok: shell ${data.shell.length} files; saved copy ${kb(data.content.hinglish)} KB Hinglish, ${kb(data.content.en)} KB more for English (gzip).`,
);

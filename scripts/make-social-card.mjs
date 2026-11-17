// Renders the link-preview image (playground/public/social-card.jpg) from docs/assets/social-card.svg.
//
//   node scripts/make-social-card.mjs
//
// macOS only, like make-app-icons.mjs: Quick Look (qlmanage) draws the SVG and sips crops and
// compresses it, so there is no image dependency to install. Run it after changing the SVG (for
// example when the chapter or visual counts on it change) and commit the JPEG it writes.
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = readFileSync(
  path.join(root, "docs/assets/social-card.svg"),
  "utf8",
);
const target = path.join(root, "playground/public/social-card.jpg");
const work = mkdtempSync(path.join(tmpdir(), "social-card-"));

// Quick Look lays an SVG out 768 CSS pixels wide, scales that to the requested size and pads the
// result to a square. So: draw the 1200×630 card in the middle of a square canvas, render it at
// 1200px, and keep the centre 630 rows.
const size = 'width="1200" height="630" viewBox="0 0 1200 630"';
if (!source.includes(size))
  throw new Error(`docs/assets/social-card.svg must keep ${size}`);
const square = source.replace(
  size,
  'width="768" height="768" viewBox="0 -285 1200 1200"',
);
writeFileSync(path.join(work, "card.svg"), square);
execFileSync(
  "qlmanage",
  ["-t", "-s", "1200", "-o", work, path.join(work, "card.svg")],
  {
    stdio: "ignore",
  },
);
const cropped = path.join(work, "cropped.png");
execFileSync(
  "sips",
  ["-c", "630", "1200", path.join(work, "card.svg.png"), "--out", cropped],
  {
    stdio: "ignore",
  },
);
// JPEG keeps it far under the ~300 KB that some chat apps accept for a preview image.
execFileSync(
  "sips",
  [
    "-s",
    "format",
    "jpeg",
    "-s",
    "formatOptions",
    "86",
    cropped,
    "--out",
    target,
  ],
  {
    stdio: "ignore",
  },
);
rmSync(work, { recursive: true, force: true });

const dimensions = execFileSync(
  "sips",
  ["-g", "pixelWidth", "-g", "pixelHeight", target],
  {
    encoding: "utf8",
  },
);
const [width, height] = [...dimensions.matchAll(/pixel\w+: (\d+)/g)].map(
  (match) => Number(match[1]),
);
if (width !== 1200 || height !== 630)
  throw new Error(`expected 1200×630, got ${width}×${height}`);
const kilobytes = Math.round(statSync(target).size / 1024);
if (kilobytes > 300)
  throw new Error(`social-card.jpg is ${kilobytes} KB; keep it under 300 KB`);
console.log(
  `wrote playground/public/social-card.jpg (1200×630, ${kilobytes} KB)`,
);

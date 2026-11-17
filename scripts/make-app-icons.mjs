// Renders the install icons in playground/public/icons from the favicon artwork.
//
//   node scripts/make-app-icons.mjs
//
// macOS only: it uses the built-in Quick Look renderer (qlmanage) and sips, so there is no
// image dependency to install. Run it after changing playground/public/favicon.svg, and commit
// the PNGs it writes.
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const favicon = readFileSync(
  path.join(root, "playground/public/favicon.svg"),
  "utf8",
);
const out = path.join(root, "playground/public/icons");
const work = mkdtempSync(path.join(tmpdir(), "app-icons-"));
mkdirSync(out, { recursive: true });

// The artwork is a rounded tile with a book drawn in a <g>. Full-bleed variants drop the corner
// radius (the platform cuts its own shape) and shrink the book to stay inside the safe zone.
const [, background] = favicon.match(/<rect[^>]*fill="([^"]+)"/);
const book = favicon.match(/<g[\s\S]*<\/g>/)[0];
const square = (scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${background}"/><g transform="translate(24 24) scale(${scale}) translate(-24 -24)">${book}</g></svg>`;
const sources = {
  // "any" purpose: the favicon as it is, rounded corners and all.
  icon: favicon,
  // Android masks this to a circle or squircle; keep the book inside the central 80% circle.
  maskable: square(0.72),
  // iOS rounds the corners itself and shows transparent corners as black.
  apple: square(0.86),
};
const outputs = [
  ["icon", 512, "icon-512.png"],
  ["icon", 192, "icon-192.png"],
  ["maskable", 512, "maskable-512.png"],
  ["apple", 180, "apple-touch-icon.png"],
];
for (const [name, svg] of Object.entries(sources)) {
  writeFileSync(path.join(work, `${name}.svg`), svg);
  execFileSync(
    "qlmanage",
    ["-t", "-s", "512", "-o", work, path.join(work, `${name}.svg`)],
    {
      stdio: "ignore",
    },
  );
}
for (const [name, size, file] of outputs) {
  const rendered = path.join(work, `${name}.svg.png`);
  const target = path.join(out, file);
  if (size === 512) execFileSync("cp", [rendered, target]);
  else
    execFileSync(
      "sips",
      ["-z", String(size), String(size), rendered, "--out", target],
      { stdio: "ignore" },
    );
  console.log(`wrote playground/public/icons/${file} (${size}px)`);
}
rmSync(work, { recursive: true, force: true });

// Vite plugin: after a production build, writes dist/sw.js from offline/sw.js with this build's
// file lists. See the top of offline/sw.js for what each list is for.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const template = new URL('./sw.js', import.meta.url);

// Which download a chunk belongs to: app code, chapter text / answers per language, or the
// archive of original source files (reference material, fetched only when opened).
function kindOf(chunk, root) {
  const name = path.basename(chunk.fileName);
  if (name.startsWith('notes-en-')) return 'en';
  if (name.startsWith('notes-')) return 'hinglish';
  const id = chunk.facadeModuleId?.split('?')[0];
  if (id?.endsWith('src/data/i18n/questions.en.json')) return 'en';
  if (id?.endsWith('src/data/interviewQuestions.js')) return 'hinglish';
  // Old /domain/... URLs open the original source files, which are not saved for offline either.
  if (id?.endsWith('src/library/LegacyRoute.jsx')) return 'archive';
  if (id && !id.includes('node_modules') && path.relative(root, id).startsWith('..'))
    return 'archive';
  return 'app';
}

function publicFiles(directory, base = directory) {
  return readdirSync(directory).flatMap((name) => {
    const full = path.join(directory, name);
    if (statSync(full).isDirectory()) return publicFiles(full, base);
    // social-card.jpg is only for link previews; nobody needs it offline.
    return ['_redirects', 'sw.js', 'social-card.jpg'].includes(name)
      ? []
      : [`/${path.relative(base, full)}`];
  });
}

export function offline() {
  let config;
  return {
    name: 'shortnotes-offline',
    apply: 'build',
    enforce: 'post',
    configResolved(resolved) {
      config = resolved;
    },
    writeBundle(_, bundle) {
      const outDir = path.resolve(config.root, config.build.outDir);
      const files = Object.values(bundle);
      const chunks = Object.fromEntries(
        files.filter((item) => item.type === 'chunk').map((chunk) => [chunk.fileName, chunk]),
      );
      const shell = new Set(['/index.html', ...publicFiles(config.publicDir)]);
      const content = { hinglish: new Set(), en: new Set() };
      // Walk the import graph from the entry. App chunks are part of the shell; a content chunk
      // and everything only it pulls in belong to that language's saved copy.
      const visit = (fileName, owner) => {
        const chunk = chunks[fileName];
        if (!chunk) return;
        const kind = kindOf(chunk, config.root);
        if (kind === 'archive') return;
        const into = kind === 'app' ? owner : kind;
        const target = into === 'app' ? shell : content[into];
        const url = `/${fileName}`;
        if (target.has(url) || (into !== 'app' && shell.has(url))) return;
        target.add(url);
        for (const next of chunk.imports) visit(next, into);
        if (into === 'app') for (const next of chunk.dynamicImports) visit(next, 'app');
      };
      for (const chunk of Object.values(chunks)) if (chunk.isEntry) visit(chunk.fileName, 'app');
      for (const item of files)
        if (item.type === 'asset' && /\.css$/.test(item.fileName)) shell.add(`/${item.fileName}`);
      // A file reached from both the app and a language belongs to the app.
      for (const set of Object.values(content))
        for (const url of set) if (shell.has(url)) set.delete(url);

      const read = (url) => readFileSync(path.join(outDir, url));
      const version = createHash('sha256');
      for (const url of [...shell].sort()) version.update(url).update(read(url));
      const sizes = {};
      for (const set of Object.values(content))
        for (const url of set) sizes[url] = gzipSync(read(url)).length;
      const data = {
        version: version.digest('hex').slice(0, 12),
        shell: [...shell].sort(),
        assets: files
          .map((item) => `/${item.fileName}`)
          .filter((url) => url.startsWith('/assets/') && !url.endsWith('.pdf'))
          .sort(),
        content: { hinglish: [...content.hinglish].sort(), en: [...content.en].sort() },
        sizes,
      };
      writeFileSync(
        path.join(outDir, 'sw.js'),
        `const OFFLINE = ${JSON.stringify(data)};\n${readFileSync(template, 'utf8')}`,
      );
      const kb = (urls) =>
        Math.round(urls.reduce((sum, url) => sum + gzipSync(read(url)).length, 0) / 1024);
      config.logger.info(
        `offline: app shell ${data.shell.length} files (${kb(data.shell)} KB gzip); ` +
          `saved copy ${data.content.hinglish.length} files Hinglish (${kb(data.content.hinglish)} KB), ` +
          `+${data.content.en.length} English (${kb(data.content.en)} KB)`,
      );
    },
  };
}

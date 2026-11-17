// Vite plugin: the files search engines and link previews read without running the app.
//
// - og:image in index.html becomes an absolute URL, since most preview bots ignore relative ones.
// - robots.txt, and sitemap.xml listing the main pages and every chapter.
//
// The site's address comes from SITE_URL, or from the URL variable Netlify sets on its builds.
// Without one (a local build) the image stays relative and no sitemap is written, because
// sitemap entries must be absolute URLs.
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Pages worth a search result besides the chapters. Saved, the arcade games and the live
// interviewer depend on the visitor's own browser data, so they are left out.
const PAGES = ['/', '/library', '/paths', '/visuals', '/play', '/interview'];

export function siteUrl(env = process.env) {
  const value = String(env.SITE_URL || env.URL || '')
    .trim()
    .replace(/\/+$/, '');
  return /^https?:\/\/[^/\s]+$/.test(value) ? value : '';
}

const escapeXml = (text) =>
  text.replace(
    /[<>&'"]/g,
    (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char],
  );

export function sitemap(site, chapters) {
  const urls = [...PAGES, ...chapters.map((chapter) => `/notes/${encodeURIComponent(chapter.id)}`)];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeXml(site + url)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

export function robots(site) {
  const lines = ['User-agent: *', 'Disallow: /api/'];
  if (site) lines.push('', `Sitemap: ${site}/sitemap.xml`);
  return `${lines.join('\n')}\n`;
}

export function absoluteImages(html, site) {
  if (!site) return html;
  return html.replace(
    /(<meta\s+(?:property|name)="(?:og|twitter):image"\s+content=")(\/[^"]*)"/g,
    (_, start, url) => `${start}${site}${url}"`,
  );
}

export function seo(env = process.env) {
  let root;
  const site = siteUrl(env);
  return {
    name: 'shortnotes-seo',
    apply: 'build',
    configResolved(resolved) {
      root = resolved.root;
    },
    transformIndexHtml(html) {
      return absoluteImages(html, site);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots(site) });
      if (!site) return;
      const index = JSON.parse(readFileSync(path.join(root, 'src/data/chapterIndex.json'), 'utf8'));
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemap(site, index.chapters),
      });
    },
  };
}

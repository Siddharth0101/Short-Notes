import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { absoluteImages, robots, siteUrl, sitemap } from '../seo/plugin.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const index = JSON.parse(
  readFileSync(new URL('../src/data/chapterIndex.json', import.meta.url), 'utf8'),
);
const meta = (attribute, key) =>
  html.match(new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="([^"]*)"`))?.[1];

test('The site address comes from SITE_URL or Netlify, and anything else is ignored', () => {
  assert.equal(siteUrl({ SITE_URL: 'https://notes.example/' }), 'https://notes.example');
  assert.equal(
    siteUrl({ URL: 'https://shortnotes.netlify.app' }),
    'https://shortnotes.netlify.app',
  );
  assert.equal(
    siteUrl({ SITE_URL: 'https://a.example', URL: 'https://b.example' }),
    'https://a.example',
  );
  assert.equal(siteUrl({}), '');
  // A path, a missing scheme or stray text is not a site root; the build then writes no sitemap.
  for (const value of ['notes.example', 'https://notes.example/docs', 'javascript:alert(1)', ' '])
    assert.equal(siteUrl({ SITE_URL: value }), '', value);
});

test('Link previews get a description, a large image and its size, without running the app', () => {
  assert.match(meta('name', 'description'), /English and Roman Hinglish/);
  assert.equal(meta('property', 'og:type'), 'website');
  assert(meta('property', 'og:title'));
  assert(meta('property', 'og:description'));
  assert(meta('property', 'og:image:alt'));
  assert.equal(meta('name', 'twitter:card'), 'summary_large_image');
  assert.equal(meta('property', 'og:image'), '/social-card.jpg');
  assert.equal(meta('property', 'og:image:width'), '1200');
  assert.equal(meta('property', 'og:image:height'), '630');
  const image = new URL('../public/social-card.jpg', import.meta.url);
  assert(existsSync(image), 'run node scripts/make-social-card.mjs');
  // Some chat apps drop preview images above about 300 KB.
  assert(statSync(image).size < 300 * 1024);
  // A single canonical/og:url would mark every chapter as a copy of the home page.
  assert.doesNotMatch(html, /rel="canonical"|property="og:url"/);
});

test('The build makes preview image URLs absolute only when it knows the site', () => {
  const built = absoluteImages(html, 'https://notes.example');
  assert.equal(
    built.match(/property="og:image"\s+content="([^"]*)"/)[1],
    'https://notes.example/social-card.jpg',
  );
  // The width, height and alt lines are not image URLs.
  assert.match(built, /property="og:image:width"\s+content="1200"/);
  assert.equal(absoluteImages(html, ''), html);
});

test('robots.txt points to the sitemap, which lists the main pages and every chapter', () => {
  assert.equal(robots(''), 'User-agent: *\nDisallow: /api/\n');
  assert.match(
    robots('https://notes.example'),
    /\nSitemap: https:\/\/notes\.example\/sitemap\.xml\n$/,
  );
  const xml = sitemap('https://notes.example', index.chapters);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length);
  assert(urls.includes('https://notes.example/'));
  assert(urls.includes('https://notes.example/visuals'));
  for (const chapter of index.chapters)
    assert(urls.includes(`https://notes.example/notes/${chapter.id}`), chapter.id);
  assert.equal(urls.length, 6 + index.chapters.length);
  // Personal pages (saved notes, the live interviewer) are not search results.
  assert(!urls.some((url) => /\/saved|\/interview\/live|\/api\//.test(url)));
  assert.match(sitemap('https://a.example', [{ id: 'x&y' }]), /\/notes\/x%26y</);
});

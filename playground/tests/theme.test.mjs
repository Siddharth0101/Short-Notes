import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { normalizeTheme, resolveTheme } from '../src/lib/theme.js';

const css = await readFile(new URL('../src/theme.css', import.meta.url), 'utf8');
const boot = await readFile(new URL('../public/theme-init.js', import.meta.url), 'utf8');
function luminance(hex) {
  const c = hex
    .slice(1)
    .match(/../g)
    .map((n) => parseInt(n, 16) / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

test('Both theme palettes keep core reading, code, buttons and subject labels at 4.5:1 contrast', () => {
  for (const theme of ['light', 'dark']) {
    const body = css.match(new RegExp(`:root\\[data-theme='${theme}'\\] \\{([^}]+)\\}`))[1];
    const tokens = Object.fromEntries(
      [...body.matchAll(/--([\w-]+):\s*(#[a-f0-9]{6});/g)].map((m) => [m[1], m[2]]),
    );
    const pairs = [
      ['text', 'page'],
      ['body-text', 'page'],
      ['muted', 'surface'],
      ['subtle', 'surface'],
      ['body-text', 'surface-soft'],
      ['accent', 'accent-soft'],
      ['on-accent', 'button-bg'],
      ['code-text', 'code-bg'],
      ['code-muted', 'code-header'],
      ...['success', 'warning', 'danger', 'info', 'purple'].map((name) => [name, `${name}-bg`]),
      ...[
        'javascript',
        'react',
        'java',
        'spring-boot',
        'mongodb',
        'dsa',
        'system-design',
        'interview',
      ].map((name) => [`track-${name}`, `tint-${name}`]),
    ];
    for (const [foreground, background] of pairs)
      assert(
        contrast(tokens[foreground], tokens[background]) >= 4.5,
        `${theme}: ${foreground} / ${background} = ${contrast(tokens[foreground], tokens[background]).toFixed(2)}`,
      );
  }
});

test('Pre-render bootstrap matches app resolution for saved, missing, invalid and blocked preferences', () => {
  for (const saved of [null, 'light', 'dark', 'system', 'invalid', 'blocked'])
    for (const systemDark of [false, true]) {
      const root = { dataset: {}, style: {} };
      const meta = {};
      runInNewContext(boot, {
        localStorage: {
          getItem() {
            if (saved === 'blocked') throw new Error('denied');
            return saved;
          },
        },
        window: { matchMedia: () => ({ matches: systemDark }) },
        document: {
          documentElement: root,
          querySelector: () => ({
            setAttribute: (k, v) => {
              meta[k] = v;
            },
          }),
        },
      });
      const expected = resolveTheme(normalizeTheme(saved), systemDark);
      assert.equal(root.dataset.theme, expected);
      assert.equal(root.style.colorScheme, expected);
      assert.equal(meta.content, expected === 'dark' ? '#10121b' : '#f7f7fb');
    }
});

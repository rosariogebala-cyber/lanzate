// Smoke tests without dependencies. Run: node --test tests/site.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
// Ignore examples of markup inside HTML comments: they are not live asset references.
const activeHtml = html.replace(/<!--[\s\S]*?-->/g, '');
test('Main document has lang, title, description and one main', () => {
  assert.match(html, /<html[^>]+lang="es-AR"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description"/);
  assert.equal((html.match(/<main(?:\s|>)/g) || []).length, 1);
});
test('All local section anchors on homepage have destinations', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const [, fragment] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(fragment), 'Missing target: #' + fragment);
  }
});
test('Sitemap is present and has valid public URLs', () => {
  const sitemap = read('sitemap.xml');
  assert.match(sitemap, /<urlset\b/);
  for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    assert.ok(url.startsWith('https://rosariogebala-cyber.github.io/lanzate/'), url);
  }
});
test('Local assets referenced by homepage exist', () => {
  for (const [, path] of activeHtml.matchAll(/(?:src|href)="((?:css|js|img)\/[^"]+)"/g)) {
    assert.ok(existsSync(new URL('../' + path.split('?')[0], import.meta.url)), path);
  }
});
test('JavaScript syntax is checked separately in CI', () => {
  assert.match(read('js/main.js'), /"use strict"/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getPosts, parsePost, renderPost } from '../lib/posts.mjs';
const source = readFileSync(
  'content/blog/sign-pdf-iphone-without-printing.md',
  'utf8',
);
test('published guides render with prefixed links and valid table of contents', () => {
  const posts = getPosts();
  assert.ok(posts.length >= 6);
  for (const post of posts) {
    const { html, headings } = renderPost(post, '/scansignature-web');
    assert.ok(headings.length);
    assert.ok(html.includes('/scansignature-web/mockup/'));
    for (const h of headings) assert.ok(html.includes(`id="${h.id}"`));
    assert.ok(!html.includes('href="/blog/'));
  }
});
test('localized guides are complete, share the source slug set, and keep links inside their locale', () => {
  const englishSlugs = getPosts({ locale: 'en' }).map((post) => post.slug).sort();
  for (const locale of ['tr', 'de', 'es']) {
    const posts = getPosts({ locale });
    assert.deepEqual(posts.map((post) => post.slug).sort(), englishSlugs);
    for (const post of posts) {
      const { html } = renderPost(post, '/scansignature-web', locale);
      assert.ok(post.body.trim().split(/\s+/).length >= 250, `${locale}/${post.slug} is too short`);
      assert.match(html, new RegExp(`href="/scansignature-web/${locale}/blog/`));
    }
  }
});
test('invalid metadata, dates, HTML, and executable URLs are rejected', () => {
  for (const bad of [
    source.replace('status: "published"', 'status: "unknown"'),
    source.replace('2026-10-19', '2026-02-30'),
    source + '\n<script>alert(1)</script>',
    source + '\n[click](javascript:alert(1))',
  ])
    assert.throws(() => parsePost(bad, 'test-guide.md'));
});
test('draft status is preserved and duplicate headings have unique anchors', () => {
  const draft = parsePost(
    source.replace('status: "published"', 'status: "draft"'),
    'test-guide.md',
  );
  assert.equal(draft.status, 'draft');
  const rendered = renderPost({
    ...draft,
    body: draft.body + '\n## Check\nFirst\n## Check\nSecond',
  });
  assert.ok(rendered.html.includes('id="check-2"'));
});

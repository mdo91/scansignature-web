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

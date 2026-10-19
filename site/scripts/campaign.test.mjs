import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppStoreUrl } from '../lib/campaign.mjs';
import { getPosts } from '../lib/posts.mjs';
test('campaign attribution requires a genuine configured provider and bounded distinct tokens', () => {
  assert.ok(!createAppStoreUrl('', 'guide').includes('ct='));
  assert.throws(() => createAppStoreUrl('not-a-provider', 'guide'));
  const tokens = getPosts().map((p) =>
    new URL(createAppStoreUrl('128835034', `guide-${p.slug}`)).searchParams.get(
      'ct',
    ),
  );
  assert.equal(new Set(tokens).size, tokens.length);
  assert.ok(tokens.every((t) => t.length <= 30));
  assert.equal(
    createAppStoreUrl('128835034', 'same'),
    createAppStoreUrl('128835034', 'same'),
  );
});

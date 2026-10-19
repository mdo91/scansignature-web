import test from 'node:test';
import assert from 'node:assert/strict';
import {
  reportingWindows,
  normalizeRows,
  opportunities,
} from '../lib/growth.mjs';
test('reporting windows have complete buffered 28-day periods across DST', () => {
  const w = reportingWindows(new Date('2026-11-03T02:00:00Z'));
  assert.equal(w.current.endDate, '2026-10-30');
  assert.equal(
    (Date.parse(w.current.endDate) - Date.parse(w.current.startDate)) /
      86400000,
    27,
  );
  assert.equal(
    (Date.parse(w.current.startDate) - Date.parse(w.previous.endDate)) /
      86400000,
    1,
  );
});
test('opportunities aggregate devices, weight position, and exclude brand/unrelated queries', () => {
  const rows = normalizeRows([
    {
      keys: ['sign pdf iphone', 'https://scansignature.app/', 'MOBILE'],
      clicks: 1,
      impressions: 50,
      ctr: 0.02,
      position: 10,
    },
    {
      keys: ['sign pdf iphone', 'https://scansignature.app/', 'DESKTOP'],
      clicks: 0,
      impressions: 50,
      ctr: 0,
      position: 30,
    },
    {
      keys: ['SignDocs', 'https://scansignature.app/', 'MOBILE'],
      clicks: 0,
      impressions: 1000,
      ctr: 0,
      position: 10,
    },
    {
      keys: ['scanner radio', 'https://scansignature.app/', 'MOBILE'],
      clicks: 0,
      impressions: 1000,
      ctr: 0,
      position: 10,
    },
  ]);
  const result = opportunities(rows);
  assert.equal(result.length, 1);
  assert.equal(result[0].impressions, 100);
  assert.equal(result[0].averagePosition, 20);
  assert.equal(result[0].ctr, 0.01);
});
test('empty data stays empty rather than inventing zero-valued rankings', () => {
  assert.deepEqual(normalizeRows(), []);
  assert.deepEqual(opportunities([]), []);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeKeywordResults,
  makeKeywordCache,
  assessKeywordCache,
  parseKeywordCsv,
  matchKeywordDemand,
  keywordCandidates,
} from '../lib/keywords.mjs';
const now = '2026-10-19T12:00:00Z';
const create = (results) =>
  makeKeywordCache({
    results,
    generatedAt: now,
    source: { kind: 'google-ads-api' },
  });
test('API missing estimates remain null, explicit zero remains zero, close variants are grouped', () => {
  const rows = normalizeKeywordResults([
    { text: 'sign pdf iphone', closeVariants: ['sign PDFs on iPhone'] },
    {
      text: 'rare signature',
      keywordMetrics: { avgMonthlySearches: '0', competition: 'UNSPECIFIED' },
    },
  ]);
  assert.equal(rows[0].averageMonthlySearches, null);
  assert.equal(rows[1].averageMonthlySearches, 0);
  assert.equal(rows[1].advertiserCompetition, null);
  const c = assessKeywordCache(
    create([
      {
        text: 'sign pdf iphone',
        closeVariants: ['sign PDFs on iPhone'],
        keywordIdeaMetrics: { avgMonthlySearches: '100' },
      },
    ]),
    new Date(now),
  );
  assert.equal(
    matchKeywordDemand('Sign PDFs on iPhone', c).averageMonthlySearches,
    100,
  );
  assert.equal(
    keywordCandidates(c, [
      { slug: 'existing', primaryQuery: 'sign PDFs on iPhone' },
    ])[0].coveredBy[0],
    'existing',
  );
  assert.equal(matchKeywordDemand('unknown', c), null);
});
test('targeting and observation age are validated, stale CSV imports cannot become fresh by reimporting', () => {
  const c = create([]);
  assert.equal(assessKeywordCache(c, new Date(now)).status, 'ready');
  assert.equal(
    assessKeywordCache(c, new Date('2026-11-18T12:00:00Z')).status,
    'stale',
  );
  assert.equal(
    assessKeywordCache(
      { ...c, targeting: { ...c.targeting, country: 'TR' } },
      new Date(now),
    ).status,
    'invalid',
  );
  assert.equal(
    assessKeywordCache({ ...c, observedAt: '2027-01-01' }, new Date(now))
      .status,
    'invalid',
  );
  const csv = makeKeywordCache({
    results: [],
    generatedAt: now,
    source: { kind: 'keyword-planner-csv', exportedAt: '2026-08-01' },
  });
  assert.equal(assessKeywordCache(csv, new Date(now)).status, 'stale');
});
test('English CSV handles metadata preamble, quoted commas, ranges, missing values and zero', () => {
  const csv = Buffer.from(
    'Keyword Stats 2026\nSeptember 2025 - August 2026\nKeyword,Avg. monthly searches,Competition,Competition (indexed value)\n"scan, sign iphone","1,000",High,50\nsignature scan,1K – 10K,Low,0\nunknown signature,--,Unknown,--\nzero signature,0,,\n',
  );
  const rows = normalizeKeywordResults(parseKeywordCsv(csv));
  assert.equal(rows[0].text, 'scan, sign iphone');
  assert.equal(rows[0].averageMonthlySearches, 1000);
  assert.equal(rows[1].averageMonthlySearches, null);
  assert.deepEqual(rows[1].searchVolumeRange, { min: 1000, max: 10000 });
  assert.equal(rows[2].averageMonthlySearches, null);
  assert.equal(rows[3].averageMonthlySearches, 0);
  const utf16 = Buffer.concat([
    Buffer.from([255, 254]),
    Buffer.from(
      'Keyword\tAvg. monthly searches\r\nsign pdf iphone\t10\r\n',
      'utf16le',
    ),
  ]);
  assert.equal(
    parseKeywordCsv(utf16)[0].keywordIdeaMetrics.avgMonthlySearches,
    10,
  );
});
test('bad exports and conflicting duplicates fail without inventing estimates', () => {
  assert.throws(
    () => parseKeywordCsv(Buffer.from('Keyword,Other\niphone,x')),
    /missing Avg/,
  );
  assert.throws(
    () =>
      parseKeywordCsv(
        Buffer.from('Keyword,Avg. monthly searches\n"unterminated,100'),
      ),
    /Unclosed/,
  );
  assert.throws(
    () =>
      normalizeKeywordResults([
        { text: 'x', keywordMetrics: { avgMonthlySearches: -1 } },
      ]),
    /Invalid/,
  );
  assert.throws(
    () =>
      normalizeKeywordResults([
        { text: 'x', keywordMetrics: { avgMonthlySearches: 1 } },
        { text: 'X', keywordMetrics: { avgMonthlySearches: 2 } },
      ]),
    /Conflicting/,
  );
  const c = create([]);
  assert.equal(
    matchKeywordDemand('x', assessKeywordCache(c, new Date('2026-12-01'))),
    null,
  );
});

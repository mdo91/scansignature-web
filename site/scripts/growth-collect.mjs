import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  reportingWindows,
  normalizeRows,
  opportunities,
} from '../lib/growth.mjs';
const directory = resolve('../.growth');
mkdirSync(directory, { recursive: true, mode: 0o700 });
const windows = reportingWindows();
const gum = process.env.GUM_BINARY || resolve('../.tools/gum');
const profile = process.env.GUM_PROFILE || 'scansignature';
const siteUrl = 'https://scansignature.app/';
function call(op, args) {
  const result = spawnSync(
    gum,
    [
      '--profile',
      profile,
      'read',
      op,
      '--args',
      JSON.stringify(args),
      '--format',
      'raw',
      '--max-items',
      'all',
    ],
    { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024, timeout: 90000 },
  );
  if (result.error || result.status !== 0)
    throw new Error(
      result.error?.message || result.stderr.trim() || 'Gum call failed',
    );
  const value = JSON.parse(result.stdout);
  if (value.error)
    throw new Error(value.error.message || JSON.stringify(value.error));
  return value.data || value;
}
function query(range, dimensions, startRow = 0) {
  return call('searchconsole.searchanalytics.query', {
    siteUrl,
    body: {
      ...range,
      type: 'web',
      dataState: 'final',
      dimensions,
      rowLimit: 25000,
      startRow,
      dimensionFilterGroups: [
        {
          filters: [
            { dimension: 'country', operator: 'equals', expression: 'usa' },
          ],
        },
      ],
    },
  });
}
function collect(range) {
  let rows = [],
    startRow = 0;
  while (true) {
    const response = query(range, ['query', 'page', 'device'], startRow);
    rows.push(...(response.rows || []));
    if ((response.rows || []).length < 25000) break;
    startRow += 25000;
    if (startRow >= 100000)
      throw new Error(
        'Reporting safety limit reached; narrow the query instead of treating partial rows as complete',
      );
  }
  const total = query(range, []).rows?.[0] || null;
  return { ...range, totals: total, rows: normalizeRows(rows) };
}
let report = {
  generatedAt: new Date().toISOString(),
  siteUrl,
  market: 'US',
  windows,
  status: 'unavailable',
  note: 'Search Console may omit anonymized queries and lower-volume rows. Average position is an aggregate, not a fixed rank. Missing data is not zero.',
};
try {
  const fixtureFlag = process.argv.indexOf('--fixture');
  let current, previous;
  if (fixtureFlag >= 0) {
    const fixture = JSON.parse(
      readFileSync(process.argv[fixtureFlag + 1], 'utf8'),
    );
    current = {
      ...windows.current,
      rows: normalizeRows(fixture.current.rows),
      totals: fixture.current.totals ?? null,
    };
    previous = {
      ...windows.previous,
      rows: normalizeRows(fixture.previous.rows),
      totals: fixture.previous.totals ?? null,
    };
    report.fixture = true;
  } else {
    current = collect(windows.current);
    previous = collect(windows.previous);
  }
  const cacheFile = resolve(directory, 'keyword-cache.json');
  const cache = existsSync(cacheFile)
    ? JSON.parse(readFileSync(cacheFile, 'utf8'))
    : null;
  report = {
    ...report,
    status: current.totals ? 'ready' : 'no-data-yet',
    current,
    previous,
    opportunities: opportunities(current.rows),
    keywordPlanner:
      cache && Date.now() - Date.parse(cache.generatedAt) < 30 * 86400000
        ? cache
        : {
            status: 'unavailable',
            note: 'Keyword Planner is optional and needs approved Ads access; never invent volume or competition.',
          },
  };
} catch (error) {
  report = {
    ...report,
    status: 'action-required',
    error: String(error.message),
  };
  process.exitCode = 2;
}
const name = report.fixture ? 'trial-fixture.json' : 'latest.json';
writeFileSync(
  resolve(directory, name),
  JSON.stringify(report, null, 2) + '\n',
  { mode: 0o600 },
);
if (!report.fixture)
  writeFileSync(
    resolve(directory, `report-${report.generatedAt.slice(0, 10)}.json`),
    JSON.stringify(report, null, 2) + '\n',
    { mode: 0o600 },
  );
console.log(
  JSON.stringify(
    {
      status: report.status,
      fixture: !!report.fixture,
      report: resolve(directory, name),
      opportunities: report.opportunities?.length ?? null,
      error: report.error,
    },
    null,
    2,
  ),
);

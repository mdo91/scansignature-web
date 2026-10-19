import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { assessKeywordCache, matchKeywordDemand, keywordCandidates, keywordMarkets } from '../lib/keywords.mjs';
import { getPosts } from '../lib/posts.mjs';
import { reportingWindows, normalizeRows, opportunities } from '../lib/growth.mjs';

const directory = resolve('../.growth');
mkdirSync(directory, { recursive: true, mode: 0o700 });
const windows = reportingWindows();
const gum = process.env.GUM_BINARY || resolve('../.tools/gum');
const profile = process.env.GUM_PROFILE || 'scansignature';
const siteUrl = 'https://scansignature.app/';
function call(op, args) {
  const result = spawnSync(gum, ['--profile', profile, 'read', op, '--args', JSON.stringify(args), '--format', 'raw', '--max-items', 'all'], {
    encoding: 'utf8', maxBuffer: 30 * 1024 * 1024, timeout: 90000,
  });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr.trim() || 'Gum call failed');
  const value = JSON.parse(result.stdout);
  if (value.error) throw new Error(value.error.message || JSON.stringify(value.error));
  return value.data || value;
}
function query(range, dimensions, country, startRow = 0) {
  return call('searchconsole.searchanalytics.query', {
    siteUrl,
    body: {
      ...range, type: 'web', dataState: 'final', dimensions, rowLimit: 25000, startRow,
      dimensionFilterGroups: [{ filters: [{ dimension: 'country', operator: 'equals', expression: country }] }],
    },
  });
}
function collect(range, country) {
  let rows = [];
  let startRow = 0;
  while (true) {
    const response = query(range, ['query', 'page', 'device'], country, startRow);
    rows.push(...(response.rows || []));
    if ((response.rows || []).length < 25000) break;
    startRow += 25000;
    if (startRow >= 100000) throw new Error('Reporting safety limit reached; narrow the query instead of treating partial rows as complete');
  }
  const total = query(range, [], country).rows?.[0] || null;
  return { ...range, totals: total, rows: normalizeRows(rows) };
}
function loadCache(market) {
  const isDefault = market.country === 'US' && market.locale === 'en';
  const cacheName = isDefault ? 'keyword-cache.json' : `keyword-cache-${market.country}-${market.locale}.json`;
  const statusName = isDefault ? 'keyword-status.json' : `keyword-status-${market.country}-${market.locale}.json`;
  let cache;
  try { cache = assessKeywordCache(existsSync(resolve(directory, cacheName)) ? JSON.parse(readFileSync(resolve(directory, cacheName), 'utf8')) : null); }
  catch (error) { cache = { status: 'invalid', note: error.message }; }
  let refreshStatus = null;
  try { if (existsSync(resolve(directory, statusName))) refreshStatus = JSON.parse(readFileSync(resolve(directory, statusName), 'utf8')); } catch {}
  return { ...cache, refreshStatus };
}
function runKeywordCollection(market) {
  return spawnSync(process.execPath, [resolve('scripts/keyword-collect.mjs'), '--country', market.country, '--language', market.locale], {
    encoding: 'utf8', timeout: 600000, maxBuffer: 1024 * 1024,
  });
}

const fixtureFlag = process.argv.indexOf('--fixture');
const report = {
  generatedAt: new Date().toISOString(), siteUrl, windows, status: 'unavailable', markets: {},
  note: 'Search Console may omit anonymized queries and lower-volume rows. Average position is an aggregate, not a fixed rank. Missing data is not zero.',
};
if (fixtureFlag >= 0) report.fixture = true;
try {
  const fixture = fixtureFlag >= 0 ? JSON.parse(readFileSync(process.argv[fixtureFlag + 1], 'utf8')) : null;
  if (fixture) {
    const current = { ...windows.current, rows: normalizeRows(fixture.current.rows), totals: fixture.current.totals ?? null };
    const previous = { ...windows.previous, rows: normalizeRows(fixture.previous.rows), totals: fixture.previous.totals ?? null };
    const market = keywordMarkets[0];
    const keywordPlanner = loadCache(market);
    report.markets.en = {
      locale: 'en', language: 'English', country: 'US', searchConsoleCountry: market.searchConsoleCountry,
      status: current.totals ? 'ready' : 'no-data-yet', current, previous,
      opportunities: opportunities(current.rows, 'en').map((row) => ({ ...row, keywordDemand: matchKeywordDemand(row.query, keywordPlanner) })),
      keywordCandidates: keywordCandidates(keywordPlanner, getPosts({ locale: 'en' })), keywordPlanner,
    };
    for (const item of keywordMarkets.slice(1)) report.markets[item.locale] = { locale: item.locale, country: item.country, status: 'fixture-not-collected', note: 'Fixture mode only includes English sample data.' };
  } else {
    const refreshed = new Map();
    for (const market of keywordMarkets) {
      const result = runKeywordCollection(market);
      refreshed.set(market.locale, result);
    }
    for (const market of keywordMarkets) {
      try {
        const current = collect(windows.current, market.searchConsoleCountry);
        const previous = collect(windows.previous, market.searchConsoleCountry);
        const keywordPlanner = loadCache(market);
        const dataStatus = current.totals ? 'ready' : 'no-data-yet';
        report.markets[market.locale] = {
          locale: market.locale, language: market.locale, country: market.country,
          searchConsoleCountry: market.searchConsoleCountry, status: dataStatus,
          current, previous,
          opportunities: opportunities(current.rows, market.locale).map((row) => ({ ...row, keywordDemand: matchKeywordDemand(row.query, keywordPlanner) })),
          keywordCandidates: keywordCandidates(keywordPlanner, getPosts({ locale: market.locale })),
          keywordPlanner,
          keywordCollectionExit: refreshed.get(market.locale)?.status ?? null,
        };
      } catch (error) {
        report.markets[market.locale] = {
          locale: market.locale, country: market.country, searchConsoleCountry: market.searchConsoleCountry,
          status: 'action-required', error: String(error.message), keywordPlanner: loadCache(market),
        };
      }
    }
  }
  const english = report.markets.en;
  report.marketStatus = Object.fromEntries(Object.entries(report.markets).map(([locale, item]) => [locale, item.status]));
  report.status = Object.values(report.markets).some((item) => item.status === 'ready') ? 'ready' : Object.values(report.markets).some((item) => item.status === 'action-required') ? 'action-required' : 'no-data-yet';
  report.current = english?.current ?? null;
  report.previous = english?.previous ?? null;
  report.opportunities = Object.entries(report.markets).flatMap(([locale, item]) => (item.opportunities || []).map((row) => ({ locale, ...row })));
  report.keywordPlanner = Object.fromEntries(Object.entries(report.markets).map(([locale, item]) => [locale, item.keywordPlanner]));
} catch (error) {
  report.status = 'action-required';
  report.error = String(error.message);
  process.exitCode = 2;
}
const name = report.fixture ? 'trial-fixture.json' : 'latest.json';
writeFileSync(resolve(directory, name), JSON.stringify(report, null, 2) + '\n', { mode: 0o600 });
if (!report.fixture) writeFileSync(resolve(directory, `report-${report.generatedAt.slice(0, 10)}.json`), JSON.stringify(report, null, 2) + '\n', { mode: 0o600 });
console.log(JSON.stringify({ status: report.status, fixture: !!report.fixture, report: resolve(directory, name), markets: report.marketStatus || null, opportunities: report.opportunities?.length ?? null, error: report.error }, null, 2));

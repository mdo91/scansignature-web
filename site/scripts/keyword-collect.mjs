import {
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  renameSync,
  chmodSync,
} from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { getPosts } from '../lib/posts.mjs';
import {
  keywordTargeting,
  makeKeywordCache,
  assessKeywordCache,
  parseKeywordCsv,
  keywordKey,
} from '../lib/keywords.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const directory = resolve(root, '.growth');
const flags = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (['--refresh', '--plan'].includes(key)) flags[key] = true;
  else if (
    [
      '--import-csv',
      '--country',
      '--language',
      '--network',
      '--exported-at',
    ].includes(key)
  ) {
    if (!process.argv[i + 1] || process.argv[i + 1].startsWith('--'))
      throw new Error('Missing value for ' + key);
    flags[key] = process.argv[++i];
  } else throw new Error('Unknown keyword option: ' + key);
}
const seeds = [...new Set(getPosts().map((p) => p.primaryQuery))];
const requestTargeting = {
  geoTargetConstants: keywordTargeting.geoTargetConstants,
  language: keywordTargeting.languageConstant,
  keywordPlanNetwork: keywordTargeting.network,
};
if (flags['--plan']) {
  console.log(
    JSON.stringify(
      {
        operations: [
          'generateKeywordIdeas',
          'generateKeywordHistoricalMetrics',
        ],
        targeting: keywordTargeting,
        seeds,
        profile: 'scansignature-keywords',
        cacheDays: 30,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}
mkdirSync(directory, { recursive: true, mode: 0o700 });
chmodSync(directory, 0o700);
function save(name, value) {
  const target = resolve(directory, name),
    temp = target + '.tmp-' + process.pid;
  writeFileSync(temp, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  chmodSync(temp, 0o600);
  renameSync(temp, target);
}
function finish(status, extra = {}) {
  const result = { checkedAt: new Date().toISOString(), status, ...extra };
  save('keyword-status.json', result);
  console.log(JSON.stringify(result, null, 2));
}
function cached() {
  try {
    return assessKeywordCache(
      JSON.parse(
        readFileSync(resolve(directory, 'keyword-cache.json'), 'utf8'),
      ),
    );
  } catch (error) {
    return { status: 'invalid', note: error.message };
  }
}
try {
  const now = new Date().toISOString();
  if (flags['--import-csv']) {
    if (
      flags['--country'] !== 'US' ||
      flags['--language'] !== 'en' ||
      flags['--network'] !== 'GOOGLE_SEARCH' ||
      !flags['--exported-at']
    )
      throw new Error(
        'CSV imports require explicit --country US --language en --network GOOGLE_SEARCH --exported-at <ISO date/time>. Check the export targeting first.',
      );
    const bytes = readFileSync(resolve(flags['--import-csv']));
    const results = parseKeywordCsv(bytes);
    if (!results.length) throw new Error('CSV contains no keyword rows');
    const cache = makeKeywordCache({
      results,
      generatedAt: now,
      source: {
        kind: 'keyword-planner-csv',
        exportedAt: flags['--exported-at'],
        targetingEvidence:
          'Operator explicitly confirmed the export targeting; CSV headers alone cannot prove geography or language.',
      },
    });
    if (assessKeywordCache(cache).status !== 'ready')
      throw new Error('CSV export must be newer than 30 days');
    const rawName = 'keyword-raw-' + now.replace(/[:.]/g, '-') + '.csv';
    writeFileSync(resolve(directory, rawName), bytes, { mode: 0o600 });
    cache.source.rawFile = rawName;
    save('keyword-cache.json', cache);
    finish('ready', {
      source: 'keyword-planner-csv',
      keywords: cache.keywords.length,
      observedAt: cache.observedAt,
    });
  } else {
    const previous = cached();
    if (previous.status === 'ready' && !flags['--refresh']) {
      finish('ready', {
        source: previous.source.kind,
        keywords: previous.keywords.length,
        observedAt: previous.observedAt,
        reusedCache: true,
      });
      process.exit(0);
    }
    const settingsFile = resolve(directory, 'keyword-settings.json');
    if (!existsSync(settingsFile)) {
      finish('setup-required', {
        note: 'Google Ads API Basic access and a separate OAuth profile must be configured. CSV import is available.',
        cacheStatus: previous.status,
      });
      process.exit(0);
    }
    const settings = JSON.parse(readFileSync(settingsFile, 'utf8'));
    if (settings.accessStatus !== 'ready' && !flags['--refresh']) {
      finish('pending-approval', {
        note: 'Google Ads API Basic access is pending. Use a targeted CSV export in the meantime.',
        cacheStatus: previous.status,
      });
      process.exit(0);
    }
    if (!/^\d{10}$/.test(settings.customerId))
      throw new Error('Google Ads client customer ID must have 10 digits');
    if (settings.loginCustomerId && !/^\d{10}$/.test(settings.loginCustomerId))
      throw new Error('Invalid manager customer ID');
    const gum = resolve(root, '.tools/gum-keywords');
    if (!existsSync(gum))
      throw new Error(
        'Build the isolated keyword Gum binary with scripts/gum/build-keyword-gum.sh',
      );
    const raw = [];
    const allowed = new Set([
      'generateKeywordIdeas',
      'generateKeywordHistoricalMetrics',
    ]);
    function call(method, args) {
      if (!allowed.has(method))
        throw new Error('Only keyword research operations are allowed');
      const request = {
        customerId: settings.customerId,
        ...(settings.loginCustomerId
          ? { loginCustomerId: settings.loginCustomerId }
          : {}),
        ...requestTargeting,
        ...args,
      };
      const result = spawnSync(
        gum,
        [
          '--profile',
          'scansignature-keywords',
          'read',
          'googleads.keywordPlanIdeas.' + method,
          '--args',
          JSON.stringify(request),
          '--format',
          'raw',
          '--max-items',
          'all',
        ],
        { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 90000 },
      );
      if (result.error || result.status !== 0)
        throw new Error(
          result.error?.message ||
            result.stderr.trim() ||
            'Keyword request failed',
        );
      const value = JSON.parse(result.stdout),
        data = value.data || value;
      if (data.error)
        throw new Error(
          data.error.message || 'Google Ads rejected keyword research',
        );
      raw.push({ method, request, response: data });
      return data;
    }
    const byText = new Map();
    for (let i = 0; i < seeds.length; i += 20) {
      const batch = seeds.slice(i, i + 20);
      let pageToken;
      const seen = new Set();
      do {
        const response = call('generateKeywordIdeas', {
          keywords: batch,
          url: 'https://scansignature.app/blog/',
          pageSize: 10000,
          ...(pageToken ? { pageToken } : {}),
        });
        for (const row of response.results || [])
          byText.set(keywordKey(row.text), row);
        pageToken = response.nextPageToken;
        if (pageToken && (seen.has(pageToken) || seen.size >= 20))
          throw new Error(
            'Incomplete keyword pagination; previous cache retained',
          );
        if (pageToken) seen.add(pageToken);
      } while (pageToken);
      const historical = call('generateKeywordHistoricalMetrics', {
        keywords: batch,
      });
      for (const row of historical.results || [])
        byText.set(keywordKey(row.text), row);
    }
    if (!byText.size)
      throw new Error(
        'Google returned no keyword estimates; missing demand is not zero',
      );
    const rawName = 'keyword-raw-' + now.replace(/[:.]/g, '-') + '.json';
    save(rawName, {
      generatedAt: now,
      targeting: keywordTargeting,
      calls: raw,
    });
    const cache = makeKeywordCache({
      results: [...byText.values()],
      generatedAt: now,
      source: {
        kind: 'google-ads-api',
        customerId: settings.customerId,
        rawFile: rawName,
      },
    });
    save('keyword-cache.json', cache);
    finish('ready', {
      source: 'google-ads-api',
      keywords: cache.keywords.length,
      observedAt: cache.observedAt,
    });
  }
} catch (error) {
  const message = String(error.message)
    .replace(/GOCSPX-[A-Za-z0-9_-]+/g, '[redacted]')
    .replace(/Bearer\s+\S+/g, 'Bearer [redacted]');
  finish('action-required', { note: message, previousCacheRetained: true });
  process.exitCode = 2;
}

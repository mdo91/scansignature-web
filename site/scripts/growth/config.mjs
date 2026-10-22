import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const config = JSON.parse(readFileSync(resolve(root, 'growth.config.json'), 'utf8'));
if (config.siteUrl !== 'https://scansignature.app/' || config.profiles.searchConsole !== 'scansignature' || config.profiles.keywords !== 'scansignature-keywords') throw new Error('Unexpected Signature Scan property/profile configuration');
export const markets = Object.freeze(config.markets);
export function marketFor(locale) {
  const market = markets.find((entry) => entry.locale === locale);
  if (!market) throw new Error('Unsupported locale: ' + locale);
  return market;
}
export function keywordTargetingFor(locale) {
  const market = marketFor(locale);
  return {
    geography: market.country==='WORLDWIDE'?'WORLDWIDE':market.country, country:market.country, language: locale, googleLanguageCode: market.googleLanguageCode,
    network: 'GOOGLE_SEARCH', geoTargetConstants: market.geoTargetId?[`geoTargetConstants/${market.geoTargetId}`]:[], languageConstant: `languageConstants/${market.languageId}`,
  };
}
export function keywordPlan(locale) {
  const market = marketFor(locale);
  return { locale, seedFingerprint: createHash('sha256').update(JSON.stringify({locale, seeds: market.seeds})).digest('hex'), operations: ['generateKeywordIdeas', 'generateKeywordHistoricalMetrics'], targeting: keywordTargetingFor(locale), seeds: market.seeds, seedUrl: new URL(`${market.locale === 'en' ? '' : market.locale + '/'}blog/`, config.siteUrl).href, profile: config.profiles.keywords, cacheDays: config.keywordCacheDays };
}

export const cacheName = locale => {const m=marketFor(locale);return locale==='en'?'keyword-cache.json':`keyword-cache-${m.country}-${locale}.json`;};

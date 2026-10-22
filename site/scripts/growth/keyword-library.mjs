import {makeKeywordCache as make,assessKeywordCache as assess} from '../../lib/keywords.mjs';
import {keywordPlan} from './config.mjs';
export {normalizeKeywordResults,parseKeywordCsv,keywordKey,matchKeywordDemand} from '../../lib/keywords.mjs';
export function makeKeywordCache(options){const cache=make(options);return {...cache,seedFingerprint:options.source.kind==='google-ads-api'?keywordPlan(cache.targeting.language).seedFingerprint:null};}
export const assessKeywordCache=assess;

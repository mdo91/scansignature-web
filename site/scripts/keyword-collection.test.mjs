import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {collectKeywords,loadKeywordCache} from './growth/keywords.mjs';
import {keywordPlan,cacheName,markets} from './growth/config.mjs';
import {savePrivate,readPrivate} from './growth/storage.mjs';
import {makeKeywordCache,mergeKeywordApiRows,normalizeKeywordResults,keywordNormalizationVersion} from '../lib/keywords.mjs';
import {rankKeywords,keywordDemand} from '../lib/intent.mjs';

const now=new Date('2026-10-24T11:00:00Z'),settings={customerId:'1234567890',accessStatus:'ready'};
function directory(t){const value=mkdtempSync(resolve(tmpdir(),'signature-keyword-test-'));t.after(()=>rmSync(value,{recursive:true,force:true}));return value;}
test('historical metrics survive an empty idea object and empty later pages cannot erase data',()=>{
 const idea={text:'sign pdf',keywordIdeaMetrics:{avgMonthlySearches:'100',monthlySearchVolumes:[{year:'2026',month:'SEPTEMBER',monthlySearches:'120'}]}};
 const combined=mergeKeywordApiRows(mergeKeywordApiRows(idea,{text:'sign pdf',keywordIdeaMetrics:{avgMonthlySearches:null,monthlySearchVolumes:[]}}),{text:'sign pdf',keywordMetrics:{avgMonthlySearches:'200'}});
 assert.equal(normalizeKeywordResults([combined])[0].averageMonthlySearches,200);
 assert.equal(normalizeKeywordResults([{text:'sign pdf',keywordIdeaMetrics:{},keywordMetrics:{avgMonthlySearches:'300'}}])[0].averageMonthlySearches,300);
 assert.equal(normalizeKeywordResults([{...combined,keywordMetrics:{avgMonthlySearches:'0'}}])[0].averageMonthlySearches,0);
 assert.equal(normalizeKeywordResults([mergeKeywordApiRows(idea,{text:'sign pdf',keywordMetrics:{}})])[0].averageMonthlySearches,100);
 assert.equal(normalizeKeywordResults([{text:'rare pdf',keywordIdeaMetrics:null,keywordMetrics:null}])[0].averageMonthlySearches,null);
});
test('a real-shaped two-endpoint response is normalized, audited privately, then reused monthly',async t=>{
 const dir=directory(t),plan=keywordPlan('en'),query=plan.seeds[0],calls=[];
 const call=async(operation,args)=>{calls.push({operation,args});return {results:[{text:query,...(operation.endsWith('generateKeywordIdeas')?{keywordIdeaMetrics:{}}:{keywordMetrics:{avgMonthlySearches:'100',monthlySearchVolumes:[{year:'2026',month:'SEPTEMBER',monthlySearches:'130'}]}})}]};};
 const result=await collectKeywords('en',{directory:dir,now,settings,call});
 assert.equal(result.status,'ready');assert.equal(calls.length,2*Math.ceil(plan.seeds.length/20));assert.equal(result.demandSummary.positiveEstimates,1);
 const cache=loadKeywordCache('en',now,dir);assert.equal(cache.keywords[0].averageMonthlySearches,100);assert.equal(cache.normalizationVersion,keywordNormalizationVersion);
 const audit=readPrivate('keyword-api-audit-en.json',dir);assert.equal(audit.responses.length,calls.length);assert.equal(audit.responses.find(row=>row.operation==='generateKeywordHistoricalMetrics').seedResults[0].keywordMetrics.avgMonthlySearches,'100');assert.ok(!JSON.stringify(audit).includes(settings.customerId));
 const cached=await collectKeywords('en',{directory:dir,now,settings,call:()=>{throw Error('Fresh monthly cache must not call Google');}});
 assert.equal(cached.reusedCache,true);assert.deepEqual(cached.demandSummary,result.demandSummary);
});
test('legacy API normalization triggers one refresh, while authentic CSV age and wrong-market isolation remain enforced',async t=>{
 const dir=directory(t),plan=keywordPlan('en');
 const cache=makeKeywordCache({results:[{text:plan.seeds[0],keywordMetrics:{avgMonthlySearches:'10'}}],source:{kind:'google-ads-api'},targeting:plan.targeting,generatedAt:now.toISOString()});
 const legacy={...cache,normalizationVersion:1,seedFingerprint:plan.seedFingerprint};savePrivate(cacheName('en'),legacy,dir);
 assert.equal(loadKeywordCache('en',now,dir).status,'refresh-required');let calls=0;
 await collectKeywords('en',{directory:dir,now,settings,call:async()=>{calls++;return {results:[{text:plan.seeds[0],keywordMetrics:{avgMonthlySearches:'20'}}]};}});assert.equal(calls,2*Math.ceil(plan.seeds.length/20));
 const csv={...cache,normalizationVersion:undefined,source:{kind:'keyword-planner-csv',exportedAt:'2026-10-20'},observedAt:'2026-10-20'};savePrivate(cacheName('en'),csv,dir);
 assert.equal((await collectKeywords('en',{directory:dir,now,call:()=>{throw Error('Do not replace an authentic fresh CSV');}})).reusedCache,true);
 const wrong=makeKeywordCache({results:[],source:{kind:'keyword-planner-csv',exportedAt:'2026-10-20'},targeting:keywordPlan('tr').targeting,generatedAt:now.toISOString()});savePrivate(cacheName('en'),wrong,dir);
 assert.equal(loadKeywordCache('en',now,dir).status,'invalid');
});
test('all eleven targets preserve unavailable metrics and a failed refresh retains the exact prior cache',async t=>{
 const dir=directory(t);
 for(const market of markets){
  const plan=keywordPlan(market.locale),calls=[];
  const result=await collectKeywords(market.locale,{directory:dir,now,settings,call:async(operation,args)=>{calls.push(args);return operation.endsWith('generateKeywordIdeas')?{}:{results:[{text:plan.seeds[0],keywordMetrics:{}}]};}});
  assert.equal(result.status,'ready');assert.equal(result.demandSummary.unavailable,1);assert.equal(result.demandSummary.reportedZero,0);
  for(const args of calls){assert.equal(args.language,plan.targeting.languageConstant);assert.deepEqual(args.geoTargetConstants,plan.targeting.geoTargetConstants);assert.equal(args.keywordPlanNetwork,'GOOGLE_SEARCH');}
 }
 const before=readFileSync(resolve(dir,cacheName('en')),'utf8');
 assert.equal((await collectKeywords('en',{directory:dir,now,settings,refresh:true,call:async()=>{throw Error('fixture: API unavailable');}})).status,'action-required');
 assert.equal(readFileSync(resolve(dir,cacheName('en')),'utf8'),before);
});
test('verified demand precedes device bonuses and uncovered unknowns after unsupported intents are excluded',()=>{
 const rows=[...Array.from({length:40},(_,i)=>({text:`scan document iphone ${i}`,averageMonthlySearches:null})),{text:'sign pdf',averageMonthlySearches:100},{text:'youtube mp3',averageMonthlySearches:1000000}];
 const ranked=rankKeywords(rows,'en',{limit:1,coverage:[{path:'site/content/blog/sign-pdf.md',primaryQuery:'sign pdf'}]});
 assert.equal(ranked.keywords[0].text,'sign pdf');assert.equal(ranked.excluded['media-task'],1);
 assert.deepEqual(keywordDemand({averageMonthlySearches:null}),{status:'unavailable',verified:false,tier:0});
 assert.equal(keywordDemand({averageMonthlySearches:0}).status,'reported-zero');
 assert.equal(keywordDemand({searchVolumeRange:{min:100,max:1000}}).verified,true);
 assert.equal(keywordDemand({searchVolumeRange:{min:0,max:9}}).verified,false);
 const variants=rankKeywords([{text:'scan document iphone app',averageMonthlySearches:null,closeVariants:['scan document']},{text:'scan document',averageMonthlySearches:100}],'en');
 assert.equal(variants.keywords[0].text,'scan document');assert.equal(variants.keywords[0].averageMonthlySearches,100);
});

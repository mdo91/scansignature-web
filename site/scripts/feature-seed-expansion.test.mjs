import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {config,markets,keywordPlan,keywordTargetingFor} from './growth/config.mjs';
import {classifyKeyword,keywordKey} from '../lib/intent.mjs';

// The expansion appends research inputs rather than replacing previously
// approved queries, changing targets, or changing unrelated configuration.
const originalPrefixes={
 en:{count:26,sha256:'5a4d335a6ab82444049e9ea721ac272aab4f4ada1f9c13dd6694db4a08f913c3'},
 tr:{count:25,sha256:'9bb280323260b04af0cc698da6193ba1b681a988beb031c24972bb9a3e575eee'},
 de:{count:25,sha256:'71a44ca73a279f3a56d9a14f4b0e75d9511eb90edb9405c1a1ad8d05f300e3c9'},
 es:{count:25,sha256:'b173a00dc654afcaa9d246b11a09f622266f4ad224a1a5d5632ee0e46b311878'},
 fr:{count:25,sha256:'3b3f13a514dc3110e27eb0d68dd9e23bc53529aa1a3f027fc540424f67d6c66a'},
 ja:{count:25,sha256:'03cf6d8a544aca0dd1917eebdaf54487f0945ee3da12d0a98f0c090abc94fb50'},
 ko:{count:25,sha256:'440fa94c7db3204838fb483db1d107454f219102f877c0d96feff2086a551bb6'},
 ms:{count:26,sha256:'3eef85db89de97e47ede08020d94d57a4769fb0c5b519002d1675161d5e571c0'},
 pt:{count:25,sha256:'1289dd94b31f701ead4552a248bacb479f5cda5c01e7126be666a6bfa485b8ec'},
 ru:{count:25,sha256:'88f1a1b41c3be17940375700d5cec7458336a07b8095568ce054f79c03f4d08f'},
 'zh-hans':{count:25,sha256:'8e0103154b29f39bfdfad08a5c7ecdf21b7182c05e51036a384557463da3009e'},
};
const originalNonSeedHash='620428ff4182d6ae09868a235ea18420116633cebab4be5236fcd42270872137';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const withoutSeeds=value=>({...value,markets:value.markets.map(({seeds,...target})=>target)});
const additions=market=>market.seeds.slice(originalPrefixes[market.locale].count);

test('feature research adds twelve queries per locale and retains all earlier inputs',()=>{
 assert.equal(markets.length,11);
 assert.equal(hash(withoutSeeds(config)),originalNonSeedHash,'Non-seed settings or targeting changed');
 let count=0;
 for(const market of markets){
  const prior=originalPrefixes[market.locale],added=additions(market),plan=keywordPlan(market.locale);
  assert.ok(prior,market.locale);
  assert.equal(hash(market.seeds.slice(0,prior.count)),prior.sha256,market.locale+': original seeds changed');
  assert.equal(added.length,12,market.locale+': twelve additions');
  assert.equal(new Set(market.seeds.map(keywordKey)).size,market.seeds.length,market.locale+': normalized duplicate');
  assert.ok(added.every(query=>typeof query==='string'&&query.trim()===query&&/pdf/i.test(query)),market.locale+': document-specific queries');
  for(const query of added){
   assert.ok([...query].length<=80,market.locale+': at most 80 Unicode characters: '+query);
   assert.ok(query.split(/\s+/u).length<=10,market.locale+': at most ten words: '+query);
  }
  assert.equal(Math.ceil(plan.seeds.length/20),2,market.locale+': two request batches');
  count+=added.length;
 }
 assert.equal(count,132);
});

test('four country targets and seven worldwide targets retain matching language and Google Search',()=>{
 const countries={en:['US','2840'],tr:['TR','2792'],de:['DE','2276'],es:['ES','2724']};
 const languages={en:'1000',tr:'1037',de:'1001',es:'1003',fr:'1002',ja:'1005',ko:'1012',ms:'1102',pt:'1014',ru:'1031','zh-hans':'1017'};
 for(const market of markets){
  const target=keywordTargetingFor(market.locale),country=countries[market.locale];
  assert.equal(target.language,market.locale);assert.equal(target.network,'GOOGLE_SEARCH');
  assert.equal(target.languageConstant,'languageConstants/'+languages[market.locale]);
  assert.equal(target.geography,country?country[0]:'WORLDWIDE');
  assert.deepEqual(target.geoTargetConstants,country?['geoTargetConstants/'+country[1]]:[]);
 }
 assert.equal(markets.filter(market=>market.country==='WORLDWIDE').length,7);
});

test('native-language additions require the appropriate released form, placement and template tasks',()=>{
 for(const market of markets){
  const added=additions(market),classified=added.map(query=>classifyKeyword(query,market.locale));
  classified.forEach((intent,index)=>assert.equal(intent.eligible,true,market.locale+': '+added[index]));
  for(const [index,expected]of [[0,'native-form-filling'],[1,'native-form-filling'],[2,'native-form-filling'],[3,'native-form-filling'],[4,'manual-text-checkmarks'],[5,'manual-text-checkmarks'],[7,'multiple-placements'],[8,'reusable-templates'],[9,'reusable-templates'],[10,'multiple-placements']]){
   assert.ok(classified[index].requiredFeatures?.includes(expected),market.locale+': '+added[index]+' requires '+expected);
  }
  // Diagnosing a non-writable PDF and restarting from the unchanged original
  // after an incorrect flattened export are distinct, supported decision paths.
  // The queries do not promise unlocking fields or editing flattened page text.
  for(const index of [6,11])assert.ok(['native-form-filling','manual-text-checkmarks','document-sharing'].includes(classified[index].feature),market.locale+': supported recovery path');
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {markets,keywordPlan} from './growth/config.mjs';
import {classifyKeyword,rankKeywords} from '../lib/intent.mjs';
import {readFileSync} from 'node:fs';
const facts=JSON.parse(readFileSync(new URL('../lib/product-facts.json',import.meta.url),'utf8'));
test('released feature seeds remain local and cover all four new workflows in every target',()=>{
 for(const market of markets){
  const plan=keywordPlan(market.locale),features=new Set(plan.seeds.map(seed=>classifyKeyword(seed,market.locale).feature));
  for(const feature of ['native-form-filling','manual-text-checkmarks','multiple-placements','reusable-templates'])assert.ok(features.has(feature),market.locale+': '+feature);
  assert.equal(plan.targeting.network,'GOOGLE_SEARCH');
  assert.equal(plan.targeting.language,market.locale);
 }
 assert.equal(facts.version,'1.1.0');assert.equal(facts.supportedFeatures.length,9);
});
test('new release never makes unsupported editing, engines, OCR or certificate tasks eligible',()=>{
 for(const query of ['edit existing PDF text','fill XFA PDF form','PDF JavaScript form','automatic form field detection PDF','OCR PDF form','certificate signing PDF form'])assert.equal(classifyKeyword(query,'en').eligible,false,query);
 const result=rankKeywords([{text:'fill PDF form',averageMonthlySearches:100},{text:'fill PDF form on iPhone',averageMonthlySearches:null}],'en');
 assert.equal(result.keywords[0].text,'fill PDF form');
 assert.equal(result.keywords[1].averageMonthlySearches,null);
});

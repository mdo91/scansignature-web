import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {locales,localeInfo} from '../lib/locale-registry.mjs';
import {getPosts,postAlternates,relatedPosts,contentUnits,parsePost} from '../lib/posts.mjs';
import {marketFilters,localePageFilter} from './growth/library.mjs';
import {keywordPlan} from './growth/config.mjs';
import {collectPeriod,collectGrowth} from './growth/collect.mjs';
import {makeKeywordCache} from './growth/keyword-library.mjs';
import {savePrivate} from './growth/storage.mjs';
import {classifyKeyword,rankKeywords} from '../lib/intent.mjs';

test('all eleven locales have six complete launch translations and original groups',()=>{
 const english=getPosts();assert(english.length>=6);const initial=['scan-handwritten-signature-iphone','remove-background-scanned-signature','scan-multiple-pages-one-pdf-iphone','sign-pdf-iphone-without-printing','save-share-signed-pdf-iphone','sign-pdf-offline-iphone'];
 for(const locale of locales){const posts=getPosts({locale});assert(posts.length>=6);for(const post of posts){assert(contentUnits(post.body)>=250);assert.equal(post.locale,locale);if(initial.includes(post.slug))assert.equal(Object.keys(postAlternates(post)).length,12);else assert(Object.keys(postAlternates(post)).includes(localeInfo[locale].hreflang));assert(relatedPosts(post,locale).length);}}
});
test('CJK body validation and reading estimates do not require spaces',()=>{
 for(const locale of ['ja','zh-hans'])for(const post of getPosts({locale}))assert(post.readingMinutes>=1&&contentUnits(post.body)>250);
 const source=readFileSync('content/blog/scan-handwritten-signature-iphone.md','utf8');
 assert.throws(()=>parsePost(source.replace(/---\n[\s\S]*?---\n([\s\S]*)$/,(whole,body)=>whole.slice(0,-body.length)+'短い。'),'tiny.md'));
});
test('an independent localized question has no invented alternates and creates reciprocal related navigation',()=>{
 const directory='content/blog/fr',file=resolve(directory,'fixture-independent-question.md');
 const source=readFileSync(resolve(directory,'sign-pdf-iphone-without-printing.md'),'utf8').replace('translationKey: "sign-pdf-iphone-without-printing"','translationKey: "fixture-independent-question"');
 try{writeFileSync(file,source,{flag:'wx'});const post=getPosts({locale:'fr'}).find(p=>p.slug==='fixture-independent-question');assert.deepEqual(Object.keys(postAlternates(post)),['fr']);assert(relatedPosts(getPosts({locale:'fr'}).find(p=>p.slug==='scan-handwritten-signature-iphone'),'fr').some(p=>p.slug===post.slug));}
 finally{rmSync(file,{force:true});}
});
test('rows and totals share locale and country filters; global languages never inherit US targeting',async()=>{
 for(const locale of locales){const requests=[];await collectPeriod(locale,{startDate:'2026-09-01',endDate:'2026-09-28'},async(op,args)=>{requests.push(args.body);return {rows:[]};});assert.equal(requests.length,2);assert.deepEqual(requests[0].dimensionFilterGroups,requests[1].dimensionFilterGroups);assert.deepEqual(requests[0].dimensionFilterGroups[0].filters,marketFilters(locale));const target=keywordPlan(locale).targeting;if(['en','tr','de','es'].includes(locale))assert.equal(target.geoTargetConstants.length,1);else assert.deepEqual(target.geoTargetConstants,[]);assert.equal(target.language,locale);assert.equal(target.network,'GOOGLE_SEARCH');}
 const filter=localePageFilter('en');assert.equal(filter.operator,'excludingRegex');const regex=new RegExp(filter.expression);for(const locale of locales.filter(l=>l!=='en'))assert(regex.test(`https://scansignature.app/${locale}/blog/test/`));assert(!regex.test('https://scansignature.app/blog/test/'));
});
test('a missing market never hides another market or fabricates suppressed totals',async()=>{
 const directory=mkdtempSync(resolve(tmpdir(),'signature-collection-'));
 try{const report=await collectGrowth({directory,now:new Date('2026-10-22T08:00:00Z'),call:async(op,args)=>{if(args.body.dimensionFilterGroups[0].filters.some(f=>f.expression==='tur'))throw Error('fixture unavailable');return {rows:[]};},refreshKeywords:async()=>({status:'pending-approval'})});assert.equal(report.markets.tr.status,'action-required');assert.equal(report.markets.en.status,'no-data-yet');assert.equal(report.markets.en.current.totals,null);assert.equal(report.markets.fr.current.totals,null);assert.equal(Object.keys(report.markets).length,11);}
 finally{rmSync(directory,{recursive:true,force:true});}
});
test('fresh observations keep unavailable demand distinct from zero; classification precedes truncation',()=>{
 const rows=Array.from({length:30},(_,i)=>({text:`youtube mp3 ${i}`,averageMonthlySearches:1e6}));rows.push({text:'sign pdf iphone app',averageMonthlySearches:null});const ranked=rankKeywords(rows,'en');assert.equal(ranked.considered,31);assert.equal(ranked.keywords.length,1);assert.equal(ranked.keywords[0].averageMonthlySearches,null);
 assert(classifyKeyword('scan multiple pages into one pdf iphone','en').eligible);assert(!classifyKeyword('merge existing pdf files iphone','en').eligible);assert(classifyKeyword('remove paper background signature iphone','en').eligible);assert(!classifyKeyword('export signature png iphone','en').eligible);assert(classifyKeyword('digital signature pdf iphone','en').eligible);assert(!classifyKeyword('certificate digital signature pdf iphone','en').eligible);
});

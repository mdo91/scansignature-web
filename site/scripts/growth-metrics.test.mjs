import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRow,comparison} from './growth/library.mjs';

test('zero-impression aggregates preserve reported counts without inventing rates or positions',()=>{
 const totals=normalizeRow({clicks:0,impressions:0,ctr:0,position:0},[]);
 assert.deepEqual(totals,{clicks:0,impressions:0,ctr:null,averagePosition:null});
 const change=comparison(totals,normalizeRow({clicks:1,impressions:20,ctr:.05,position:8},[]));
 assert.deepEqual(change.clicks,{current:0,previous:1,change:-1});
 assert.deepEqual(change.ctr,{current:null,previous:.05,change:null});
 assert.deepEqual(change.averagePosition,{current:null,previous:8,change:null});
});

test('missing metrics remain unavailable while observed zero clicks and CTR remain zero',()=>{
 assert.deepEqual(normalizeRow({},[]),{clicks:null,impressions:null,ctr:null,averagePosition:null});
 assert.deepEqual(normalizeRow({ctr:0,position:0},[]),{clicks:null,impressions:null,ctr:null,averagePosition:null});
 assert.deepEqual(normalizeRow({clicks:0,impressions:25,ctr:0,position:3.5},[]),{clicks:0,impressions:25,ctr:0,averagePosition:3.5});
});

test('invalid positions cannot create artificial ranking improvements',()=>{
 for(const position of [0,-1,NaN,Infinity,'3',undefined]){
  const row=normalizeRow({keys:['sign pdf iphone','https://scansignature.app/','MOBILE','usa'],clicks:0,impressions:25,ctr:0,position});
  assert.equal(row.averagePosition,null);
  assert.equal(row.query,'sign pdf iphone');
  assert.equal(row.device,'MOBILE');
 }
});

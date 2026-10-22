import {config,marketFor} from './config.mjs';
import {locales} from '../../lib/locale-registry.mjs';
import {classifyKeyword} from '../../lib/intent.mjs';
export {reportingWindows} from '../../lib/growth.mjs';
export function localePageFilter(locale){
 if(!locales.includes(locale))throw Error('Unsupported locale');
 const prefix=config.siteUrl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 return locale==='en'?{dimension:'page',operator:'excludingRegex',expression:`^${prefix}(?:${locales.filter(l=>l!=='en').join('|')})(?:/|$)`}:{dimension:'page',operator:'includingRegex',expression:`^${prefix}${locale}/`};
}
export function marketFilters(locale){const market=marketFor(locale);return [localePageFilter(locale),...(market.searchConsoleCountry?[{dimension:'country',operator:'equals',expression:market.searchConsoleCountry}]:[])];}
export function normalizeRow(row,dimensions=['query','page','device','country']){
 const metrics=Object.fromEntries(['clicks','impressions','ctr'].map(key=>[key,typeof row[key]==='number'&&Number.isFinite(row[key])?row[key]:null]));
 return {...Object.fromEntries(dimensions.map((key,i)=>[key,row.keys?.[i]||''])),...metrics,averagePosition:typeof row.position==='number'?row.position:null};
}
export function comparison(current,previous){return Object.fromEntries(['clicks','impressions','ctr','averagePosition'].map(key=>[key,current?.[key]!=null&&previous?.[key]!=null?{current:current[key],previous:previous[key],change:current[key]-previous[key]}:{current:current?.[key]??null,previous:previous?.[key]??null,change:null}]));}
export function opportunities(rows,locale){
 const groups=new Map();
 for(const row of rows){if(!classifyKeyword(row.query,locale).eligible||/signdocs|signature scan|scansignature|damas technologies/i.test(row.query)||row.impressions==null||row.clicks==null||row.averagePosition==null)continue;const key=JSON.stringify([row.query,row.page]),g=groups.get(key)||{query:row.query,page:row.page,clicks:0,impressions:0,weighted:0};g.clicks+=row.clicks;g.impressions+=row.impressions;g.weighted+=row.averagePosition*row.impressions;groups.set(key,g);}
 return [...groups.values()].filter(g=>g.impressions>0).map(({weighted,...g})=>({...g,ctr:g.clicks/g.impressions,averagePosition:weighted/g.impressions})).filter(g=>g.impressions>=20&&g.averagePosition>=4&&g.averagePosition<=50&&g.ctr<.05).map(g=>({...g,priority:g.impressions*(1-g.ctr)/Math.sqrt(g.averagePosition)})).sort((a,b)=>b.priority-a.priority);
}

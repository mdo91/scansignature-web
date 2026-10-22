import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {getPosts,postAlternates} from '../lib/posts.mjs';
import {locales,localeInfo,localePath} from '../lib/locale-registry.mjs';
const origin='https://scansignature.app',output=resolve('dist/client');
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const common=route=>Object.fromEntries([...locales.map(locale=>[localeInfo[locale].hreflang,localePath(locale,route)]),['x-default',route]]);
const pages=[{path:'/privacy/'},{path:'/terms/'},...locales.flatMap(locale=>[
 {path:localePath(locale,'/'),alternates:common('/')},
 {path:localePath(locale,'/blog/'),alternates:common('/blog/')},
 ...getPosts({locale}).map(post=>({path:localePath(locale,`/blog/${post.slug}/`),updated:post.updatedAt,alternates:postAlternates(post)}))
])];
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pages.map(page=>`<url><loc>${escape(origin+page.path)}</loc>${page.updated?`<lastmod>${page.updated}</lastmod>`:''}${Object.entries(page.alternates||{}).map(([language,route])=>`<xhtml:link rel="alternate" hreflang="${language}" href="${escape(origin+route)}" />`).join('')}</url>`).join('')}</urlset>\n`;
writeFileSync(resolve(output,'sitemap.xml'),xml);
writeFileSync(resolve(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Generated sitemap for ${pages.length} published public pages.`);

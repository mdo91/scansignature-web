import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { load } from 'cheerio';
import { getPosts } from '../lib/posts.mjs';
const locales = ['en', 'tr', 'de', 'es'];
const localeInfo = { en: { hreflang: 'en-US' }, tr: { hreflang: 'tr-TR' }, de: { hreflang: 'de-DE' }, es: { hreflang: 'es-ES' } };
const localePath = (locale, path) => locale === 'en' ? path : `/${locale}${path}`;

const output = resolve('dist/client');
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const origin = 'https://scansignature.app';
const basePosts = getPosts({ locale: 'en' });
const routes = [
  { path: '/privacy/', locale: 'en', indexable: true },
  { path: '/terms/', locale: 'en', indexable: true },
  ...locales.flatMap((locale) => [
    { path: localePath(locale, '/'), locale, group: '/', indexable: true },
    { path: localePath(locale, '/blog/'), locale, group: '/blog/', indexable: true, blog: true },
    ...getPosts({ locale }).map((post) => ({
      path: localePath(locale, `/blog/${post.slug}/`), locale, group: `/blog/${post.slug}/`, indexable: true, post,
    })),
  ]),
  { path: '/growth/', locale: 'en', indexable: false },
  { path: '/growth/privacy/', locale: 'en', indexable: false },
];
const titles = new Set();
function fail(message) { throw new Error(message); }
function target(path) {
  const clean = decodeURIComponent(path);
  const result = resolve(output, `.${clean}`);
  if (result !== output && !result.startsWith(output + sep)) fail('Reference outside artifact');
  return extname(result) ? result : resolve(result, 'index.html');
}
const languageAlternates = (group) => Object.fromEntries(locales.map((locale) => [localeInfo[locale].hreflang, origin + localePath(locale, group)]));

for (const route of routes) {
  const filename = target(route.path);
  if (!existsSync(filename)) fail(`${route.path}: missing export`);
  const $ = load(readFileSync(filename, 'utf8'));
  const title = $('title').text();
  if (!title || titles.has(title)) fail(`${route.path}: missing or duplicate title`);
  titles.add(title);
  if ($('h1').length !== 1) fail(`${route.path}: expected one H1`);
  if (!$('meta[name="description"]').attr('content')) fail(`${route.path}: missing description`);
  if ($('link[rel="canonical"]').attr('href') !== origin + route.path) fail(`${route.path}: incorrect canonical`);
  if (!$('meta[property="og:image"]').attr('content')) fail(`${route.path}: missing social image`);
  if ($('html').attr('lang') !== route.locale) fail(`${route.path}: document language should be ${route.locale}`);
  const noindex = $('meta[name="robots"]').attr('content')?.includes('noindex');
  if (route.indexable ? noindex : !noindex) fail(`${route.path}: unexpected indexing directive`);
  if (route.post && !$('a[href*="id6805875185"]').length) fail(`${route.path}: missing app link`);

  const expectedAlternates = route.group ? languageAlternates(route.group) : null;
  if (expectedAlternates) {
    const actual = Object.fromEntries($('link[rel="alternate"][hreflang]').toArray().map((el) => [$(el).attr('hreflang'), $(el).attr('href')]));
    for (const [language, url] of Object.entries(expectedAlternates)) {
      if (actual[language] !== url) fail(`${route.path}: missing or incorrect ${language} alternate`);
    }
    if (actual['x-default'] !== origin + route.group) fail(`${route.path}: missing x-default alternate`);
  }

  $('script[type="application/ld+json"]').each((_, element) => {
    const data = JSON.parse($(element).text());
    if (data['@context'] !== 'https://schema.org') fail(`${route.path}: invalid schema context`);
    if (route.post && data['@type'] === 'BlogPosting' && data.inLanguage !== route.locale) fail(`${route.path}: article schema language mismatch`);
  });
  if (route.post) {
    if ($('.prose').text().trim().split(/\s+/).length < 250) fail(`${route.path}: article missing from HTML or too short`);
    if (!$('script[type="application/ld+json"]').toArray().some((el) => JSON.parse($(el).text())['@type'] === 'BlogPosting')) fail(`${route.path}: missing article schema`);
    const bodyLinks = $('.prose a[href^="/"], .prose a[href^="' + base + '/"]').toArray();
    for (const link of bodyLinks) {
      const href = $(link).attr('href');
      const expectedPrefix = `${base}${route.locale === 'en' ? '' : `/${route.locale}`}/blog/`;
      if (!href?.startsWith(expectedPrefix)) fail(`${route.path}: translated article link leaves its locale: ${href}`);
    }
  }

  $('a[href],img[src],script[src],link[rel="stylesheet"]').each((_, element) => {
    const value = $(element).attr(element.tagName === 'a' || element.tagName === 'link' ? 'href' : 'src');
    if (!value || /^(https?:|mailto:|data:|tel:|javascript:)/.test(value)) return;
    const url = new URL(value, origin + base + route.path);
    if (base && url.pathname !== base && !url.pathname.startsWith(base + '/')) fail(`${route.path}: link misses deployment prefix: ${value}`);
    const path = url.pathname.slice(base.length) || '/';
    const file = target(path);
    if (!existsSync(file)) fail(`${route.path}: missing target ${value}`);
    if (url.hash && element.tagName === 'a') {
      const other = load(readFileSync(file, 'utf8'));
      const id = decodeURIComponent(url.hash.slice(1));
      if (!other('[id]').toArray().some((item) => other(item).attr('id') === id)) fail(`${route.path}: missing anchor ${value}`);
    }
    if (element.tagName === 'img' && ($(element).attr('alt') === undefined || !$(element).attr('width') || !$(element).attr('height'))) fail(`${route.path}: image missing alt or dimensions`);
  });
}

for (const locale of locales) {
  const posts = getPosts({ locale, includeDrafts: true });
  for (const draft of posts.filter((post) => post.status === 'draft')) {
    if (existsSync(target(localePath(locale, `/blog/${draft.slug}/`)))) fail(`${locale}: draft leaked into published artifact`);
  }
}

const sitemap = load(readFileSync(resolve(output, 'sitemap.xml'), 'utf8'), { xmlMode: true });
const urls = sitemap('url > loc').map((_, element) => sitemap(element).text()).get();
const indexable = routes.filter((route) => route.indexable).map((route) => origin + route.path);
if (urls.length !== indexable.length || new Set(urls).size !== indexable.length || indexable.some((url) => !urls.includes(url)) || routes.filter((route) => !route.indexable).some((route) => urls.includes(origin + route.path))) fail('Sitemap does not match published indexable pages');
for (const locale of locales) {
  for (const group of ['/', '/blog/', ...basePosts.map((post) => `/blog/${post.slug}/`)]) {
    const url = origin + localePath(locale, group);
    const item = sitemap('url').toArray().find((element) => sitemap(element).children('loc').text() === url);
    if (!item) fail(`Sitemap missing ${url}`);
    const alternates = sitemap(item).find('xhtml\\:link[rel="alternate"]').toArray();
    for (const [language, href] of Object.entries(languageAlternates(group))) {
      if (!alternates.some((element) => sitemap(element).attr('hreflang') === language && sitemap(element).attr('href') === href)) fail(`Sitemap missing ${language} alternate for ${url}`);
    }
    if (!alternates.some((element) => sitemap(element).attr('hreflang') === 'x-default' && sitemap(element).attr('href') === origin + group)) fail(`Sitemap missing x-default alternate for ${url}`);
  }
}
if (!readFileSync(resolve(output, 'robots.txt'), 'utf8').includes(`${origin}/sitemap.xml`)) fail('Missing sitemap declaration');
for (const file of ['404.html', '.nojekyll']) if (!existsSync(resolve(output, file))) fail(`Missing ${file}`);
console.log(`Validated ${routes.length} HTML pages, locale metadata, hreflang, structured data, sitemap, assets, links, and anchors (${base || '/'}).`);

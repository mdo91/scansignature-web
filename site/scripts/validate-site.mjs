import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname, sep } from 'node:path';
import { load } from 'cheerio';
import { getPosts } from '../lib/posts.mjs';
const output = resolve('dist/client');
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const origin = 'https://scansignature.app';
const posts = getPosts();
const routes = [
  '/',
  '/privacy/',
  '/terms/',
  '/blog/',
  ...posts.map((p) => `/blog/${p.slug}/`),
];
const titles = new Set();
function fail(message) {
  throw new Error(message);
}
function target(path) {
  const clean = decodeURIComponent(path);
  const result = resolve(output, `.${clean}`);
  if (result !== output && !result.startsWith(output + sep))
    fail('Reference outside artifact');
  return extname(result) ? result : resolve(result, 'index.html');
}
for (const route of routes) {
  const filename = target(route);
  const $ = load(readFileSync(filename, 'utf8'));
  const title = $('title').text();
  if (!title || titles.has(title)) fail(`${route}: missing or duplicate title`);
  titles.add(title);
  if ($('h1').length !== 1) fail(`${route}: expected one H1`);
  if (!$('meta[name="description"]').attr('content'))
    fail(`${route}: missing description`);
  if ($('link[rel="canonical"]').attr('href') !== origin + route)
    fail(`${route}: incorrect canonical`);
  if (!$('meta[property="og:image"]').attr('content'))
    fail(`${route}: missing social image`);
  if ($('meta[name="robots"]').attr('content')?.includes('noindex'))
    fail(`${route}: unexpectedly noindex`);
  if (!$('a[href*="id6805875185"]').length && route.startsWith('/blog/'))
    fail(`${route}: missing app link`);
  $('script[type="application/ld+json"]').each((_, e) => {
    const data = JSON.parse($(e).text());
    if (data['@context'] !== 'https://schema.org')
      fail(`${route}: invalid schema context`);
  });
  $('a[href],img[src],script[src],link[rel="stylesheet"]').each((_, e) => {
    const value = $(e).attr(
      e.tagName === 'a' || e.tagName === 'link' ? 'href' : 'src',
    );
    if (!value || /^(https?:|mailto:|data:|tel:)/.test(value)) return;
    const url = new URL(value, origin + base + route);
    if (base && url.pathname !== base && !url.pathname.startsWith(base + '/'))
      fail(`${route}: link misses deployment prefix: ${value}`);
    const path = url.pathname.slice(base.length) || '/';
    const file = target(path);
    if (!existsSync(file)) fail(`${route}: missing target ${value}`);
    if (url.hash && e.tagName === 'a') {
      const other = load(readFileSync(file, 'utf8'));
      const id = decodeURIComponent(url.hash.slice(1));
      if (
        !other('[id]')
          .toArray()
          .some((el) => other(el).attr('id') === id)
      )
        fail(`${route}: missing anchor ${value}`);
    }
    if (
      e.tagName === 'img' &&
      ($(e).attr('alt') === undefined ||
        !$(e).attr('width') ||
        !$(e).attr('height'))
    )
      fail(`${route}: image missing alt or dimensions`);
  });
  const post = posts.find((p) => route === `/blog/${p.slug}/`);
  if (post) {
    if ($('.prose').text().split(/\s+/).length < 250)
      fail(`${route}: article missing from HTML`);
    if (
      !$('script[type="application/ld+json"]')
        .toArray()
        .some((el) => JSON.parse($(el).text())['@type'] === 'BlogPosting')
    )
      fail(`${route}: missing article schema`);
  }
}
const sitemap = load(readFileSync(resolve(output, 'sitemap.xml'), 'utf8'), {
  xmlMode: true,
});
const urls = sitemap('loc')
  .map((_, e) => sitemap(e).text())
  .get();
if (
  urls.length !== routes.length ||
  new Set(urls).size !== routes.length ||
  routes.some((p) => !urls.includes(origin + p))
)
  fail('Sitemap does not match public routes');
for (const draft of getPosts({ includeDrafts: true }).filter(
  (p) => p.status === 'draft',
))
  if (existsSync(target(`/blog/${draft.slug}/`)))
    fail('Draft leaked into published artifact');
if (
  !readFileSync(resolve(output, 'robots.txt'), 'utf8').includes(
    `${origin}/sitemap.xml`,
  )
)
  fail('Missing sitemap declaration');
for (const file of ['404.html', '.nojekyll'])
  if (!existsSync(resolve(output, file))) fail(`Missing ${file}`);
console.log(
  `Validated ${routes.length} HTML pages, canonical URLs, schema, sitemap, assets, links, and anchors (${base || '/'}).`,
);

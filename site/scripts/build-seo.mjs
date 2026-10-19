import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPosts } from '../lib/posts.mjs';
const locales = ['en', 'tr', 'de', 'es'];
const hreflangs = { en: 'en-US', tr: 'tr-TR', de: 'de-DE', es: 'es-ES' };
const localePath = (locale, path) => locale === 'en' ? path : `/${locale}${path}`;

const origin = 'https://scansignature.app';
const output = resolve('dist/client');
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const englishPosts = getPosts({ locale: 'en' });
for (const locale of locales) {
  const slugs = getPosts({ locale }).map((post) => post.slug).sort();
  if (JSON.stringify(slugs) !== JSON.stringify(englishPosts.map((post) => post.slug).sort())) {
    throw new Error(`Published guide set differs for locale ${locale}`);
  }
}

const pages = [
  { path: '/privacy/' },
  { path: '/terms/' },
  ...[
    { base: '/' },
    { base: '/blog/' },
    ...englishPosts.map((post) => ({ base: `/blog/${post.slug}/`, updated: post.updatedAt })),
  ].flatMap((group) => locales.map((locale) => ({
      path: localePath(locale, group.base),
    locale,
    updated: group.updated,
    alternates: [...locales.map((alternate) => ({
      hreflang: hreflangs[alternate],
      url: origin + localePath(alternate, group.base),
    })), { hreflang: 'x-default', url: origin + group.base }],
  }))),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pages.map((page) => `<url><loc>${escape(origin + page.path)}</loc>${page.updated ? `<lastmod>${page.updated}</lastmod>` : ''}${page.alternates ? page.alternates.map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escape(alternate.url)}" />`).join('') : ''}</url>`).join('')}</urlset>\n`;
writeFileSync(resolve(output, 'sitemap.xml'), sitemap);
writeFileSync(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Generated sitemap for ${pages.length} public pages and locale alternates.`);

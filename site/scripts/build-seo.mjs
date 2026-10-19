import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPosts } from '../lib/posts.mjs';
const origin = 'https://scansignature.app';
const output = resolve('dist/client');
const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pages = [
  { path: '/' },
  { path: '/privacy/' },
  { path: '/terms/' },
  { path: '/blog/' },
  ...getPosts().map((p) => ({
    path: `/blog/${p.slug}/`,
    updated: p.updatedAt,
  })),
];
writeFileSync(
  resolve(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((p) => `<url><loc>${escape(origin + p.path)}</loc>${p.updated ? `<lastmod>${p.updated}</lastmod>` : ''}</url>`).join('')}</urlset>\n`,
);
writeFileSync(
  resolve(output, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
console.log(`Generated sitemap for ${pages.length} public pages.`);

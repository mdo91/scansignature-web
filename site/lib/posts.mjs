import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseDocument } from 'yaml';
import { marked } from 'marked';

/** @typedef {{slug:string,title:string,description:string,publishedAt:string,updatedAt:string,topic:string,primaryQuery:string,image:string,imageAlt:string,related:string[],sources:{title:string,url:string}[],status:'published'|'draft',body:string,readingMinutes:number}} Post */
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const contentDirectory = resolve(process.cwd(), 'content/blog');
/** @param {string} input */
export const headingId = (input) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
/** @param {string} input */
const escape = (input) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
/** @param {string} value */
function safeUrl(value) {
  return /^(https:\/\/|\/(?!\/)|#)/.test(value);
}
/** @param {string} source @param {string} filename @returns {Post} */
export function parsePost(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: missing frontmatter`);
  const document = parseDocument(match[1], { uniqueKeys: true });
  if (document.errors.length)
    throw new Error(`${filename}: invalid YAML: ${document.errors[0].message}`);
  const data = document.toJS({ maxAliasCount: 0 });
  if (!data || Array.isArray(data) || typeof data !== 'object')
    throw new Error(`${filename}: metadata must be an object`);
  const content = match[2];
  const slug = filename.replace(/\.md$/, '');
  const fail = (message) => {
    throw new Error(`${filename}: ${message}`);
  };
  if (!slugPattern.test(slug)) fail('invalid slug');
  for (const field of [
    'title',
    'description',
    'publishedAt',
    'updatedAt',
    'topic',
    'primaryQuery',
    'image',
    'imageAlt',
  ])
    if (typeof data[field] !== 'string' || !data[field].trim())
      fail(`missing ${field}`);
  if (data.title.length > 100 || data.description.length > 200)
    fail('title or description too long');
  for (const field of ['publishedAt', 'updatedAt'])
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(data[field]) ||
      !Number.isFinite(Date.parse(data[field])) ||
      new Date(data[field]).toISOString().slice(0, 10) !== data[field]
    )
      fail(`invalid ${field}`);
  if (data.updatedAt < data.publishedAt)
    fail('updated date precedes publication');
  if (!['draft', 'published'].includes(data.status))
    fail('status must be draft or published');
  if (!/^\/mockup\/[a-z0-9-]+\.png$/.test(data.image))
    fail('image must be a supplied product screenshot');
  if (
    !Array.isArray(data.related) ||
    !data.related.length ||
    data.related.some((s) => !slugPattern.test(s) || s === slug) ||
    new Set(data.related).size !== data.related.length
  )
    fail('invalid related articles');
  if (
    !Array.isArray(data.sources) ||
    !data.sources.length ||
    data.sources.some((s) => !s.title || !/^https:\/\//.test(s.url))
  )
    fail('sources need a title and HTTPS URL');
  if (content.trim().split(/\s+/).length < 250)
    fail('guide must provide a complete answer');
  const tokens = marked.lexer(content);
  marked.walkTokens(tokens, (token) => {
    if (token.type === 'html') fail('raw HTML is not allowed in Markdown');
    if (
      (token.type === 'link' || token.type === 'image') &&
      !safeUrl(token.href)
    )
      fail('unsafe link or image URL');
    if (token.type === 'heading' && token.depth === 1)
      fail('the template supplies the H1');
  });
  return {
    ...data,
    slug,
    body: content,
    readingMinutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 210)),
  };
}
/** @param {{includeDrafts?: boolean}} [options] @returns {Post[]} */
export function getPosts({ includeDrafts = false } = {}) {
  const all = readdirSync(contentDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) =>
      parsePost(readFileSync(resolve(contentDirectory, f), 'utf8'), f),
    );
  const published = all.filter((p) => p.status === 'published');
  for (const post of all)
    for (const slug of post.related)
      if (
        !(post.status === 'draft' ? all : published).some(
          (p) => p.slug === slug,
        )
      )
        throw new Error(
          `${post.slug}: related article ${slug} is missing or unpublished`,
        );
  return (includeDrafts ? all : published).sort(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.slug.localeCompare(b.slug),
  );
}
/** @param {Post} post @param {string} [basePath] */
export function renderPost(post, basePath = '') {
  /** @type {{id:string,text:string}[]} */
  const headings = [];
  const counts = new Map();
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth, text }) {
    const base = headingId(text);
    const count = counts.get(base) || 0;
    counts.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    if (depth === 2) headings.push({ id, text });
    return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`;
  };
  renderer.link = function ({ href, tokens, title }) {
    if (!safeUrl(href)) throw new Error('Unsafe article URL');
    const url = href.startsWith('/') ? basePath + href : href;
    return `<a href="${escape(url)}"${title ? ` title="${escape(title)}"` : ''}>${this.parser.parseInline(tokens)}</a>`;
  };
  renderer.image = function ({ href, text }) {
    if (!/^\/mockup\/[a-z0-9-]+\.png$/.test(href))
      throw new Error('Unexpected article image');
    return `<img src="${escape(basePath + href)}" alt="${escape(text)}" width="450" height="920" loading="lazy" decoding="async" />`;
  };
  const html = marked.parse(post.body, { renderer, async: false });
  return { html, headings };
}

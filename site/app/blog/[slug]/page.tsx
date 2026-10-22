import { notFound } from 'next/navigation';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import StoreBadge from '@/components/store-badge';
import StructuredData from '@/components/structured-data';
import { getPosts, renderPost, postAlternates, relatedPosts } from '@/lib/posts.mjs';
import { absoluteUrl, basePath, organization, pageMetadata, sitePath } from '@/lib/site';
import { copy, localePath, localeInfo, type Locale } from '@/lib/locales';

export const dynamicParams = false;
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export function articleMetadata(post: ReturnType<typeof getPosts>[number], locale: Locale = 'en') {
  const path = localePath(locale, `/blog/${post.slug}/`);
  const metadata = pageMetadata(`${post.title} | SignDocs`, post.description, path, true, locale, true);
  return {
    ...metadata,
    alternates: {canonical: absoluteUrl(path), languages: Object.fromEntries(Object.entries(postAlternates(post)).map(([lang,route])=>[lang,absoluteUrl(String(route))]))},
    openGraph: {
      ...metadata.openGraph,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [organization],
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPosts().find((item) => item.slug === slug);
  if (!post) notFound();
  return articleMetadata(post, 'en');
}

export function ArticleView({ slug, locale = 'en' }: { slug: string; locale?: Locale }) {
  const t = copy[locale];
  const post = getPosts({ locale }).find((item) => item.slug === slug);
  if (!post) notFound();
  const { html, headings } = renderPost(post, basePath, locale);
  const related = relatedPosts(post,locale);
  const articlePath = localePath(locale, `/blog/${post.slug}/`);
  const url = absoluteUrl(articlePath);
  const campaign = `guide-${post.slug}-${locale}`;
  return (
    <>
      <SiteHeader campaign={campaign} locale={locale} route={`/blog/${post.slug}/`} articleAlternates={postAlternates(post)} />
      <main id="main" className="wrap article-main">
        <nav className="breadcrumbs" aria-label={t.breadcrumb}>
          <a href={sitePath(localePath(locale, '/'))}>{t.homeLabel}</a>
          <span aria-hidden="true">/</span>
          <a href={sitePath(localePath(locale, '/blog/'))}>{t.guides}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{post.topic}</span>
        </nav>
        <header className="article-title">
          <p className="eyebrow">{post.topic}</p>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.description}</p>
          <p className="article-byline">
            {t.by} {organization} · {t.updated}{' '}
            <time dateTime={post.updatedAt}>
              {new Date(`${post.updatedAt}T12:00:00Z`).toLocaleDateString(localeInfo[locale].htmlLang, {
                year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
              })}
            </time>{' '}· {post.readingMinutes} {t.minRead}
          </p>
        </header>
        <div className="article-layout">
          <aside className="article-sidebar">
            <nav aria-label={t.onPage}>
              <p>{t.inGuide}</p>
              <ol>{headings.map((heading) => <li key={heading.id}><a href={`#${heading.id}`}>{heading.text}</a></li>)}</ol>
            </nav>
            <div className="sidebar-app">
              <p>{t.appCtaTitleA}<br />{t.appCtaTitleB}</p>
              <StoreBadge campaign={campaign} locale={locale} />
              <small>{t.compatibility}</small>
            </div>
          </aside>
          <article className="article-content">
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            <section className="article-cta" aria-label={t.appCtaLabel}>
              <img src={sitePath('/mockup/app-logo.png')} width="52" height="52" alt="" />
              <h2>{t.appCtaTitleA}<br />{t.appCtaTitleB}</h2>
              <p>{t.appCtaCopy}</p>
              <StoreBadge campaign={campaign} locale={locale} />
              <small>{t.appNote}</small>
            </section>
            <section className="article-sources" aria-labelledby="sources-title">
              <h2 id="sources-title">{t.sources}</h2>
              <ul>{post.sources.map((source) => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul>
              <p>{t.preparedBy}</p>
            </section>
          </article>
        </div>
        <section className="related-guides" aria-labelledby="related-title">
          <p className="eyebrow">{t.relatedEyebrow}</p>
          <h2 id="related-title">{t.relatedTitle}</h2>
          <div className="guide-grid">
            {related.map((item) => <article className="guide-card" key={item.slug}>
              <p className="eyebrow">{item.topic}</p>
              <h3><a href={sitePath(localePath(locale, `/blog/${item.slug}/`))}>{item.title}</a></h3>
              <p>{item.description}</p>
              <a className="text-link" href={sitePath(localePath(locale, `/blog/${item.slug}/`))}>{t.readGuide} ↗</a>
            </article>)}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
      <StructuredData value={{
        '@context': 'https://schema.org', '@type': 'BlogPosting', inLanguage: localeInfo[locale].htmlLang,
        headline: post.title, description: post.description, datePublished: post.publishedAt,
        dateModified: post.updatedAt, mainEntityOfPage: url, image: absoluteUrl(post.image),
        author: { '@type': 'Organization', name: organization, url: absoluteUrl('/') },
        publisher: { '@type': 'Organization', name: organization, url: absoluteUrl('/'), logo: { '@type': 'ImageObject', url: absoluteUrl('/mockup/app-logo.png') } },
      }} />
      <StructuredData value={{
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.homeLabel, item: absoluteUrl(localePath(locale, '/')) },
          { '@type': 'ListItem', position: 2, name: t.guides, item: absoluteUrl(localePath(locale, '/blog/')) },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      }} />
    </>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleView slug={slug} locale="en" />;
}

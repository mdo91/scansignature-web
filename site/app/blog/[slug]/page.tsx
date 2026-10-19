import { notFound } from 'next/navigation';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import StoreBadge from '@/components/store-badge';
import StructuredData from '@/components/structured-data';
import { getPosts, renderPost } from '@/lib/posts.mjs';
import {
  absoluteUrl,
  basePath,
  organization,
  pageMetadata,
  sitePath,
} from '@/lib/site';
export const dynamicParams = false;
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}
async function findPost(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) notFound();
  return post;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await findPost(params);
  const metadata = pageMetadata(
    `${post.title} | SignDocs`,
    post.description,
    `/blog/${post.slug}/`,
    true,
  );
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [organization],
    },
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await findPost(params);
  const { html, headings } = renderPost(post, basePath);
  const related = getPosts().filter((p) => post.related.includes(p.slug));
  const url = absoluteUrl(`/blog/${post.slug}/`);
  return (
    <>
      <SiteHeader campaign={`guide-${post.slug}`} />
      <main id="main" className="wrap article-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={sitePath('/')}>Home</a>
          <span aria-hidden="true">/</span>
          <a href={sitePath('/blog/')}>Guides</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{post.topic}</span>
        </nav>
        <header className="article-title">
          <p className="eyebrow">{post.topic}</p>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.description}</p>
          <p className="article-byline">
            By {organization} · Updated{' '}
            <time dateTime={post.updatedAt}>
              {new Date(`${post.updatedAt}T12:00:00Z`).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                },
              )}
            </time>{' '}
            · {post.readingMinutes} min read
          </p>
        </header>
        <div className="article-layout">
          <aside className="article-sidebar">
            <nav aria-label="On this page">
              <p>In this guide</p>
              <ol>
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="sidebar-app">
              <p>
                Paper to signed.
                <br />
                On your iPhone.
              </p>
              <StoreBadge campaign={`guide-${post.slug}`} />
              <small>iOS 26 / iPadOS 26 or later</small>
            </div>
          </aside>
          <article className="article-content">
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            <section className="article-cta" aria-label="Get Signature Scan">
              <img
                src={sitePath('/mockup/app-logo.png')}
                width="52"
                height="52"
                alt=""
              />
              <h2>
                Your paper. Your signature.
                <br />
                One signed PDF.
              </h2>
              <p>
                Scan a document, capture your handwriting, and save a signed
                copy with Signature Scan: Sign PDFs — also known as SignDocs.
              </p>
              <StoreBadge campaign={`guide-${post.slug}`} />
              <small>
                On-device document processing. iPhone and iPad, version 26 or
                later.
              </small>
            </section>
            <section
              className="article-sources"
              aria-labelledby="sources-title"
            >
              <h2 id="sources-title">Sources &amp; editorial notes</h2>
              <ul>
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{source.title}</a>
                  </li>
                ))}
              </ul>
              <p>
                Prepared by the app’s developer using product documentation,
                supplied screenshots, and the sources above, with AI assistance
                for drafting and editing. Screenshots show SignDocs; system
                menus can vary by OS version. This guide does not claim
                independent hands-on testing.
              </p>
            </section>
          </article>
        </div>
        <section className="related-guides" aria-labelledby="related-title">
          <p className="eyebrow">KEEP GOING</p>
          <h2 id="related-title">The next small step.</h2>
          <div className="guide-grid">
            {related.map((item) => (
              <article className="guide-card" key={item.slug}>
                <p className="eyebrow">{item.topic}</p>
                <h3>
                  <a href={sitePath(`/blog/${item.slug}/`)}>{item.title}</a>
                </h3>
                <p>{item.description}</p>
                <a className="text-link" href={sitePath(`/blog/${item.slug}/`)}>
                  Read the guide ↗
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          mainEntityOfPage: url,
          image: absoluteUrl(post.image),
          author: {
            '@type': 'Organization',
            name: organization,
            url: absoluteUrl('/'),
          },
          publisher: {
            '@type': 'Organization',
            name: organization,
            url: absoluteUrl('/'),
            logo: {
              '@type': 'ImageObject',
              url: absoluteUrl('/mockup/app-logo.png'),
            },
          },
        }}
      />
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: absoluteUrl('/'),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Guides',
              item: absoluteUrl('/blog/'),
            },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        }}
      />
    </>
  );
}

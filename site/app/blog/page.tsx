import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { getPosts } from '@/lib/posts.mjs';
import { pageMetadata, sitePath } from '@/lib/site';
import { copy, localePath, type Locale } from '@/lib/locales';
export const metadata = pageMetadata(
  'iPhone PDF & Signature Guides | SignDocs',
  'Practical guides to scan documents, capture handwritten signatures, sign PDFs offline, and share signed copies from iPhone and iPad.',
  '/blog/', false, 'en', true,
);
export function BlogIndex({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];
  const posts = getPosts({ locale });
  return (
    <>
      <SiteHeader locale={locale} route="/blog/" />
      <main id="main" className="wrap blog-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={sitePath(localePath(locale, '/'))}>{t.homeLabel}</a>
          <span aria-hidden="true">/</span>
          <span>{t.guides}</span>
        </nav>
        <div className="blog-intro">
          <p className="eyebrow">{t.blogEyebrow}</p>
          <h1>
            {t.blogTitleA}
            <br />
            <span>{t.blogTitleB}</span>
          </h1>
          <p>
            {t.blogIntro}
          </p>
        </div>
        <div className="guide-grid">
          {posts.map((post) => (
            <article key={post.slug} className="guide-card">
              <p className="eyebrow">{post.topic}</p>
              <h2>
                <a href={sitePath(localePath(locale, `/blog/${post.slug}/`))}>{post.title}</a>
              </h2>
              <p>{post.description}</p>
              <a className="text-link" href={sitePath(localePath(locale, `/blog/${post.slug}/`))}>
                {t.readGuide} <span aria-hidden="true">↗</span>
              </a>
              <span className="reading-time">
              {post.readingMinutes} {t.minRead}
              </span>
            </article>
          ))}
        </div>
        <aside className="editorial-note">
          <p>
            {t.editorial}
          </p>
        </aside>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
export default function BlogPage() {
  return <BlogIndex locale="en" />;
}

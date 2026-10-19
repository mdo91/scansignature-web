import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { getPosts } from '@/lib/posts.mjs';
import { pageMetadata, sitePath } from '@/lib/site';
export const metadata = pageMetadata(
  'iPhone PDF & Signature Guides | SignDocs',
  'Practical guides to scan documents, capture handwritten signatures, sign PDFs offline, and share signed copies from iPhone and iPad.',
  '/blog/',
);
export default function BlogPage() {
  const posts = getPosts();
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap blog-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href={sitePath('/')}>Home</a>
          <span aria-hidden="true">/</span>
          <span>Guides</span>
        </nav>
        <div className="blog-intro">
          <p className="eyebrow">LESS PAPERWORK. A LITTLE KNOW-HOW.</p>
          <h1>
            Scan. Sign.
            <br />
            <span>Know how.</span>
          </h1>
          <p>
            Clear, practical guides for the paperwork in front of you. From your
            first scan to a signed PDF, ready to send.
          </p>
        </div>
        <div className="guide-grid">
          {posts.map((post) => (
            <article key={post.slug} className="guide-card">
              <p className="eyebrow">{post.topic}</p>
              <h2>
                <a href={sitePath(`/blog/${post.slug}/`)}>{post.title}</a>
              </h2>
              <p>{post.description}</p>
              <a className="text-link" href={sitePath(`/blog/${post.slug}/`)}>
                Read the guide <span aria-hidden="true">↗</span>
              </a>
              <span className="reading-time">
                {post.readingMinutes} min read
              </span>
            </article>
          ))}
        </div>
        <aside className="editorial-note">
          <p>
            Written by Damas Technologies LLC, the maker of Signature Scan: Sign
            PDFs (SignDocs). Our guides use product documentation and Apple
            Support, with AI assistance for drafting and editing. Sources are
            listed in each guide. App workflows require iOS 26 or iPadOS 26 or
            later.
          </p>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}

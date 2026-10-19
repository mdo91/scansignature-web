import { getPosts } from '@/lib/posts.mjs';
import { sitePath } from '@/lib/site';
export default function GuidePreview() {
  const selected = [
    'sign-pdf-iphone-without-printing',
    'scan-handwritten-signature-iphone',
    'scan-multiple-pages-one-pdf-iphone',
  ];
  const posts = getPosts().filter((p) => selected.includes(p.slug));
  return (
    <section className="wrap home-guides" aria-labelledby="guides-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A LITTLE KNOW-HOW</p>
          <h2 id="guides-title">
            Paperwork questions.
            <br />
            <span>Practical answers.</span>
          </h2>
        </div>
        <a className="text-link" href={sitePath('/blog/')}>
          All guides ↗
        </a>
      </div>
      <div className="guide-grid">
        {posts.map((post) => (
          <article className="guide-card" key={post.slug}>
            <p className="eyebrow">{post.topic}</p>
            <h3>
              <a href={sitePath(`/blog/${post.slug}/`)}>{post.title}</a>
            </h3>
            <p>{post.description}</p>
            <a className="text-link" href={sitePath(`/blog/${post.slug}/`)}>
              Read the guide ↗
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

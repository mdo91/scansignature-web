import { getPosts } from '@/lib/posts.mjs';
import { sitePath } from '@/lib/site';
import { copy, localePath, type Locale } from '@/lib/locales';
export default function GuidePreview({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];
  const selected = [
    'sign-pdf-iphone-without-printing',
    'scan-handwritten-signature-iphone',
    'scan-multiple-pages-one-pdf-iphone',
  ];
  const posts = getPosts({ locale }).filter((p) => selected.includes(p.slug));
  return (
    <section className="wrap home-guides" aria-labelledby="guides-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.guidesEyebrow}</p>
          <h2 id="guides-title">
            {t.guidesTitleA}
            <br />
            <span>{t.guidesTitleB}</span>
          </h2>
        </div>
        <a className="text-link" href={sitePath(localePath(locale, '/blog/'))}>
          {t.allGuides} ↗
        </a>
      </div>
      <div className="guide-grid">
        {posts.map((post) => (
          <article className="guide-card" key={post.slug}>
            <p className="eyebrow">{post.topic}</p>
            <h3>
              <a href={sitePath(localePath(locale, `/blog/${post.slug}/`))}>{post.title}</a>
            </h3>
            <p>{post.description}</p>
            <a className="text-link" href={sitePath(localePath(locale, `/blog/${post.slug}/`))}>
              {t.readGuide} ↗
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

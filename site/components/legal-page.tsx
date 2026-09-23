import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import SiteFooter from './site-footer';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export type LegalSection = { id: string; title: string; content: ReactNode };

export default function LegalPage({
  title,
  introduction,
  sections,
  effectiveDate = { iso: '2026-09-10', label: 'September 10, 2026' },
}: {
  title: string;
  introduction: ReactNode;
  sections: LegalSection[];
  effectiveDate?: { iso: string; label: string };
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap legal-header">
        <a className="brand" href={`${basePath}/`} aria-label="SignDocs home">
          <img
            src={`${basePath}/mockup/app-logo.png`}
            width="38"
            height="38"
            alt=""
          />
          <span>SignDocs</span>
        </a>
        <a className="text-link" href={`${basePath}/`}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to SignDocs
        </a>
      </header>
      <main id="main" className="legal-main wrap">
        <div className="legal-title">
          <p className="eyebrow">DAMAS TECHNOLOGIES LLC</p>
          <h1>{title}</h1>
          <p className="legal-date">
            Effective <time dateTime={effectiveDate.iso}>{effectiveDate.label}</time>
          </p>
          <div className="legal-introduction">{introduction}</div>
        </div>
        <div className="legal-layout">
          <aside className="legal-contents">
            <nav aria-label="On this page">
              <p>On this page</p>
              <ol>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="legal-article" aria-label={title}>
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
              >
                <h2 id={`${section.id}-title`}>
                  <span className="legal-section-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

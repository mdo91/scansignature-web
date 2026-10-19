const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
import { copy, type Locale } from '@/lib/locales';

export default function SiteFooter({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];
  const home = locale === 'en' ? `${basePath}/` : `${basePath}/${locale}/`;
  const blog = locale === 'en' ? `${basePath}/blog/` : `${basePath}/${locale}/blog/`;
  return (
    <footer className="site-footer wrap">
      <a
        className="brand footer-brand"
        href={home}
        aria-label={t.home}
      >
        <img
          src={`${basePath}/mockup/app-logo.png`}
          width="28"
          height="28"
          alt=""
          loading="lazy"
        />
        <span>SignDocs</span>
      </a>
      <p>© {new Date().getFullYear()} Damas Technologies LLC</p>
      <nav aria-label={t.footerLabel}>
        <a href={blog}>{t.footerGuides}</a>
        <a href={`${basePath}/privacy/`}>{t.privacy}</a>
        <a href={`${basePath}/terms/`}>{t.terms}</a>
        <a href="mailto:hi@damastechnologies.com">{t.contact}</a>
      </nav>
    </footer>
  );
}

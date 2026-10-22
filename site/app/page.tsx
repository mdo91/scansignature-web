import LanguageSwitcher from '@/components/language-switcher';
import {
  ArrowDown,
  ArrowUpRight,
  LockKeyhole,
  ScanLine,
  PenLine,
  Send,
  WifiOff,
  UserRoundCheck,
  FolderCheck,
  Check,
} from 'lucide-react';
import FeatureGallery from './feature-gallery';
import SiteFooter from '@/components/site-footer';
import StoreBadge from '@/components/store-badge';
import GuidePreview from '@/components/guide-preview';
import StructuredData from '@/components/structured-data';
import { absoluteUrl, appStoreUrl, sitePath } from '@/lib/site';
import { copy, localeInfo, localePath, locales, type Locale } from '@/lib/locales';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (name: string) => `${basePath}/mockup/${name}`;

export function HomePage({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];
  const homePath = localePath(locale, '/');
  const campaign = `homepage-${locale}`;
  const storeUrl = appStoreUrl(campaign);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header wrap guide-header">
        <a className="brand" href={sitePath(homePath)} aria-label={t.home}>
          <img src={asset('app-logo.png')} alt="" width="38" height="38" />
          <span>SignDocs</span>
        </a>
        <nav aria-label={t.navLabel}>
          <a href={`${sitePath(homePath)}#features`}>{t.how}</a>
          <a href={sitePath(localePath(locale, '/blog/'))}>{t.guides}</a>
        </nav>
        <LanguageSwitcher locale={locale} />
        <a className="header-download" href={storeUrl}>
          {t.getApp} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> {t.heroEyebrow}
            </p>
            <h1 id="hero-title">
              {t.heroTitleA}
              <br />
              <span>{t.heroTitleB}</span>
              <br />
              {t.heroTitleC}
            </h1>
            <p className="hero-description">
              {t.heroDescription}
            </p>
            <div className="hero-actions">
              <StoreBadge campaign={campaign} locale={locale} />
              <a className="text-link" href={`${sitePath(homePath)}#features`}>
                {t.closer} <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-note">
              <LockKeyhole size={14} aria-hidden="true" /> {t.privacyNote}
            </p>
            <p className="hero-compatibility">
              {t.compatibility}
            </p>
          </div>
          <div className="hero-visual">
            <div className="hero-halo" aria-hidden="true" />
            <img
              className="hero-phone hero-phone-back"
              src={asset('place-signature.png')}
              alt={t.features[4][3]}
              width="450"
              height="920"
              decoding="async"
            />
            <img
              className="hero-phone hero-phone-front"
              src={asset('main.png')}
              alt={t.features[0][3]}
              width="450"
              height="920"
              fetchPriority="high"
            />
            <div className="privacy-label">
              <span className="privacy-label-icon">
                <LockKeyhole size={17} aria-hidden="true" />
              </span>
              <span>
                {t.privacyLabelTitle}<small>{t.privacyLabelDescription}</small>
              </span>
            </div>
          </div>
        </section>
        <section
          className="workflow wrap"
          aria-label={t.workflowLabel}
        >
          {t.workflow.map(([title, description], index) => (
            <article key={title}>
              {index === 0 ? <ScanLine aria-hidden="true" /> : index === 1 ? <PenLine aria-hidden="true" /> : <Send aria-hidden="true" />}
              <div><h2>{title}</h2><p>{description}</p></div>
            </article>
          ))}
        </section>
        <FeatureGallery locale={locale} />
        <section
          id="privacy"
          className="privacy-section wrap"
          aria-labelledby="privacy-title"
        >
          <div className="privacy-intro">
            <div className="privacy-symbol">
              <LockKeyhole size={27} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <p className="eyebrow">{t.privateEyebrow}</p>
            <h2 id="privacy-title">
              {t.privacyTitleA}
              <br />
              <span>{t.privacyTitleB}</span>
            </h2>
            <p>
              {t.privacyIntro}
            </p>
          </div>
          <div className="privacy-points">
            {t.privacyPoints.map(([title, description], index) => (
              <article key={title}>
                {index === 0 ? <WifiOff size={22} strokeWidth={1.6} aria-hidden="true" /> : index === 1 ? <UserRoundCheck size={22} strokeWidth={1.6} aria-hidden="true" /> : <FolderCheck size={22} strokeWidth={1.6} aria-hidden="true" />}
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>
        <section className="share-section wrap" aria-labelledby="share-title">
          <div>
            <p className="eyebrow">{t.shareEyebrow}</p>
            <h2 id="share-title">
              {t.shareTitleA}
              <br />
              <span>{t.shareTitleB}</span>
            </h2>
          </div>
          <div className="share-copy">
            <p>
              {t.shareCopy}
            </p>
            <ul>
              {t.sharePoints.map((point) => <li key={point}><Check size={16} aria-hidden="true" /> {point}</li>)}
            </ul>
          </div>
        </section>
        <GuidePreview locale={locale} />
        <section
          className="download-section wrap"
          aria-labelledby="download-title"
        >
          <img
            className="download-icon"
            src={asset('app-logo.png')}
            width="72"
            height="72"
            alt=""
            loading="lazy"
          />
          <h2 id="download-title">
            {t.downloadTitleA}
            <br />{t.downloadTitleB}
          </h2>
          <p>{t.downloadCopy}</p>
          <StoreBadge campaign={campaign} locale={locale} />
          <p className="download-note">{t.device}</p>
        </section>
      </main>
      <SiteFooter locale={locale} />
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': absoluteUrl('/#organization'),
          name: 'Damas Technologies LLC',
          url: absoluteUrl('/'),
          logo: absoluteUrl('/mockup/app-logo.png'),
          email: 'hi@damastechnologies.com',
        }}
      />
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Signature Scan · SignDocs',
          url: absoluteUrl(homePath),
        }}
      />
      <StructuredData
        value={{
          '@context': 'https://schema.org',
          '@type': 'MobileApplication',
          name: 'Signature Scan: Sign PDFs',
          alternateName: 'SignDocs',
          operatingSystem: 'iOS 26 or later; iPadOS 26 or later',
          applicationCategory: 'UtilitiesApplication',
          url: absoluteUrl(homePath),
          installUrl: appStoreUrl(),
          image: absoluteUrl('/mockup/app-logo.png'),
          author: { '@id': absoluteUrl('/#organization') },
          featureList: t.features.map((feature) => feature[2]),
        }}
      />
    </>
  );
}

export default function Home() {
  return <HomePage locale="en" />;
}

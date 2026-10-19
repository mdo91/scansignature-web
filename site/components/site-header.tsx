import { ArrowUpRight } from 'lucide-react';
import { appStoreUrl, sitePath } from '@/lib/site';
import { copy, localeInfo, localePath, locales, type Locale } from '@/lib/locales';
export default function SiteHeader({ campaign = 'guides-header', locale = 'en', route = '/' }: { campaign?: string; locale?: Locale; route?: string }) {
  const t = copy[locale];
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header wrap guide-header">
        <a className="brand" href={sitePath(localePath(locale, '/'))} aria-label={t.home}>
          <img
            src={sitePath('/mockup/app-logo.png')}
            alt=""
            width="38"
            height="38"
          />
          <span>SignDocs</span>
        </a>
        <nav aria-label="Main navigation">
          <a href={sitePath(localePath(locale, '/#features'))}>{t.how}</a>
          <a href={sitePath(localePath(locale, '/blog/'))}>{t.guides}</a>
        </nav>
        <nav className="language-switcher" aria-label={t.language}>
          {locales.map((code) => (
            <a key={code} href={sitePath(localePath(code, route))} lang={localeInfo[code].htmlLang} aria-label={localeInfo[code].language} aria-current={code === locale ? 'page' : undefined}>
              {code.toUpperCase()}
            </a>
          ))}
        </nav>
        <a className="header-download" href={appStoreUrl(campaign)}>
          {t.getApp} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
    </>
  );
}

import type { Metadata } from 'next';
import growth from '../growth.config.json';
import { createAppStoreUrl } from './campaign.mjs';
import { locales, localeInfo, localePath, type Locale } from './locales';

export const origin = 'https://scansignature.app';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const appId = '6805875185';
export const organization = 'Damas Technologies LLC';
export const sitePath = (path: string) => `${basePath}${path}`;
export const absoluteUrl = (path: string) => `${origin}${path}`;
export { localePath };
export function appStoreUrl(campaign = 'website') {
  return createAppStoreUrl(growth.appStoreProviderToken, campaign);
}
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  article = false,
  locale: Locale = 'en',
  withLanguageAlternates = false,
): Metadata {
  const canonicalPath = path;
  const image = {
    url: absoluteUrl('/mockup/app-logo.png'),
    alt: 'Signature Scan: Sign PDFs app icon',
  };
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
      ...(withLanguageAlternates
        ? {
            languages: {
              [localeInfo.en.hreflang]: absoluteUrl(localizedPathFor('en', canonicalPath)),
              [localeInfo.tr.hreflang]: absoluteUrl(localizedPathFor('tr', canonicalPath)),
              [localeInfo.de.hreflang]: absoluteUrl(localizedPathFor('de', canonicalPath)),
              [localeInfo.es.hreflang]: absoluteUrl(localizedPathFor('es', canonicalPath)),
              'x-default': absoluteUrl(localizedPathFor('en', canonicalPath)),
            },
          }
        : {}),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: 'Signature Scan · SignDocs',
      locale: localeInfo[locale].ogLocale,
      type: article ? 'article' : 'website',
      images: [image],
    },
    twitter: { card: 'summary', title, description, images: [image.url] },
  };
}

function localizedPathFor(locale: Locale, path: string): string {
  const englishPath = path.replace(/^\/(?:tr|de|es)(?=\/|$)/, '') || '/';
  return localePath(locale, englishPath);
}

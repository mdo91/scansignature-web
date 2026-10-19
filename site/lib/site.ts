import type { Metadata } from 'next';
import growth from '../growth.config.json';
import { createAppStoreUrl } from './campaign.mjs';

export const origin = 'https://scansignature.app';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const appId = '6805875185';
export const organization = 'Damas Technologies LLC';
export const sitePath = (path: string) => `${basePath}${path}`;
export const absoluteUrl = (path: string) => `${origin}${path}`;
export function appStoreUrl(campaign = 'website') {
  return createAppStoreUrl(growth.appStoreProviderToken, campaign);
}
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  article = false,
): Metadata {
  const image = {
    url: absoluteUrl('/mockup/app-logo.png'),
    alt: 'Signature Scan: Sign PDFs app icon',
  };
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: 'Signature Scan · SignDocs',
      locale: 'en_US',
      type: article ? 'article' : 'website',
      images: [image],
    },
    twitter: { card: 'summary', title, description, images: [image.url] },
  };
}

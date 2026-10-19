import { notFound } from 'next/navigation';
import { HomePage } from '../page';
import { pageMetadata } from '@/lib/site';
import { isLocale, localePath, locales, seoCopy } from '@/lib/locales';
export const dynamicParams = false;
export function generateStaticParams() { return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value) || value === 'en') notFound();
  const meta = seoCopy[value];
  return pageMetadata(meta.homeTitle, meta.homeDescription, localePath(value, '/'), false, value, true);
}
export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value) || value === 'en') notFound();
  return <HomePage locale={value} />;
}

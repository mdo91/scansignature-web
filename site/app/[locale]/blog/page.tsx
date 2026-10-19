import { notFound } from 'next/navigation';
import { BlogIndex } from '../../blog/page';
import { pageMetadata } from '@/lib/site';
import { copy, isLocale, localePath, locales, seoCopy } from '@/lib/locales';
export const dynamicParams = false;
export function generateStaticParams() { return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value) || value === 'en') notFound();
  const meta = seoCopy[value];
  return pageMetadata(meta.blogTitle, meta.blogDescription, localePath(value, '/blog/'), false, value, true);
}
export default async function LocalizedBlog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value) || value === 'en') notFound();
  return <BlogIndex locale={value} />;
}

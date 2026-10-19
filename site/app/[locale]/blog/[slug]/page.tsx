import { notFound } from 'next/navigation';
import { ArticleView, articleMetadata } from '../../../blog/[slug]/page';
import { getPosts } from '@/lib/posts.mjs';
import { isLocale, locales, type Locale } from '@/lib/locales';
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.filter((locale) => locale !== 'en').flatMap((locale) => getPosts({ locale }).map((post) => ({ locale, slug: post.slug })));
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params;
  if (!isLocale(value) || value === 'en') notFound();
  const post = getPosts({ locale: value }).find((item) => item.slug === slug);
  if (!post) notFound();
  return articleMetadata(post, value as Locale);
}
export default async function LocalizedArticle({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params;
  if (!isLocale(value) || value === 'en') notFound();
  return <ArticleView slug={slug} locale={value} />;
}

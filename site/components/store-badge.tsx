import { appStoreUrl, sitePath } from '@/lib/site';
import { type Locale } from '@/lib/locales';
export default function StoreBadge({
  campaign = 'website',
  locale = 'en',
}: {
  campaign?: string;
  locale?: Locale;
}) {
  const labels = {
    en: 'Download Signature Scan: Sign PDFs on the App Store',
    tr: 'Signature Scan: Sign PDFs uygulamasını App Store’dan indirin',
    de: 'Signature Scan: Sign PDFs im App Store laden',
    es: 'Descarga Signature Scan: Sign PDFs en el App Store',
  };
  return (
    <a
      className="store-badge"
      href={appStoreUrl(campaign)}
      aria-label={labels[locale]}
    >
      <img
        src={sitePath(
          locale === 'en'
            ? '/mockup/DownloadAppleBadge.svg'
            : `/mockup/DownloadAppleBadge-${locale}.svg`,
        )}
        alt=""
        width="156"
        height="52"
      />
    </a>
  );
}

import badges from '@/lib/store-badges.json';
import { appStoreUrl, sitePath } from '@/lib/site';
import { copy, type Locale } from '@/lib/locales';
export default function StoreBadge({
  campaign = 'website',
  locale = 'en',
}: {
  campaign?: string;
  locale?: Locale;
}) {
  return (
    <a
      className="store-badge"
      href={appStoreUrl(campaign)}
      aria-label={`${copy[locale].getApp} — Signature Scan: Sign PDFs · App Store`}
    >
      <img
        src={sitePath(badges[locale].asset)}
        alt=""
        width={badges[locale].width}
        height={badges[locale].height}
      />
    </a>
  );
}

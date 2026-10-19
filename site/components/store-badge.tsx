import { appStoreUrl, sitePath } from '@/lib/site';
export default function StoreBadge({
  campaign = 'website',
}: {
  campaign?: string;
}) {
  return (
    <a
      className="store-badge"
      href={appStoreUrl(campaign)}
      aria-label="Download Signature Scan: Sign PDFs on the App Store"
    >
      <img
        src={sitePath('/mockup/DownloadAppleBadge.svg')}
        alt="Download on the App Store"
        width="156"
        height="52"
      />
    </a>
  );
}

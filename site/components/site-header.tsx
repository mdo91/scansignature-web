import { ArrowUpRight } from 'lucide-react';
import { appStoreUrl, sitePath } from '@/lib/site';
export default function SiteHeader({ campaign = 'guides-header' }: { campaign?: string }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap guide-header">
        <a className="brand" href={sitePath('/')} aria-label="SignDocs home">
          <img
            src={sitePath('/mockup/app-logo.png')}
            alt=""
            width="38"
            height="38"
          />
          <span>SignDocs</span>
        </a>
        <nav aria-label="Main navigation">
          <a href={sitePath('/#features')}>How it works</a>
          <a href={sitePath('/blog/')}>Guides</a>
        </nav>
        <a className="header-download" href={appStoreUrl(campaign)}>
          Get the app <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
    </>
  );
}

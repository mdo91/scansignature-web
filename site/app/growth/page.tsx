import type { Metadata } from 'next';
import LegalPage from '@/components/legal-page';
import { pageMetadata, sitePath } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMetadata(
    'Signature Scan Growth — Website research tool',
    'About the owner-operated tool used to research useful Signature Scan guides and review aggregate search performance.',
    '/growth/',
  ),
  robots: { index: false, follow: true },
};
export default function GrowthPage() {
  return (
    <LegalPage
      title="Signature Scan Growth"
      effectiveDate={{ iso: '2026-10-19', label: 'October 19, 2026' }}
      introduction={
        <p>
          An internal research and editorial tool operated by Damas Technologies
          LLC for scansignature.app.
        </p>
      }
      sections={[
        {
          id: 'purpose',
          title: 'What this tool does',
          content: (
            <>
              <p>
                Signature Scan Growth helps our authorized website operators
                understand which scanning and signing questions need clearer
                answers. It reviews aggregate Google Search Console performance
                and, when access is available, Google Ads Keyword Planner demand
                estimates.
              </p>
              <p>
                Operators use the findings to review and improve our guides for
                Signature Scan: Sign PDFs, also known as SignDocs. Search
                estimates do not guarantee rankings or downloads.
              </p>
            </>
          ),
        },
        {
          id: 'access',
          title: 'Owner-authorized Google access',
          content: (
            <>
              <p>
                This is an owner-operated tool, not a public account-connection
                service. Website readers and users of the iPhone app do not need
                to connect a Google account. Operators authorize their own
                Google accounts through Google’s consent screen.
              </p>
              <p>
                Search Console access is read-only. Google Ads authorization
                uses Google’s broader Ads scope; this workflow only requests
                keyword ideas and historical keyword metrics. It does not create
                advertisements, change campaigns, manage billing, or spend
                money.
              </p>
            </>
          ),
        },
        {
          id: 'data',
          title: 'Data handling and contact',
          content: (
            <>
              <p>
                Credentials stay in Gum’s supported local secure storage.
                Private research reports are kept outside the published website.
                Selected aggregate reports can be processed with Codex/OpenAI
                for editorial assistance.
              </p>
              <p>
                Read the{' '}
                <a href={sitePath('/growth/privacy/')}>
                  Signature Scan Growth privacy notice
                </a>{' '}
                for the data categories, processing, retention, and revocation
                options. The separate{' '}
                <a href={sitePath('/privacy/')}>SignDocs privacy policy</a>{' '}
                covers the iPhone app and general website visits.
              </p>
              <p>
                Contact Damas Technologies LLC at{' '}
                <a href="mailto:hi@damastechnologies.com">
                  hi@damastechnologies.com
                </a>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

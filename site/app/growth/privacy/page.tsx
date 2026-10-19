import type { Metadata } from 'next';
import LegalPage from '@/components/legal-page';
import { pageMetadata, sitePath } from '@/lib/site';
export const metadata: Metadata = {
  ...pageMetadata(
    'Signature Scan Growth privacy notice',
    'How the owner-operated Signature Scan Growth tool accesses, uses, stores, and handles Google research data and authorization.',
    '/growth/privacy/',
  ),
  robots: { index: false, follow: true },
};
export default function GrowthPrivacyPage() {
  return (
    <LegalPage
      title="Growth tool privacy notice"
      effectiveDate={{ iso: '2026-10-19', label: 'October 19, 2026' }}
      introduction={
        <p>
          This notice covers{' '}
          <a href={sitePath('/growth/')}>Signature Scan Growth</a>, the internal
          website research tool operated by Damas Technologies LLC. It is
          separate from the document processing performed by the SignDocs iPhone
          app.
        </p>
      }
      sections={[
        {
          id: 'google-data',
          title: 'Google data we access',
          content: (
            <>
              <p>
                An authorized operator can connect Google Search Console to
                retrieve aggregate search queries, page URLs, device and country
                dimensions, clicks, impressions, click-through rates, and
                average positions for scansignature.app. Search Console may
                suppress some queries and low-volume data.
              </p>
              <p>
                When Google Ads access is approved, the tool retrieves keyword
                ideas, close variants, estimated search volumes, and advertising
                competition metrics for selected keywords and website URLs. The
                operator’s Google Ads customer ID identifies the authorized
                account. Manually exported Keyword Planner files may be imported
                for the same purpose.
              </p>
              <p>
                Google OAuth provides authorization tokens and account identity
                information needed to bind the local profile to the operator. We
                do not request Gmail, Drive, Calendar, contacts, or document
                contents for this workflow. We do not receive iPhone users’ PDFs
                or signatures through these APIs.
              </p>
            </>
          ),
        },
        {
          id: 'use',
          title: 'How we use the information',
          content: (
            <>
              <p>
                We use research data to identify useful guide topics, improve
                existing pages, and compare aggregate search performance. Google
                Ads competition describes advertising demand and is not treated
                as organic ranking difficulty. This workflow does not create
                ads, change campaigns or billing, or authorize advertising
                spend.
              </p>
              <p>
                Our use and transfer of information received from Google APIs
                will adhere to the{' '}
                <a href="https://developers.google.com/terms/api-services-user-data-policy">
                  Google API Services User Data Policy
                </a>
                , including applicable Limited Use requirements. We do not sell
                Google user data or use it for personalized advertising.
              </p>
            </>
          ),
        },
        {
          id: 'storage',
          title: 'Storage and AI-assisted processing',
          content: (
            <>
              <p>
                Gum stores authorization credentials in its supported local
                secure storage, including the operating system keychain where
                available. Downloaded credential files are restricted to the
                operator and are not committed to the public website repository.
              </p>
              <p>
                Research caches, raw API results, imported exports, and run
                history remain in a private local working directory excluded
                from the public repository. The website publishes editorial
                content, not private Search Console reports or credentials.
              </p>
              <p>
                Authorized operators may send selected aggregate research
                reports to Codex/OpenAI for analysis and editorial assistance.
                OpenAI processes that information under the operator’s
                applicable service terms and account data settings. Operators
                must select settings consistent with Google’s applicable
                data-use requirements; The tool has no model-training feature.
                Credentials are not included in research reports.
              </p>
            </>
          ),
        },
        {
          id: 'retention',
          title: 'Retention, revocation, and deletion',
          content: (
            <>
              <p>
                Keyword estimates are normally refreshed monthly. Older private
                research reports and publication history may be retained to
                compare results and avoid duplicate work until the operator
                deletes them or they are no longer needed. Cache expiry alone
                does not delete historical local reports.
              </p>
              <p>
                The operator can revoke the connection in{' '}
                <a href="https://myaccount.google.com/connections">
                  Google Account connections
                </a>
                , remove the local Gum authorization, and delete local research
                files. Revoking access stops new authorized retrieval; it does
                not automatically remove previously saved reports or information
                already processed by another service.
              </p>
              <p>
                We use reasonable measures to restrict access. No storage or
                transmission method is completely secure. Contact us for access,
                deletion, or other privacy requests relating to information we
                hold.
              </p>
            </>
          ),
        },
        {
          id: 'scope',
          title: 'Website visitors and app users',
          content: (
            <>
              <p>
                This tool does not require website visitors or SignDocs users to
                connect a Google account. It adds no advertising or analytics
                scripts to this website and does not change on-device document
                handling. Our{' '}
                <a href={sitePath('/privacy/')}>SignDocs privacy policy</a>{' '}
                explains the app, hosting, and support practices.
              </p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact',
          content: (
            <>
              <p>
                Damas Technologies LLC operates this tool. For privacy
                questions, deletion requests, or concerns, email{' '}
                <a href="mailto:hi@damastechnologies.com">
                  hi@damastechnologies.com
                </a>
                . We update this notice when the tool’s data practices change;
                the effective date identifies this version.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

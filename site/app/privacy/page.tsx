import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy — SignDocs | Damas Technologies LLC',
  description:
    'How SignDocs handles local documents, signatures, planned AppsFlyer advertising attribution, support requests, and website visits. Damas Technologies LLC.',
  openGraph: {
    title: 'Privacy Policy — SignDocs',
    description: 'Privacy information for SignDocs by Damas Technologies LLC.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy — SignDocs',
    description: 'Privacy information for SignDocs by Damas Technologies LLC.',
  },
};

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    content: (
      <>
        <p>
          SignDocs and scansignature.app are owned and operated by{' '}
          <strong>Damas Technologies LLC</strong> (“we,” “us,” or “our”). We are
          responsible for the personal information described in this policy.
          Contact us at{' '}
          <a href="mailto:hi@damastechnologies.com">hi@damastechnologies.com</a>
          .
        </p>
        <p>
          This policy covers the SignDocs app for iPhone and iPad, this website,
          and communications with us. No account is required to use SignDocs.
        </p>
      </>
    ),
  },
  {
    id: 'documents-and-signatures',
    title: 'Your documents and signatures',
    content: (
      <>
        <p>
          Document scanning, signature cropping, paper-background removal, and
          PDF creation happen entirely on your device. These operations do not
          require an internet connection. SignDocs does not upload your
          documents or signatures to us or another service for processing.
        </p>
        <p>
          Saved signatures and documents remain on your device unless you choose
          to export or share them, or your device’s backup and storage settings
          copy them elsewhere. We do not receive document contents or signature
          images through advertising measurement.
        </p>
        <p>
          You choose which files to open and where to share exported copies.
          AirDrop, Mail, Messages, Files storage providers, and other
          destinations handle those copies under their own practices. Device or
          cloud backups are controlled by your settings and the relevant
          provider.
        </p>
      </>
    ),
  },
  {
    id: 'device-permissions',
    title: 'Device permissions',
    content: (
      <>
        <p>
          SignDocs requests camera access to scan documents and capture
          signatures. When you open a PDF through the file picker, the app uses
          the file you select. You can change camera access in your device’s
          Settings; camera-based features need that permission to work.
        </p>
      </>
    ),
  },
  {
    id: 'advertising-measurement',
    title: 'AppsFlyer and advertising measurement',
    content: (
      <>
        <p>
          <strong>Planned integration:</strong> we intend to add AppsFlyer to
          measure campaigns that promote SignDocs. This section applies to app
          versions in which that integration is enabled.
        </p>
        <p>
          AppsFlyer helps us understand which campaigns lead to installs and app
          launches and detect advertising fraud. Depending on the enabled
          settings and your permissions, it may receive:
        </p>
        <ul>
          <li>
            Device model, operating system and app version, language, and
            network information.
          </li>
          <li>IP address and approximate region derived from it.</li>
          <li>
            Install and launch events, timestamps, campaign references, and
            related ad interactions.
          </li>
          <li>
            App and device identifiers, such as an AppsFlyer identifier, Apple’s
            vendor identifier (IDFV), and Apple’s advertising identifier (IDFA)
            when tracking permission is granted.
          </li>
        </ul>
        <p>
          Document contents, scanned pages, and signature images are excluded
          from this measurement. Attribution data can be sent over the internet;
          this is separate from the app’s offline document processing.
        </p>
        <p>
          AppsFlyer acts as a service provider processing attribution
          information for us. Where we connect an advertising partner for a
          campaign, limited attribution information may also be shared with that
          partner to measure the campaign, subject to your permissions and
          applicable law. Learn more about{' '}
          <a href="https://www.appsflyer.com/legal/processing-customer-data/">
            AppsFlyer’s processing of customer data
          </a>{' '}
          and its{' '}
          <a href="https://www.appsflyer.com/legal/services-privacy-policy/">
            Services Privacy Policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'tracking-choices',
    title: 'Tracking and your choices',
    content: (
      <>
        <p>
          Where the integration involves tracking across other companies’ apps
          or websites, we will request permission through Apple’s App Tracking
          Transparency prompt before enabling that tracking or accessing the
          IDFA. We will also obtain any additional consent required by
          applicable law.
        </p>
        <p>
          You can decline tracking and change your choice in{' '}
          <strong>Settings → Privacy &amp; Security → Tracking</strong>.
          Scanning and signing do not depend on permission to track. Declining
          tracking does not necessarily stop all measurement: limited
          measurement that does not track you across companies may still occur
          where permitted.
        </p>
        <p>
          To ask about attribution data, request deletion, or exercise an
          applicable right to opt out of advertising-related sharing, email{' '}
          <a href="mailto:hi@damastechnologies.com">hi@damastechnologies.com</a>
          . Changing a tracking permission does not itself delete data
          previously collected.{' '}
          <a href="https://developer.apple.com/app-store/user-privacy-and-data-use/">
            Apple explains its tracking permission framework here
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'support-and-website',
    title: 'Support and website visits',
    content: (
      <>
        <p>
          If you contact us, we receive your email address and the information
          or attachments you choose to send. We use this information to respond,
          troubleshoot issues, and handle your request. Please send only the
          information needed for your request.
        </p>
        <p>
          This website is hosted on GitHub Pages. GitHub logs visitors’ IP
          addresses for security purposes. See{' '}
          <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">
            GitHub Pages data collection
          </a>{' '}
          and the{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
            GitHub Privacy Statement
          </a>
          .
        </p>
        <p>
          The website does not embed AppsFlyer, advertising trackers, or
          analytics scripts, and we do not set advertising or analytics cookies
          here. Following an App Store or other external link takes you to a
          service with its own privacy practices.
        </p>
      </>
    ),
  },
  {
    id: 'use-and-disclosure',
    title: 'Use and disclosure of information',
    content: (
      <>
        <p>
          We use information for the purposes described above: providing the
          app’s features, responding to you, operating and protecting the
          website, and measuring advertising campaigns when enabled.
        </p>
        <p>
          Where a legal basis is required, we rely on consent for processing
          that requires it; providing the service you request; and legitimate
          interests in support, security, and measurement where permitted and
          balanced against your rights. We may also process information to meet
          legal obligations.
        </p>
        <p>
          Service providers, including email providers, GitHub, and AppsFlyer
          when enabled, handle information needed for their services. We may
          disclose information when legally required or necessary to address
          fraud, protect rights or safety, or complete a business transfer with
          appropriate protections. Your local documents are not available to us
          through these services unless you separately send them to us.
        </p>
        <p>
          Providers may process information outside your country. Where
          applicable law requires safeguards for an international transfer, we
          will use the required protections.
        </p>
      </>
    ),
  },
  {
    id: 'retention-and-security',
    title: 'Retention, deletion, and security',
    content: (
      <>
        <p>
          You control the signatures and documents saved in SignDocs and can
          delete saved items in the app. Copies exported to another app or
          included in a backup must be managed with that app or provider. We
          cannot remotely retrieve or delete files stored only on your device.
        </p>
        <p>
          We retain support correspondence only for as long as needed to handle
          your request, resolve related issues, and meet legal obligations. When
          attribution is enabled, retention depends on the measurement purpose,
          AppsFlyer account settings, and applicable legal requirements. Contact
          us to request information about retention or deletion of data
          associated with your device. GitHub manages its hosting logs under its
          own policies.
        </p>
        <p>
          We use reasonable measures to protect information handled by us. No
          storage or transmission method is completely secure. Protect access to
          your device and any copies you export or back up.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your privacy rights',
    content: (
      <>
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or receive a copy of personal information; restrict or object
          to processing; withdraw consent; or opt out of certain
          advertising-related sharing. Withdrawing consent does not affect
          processing already lawfully carried out.
        </p>
        <p>
          Send requests to{' '}
          <a href="mailto:hi@damastechnologies.com">hi@damastechnologies.com</a>
          . We may ask for information reasonably necessary to verify and locate
          your request, and will respond as required by applicable law. There is
          no SignDocs account to delete. For documents kept only on your device,
          use the app’s controls.
        </p>
        <p>
          You may also have the right to complain to your local data protection
          authority.
        </p>
      </>
    ),
  },
  {
    id: 'children-and-updates',
    title: 'Children and policy updates',
    content: (
      <>
        <p>
          SignDocs is a general-purpose document utility and is not directed at
          children. If you believe a child has provided us with personal
          information that should be removed, contact us.
        </p>
        <p>
          We will update this policy when data practices change, including to
          reflect the released AppsFlyer configuration. The effective date above
          identifies this version. We will provide additional notice and request
          consent for changes where required.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    content: (
      <>
        <p>
          For privacy questions, requests, or concerns, contact the owner of
          SignDocs:
        </p>
        <address>
          <strong>Damas Technologies LLC</strong>
          <br />
          <a href="mailto:hi@damastechnologies.com">hi@damastechnologies.com</a>
        </address>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      introduction={
        <p>
          Your documents are processed on your device. This policy explains that
          processing, our planned AppsFlyer integration, and information handled
          through support and this website.
        </p>
      }
      sections={sections}
    />
  );
}

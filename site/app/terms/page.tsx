import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/legal-page';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const metadata: Metadata = {
  title: 'Terms of Use — SignDocs | Damas Technologies LLC',
  description:
    'Terms for using SignDocs and scansignature.app, owned and operated by Damas Technologies LLC. Contact hi@damastechnologies.com.',
  openGraph: {
    title: 'Terms of Use — SignDocs',
    description: 'Terms of Use for SignDocs by Damas Technologies LLC.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Use — SignDocs',
    description: 'Terms of Use for SignDocs by Damas Technologies LLC.',
  },
};

const sections: LegalSection[] = [
  {
    id: 'owner-and-scope',
    title: 'Owner and scope',
    content: (
      <>
        <p>
          SignDocs and this website are owned and operated by{' '}
          <strong>Damas Technologies LLC</strong> (“we,” “us,” or “our”). These
          Terms of Use apply to your use of SignDocs for iPhone and iPad and the
          website at scansignature.app.
        </p>
        <p>
          By using the app or website, you agree to these terms to the extent
          permitted by applicable law. If you do not agree, stop using them. You
          must have the legal capacity to agree, or the permission of a parent
          or guardian where required.
        </p>
      </>
    ),
  },
  {
    id: 'apple-license',
    title: 'Apple’s app license',
    content: (
      <>
        <p>
          Your license to use the iOS and iPadOS app is governed by{' '}
          <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">
            Apple’s Standard End User License Agreement (EULA)
          </a>{' '}
          and the applicable App Store usage rules. Damas Technologies LLC is
          the provider of SignDocs.
        </p>
        <p>
          These terms supplement that agreement with information about SignDocs
          and this website. They do not replace Apple’s standard app license. If
          a provision conflicts with the EULA on an app-licensing matter, the
          EULA applies, subject to rights that applicable law does not allow you
          to waive.
        </p>
      </>
    ),
  },
  {
    id: 'using-signdocs',
    title: 'Using SignDocs responsibly',
    content: (
      <>
        <p>
          SignDocs lets you scan documents, capture a handwritten signature,
          place it on a PDF, and save or share a signed copy. You are
          responsible for the documents you process and the signatures you use.
        </p>
        <ul>
          <li>
            Only scan, copy, sign, or share material you own or are authorized
            to use.
          </li>
          <li>Use another person’s signature only with their authorization.</li>
          <li>
            Do not forge signatures, impersonate another person, commit fraud,
            or infringe anyone’s privacy or intellectual property rights.
          </li>
          <li>
            Do not interfere with the app or website, bypass security measures,
            or use them unlawfully.
          </li>
        </ul>
        <p>
          Review every scan and signed PDF before relying on or sharing it.
          Check page order, readability, signature placement, and the content of
          the exported file.
        </p>
      </>
    ),
  },
  {
    id: 'signatures-and-documents',
    title: 'Signatures and document acceptance',
    content: (
      <>
        <p>
          SignDocs places an image of a handwritten signature on a PDF. It does
          not verify a signer’s identity, authority, or intent, or provide a
          certificate-based digital signature or notarization service.
        </p>
        <p>
          Whether a signed document is accepted or legally effective depends on
          the document, the parties, and applicable requirements. Confirm that
          your recipient accepts this method of signing. We do not guarantee
          that a document created with SignDocs will satisfy every legal,
          regulatory, or recipient requirement.
        </p>
      </>
    ),
  },
  {
    id: 'ownership',
    title: 'App ownership and your files',
    content: (
      <>
        <p>
          Damas Technologies LLC and its licensors retain their rights in the
          app, website, branding, and software. Your use of SignDocs does not
          transfer ownership of those materials to you. Third-party and
          open-source materials remain subject to their applicable licenses.
        </p>
        <p>
          You retain your rights in your documents and signatures. These terms
          do not give us ownership of them. Keep copies of important files and
          protect access to your device. Files that exist only on your device
          may be lost if you delete them, remove the app, or lose access to the
          device.
        </p>
      </>
    ),
  },
  {
    id: 'privacy-and-sharing',
    title: 'Privacy and sharing',
    content: (
      <>
        <p>
          Document scanning, signature cropping, paper-background removal, and
          PDF creation happen on your device. Read our{' '}
          <a href={`${basePath}/privacy/`}>Privacy Policy</a> for details about
          local files, planned AppsFlyer advertising measurement, support
          communications, and website hosting.
        </p>
        <p>
          When you choose to export or share a file, the receiving app, storage
          provider, or recipient handles that copy under its own terms and
          practices. You are responsible for choosing the destination and
          confirming that you are authorized to share the content.
        </p>
      </>
    ),
  },
  {
    id: 'availability-and-responsibility',
    title: 'Availability and responsibility',
    content: (
      <>
        <p>
          We may update the app and website to improve them, fix issues, or
          respond to changes in supported devices and operating systems.
          Features and compatibility may change. We do not promise uninterrupted
          availability or error-free results.
        </p>
        <p>
          To the extent permitted by law, the website is provided as available,
          without additional warranties. The app’s warranty provisions,
          termination rules, and limitations of liability are set out in the
          Apple Standard EULA. Nothing in these terms excludes liability or
          removes consumer rights that cannot lawfully be excluded or
          restricted.
        </p>
      </>
    ),
  },
  {
    id: 'changes-and-contact',
    title: 'Changes and contact',
    content: (
      <>
        <p>
          We may update these terms as the app, website, or applicable
          requirements change. The effective date above identifies the current
          version. Where the law requires notice or agreement to a material
          change, we will provide it before applying that change.
        </p>
        <p>
          For questions about these terms, the app, or your use of SignDocs,
          contact:
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

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      introduction={
        <p>
          The terms for using SignDocs and this website, provided by Damas
          Technologies LLC.
        </p>
      }
      sections={sections}
    />
  );
}

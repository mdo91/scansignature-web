import type { Metadata } from 'next';
import { basePath, origin, pageMetadata } from '@/lib/site';
import growth from '../growth.config.json';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  ...pageMetadata(
    'Signature Scan: Sign PDFs on iPhone & iPad | SignDocs',
    'Scan documents, capture your real handwritten signature, and sign PDFs on iPhone and iPad with SignDocs. On-device processing, no account required.',
    '/',
  ),
  applicationName: 'Signature Scan: Sign PDFs',
  verification: { google: growth.googleSiteVerification },
  icons: {
    icon: `${basePath}/favicon.png`,
    apple: `${basePath}/apple-touch-icon.png`,
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const metadata: Metadata = {
  title: 'SignDocs — Scan documents. Capture your signature. Sign PDFs.',
  description:
    'Turn paper into PDFs and add your real handwritten signature with SignDocs for iPhone and iPad. On-device processing, no internet required, and no account needed.',
  applicationName: 'SignDocs',
  icons: {
    icon: `${basePath}/favicon.png`,
    apple: `${basePath}/apple-touch-icon.png`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SignDocs',
    title: 'SignDocs — From paper to signed. Just like that.',
    description:
      'Scan documents, capture your handwritten signature, and sign PDFs on your iPhone or iPad. Processed entirely on your device.',
  },
  twitter: {
    card: 'summary',
    title: 'SignDocs — Scan. Sign. Send.',
    description:
      'Your documents. Your handwritten signature. On your iPhone and iPad.',
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

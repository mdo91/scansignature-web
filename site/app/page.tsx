import {
  ArrowDown,
  ArrowUpRight,
  LockKeyhole,
  ScanLine,
  PenLine,
  Send,
  WifiOff,
  UserRoundCheck,
  FolderCheck,
  Check,
} from 'lucide-react';
import FeatureGallery from './feature-gallery';
import SiteFooter from '@/components/site-footer';

const appStoreUrl = 'https://apps.apple.com/app/id6805875185';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (name: string) => `${basePath}/mockup/${name}`;

function StoreBadge() {
  return (
    <a
      className="store-badge"
      href={appStoreUrl}
      aria-label="Download SignDocs on the App Store"
    >
      <img
        src={asset('DownloadAppleBadge.svg')}
        alt="Download on the App Store"
        width="156"
        height="52"
      />
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a className="brand" href="#" aria-label="SignDocs home">
          <img src={asset('app-logo.png')} alt="" width="38" height="38" />
          <span>SignDocs</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#features">How it works</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <a className="header-download" href={appStoreUrl}>
          Get SignDocs <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> MADE FOR IPHONE & IPAD
            </p>
            <h1 id="hero-title">
              From paper
              <br />
              to <span>signed.</span>
              <br />
              Just like that.
            </h1>
            <p className="hero-description">
              Scan a document. Capture your real signature. Share a signed PDF.
              Everyday paperwork, handled with SignDocs.
            </p>
            <div className="hero-actions">
              <StoreBadge />
              <a className="text-link" href="#features">
                Take a closer look <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-note">
              <LockKeyhole size={14} aria-hidden="true" /> On-device processing.
              No account required.
            </p>
          </div>
          <div className="hero-visual">
            <div className="hero-halo" aria-hidden="true" />
            <img
              className="hero-phone hero-phone-back"
              src={asset('place-signature.png')}
              alt="Position and resize your handwritten signature on a PDF in SignDocs."
              width="450"
              height="920"
              fetchPriority="high"
            />
            <img
              className="hero-phone hero-phone-front"
              src={asset('main.png')}
              alt="The SignDocs document studio, with Scan Document, Choose PDF, and Scan Signature options."
              width="450"
              height="920"
              fetchPriority="high"
            />
            <div className="privacy-label">
              <span className="privacy-label-icon">
                <LockKeyhole size={17} aria-hidden="true" />
              </span>
              <span>
                Yours. And only yours.<small>Processed on your device.</small>
              </span>
            </div>
          </div>
        </section>
        <section
          className="workflow wrap"
          aria-label="From paper to a signed PDF"
        >
          <article>
            <ScanLine aria-hidden="true" />
            <div>
              <h2>Scan the paper.</h2>
              <p>Turn one page or many into a PDF.</p>
            </div>
          </article>
          <article>
            <PenLine aria-hidden="true" />
            <div>
              <h2>Make it yours.</h2>
              <p>Add your own handwritten signature.</p>
            </div>
          </article>
          <article>
            <Send aria-hidden="true" />
            <div>
              <h2>Send it on its way.</h2>
              <p>Save a signed copy, ready to share.</p>
            </div>
          </article>
        </section>
        <FeatureGallery />
        <section
          id="privacy"
          className="privacy-section wrap"
          aria-labelledby="privacy-title"
        >
          <div className="privacy-intro">
            <div className="privacy-symbol">
              <LockKeyhole size={27} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <p className="eyebrow">PRIVATE BY DESIGN</p>
            <h2 id="privacy-title">
              Your paperwork.
              <br />
              <span>Your business.</span>
            </h2>
            <p>
              Your documents and signatures are processed entirely on your
              iPhone or iPad. SignDocs never uploads them for processing. You
              decide when and where to share.
            </p>
          </div>
          <div className="privacy-points">
            <article>
              <WifiOff size={22} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h3>No internet required.</h3>
                <p>
                  Scanning, signature cropping, background removal, and PDF
                  creation all happen on your device.
                </p>
              </div>
            </article>
            <article>
              <UserRoundCheck size={22} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h3>No account to create.</h3>
                <p>
                  Open the app and get to work. Your saved signatures stay on
                  your device, ready when you need them.
                </p>
              </div>
            </article>
            <article>
              <FolderCheck size={22} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h3>Your original stays original.</h3>
                <p>
                  Save a new PDF with your signature embedded. The original PDF
                  stays unchanged.
                </p>
              </div>
            </article>
          </div>
        </section>
        <section className="share-section wrap" aria-labelledby="share-title">
          <div>
            <p className="eyebrow">READY FOR WHAT’S NEXT</p>
            <h2 id="share-title">
              Signed. Saved.
              <br />
              <span>On its way.</span>
            </h2>
          </div>
          <div className="share-copy">
            <p>
              Name your finished PDF, find it again in Recent Docs, and send it
              wherever it needs to go.
            </p>
            <ul>
              <li>
                <Check size={16} aria-hidden="true" /> AirDrop to a nearby
                device
              </li>
              <li>
                <Check size={16} aria-hidden="true" /> Share with Mail,
                Messages, and compatible apps
              </li>
              <li>
                <Check size={16} aria-hidden="true" /> Reopen saved PDFs
                whenever you need
              </li>
            </ul>
          </div>
        </section>
        <section
          className="download-section wrap"
          aria-labelledby="download-title"
        >
          <img
            className="download-icon"
            src={asset('app-logo.png')}
            width="72"
            height="72"
            alt=""
            loading="lazy"
          />
          <h2 id="download-title">
            A little less paperwork.
            <br />A little more day.
          </h2>
          <p>Scan, sign, and get on with it.</p>
          <StoreBadge />
          <p className="download-note">For iPhone and iPad.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

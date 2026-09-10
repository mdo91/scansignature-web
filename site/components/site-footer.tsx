const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <a
        className="brand footer-brand"
        href={`${basePath}/`}
        aria-label="SignDocs home"
      >
        <img
          src={`${basePath}/mockup/app-logo.png`}
          width="28"
          height="28"
          alt=""
          loading="lazy"
        />
        <span>SignDocs</span>
      </a>
      <p>© {new Date().getFullYear()} Damas Technologies LLC</p>
      <nav aria-label="Footer navigation">
        <a href={`${basePath}/privacy/`}>Privacy Policy</a>
        <a href={`${basePath}/terms/`}>Terms of Use</a>
        <a href="mailto:hi@damastechnologies.com">Contact</a>
      </nav>
    </footer>
  );
}

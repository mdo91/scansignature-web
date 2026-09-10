# SignDocs landing page

A minimal, responsive landing page for SignDocs on iPhone and iPad. It uses the supplied mockups and original App Store badge, and links to https://apps.apple.com/app/id6805875185.

## Run locally

Requires Node.js 22.13 or newer and npm.

```sh
npm --prefix site ci
npm run dev
```

Open http://127.0.0.1:3000. The server stays running until you press Ctrl+C.

## Build and preview the static website

```sh
npm run check
npm run build
npm run preview
```

The static output is `site/dist/client/`. The production preview runs at http://127.0.0.1:4173. There is no runtime server, database, account system, analytics, or external font dependency in the published page.

## Publish later on GitHub Pages

Repository: [mdo91/scansignature-web](https://github.com/mdo91/scansignature-web), default branch `main`.

Pushing to `main` runs **Validate SignDocs website**, which installs the locked dependencies, checks TypeScript, builds for the repository URL path, and verifies the publication artifact. Pull requests to `main` run the same checks. Publishing is manual.

To launch the site:

1. In the repository's **Settings → Pages**, the **Source** must be **GitHub Actions**.
2. Open [Publish SignDocs to GitHub Pages](https://github.com/mdo91/scansignature-web/actions/workflows/deploy-pages.yml) under **Actions**, select **Run workflow**, and choose `main`.
3. When deployment succeeds, the site will be available at [mdo91.github.io/scansignature-web](https://mdo91.github.io/scansignature-web/).

The publishing workflow obtains the repository path from GitHub Pages and sets `NEXT_PUBLIC_BASE_PATH` at build time. This supports the project site at `https://mdo91.github.io/scansignature-web/` and a root/custom-domain site. Only `site/dist/client` is uploaded.

The build includes `site/scripts/prepare-static.mjs`, which places Vinext's path-prefixed export at the artifact root. GitHub Pages supplies the URL prefix when serving the artifact.

For a manual project-path build:

```sh
NEXT_PUBLIC_BASE_PATH=/scansignature-web npm run build
```

Build again without that variable before using a root-path local production preview. The workflow itself must be run on GitHub to verify the deployment and account-specific Pages settings.

## Content and assets

- `site/app/page.tsx`: headline, App Store link, workflow summary, privacy, sharing, and footer.
- `site/app/feature-gallery.tsx`: five feature captions and the accessible manual carousel.
- `site/app/globals.css`: responsive layout, typography, and colors.
- `site/app/layout.tsx`: page title, descriptions, and icons.
- `mockup/`: untouched source assets.
- `site/public/mockup/`: published assets; the app icon is reduced for web delivery.

The site uses React, Vinext static export, and the supplied Shadcn/Embla carousel primitive. On-device privacy statements describe the app's processing, as provided in the product description. The footer links to that explanation and Apple's standard EULA, not an invented legal privacy policy.

## Validation

- TypeScript checks and the production static export pass.
- Root-path and `/ScanSignatureWeb` exports were checked for valid local image, stylesheet, script, and anchor references.
- All eight supplied assets are used; images have alt attributes and explicit dimensions.
- Starter dependencies were updated to compatible patched versions; npm reported zero known vulnerabilities after installation on September 10, 2026.
- The local page returns HTTP 200. Browser interaction/visual testing and an actual GitHub deployment have not been performed.

## UX decisions and sources

- Keep the value proposition and download link visible outside the carousel; important information should not depend on discovering later slides. Use visible previous/next controls, selected indicators, and a partial next screenshot to signal that there is more to explore. [Nielsen Norman Group: Carousel Usability](https://www.nngroup.com/articles/designing-effective-carousels/).
- Use a manual carousel with keyboard navigation, descriptive labels, announced slide changes, touch dragging, and reduced-motion support. All screenshots and captions are included in the HTML, with horizontal scrolling as a no-JavaScript fallback. [W3C WAI: Carousels Tutorial](https://www.w3.org/WAI/tutorials/carousels/).
- Use the supplied official App Store badge without redrawing it and link it directly to the app listing. [Apple: Marketing Resources and Identity Guidelines](https://developer.apple.com/app-store/marketing/guidelines/).
- Keep the output static and let the Pages workflow configure the deployment path. [GitHub: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

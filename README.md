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

## Publish on GitHub Pages

Repository: [mdo91/scansignature-web](https://github.com/mdo91/scansignature-web), default branch `main`.

Pushing to `main` automatically runs **Publish SignDocs to GitHub Pages**. It installs the locked dependencies, checks TypeScript, builds the landing page, verifies its content and assets, and publishes only the static output. **Validate SignDocs website** also checks builds for a repository URL path on pushes and pull requests to `main`.

The public site is [scansignature.app](https://scansignature.app/).

Keep **Settings → Pages → Source** set to **GitHub Actions**, with **Custom domain** set to `scansignature.app` and **Enforce HTTPS** enabled. Publishing directly from the `main` branch's root renders the README instead of building the landing page.

To republish without a new commit, open [Publish SignDocs to GitHub Pages](https://github.com/mdo91/scansignature-web/actions/workflows/deploy-pages.yml), select **Run workflow**, and choose `main`. Monitor that run for deployment results.

The publishing workflow obtains the URL path from GitHub Pages and sets `NEXT_PUBLIC_BASE_PATH` at build time. For the custom domain `scansignature.app`, the path is empty, so the site and its assets are served at the domain root. A standard repository URL such as `mdo91.github.io/scansignature-web/` uses `/scansignature-web`. Only `site/dist/client` is uploaded.

The build includes `site/scripts/prepare-static.mjs`, which places Vinext's path-prefixed export at the artifact root. GitHub Pages supplies the URL prefix when serving the artifact.

For a manual project-path build:

```sh
NEXT_PUBLIC_BASE_PATH=/scansignature-web npm run build
```

Build without that variable for the custom domain or the root-path local production preview.

## Content and assets

- `site/app/page.tsx`: headline, App Store link, workflow summary, privacy, sharing, and footer.
- `site/app/feature-gallery.tsx`: five feature captions and the accessible manual carousel.
- `site/app/globals.css`: responsive layout, typography, and colors.
- `site/app/layout.tsx`: page title, descriptions, and icons.
- `site/app/terms/page.tsx`: Terms of Use, supplementing Apple's Standard EULA.
- `site/app/privacy/page.tsx`: Privacy Policy covering local files, AppsFlyer removal in 1.0.1, earlier-version attribution, Apple services, support, and hosting.
- `site/components/legal-page.tsx`: shared legal document layout and table of contents.
- `site/components/site-footer.tsx`: ownership, legal links, and contact information on every page.
- `mockup/`: untouched source assets.
- `site/public/mockup/`: published assets; the app icon is reduced for web delivery.

The site uses React, Vinext static export, and the supplied Shadcn/Embla carousel primitive. On-device privacy statements describe the app's document and signature processing, as provided in the product description. The footer links to the [Privacy Policy](https://scansignature.app/privacy/), [Terms of Use](https://scansignature.app/terms/), and hi@damastechnologies.com. Both legal pages identify Damas Technologies LLC as the owner.

## App privacy integration

The policy distinguishes version **1.0**, which starts AppsFlyer attribution only after tracking permission, from **1.0.1**, which removes the SDK and its tracking prompt. It retains guidance for earlier-version users and previously collected attribution records. No AppsFlyer SDK or tracking code has been added to this website. Website publication does not configure the iOS app or App Store Connect; publish the new App Store privacy label when 1.0.1 becomes the available release.

The disclosures distinguish local document processing from earlier-version attribution, Apple services, and voluntary support emails. Reference material: [AppsFlyer customer data processing](https://www.appsflyer.com/legal/processing-customer-data/), [AppsFlyer iOS privacy controls](https://dev.appsflyer.com/hc/docs/preserve-user-privacy-ios), [Apple user privacy and data use](https://developer.apple.com/app-store/user-privacy-and-data-use/), and [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection).

## Validation

- TypeScript checks and the production static export pass.
- Root-path and `/scansignature-web` exports are checked for legal pages and valid local image, stylesheet, script, and anchor references.
- All eight supplied assets are used; images have alt attributes and explicit dimensions.
- Starter dependencies were updated to compatible patched versions; npm reported zero known vulnerabilities after installation on September 10, 2026.
- The publishing workflow verifies that the generated artifact contains the landing page, both legal pages with ownership/contact information, the App Store link, and assets before deploying. Deployment results are available in GitHub Actions.
- The local page returns HTTP 200. Browser interaction/visual testing has not been performed.

## UX decisions and sources

- Keep the value proposition and download link visible outside the carousel; important information should not depend on discovering later slides. Use visible previous/next controls, selected indicators, and a partial next screenshot to signal that there is more to explore. [Nielsen Norman Group: Carousel Usability](https://www.nngroup.com/articles/designing-effective-carousels/).
- Use a manual carousel with keyboard navigation, descriptive labels, announced slide changes, touch dragging, and reduced-motion support. All screenshots and captions are included in the HTML, with horizontal scrolling as a no-JavaScript fallback. [W3C WAI: Carousels Tutorial](https://www.w3.org/WAI/tutorials/carousels/).
- Use the supplied official App Store badge without redrawing it and link it directly to the app listing. [Apple: Marketing Resources and Identity Guidelines](https://developer.apple.com/app-store/marketing/guidelines/).
- Keep the output static and let the Pages workflow configure the deployment path. [GitHub: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

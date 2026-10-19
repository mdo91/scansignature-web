# Signature Scan growth playbook

## Purpose and boundaries

Grow qualified US English search visits that lead to downloads of **Signature Scan: Sign PDFs**, also known as **SignDocs**. The owner is Damas Technologies LLC. The public website is https://scansignature.app/ and the app ID is 6805875185. Work only in this website repository. Preserve its design, static Vinext export, custom domain, existing legal disclosures, and GitHub Pages deployment.

The daily agent may publish one useful new guide or one substantial existing-guide update per Istanbul calendar day. Skipping is a good outcome when there is no useful, verifiable change. Do not create near-duplicate pages for keyword variants, backdate articles, refresh modification dates without changes, claim tests that were not performed, fabricate authors/reviews/results, or publish bulk AI content. Follow https://developers.google.com/search/docs/fundamentals/creating-helpful-content.

App facts: iOS/iPadOS 26 or later; scan paper to multipage PDFs; capture handwriting on paper; crop and remove paper backgrounds; compare Clean/Balanced/Bold extraction; preserve supported ink colors; save/reuse/rename/delete local signatures; open PDFs from Files; place and resize signatures; create separate signed copies; reopen Recent Docs and share through compatible apps. Processing runs on device. Sharing, cloud retrieval, installation, and purchase/restore flows have separate connection requirements. Free exports are limited; do not promise unlimited free use. Do not invent OCR, PDF merging, standalone PNG export, encryption, identity verification, certificate signatures, or legal validity. Verify changing facts against the current App Store listing and product documentation. Do not alter the iOS app or store listing.

## Before each run

1. Use `/Users/mdo/Documents/ScanSignatureWeb`. Confirm the Git remote, branch, and working-tree state. Never overwrite unrelated or uncommitted work. Resume an existing growth PR before opening a duplicate. Fetch main and use a clean branch from current origin/main.
2. Inspect `.growth/history.jsonl`, relevant recent commits, and open PRs to enforce at most one publication per Europe/Istanbul date, including recovery after an interrupted merge/deployment. Keep reports/history private and ignored.
3. Run `npm run growth:collect`. Gum lives at `.tools/gum`, uses profile `scansignature`, and keeps credentials outside source control. `.codex/config.toml` contains the local MCP entry. Read `.growth/latest.json`. An authentication error, missing property, unavailable response, or missing total is not zero traffic.

## Data and topic selection

The collector compares complete 28-day periods with a three-day buffer using Pacific reporting dates, requests finalized Search Console data for US web searches, paginates query/page/device rows, and separately requests totals. Search Console can omit anonymized and lower-volume queries. Its position is an aggregate, not an exact keyword ranking. Never imply causal ranking lift from one day's movement.

Prefer relevant non-brand searches with impressions, low CTR, and average positions 4–50. The scripted opportunity score is a triage aid, not a publishing instruction. Inspect intent, existing coverage, mobile/tablet relevance, and factual usefulness. Improve the page that already owns the intent before adding another. Twenty impressions is an initial triage threshold, not evidence of commercial demand.

When data is sparse, research an unserved problem from this backlog: signatures with faint strokes; scanner glare/cropped page troubleshooting; checking a signed PDF before email; capturing black/red/dark-blue ink; retaining the unsigned original; reusing a signature on iPad; local PDFs versus cloud placeholders. Check the published library before using any topic. Search primary sources and verify actual app steps. Avoid legal, tax, medical, identity-document storage, and security claims beyond demonstrated product behavior.

Keyword Planner is optional enrichment. Use only an authorized Google Ads account with approved API access. Gum operation `googleads.keywordPlanIdeas.generateKeywordIdeas` or `generateKeywordHistoricalMetrics` must explicitly request US geo target 2840 and English language 1000. Read `gum describe` before calls. Cache original results, timestamps, and targeting in `.growth/keyword-cache.json` for up to 30 days. Distinguish missing/merged/unknown inputs from zero demand; do not use Ads competition as an organic ranking difficulty score. Never create ads, campaigns, billing, or spend. Missing approval does not block Search Console or researched content.

## Write and validate

Articles are `site/content/blog/<slug>.md`, with YAML frontmatter. Copy the shape from an existing guide: title, description, publishedAt, updatedAt, topic, primaryQuery, image, imageAlt, related, sources, status. Dates must be quoted ISO dates. `status: draft` stays out of the static site and sitemap. Add factual source titles and HTTPS URLs. Use descriptive slugs and real product screenshots in `/mockup/`; no raw HTML or unsafe URLs. The template supplies H1, dates/byline, table of contents, sources, related articles, schema, and download CTAs.

Answer the task early, then give precise steps, useful limitations, and an appropriate next action. Include Apple's built-in methods when they meet the need. Add contextual links from at least one relevant existing page and link to related guides. Keep titles distinct and readable. Preserve the factual distinction between image signatures and certificate-based signatures. Do not claim independent hands-on testing based on screenshots or source inspection. Use the existing transparent editorial attribution.

The genuine App Store provider token is configured in `site/growth.config.json`. Shared helpers create stable, distinct campaign tokens; do not replace it with a guessed token, strip attribution, or add website analytics. Apple campaign data may be delayed or suppressed below its download threshold. Consult the existing Safari App Store Connect account only when available; do not try to bypass sign-in. Report unavailable attribution rather than guessing results.

Run `npm test`, `npm run check`, `NEXT_PUBLIC_BASE_PATH=/scansignature-web npm run build`, then `npm run build`. Both builds validate rendered content, unique metadata, production canonical URLs, schema, sitemap, assets, internal links, and anchors. Inspect a representative mobile/desktop page and keyboard navigation when changing templates or CSS. Content-only updates can reuse established layout checks while reviewing their exported HTML. Fix failures before publication.

## Publish and monitor

Use Conventional Commit branch names: `docs/blog-<short-topic>` for content-only updates, `fix/<short-name>` for corrections, or `feat/<short-name>` for new behavior. Never use a codex/ prefix. Commit only the intended change. Push and open a concise PR describing the problem, behavior, and validation; attach every PR to the Codex chat with the native attachment tool.

Wait for required GitHub checks. Merge automatically only when checks pass and existing repository protections permit it. Do not bypass reviews or protections. Resume the existing PR if approval is required, and notify the owner. A local build is not proof of deployment. Wait for the Pages workflow for the exact merged revision, confirm success, and check the published article and sitemap. If a deployed change fails, diagnose it or revert only the agent's change through a new checked PR; never discard unrelated work.

Append the Istanbul date, decision, query evidence (or researched fallback), changed slugs, PR URL, merged SHA, and deployment status to `.growth/history.jsonl`. Do not publish private Search Console reports in the public repository. On Mondays, include a concise 28-day search/campaign review when data is available. Notify on a verified publication, meaningful improvement, deployment failure, credential expiry, or required owner action. Stay quiet on unchanged or non-actionable runs.

## Installation and credential recovery

Gum v2.3.1 was downloaded from the official ehmo/gum release and verified against its published archive SHA-256. Its local binary and generated skill/MCP setup are ignored. Reinstall that release and run `gum setup --target codex --scope project --features skills,mcp --dry-run` before applying setup if needed. Set the MCP command to the absolute binary path and include `--profile scansignature`.

Google Cloud project: `signature-scan-growth`. Use a Desktop OAuth client owned by the operator. Register its secret through Gum's stdin/file support without printing it, then authorize only Search Console. Do not follow generic Gmail/Calendar/Drive examples. Keep all refresh tokens and secrets in supported secure storage, never source control or chat. A testing-mode OAuth consent configuration can expire refresh tokens after seven days; use an appropriate production configuration for recurring access and handle revocation explicitly. Google Ads setup additionally requires a customer ID and approved developer token.

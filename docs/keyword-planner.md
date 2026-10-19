# Keyword Planner integration

This workflow enriches the private daily Search Console report with demand estimates for four separate locale-market pairs: United States/English, Türkiye/Turkish, Germany/German, and Spain/Spanish. It does not track exact organic rankings, assign SEO difficulty from advertising competition, create ads, or authorize spend.

## Google access

Use the existing `signature-scan-growth` Cloud project and an authorized Google Ads **client** customer ID. A manager ID is only an optional `loginCustomerId` when accessing the client through a manager. Google retired developer tokens on September 9, 2026; access is now tied to the Cloud project that owns the OAuth client. Do not apply through the old manager-account API Center or fabricate a token.

Enable Google Ads API, apply for Explorer, complete OAuth brand verification, then apply for **Basic** access. Explorer excludes KeywordPlanIdeaService. Standard is unnecessary for this workload. Describe the actual internal keyword-research purpose honestly. OAuth publishing status and brand verification are different steps. The tool has public information at `/growth/` and a separate Google-data privacy notice at `/growth/privacy/`; these pages are accessible but excluded from search indexing and the article sitemap.

Google's Ads OAuth scope is `https://www.googleapis.com/auth/adwords` and is broader than keyword reads. Obtain specific operator consent before granting it. Use the separate `scansignature-keywords` profile; preserve the existing `scansignature` Search Console profile and original `.tools/gum` binary. Import the rotated Desktop OAuth client through Gum's stdin/file support, never by pasting secrets into a prompt or a command argument. The same Cloud project must own the OAuth client and API access. If Google requires a passkey, security delay, or another account check, the human operator must complete it; do not bypass the check. CSV imports remain available.

Official sources:

- https://developers.google.com/google-ads/api/docs/api-policy/developer-token
- https://developers.google.com/google-ads/api/docs/api-policy/access-levels
- https://developers.google.com/google-ads/api/docs/api-policy/brand-verification
- https://developers.google.com/google-ads/api/docs/keyword-planning/overview
- https://developers.google.com/google-ads/api/data/codes-formats
- https://developers.google.com/google-ads/api/data/geotargets

## Reproducible Gum compatibility build

The upstream v2.3.1 adapter still rejects requests without a developer token. The small patch in `scripts/gum/google-ads-project-access.patch` removes that obsolete requirement while retaining mandatory OAuth. Legacy tokens, when configured, remain server-side and optional. Tests cover requests with no token hook or an empty token, correct OAuth and omitted headers, alongside all upstream adapter fixtures and authentication failures. No secrets are part of the patch or tests.

Upstream source: https://github.com/ehmo/gum, MIT license. Pin: v2.3.1, commit `f8ef8dad227fc1c57925ca02c0d90e60aec0d488`.

Run from the repository root with Go 1.26 or later:

```sh
scripts/gum/build-keyword-gum.sh
```

The script verifies the source revision, applies or verifies the committed patch, runs the complete Google Ads adapter test package, and builds `.tools/gum-keywords` with version `2.3.1-scansignature.1`. It leaves `.tools/gum` unchanged. `GUM_GO_BINARY` can select a Go binary; otherwise the script prefers the project-local toolchain then PATH. CI repeats the build with Go 1.27.2. The setup Mac's project-local Go archive came from go.dev and was verified against its published SHA-256. The binary, downloaded sources, and toolchain are ignored local dependencies.

## Collection and configuration

Run these from `site/`:

```sh
npm run growth:keywords -- --plan
npm run growth:keywords
npm run growth:collect
```

`--plan` prints the seed topics and targeting without making requests. Seeds combine locale-specific phrases for the six core workflows with that locale's published guides' `primaryQuery` values. Article-specific phrases alone can be too narrow to produce useful discovery. API collection uses only `generateKeywordIdeas` and `generateKeywordHistoricalMetrics`, batches idea seeds in groups of 20, paginates, and explicitly sends one country, one language, and `GOOGLE_SEARCH`. Target pairs are US/en (`geoTargetConstants/2840`, `languageConstants/1000`), TR/tr (`2792`, `1037`), DE/de (`2276`, `1001`), and ES/es (`2724`, `1003`). The IDs follow Google's current Geo Targets and Language Codes references; no Ads API permission beyond the existing authorized Keyword Planner workflow is added. `--refresh` forces a real request for approval checks or manual recovery.

Private `.growth/keyword-settings.json` contains a ten-digit `customerId`, optional `loginCustomerId`, and `accessStatus`. Use `pending-basic` until both Basic access and Ads OAuth are verified. Set `accessStatus` to `ready` only after a successful real API trial. This file must not contain credentials. `npm run growth:collect` reads Search Console separately for each country and refreshes each keyword cache only when needed; a keyword failure must never hide Search Console results. A fresh cache causes no daily API calls. The independent cache files are `.growth/keyword-cache.json` for US/en, `.growth/keyword-cache-TR-tr.json`, `.growth/keyword-cache-DE-de.json`, and `.growth/keyword-cache-ES-es.json`.

## CSV bridge

In the authorized Google Ads account, open Tools → Planning → Keyword Planner → Discover new keywords. Use the localized guides' topics and scansignature.app as seeds. Select the matching country, language, and **Google** network, then download the keyword-ideas CSV. Do not save ideas into a campaign or activate any existing draft campaign.

Import with the actual local file and original export date:

```sh
npm run growth:keywords -- --import-csv /absolute/path/KeywordStats.csv --country US --language en --network GOOGLE_SEARCH --exported-at YYYY-MM-DD
```

Use `--country TR --language tr`, `--country DE --language de`, or `--country ES --language es` for the matching locale caches. Keep the CSV export's original date and targeting.

The targeting flags are an explicit operator assertion: CSV column names alone do not prove country, language, or network. The importer accepts English headers, comma or tab separators, quoted values, UTF-8 and UTF-16LE exports, numeric point estimates and ranges. It preserves ranges as ranges and missing values as null. Numeric CSV values are Google-provided estimates, not exact traffic counts; they may be representative values for the broad ranges shown in the account UI. Data older than 30 days is rejected for a fresh import; re-importing an old export does not reset its observation age. Refresh monthly while API access is pending.

## Private output and failures

Each locale cache uses schema version 1 with retrieval and observation timestamps, explicit matching targeting, source/provenance, and normalized keywords. Each keyword includes close variants, an average estimate or null, an optional range, optional monthly history, and distinctly named `advertiserCompetition` fields. Preserve Google's grouping; never sum close variants or translate a range into a fabricated exact number.

Raw API responses or original CSVs are retained privately, as are market-specific keyword status files and run history. Writes are atomic and restricted to the owner. A failed refresh retains the prior cache. Missing, wrong-market, invalid, future-dated, and stale caches cannot supply fresh demand. Missing metrics are not zero. Cached demand is matched only to Search Console opportunities for the same locale and market. Research candidates are provisional coverage aids; the agent must still inspect intent and the full localized library.

When access is pending, continue researched content using a fresh CSV when available. Notify once on a changed approval state, credential expiry, or a needed fresh export; do not repeat unchanged setup warnings daily. After authentication or approval recovery, force one keyword refresh, verify targeting and credential refresh, then run the daily collector and inspect its private output. Do not put any private reports or credential downloads in a PR.

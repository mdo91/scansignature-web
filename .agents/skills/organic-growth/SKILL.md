---
name: organic-growth
description: Build and operate a measurement-led, people-first organic search growth workflow for apps and websites. Use when improving SEO, planning search-led content, connecting search-demand data, or creating a recurring traffic-growth process.
---

# Organic Growth for Apps and Websites

Grow qualified organic visits and the product action that matters (for example, an app install, signup, purchase, or lead). Search visibility is a goal, not a promised outcome. Use evidence and useful content; never manufacture rankings, demand, product claims, or publication activity.

## Start with the project

1. Read repository instructions, inspect the working tree, and preserve existing changes.
2. Identify the product, audience, target countries and languages, primary conversion, website stack, deployment path, published content, and verified product facts. Use product documentation, the current app-store listing, and first-party sources. Record what remains unverified.
3. Inspect existing search measurement and SEO implementation before adding tools. Reuse connected Search Console or equivalent first-party search data where available. Do not add website analytics or new paid services unless requested.
4. Establish a baseline and reporting window. Compare equivalent, sufficiently complete periods; label missing, delayed, suppressed, or incomplete data as unavailable rather than zero.
5. For a Signature Scan task in this repository, also follow `docs/growth-playbook.md` and `docs/keyword-planner.md`. For another project, create a project brief using [the setup template](references/project-brief-template.md).

## Improve technical discoverability

- Ensure important pages return successful responses and render their main content without requiring client-side interaction.
- Give each indexable page a distinct, accurate title and description, one clear heading hierarchy, a canonical URL on the chosen production origin, and useful social-preview metadata.
- Keep `robots.txt` and a generated XML sitemap aligned with canonical, published, indexable pages. Exclude drafts, redirects, errors, and noindex pages.
- Add structured data only when it accurately describes visible page content and verified product facts. Do not invent ratings, prices, awards, authors, reviews, or feature claims.
- Make navigation and internal links descriptive and useful. Link related pages by task or intent, and provide a relevant next step toward the product conversion.
- Verify mobile layout, keyboard access, image alternatives, page metadata, links, sitemap output, and the production build. Keep existing branding and deployment behavior unless the task authorizes a redesign.

## Use search data responsibly

- Use Search Console or equivalent first-party search data for query and page impressions, clicks, click-through rate, and aggregate position. Position is an average across contexts, not an exact rank or a competitor-ranking report. Search systems may omit some queries.
- Use a keyword research provider only when access is already available or the project owner authorizes setup. Specify geography, language, and network. Treat volume as an estimate, preserve ranges and missing values, and cache historical demand at the provider's recommended cadence (monthly is a reasonable default for Keyword Planner).
- Keep advertising competition separate from organic ranking difficulty. Keyword tools do not guarantee organic traffic or first place.
- Prioritize relevant intent, existing page performance, useful coverage, and the product conversion. Improve the page that already serves an intent before creating a competing page. Do not infer content gaps from exact-string matching alone.
- Keep API credentials in supported secure storage. Never put secrets, raw private reports, or refresh tokens in source control, prompts, pull requests, public artifacts, or logs. Request explicit approval before granting new account scopes or moving credentials to a hosted runner.

## Plan and publish useful content

1. Choose a real audience question supported by search evidence, customer needs, or a well-researched backlog. Check the full existing library for overlap.
2. Answer the question early. Give accurate, task-specific steps, useful limitations, and an appropriate next action. Cite authoritative sources for changeable platform instructions and product claims.
3. Use only verified product capabilities. Do not invent testing, authorship, expertise, testimonials, legal outcomes, or screenshots. Attribute content transparently when a named author is not verified.
4. Add contextual internal links and a relevant conversion path without disrupting the reader's task. Use distinct campaign attribution only when its provider token is authentic and reporting is enabled.
5. Publish at most one substantial new page or update per scheduled run. Skip the run when evidence, factual support, or reader value is insufficient. Avoid near-duplicate pages, keyword stuffing, bulk AI content, and artificial date changes.
6. Validate metadata, links, rendered output, mobile layout, and the project build. Prefer a reviewable pull request and follow existing repository protections; do not bypass required checks or merge rules.

## Choose an operating model

- A local Codex automation can use the project's existing local tools and secure credential store. It needs the computer and Codex runtime available at its scheduled time; sleep or shutdown may prevent the run.
- A hosted runner can run while the owner's computer is offline. It needs a supported AI API credential when the runner uses an API-backed agent, securely provisioned search-provider credentials, private-state handling, repository permissions, and an end-to-end trial. Confirm any API billing and credential transfer explicitly.
- Do not switch runners or duplicate schedules silently. Keep one active publisher until the replacement has passed a full trial and its deployment is verified.

## Measure outcomes

Report search visits and query/page trends alongside the chosen product conversion where reliable attribution exists. Respect reporting delays and privacy thresholds. Distinguish observed changes from causal claims; do not promise ranking gains or infer downloads from clicks. Preserve a private run history to prevent duplicate work and report only meaningful changes, failures, expired access, or required owner action.

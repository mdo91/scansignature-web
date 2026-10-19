# Proposal: GitHub-hosted daily growth runner

**Status:** planning only. This document proposes the runner; it does not add or enable runner code.

## Proposed pull request description

Move the daily Signature Scan growth run from the local Codex/Mac runtime to a GitHub-hosted Ubuntu runner. The scheduled workflow should run at 09:00 Europe/Istanbul (06:00 UTC), collect Search Console data and cached Keyword Planner estimates through Gum, and let the content agent propose at most one useful guide update per Istanbul date. A separate publish job should validate a content-only change, open or update a pull request, follow repository checks and protections, and verify the resulting Pages deployment and sitemap.

The workflow must remain disabled until its credentials and private state are configured and an owner explicitly enables it. Keep the local automation active until the hosted workflow passes an end-to-end trial.

## Why this is important

A local automation depends on the Mac and Codex runtime being awake and available. Sleep, shutdown, Keychain prompts, or local authentication interruptions can prevent the daily collection or publication run. A hosted runner removes that laptop dependency and gives the workflow a consistent environment.

The hosted runner adds operational responsibilities: API-backed agent credentials, secure Google credential handling, encrypted private state, repository permissions, and a monitored trial. It does not guarantee exact start time because GitHub may delay scheduled workflows during busy periods, and it does not guarantee rankings or require publishing when evidence is weak.

## Definition of done

- The implementation is merged to the default branch, with its scheduled workflow disabled until explicit owner activation.
- The schedule is confirmed to target 09:00 Europe/Istanbul, and its behavior and possible scheduling delay are documented.
- Required Actions secrets are configured without exposing values in source control, logs, prompts, artifacts, or pull requests:
  - OPENAI_API_KEY for the hosted Codex action.
  - GUM_KEYRING_BUNDLE_B64 and GUM_KEYRING_PASSWORD for a disposable runner keyring.
  - GROWTH_STATE_ENCRYPTION_KEY and the initial GROWTH_STATE_SEED_B64 for protected private state.
- Gum collection works with the authorized read-only Search Console profile. The separate Ads profile is included only when its authorization is available; its use remains limited to keyword research.
- Google credentials are available only to the collection step. Raw Search Console reports and source CSV exports are not uploaded as public artifacts. Private state is encrypted before artifact storage.
- The daily limit, duplicate-PR handling, content-only patch boundary, validations for both deployment paths, and least-privilege Actions permissions are tested.
- One manual run from the default branch completes the end-to-end path: collection, a valid content decision (publishing may be skipped when evidence is insufficient), checks, PR handling where applicable, deployment verification, and encrypted state retention.
- The live page and sitemap are verified after deployment. Only then is the local automation paused to prevent duplicate publishers.
- Failure, expired credentials, and required owner action produce a clear notification; unchanged/no-op runs stay quiet.

## Context for implementation work

The intended workflow uses GitHub Actions on Ubuntu, with one collection job and a separate publication job. Collection restores an allowlisted private state, builds the pinned Gum variant, places Google credentials in a temporary keyring, and writes encrypted history/cache state. The content agent receives no Google credentials and may produce only one Markdown guide patch. The publication job applies that patch, runs site checks, uses narrowly scoped repository permissions to create or update the PR, and verifies the deployed revision.

Expected configuration includes the repository variable GROWTH_CLOUD_ENABLED=true only after the trial prerequisites are ready, plus the five Actions secrets listed above. Confirm the repository setting that permits Actions to create pull requests, and confirm branch protections and required checks before deciding how merges are handled.

Google Ads access is broader than keyword research even when the workflow is restricted to keyword-planning methods. Keep Ads credentials separate from Search Console, do not create campaigns or change billing, and do not bypass account security prompts. Treat keyword estimates as demand context, not organic ranking or traffic guarantees. Any OpenAI API credential or Google refresh credential must use its supported secure configuration and be reviewed for access and ongoing cost before activation.

## Out of scope

This proposal does not enable the workflow, move credentials, change OAuth permissions, alter billing, create or edit ad campaigns, publish content, change the website, or pause the local automation. Those actions belong to the implementation and trial, with required owner approval at the relevant step.

## References

- [Gum](https://github.com/ehmo/gum)
- [GitHub Actions scheduled workflows](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)
- [Google Ads API access levels](https://developers.google.com/google-ads/api/docs/api-policy/access-levels)
- [Google Search Central: helpful, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

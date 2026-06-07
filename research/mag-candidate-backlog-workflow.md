# Minted & Gone candidate backlog workflow

This document defines the workflow for expanding Minted & Gone records after batch-36.

## Purpose

Minted & Gone must not add marketplace records directly from ad hoc suggestions. New records should come from a candidate backlog that has already been checked against known existing slugs, names, aliases, and domains.

## Current baseline

The current safe baseline is the local check result after batch-36 cleanup:

```txt
Sitemap generated: 386 URLs
Validation passed
386 page(s) built
Build Complete
```

Use the generated `/encyclopedia/<slug>/index.html` route list from that check output as the first existing-slug snapshot.

## Files

```txt
research/mag-candidate-backlog.json
research/mag-candidate-consumption-log.json
research/mag-candidate-backlog-workflow.md
scripts/validate-mag-candidate-backlog.mjs
```

## Candidate states

```txt
candidate   = not yet promoted to registry data
ready       = checked again and ready for the next batch
consumed    = promoted into data/marketplaces-batch-XX.json and related event/evidence files
rejected    = duplicate, out of scope, or too weak
hold        = keep for later review
```

## Required duplicate checks before batch creation

Before creating any new data batch, check every candidate against:

1. Exact slug in latest generated build route list.
2. Exact slug in `data/marketplaces*.json`.
3. Canonical name and aliases in `data/marketplaces*.json`.
4. Official domain in `data/marketplaces*.json`.
5. Near-duplicate base names, such as:
   - `foundation` / `foundation-marketplace`
   - `tensor` / `tensor-marketplace`
   - `oneof` / `oneof-marketplace`
   - `okx-nft` / `okx-nft-marketplace`
   - `paras` / `paras-marketplace`

GitHub code search alone is not sufficient. It can return stale index results.

## Local candidate validation gate

`npm run check` now includes:

```bash
npm run validate:candidates
```

The candidate validator scans all `data/marketplaces*.json` files and active backlog candidates whose `consumption.status` is `candidate` or `ready`.

It fails on:

- candidate slug already used by existing marketplace data
- candidate name matching an existing canonical name or alias
- candidate domain matching an existing marketplace domain or URL
- duplicate candidate slug/name/domain inside the backlog
- missing candidate identity fields

This check is intentionally stricter than GitHub code search and should catch stale-index misses before a batch is created.

## Backlog readiness rule

Do not promote candidates whose `duplicate_check.needs_full_data_file_scan` is still `true`.

Promotion path:

```txt
candidate
↓ full data-file scan passes
ready
↓ promoted into batch data files
consumed
```

Rejected duplicates should stay in the backlog with `consumption.status = rejected` and a note explaining the match.

## Batch creation rule

For each new batch:

1. Select candidates whose `consumption.status` is `ready`.
2. Re-check slug/name/domain against latest data and latest build output.
3. Promote only checked candidates into:
   - `data/marketplaces-batch-XX.json`
   - `data/events-batch-XX.json`
   - `data/evidence-batch-XX.json`
4. After promotion, update the candidate entry:

```json
"consumption": {
  "status": "consumed",
  "batch": "batch-37",
  "marketplace_id": "mag_nfm_real_000351",
  "event_id": "mag_ev_real_000354",
  "evidence_ids": ["mag_src_real_000708", "mag_src_real_000709"],
  "consumed_at": "2026-06-07"
}
```

5. Append the same promotion to `research/mag-candidate-consumption-log.json`.
6. Run:

```bash
cd "$HOME/mintedandgone" || exit 1
git pull origin main
npm run check
```

7. Continue only if validation passes.

## Target

Build the candidate backlog toward 1000 non-duplicate candidates, but do not treat candidates as verified registry data.

The first backlog file may start below 1000. Expand it in candidate-only commits before promoting more data records.

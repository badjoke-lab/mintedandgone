# Minted & Gone next record batch 01

Purpose: track the first expansion batch after the initial 11-record cleanup.

Status: partially implemented. Do not treat this file as canonical data; canonical records are the JSON data files.

## Batch rule

- Add records in small reviewed batches.
- Avoid dead or shutdown claims unless there is strong official or high-quality reporting support.
- If current status is unclear, use `inactive` or keep `active` with review flags rather than overclaiming.
- Every record should start with at least two evidence notes.
- Wikipedia may be used only as a low-reliability cross-check, not as the main source for status.
- arXiv/research papers may support entity or market context, but should not be used alone to prove current status.

## Implemented from Candidate set A

### Rarible

Implemented as source-reviewed draft.

- slug: `rarible`
- status: `active`
- category: `general`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `multi_chain`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`

### SuperRare

Implemented as source-reviewed draft.

- slug: `superrare`
- status: `active`
- category: `art_curated`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `ethereum`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`

### Foundation

Implemented as source-reviewed draft.

- slug: `foundation`
- status: `active`
- category: `art_curated`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `ethereum`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`

### LG Art Lab

Implemented as source-reviewed draft.

- slug: `lg-art-lab`
- status: `dead`
- category: `brand_marketplace`
- marketplace_scope: `brand_marketplace`
- chain_scope: `hedera`, `ethereum`
- end_date: `2025-06-17`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_shutdown_archive`
  - `needs_asset_status_review`
  - `needs_exact_archive_capture`
  - `needs_contract_review`

## Deferred from Candidate set A

### Nifty Gateway / Nifty Gateway Studio

Deferred because status classification is more complex than the active records and should not be rushed.

Possible initial status: `inactive`, `rebranded`, or `acquired` after stronger source review.

Flags likely needed:

- `needs_official_status_source`
- `needs_frontend_review`
- `needs_acquisition_review`
- `needs_rebrand_review`

Candidate evidence:

- Nifty Gateway / Studio home: `https://www.niftygateway.com/`
- Gemini acquisition reference: `https://www.gemini.com/blog/gemini-acquires-nifty-gateway`
- Nifty Gateway Studio cross-check: `https://en.wikipedia.org/wiki/Nifty_Gateway_Studio`

Do not classify as dead without stronger official status source.

## Implemented as replacement / batch-02 active records

### LooksRare

Implemented as source-reviewed draft.

- slug: `looksrare`
- status: `active`
- category: `general`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `ethereum`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`

### VeVe

Implemented as source-reviewed draft.

- slug: `veve`
- status: `active`
- category: `collectibles`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `immutable_x`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`
  - `needs_app_status_review`

## Current expansion result

After this work, the registry is expected to contain:

- 17 marketplace records
- 20 timeline events
- 39 evidence notes
- reviewed_staging: 17
- low confidence: 0
- fictional records: 0

Run `npm run check` after pulling latest main. The check now runs:

```txt
generate:stats → generate:sitemap → validate → build
```

## Current data-file layout

Base files:

- `data/marketplaces.json`
- `data/events.json`
- `data/evidence.json`

Split batch files:

- `data/evidence-lg-art-lab.json`
- `data/marketplaces-batch-02.json`
- `data/events-batch-02.json`
- `data/evidence-batch-02.json`

The site loader, validator, stats generator, and sitemap generator combine these files. Future expansion should keep using split files unless intentionally consolidating the data.

## Next candidate direction

Next record work should focus on one of these:

1. Finish Nifty Gateway after stronger status review.
2. Add active/general marketplace records such as Zora, Objkt, MakersPlace, Solanart, or Nifty Gateway only if status is clear.
3. Add dead/inactive records only when official or high-quality shutdown evidence is available.

## Implementation warning

Do not add records by copying status claims blindly. Each candidate must be added as a conservative source-reviewed draft with explicit flags where official launch, official current status, exact archive capture, frontend status, contract status, app status, or asset handling is still incomplete.

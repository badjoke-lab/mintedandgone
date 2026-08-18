# MAG Ledger Series Phase 5 — Stage 2 Schema Decision Gate

Date: 2026-08-19  
Stacked on: `agent/ledger-series-phase5-authority` / PR #69

## Decision

**NO SCHEMA EXPANSION REQUIRED for the bounded Phase 5 public-surface lane.**

The existing canonical marketplace/event/evidence model already contains the fields needed to represent the lifecycle and aftermath concepts required by the MAG AI-era specification.

## Existing canonical fields already sufficient

Marketplace-level:

- `status`
- `launch_date`, `launch_date_precision`, `launch_year`
- `end_date`, `end_date_precision`, `end_year`
- `closure_reason`
- `frontend_status`
- `contract_status`
- `asset_status`
- `successor_marketplace`
- `predecessor_marketplace`
- `what_is_gone`
- `what_remains`
- `where_users_or_assets_went`
- `confidence`
- `review_status`
- `record_quality_flags`
- `last_verified_at`
- official/archive URL fields

Event-level schema already supports lifecycle transitions including launch, acquisition, merge, rebrand, shutdown, frontend closure, contract deprecation, asset migration, security/regulatory action, community forks and reopenings.

Evidence already supports marketplace/event linkage, source type, archive URL, reliability, claim scope and access/publication dates.

## Representative record shapes reviewed

### Hic et Nunc → Teia

Current canonical data already encodes:

- original marketplace status `dead`
- `closure_reason: community_fork`
- `successor_marketplace: teia`
- original frontend gone while contracts/assets remain represented separately
- explicit `what_remains`
- explicit user/asset continuation text

Teia independently carries `predecessor_marketplace: hic-et-nunc`.

This proves the current model can represent a source-backed predecessor/successor community-continuation case without a new relationship table.

### KnownOrigin

Current canonical data already encodes:

- `status: acquired`
- bounded acquisition/end chronology
- `closure_reason`
- frontend / contract / asset states
- aftermath text describing what did and did not disappear

This covers acquisition lifecycle without a schema change.

### GameStop NFT

Current canonical data already encodes:

- exact launch/end chronology
- `status: dead`
- `closure_reason: parent_company_shutdown`
- frontend dead while contract/asset states remain separately represented
- explicit user/asset aftermath

This covers terminal shutdown with surviving on-chain assets.

### Active marketplace baseline

OpenSea and other active records preserve:

- active status
- no artificial end date
- `closure_reason: not_applicable`
- active frontend / accessible contracts / user assets remain
- unknown or unresolved fields remain explicit

This prevents the lifecycle layer from fabricating closure history for active entities.

## Important distinction

The current schema is sufficient, but **record completeness is not uniform**. Missing successor evidence, exact archive captures, contract review or asset-status review should continue to appear through `record_quality_flags` and evidence-backed follow-up work.

Phase 5 must not solve incomplete records by inventing a new schema or generated facts.

## Implementation consequence

Stage 3 can proceed directly to deterministic per-marketplace machine-readable dossiers using the existing canonical model.

The dossier generator should join:

1. marketplace record
2. ordered events for that marketplace
3. marketplace-level and event-linked evidence
4. canonical predecessor/successor references when present
5. stable human and machine URLs

No canonical migration is required before Stage 3.

## Explicitly not authorized

- new relationship JSON/table
- new closure taxonomy
- new successor taxonomy
- inferred migration graph
- canonical backfill without evidence review
- generated safety/recovery ranking

If Stage 3 implementation discovers a concrete fact that cannot be expressed by the existing model, stop that fact-specific path and open a separate reviewed schema proposal. Do not expand the schema preemptively.

## Stage 2 completion condition

Stage 2 completes when this decision is reviewed and merged after PR #69. Next implementation stage: **Stage 3 — deterministic per-marketplace JSON**.

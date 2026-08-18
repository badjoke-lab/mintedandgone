# MAG Ledger Series Phase 5 — Stage 1 Gap Audit

Date: 2026-08-19  
Repository: `badjoke-lab/mintedandgone`  
Audited base: `7caf92bdaeda744772aaf85e459a54bedab1d5c8`

## Purpose

Establish the bounded implementation delta for Ledger Series Phase 5 without resetting existing MAG work or duplicating mature surfaces.

Mandatory references:

- `AGENTS.md`
- `docs/00-minted-and-gone-v0-spec.md`
- `docs/01-minted-and-gone-design.md`
- `docs/02-minted-and-gone-schema-stats-ready.md`
- `docs/03-minted-and-gone-methodology.md`
- `docs/06-minted-and-gone-implementation-plan.md`
- `docs/ai-era-registry-spec.md`
- `docs/ai-era-execution-schedule.md`

## Repository state at audit start

- `main`: `7caf92bdaeda744772aaf85e459a54bedab1d5c8`
- open pull requests: 0
- open issues: #29 and #31, both unrelated temporary/handoff items
- current public architecture: Astro static-first
- canonical source families: split marketplace / event / evidence JSON series
- candidate and monitoring outputs remain outside canonical publication

## Existing capabilities — reuse, do not rebuild

### Registry / encyclopedia

Implemented at `/encyclopedia/` with:

- text search
- status filter
- chain filter
- category filter
- static cards and bounded client-side load-more
- query initialization for `q` / `search`, `status`, `category`, and `chain`

Decision: **reuse and extend**. Do not create a second registry/search page.

### Marketplace detail

Implemented at `/encyclopedia/{slug}/` with:

- canonical identity and status
- fact grid
- `WhatRemainsBlock`
- timeline
- evidence list
- official/archive URL block
- related records
- explicit uncertainty/review-state presentation

Decision: **reuse**. Phase 5 lifecycle work must strengthen the canonical/event relationship feeding this surface, not replace the page.

### Aggregate machine-readable layer

Existing build outputs include:

- `/version.json`
- `/data/manifest.json`
- `/data/marketplaces.json`
- `/data/events.json`
- `/data/evidence.json`
- `/data/stats.json`
- `/llms.txt`
- `/ai.txt`
- `/sitemap.xml`

Decision: **reuse the envelope and canonical-only boundary**.

### Stats

A public `/stats/` surface and generated `data/stats.json` already exist.

Decision: **extend only with missing lifecycle/history/quality dimensions**. Do not build a second dashboard or introduce market-price/ranking statistics.

### Monitoring

Tokenized Collectibles monitoring and candidate monitoring already preserve the noncanonical boundary.

Decision: **leave monitoring architecture intact** during the bounded public-surface Phase 5 lane unless a concrete integration defect is found.

## Verified Phase 5 gaps

### Gap 1 — per-marketplace machine-readable dossier

Status: **missing**.

Current machine-readable publication is aggregate-only. The HTML detail route has joined marketplace/event/evidence context, but there is no deterministic `/data/marketplace/{slug}.json` or equivalent record bundle advertised in the manifest.

Required outcome:

- one deterministic reviewed record JSON per canonical marketplace
- canonical marketplace fields
- ordered linked events
- linked evidence with provenance/archive/reliability fields already present in canonical data
- related/successor/predecessor identifiers only where canonical data supports them
- canonical human URL and stable machine URL
- explicit review status / quality flags / unknown values
- no candidate, monitoring, research, or generated factual claims

### Gap 2 — structured lifecycle discovery

Status: **partial**.

Existing filters cover status, chain, category and text search. Phase 5 requires additional lifecycle-oriented discovery where current canonical fields support it.

Required audit/implementation targets:

- closure/change reason
- launch/end year or year range
- successor/migration presence
- evidence/archive quality facet where supported by existing canonical fields
- preserve current multi-filter semantics and existing encyclopedia route
- deterministic URL state; no generated SEO landing-page explosion

### Gap 3 — historical Compare

Status: **missing**.

No dedicated Compare route/surface is present in the current public pages.

Required outcome:

- compare a small bounded set of reviewed marketplaces
- lifecycle-oriented rows only
- identity/status/category/chain/year range
- frontend/contract/asset state where canonical
- closure/change reason
- what remains / successor or migration outcome
- evidence/provenance depth indicators that are descriptive, not safety scores
- no ranking, recommendation, synthetic risk score, or inferred factual state

### Gap 4 — lifecycle/aftermath Stats

Status: **partial**.

Current Stats already covers core registry summaries. Phase 5 should add only missing dimensions required by the AI-era specification:

- closure/change reason distribution
- marketplace lifespan distribution where both boundaries are supported
- chain distribution reconciliation with current multi-valued semantics
- migration/successor outcome coverage
- archive / evidence / review-quality coverage
- launch/end year distributions where supported

Missing data must be represented as missing/unknown, not inferred.

### Gap 5 — lifecycle aftermath record quality

Status: **needs bounded representative audit before schema mutation**.

The current detail model already exposes `what_remains`, events, archive state and related records. A schema expansion is therefore **not automatically justified**.

Stage 2 must inspect representative shapes covering:

- dead marketplace with known shutdown aftermath
- acquired/merged/rebranded marketplace
- marketplace with successor/migration evidence
- active marketplace with no closure outcome
- uncertain/source-reviewed-staging record

Only if the existing canonical model cannot represent evidence-backed successor/migration/aftermath facts should schema changes be proposed in a separate reviewed PR.

## Stage decision

Phase 5 may proceed with the following bounded order:

1. Stage 1 gap audit — this document
2. Stage 2 schema decision gate using representative records
3. Stage 3 deterministic per-marketplace JSON
4. Stage 4 extend the existing encyclopedia filters
5. Stage 5 add bounded historical Compare
6. Stage 6 extend existing Stats
7. Stage 7 exact-main production verification across aggregate + record JSON + filters + Compare + Stats
8. Stage 8 closeout and restore no-active-implementation state

## Non-goals / safety

Do not add:

- NFT price, volume or floor-price dashboards
- marketplace rankings
- safety/risk scores
- AI-generated canonical history
- automatic candidate promotion
- chatbot-first UI
- a second source of canonical facts
- a duplicate Search or Stats surface

## Stage 1 completion gate

Stage 1 is complete when this audit and the bounded Phase 5 authority are reviewed, CI-valid, and merged. Runtime implementation begins only from the merged authority state.

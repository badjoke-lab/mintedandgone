# MAG Ledger Series Phase 5 — Closeout

Date: 2026-08-19  
Project: Minted & Gone  
Repository: `badjoke-lab/mintedandgone`

## Result

Ledger Series Phase 5 is complete.

The phase strengthened the existing MAG historical marketplace registry without resetting its v0 architecture, replacing its encyclopedia, inventing a second statistics system, or changing canonical schema/taxonomy.

## Completed stages

### Stage 1 — gap audit

PR #69 established the bounded Phase 5 authority and verified the actual gaps against the existing repository.

Existing assets retained:

- `/encyclopedia/` search/filter surface
- marketplace detail lifecycle presentation
- aggregate canonical machine-readable layer
- existing Stats surface
- noncanonical candidate/monitoring boundary

Verified gaps:

- no per-marketplace machine-readable dossier
- lifecycle discovery only partial
- no historical Compare
- lifecycle/aftermath Stats only partial

### Stage 2 — schema decision gate

PR #70 reviewed representative lifecycle shapes and concluded that the existing schema already represents the required public lifecycle concepts.

No schema expansion was required.

Representative supported shapes included:

- Hic et Nunc → Teia predecessor/successor continuation
- KnownOrigin acquisition
- GameStop NFT terminal shutdown with separately represented frontend/contract/asset states
- active records without fabricated end dates

### Stage 3 — record-level machine-readable dossiers

PR #71 added deterministic canonical-only dossiers at:

`/data/marketplace/{slug}.json`

Each dossier joins the canonical marketplace, ordered canonical events, linked canonical evidence, predecessor/successor references when recorded, and stable human/machine URLs.

The manifest, version metadata, `llms.txt`, and `ai.txt` advertise the record-level contract. A dedicated validator checks the complete file set and rejects internal candidate/monitoring markers.

### Stage 4 — lifecycle/provenance discovery

PR #72 extended the existing `/encyclopedia/` rather than creating another registry/search surface.

Added facets:

- closure/change reason
- launch year
- end year
- successor recorded
- predecessor recorded
- migration event recorded
- archive available
- high-reliability evidence present
- open review flags

Within-facet OR and cross-facet AND semantics remain deterministic. Missing values remain unknown/not-recorded rather than inferred.

### Stage 5 — historical Compare

PR #73 added `/compare/` with bounded 2–4 record comparison, shareable canonical-slug query state, and an optional difference-only mode.

Compared fields are reviewed lifecycle/provenance facts only. No marketplace ranking, safety score, recommendation, or generated factual conclusion is produced.

### Stage 6 — lifecycle/aftermath Stats

PR #74 extended the existing deterministic Stats layer with:

- faded-side closure/change reason distribution
- recorded lifespan buckets
- successor/predecessor coverage
- migration-event coverage
- faded-side successor-or-migration coverage
- lifecycle event depth
- high-reliability evidence coverage
- archived evidence coverage

Missing lifecycle data remains explicitly unrecorded rather than negative evidence.

## Stage 7 — production verification

Production-verification tooling was added and repaired through reviewed PRs rather than bypassed when it exposed real operational defects.

Important findings during verification:

1. raw HTML marker checks initially failed on Astro-escaped `&amp;`; the checker was corrected to normalize HTML entities rather than weakening the expected labels;
2. an old repository GitHub Pages workflow was found to be non-production and permanently nonfunctional because GitHub Pages is not enabled for this repository; it was removed instead of changing external publication settings;
3. the actual custom-domain publication remained the authority for live acceptance;
4. a reviewed-production floor verifier was added so workflow/docs-only main revisions do not need to be falsely treated as public-content releases.

Accepted production evidence:

- implementation floor: `d5c6c56dd787cbf3ae09ba2df83f97c15bbefcad`
- observed deployed production: `c5736e09942cfd0a2c8de767f4766ba9d867fe91`
- reviewed main at acceptance: `da8d57e5b14570714d326a138fc84202f5c2f1ff`
- Actions run: `32164720048`
- job: `95801511830`
- artifact: `9334947090`
- commit status: `mag-phase5-reviewed-production=success`
- live counts: 385 marketplaces / 388 events / 811 evidence

The production evidence run proved:

- the deployed SHA is a reviewed ancestor of current main;
- the deployed SHA is at or after the complete Stage 6 implementation floor;
- `/version.json` and `/data/manifest.json` are coherent;
- record-level marketplace dossiers are live and relationships reconcile;
- Encyclopedia lifecycle/provenance filters are present;
- Compare is live;
- lifecycle/aftermath Stats JSON and page are live;
- sitemap includes the canonical Compare route and excludes Compare query variants.

## Safety and data boundary

Phase 5 canonical delta: **0**.  
Phase 5 schema/taxonomy delta: **0**.

The phase did not add:

- candidate auto-promotion
- AI-generated canonical history
- safety/risk rankings
- investment recommendations
- chatbot-first factual surfaces
- fabricated successor/migration/closure facts

## Ongoing vertical work

Phase 5 closeout does not stop normal MAG maintenance.

The following remain ongoing under normal reviewed work:

- record growth
- evidence strengthening
- archive maintenance
- candidate review
- lifecycle follow-up
- monitoring
- corrections

Those are not unfinished Phase 5 implementation.

## Next horizontal phase

The Ledger Series horizontal roadmap advances to **Phase 6 — WLR**.

WLR already contains substantial lifecycle/search/Compare/Stats/machine-readable/monitoring implementation, so Phase 6 must begin with a repository-state mapping audit and must not reimplement already-complete work.

Automatic continuation beyond this closeout is false. Any new MAG public product phase requires a fresh reviewed authority.

# Minted & Gone

Minted & Gone is a static-first historical registry of NFT marketplaces.

It records marketplace identity, status, timeline events, evidence notes, archive links, and unresolved review work. It is not a marketplace ranking, price tracker, safety certification, or investment guide.

## Canonical source of truth

Canonical records are stored only in these split-file series:

```text
data/marketplaces.json
data/marketplaces-batch-*.json
data/events.json
data/events-batch-*.json
data/evidence.json
data/evidence-batch-*.json
```

The public HTML, statistics, sitemap, version metadata, manifest, and public JSON files are generated from those canonical series. Candidate backlogs, research notes, monitoring output, and unmerged branches are excluded.

Current public counts must not be maintained by hand in documentation. Use the generated endpoints instead:

```text
https://mag.badjoke-lab.com/version.json
https://mag.badjoke-lab.com/data/manifest.json
https://mag.badjoke-lab.com/data/marketplaces.json
https://mag.badjoke-lab.com/data/events.json
https://mag.badjoke-lab.com/data/evidence.json
https://mag.badjoke-lab.com/data/stats.json
https://mag.badjoke-lab.com/data/marketplace/{slug}.json
```

## Review-state model

`review_status` is a fixed machine-readable field.

- `reviewed_staging` — **Source-reviewed draft**. The record has enough source review for canonical public draft publication. Open review flags may remain. This is not final public-quality certification.
- `public_quality_reviewed` — **Public-quality reviewed**. The record has passed the stricter public-quality criteria.

The public registry must not use the ambiguous label `Reviewed` by itself as a quality guarantee.

`record_quality_flags` exposes unresolved work such as missing official sources, exact archive captures, frontend checks, contract review, asset-path review, or successor review. A non-empty flag list does not make a record an internal candidate; it means the canonical public draft still has open review work.

## Count definitions

Each marketplace has exactly one status. The exclusive status breakdown sums to the total marketplace count.

- active-side = `active + limited`
- faded-side = `inactive + dead + acquired + merged + rebranded`
- unknown-side = `unknown`
- transitioned = `acquired + merged + rebranded`, which is a subset of faded-side

Category and marketplace scope are single-valued in the current schema. Chain scope and platform roles are multi-valued, so those breakdown totals can exceed the marketplace count.

## Generated machine-readable layer

The build writes:

```text
/version.json
/data/manifest.json
/data/marketplaces.json
/data/events.json
/data/evidence.json
/data/stats.json
/data/marketplace/{slug}.json
/llms.txt
/ai.txt
/sitemap.xml
```

Each `/data/marketplace/{slug}.json` dossier is generated from the same canonical marketplace/event/evidence series as the HTML detail route. It contains the canonical marketplace record, ordered linked events, linked evidence, canonical predecessor/successor references when present, and stable human/machine URLs. Candidate, monitoring, research, and unmerged material are excluded.

Generated files include `generated_at`, `schema_version`, and `canonical_only` metadata. Public record JSON files contain the same record IDs used by the HTML detail pages.

## Validation

```text
npm install
npm run generate:stats
npm run generate:sitemap
npm run validate
npm run validate:record-json
npm run validate:candidates
npm run validate:latest-batch
npm run validate:tokenized
npm run test:monitoring:tokenized
npm run monitor:tokenized
npm run build
node scripts/check-built-registry.mjs
```

The registry consistency CI checks:

- canonical counts against public JSON, version, manifest, stats, and HTML
- marketplace, event, and evidence record identities
- per-marketplace dossier file-set, canonical payload, linked event/evidence ordering, relationships, and discovery metadata
- exclusive status totals and active/faded/unknown partition totals
- review-state enum values and exposed quality flags
- sitemap detail-page coverage
- canonical URLs, discovery links, JSON-LD, meta descriptions, and OGP
- stale known count phrases and ambiguous `Reviewed share` wording
- robots.txt, llms.txt, and ai.txt

## Tokenized Collectibles monitoring

Tokenized Collectibles monitoring may write only to:

```text
data-staging/monitoring/tokenized-collectibles/**
```

It must not directly modify canonical marketplace, event, or evidence files. Any justified correction requires a separate reviewed pull request.

The monitoring workflow runs every Monday at 03:00 UTC and can also be started manually.

## Development notes

- `data/batch-42` remains outside the published mainline and must not be revived without a fresh audit.
- GitHub search alone is not sufficient for duplicate checking.
- Monitoring reports are review inputs, not canonical updates.
- External URL failures must be reviewed manually before changing status.

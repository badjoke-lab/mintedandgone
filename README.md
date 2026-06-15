# Minted & Gone

Minted & Gone is a static-first NFT marketplace historical registry and field guide.

It records NFT marketplaces as historical entries: active, limited, inactive, dead, acquired, merged, rebranded, or unknown.

## Current status

This repository contains:

- Astro static site implementation
- source-reviewed marketplace records
- generated marketplace encyclopedia pages
- stats, sitemap, validation, and build scripts
- methodology, about, stats, submit, and encyclopedia pages
- Tokenized Collectibles category records and category-specific UI
- Tokenized Collectibles integrity and monitoring scripts
- weekly monitoring workflow with monitoring-only pull requests

The registry preserves uncertainty through confidence values, evidence notes, review states, and record quality flags. It is not a marketplace safety certification or trading dashboard.

## Data file layout

Canonical data is stored in split JSON files discovered by prefix:

```text
data/marketplaces*.json
data/events*.json
data/evidence*.json
```

The site loader, validator, stats generator, sitemap generator, and monitoring scripts read these files automatically.

Future batches should follow the same split-file pattern unless an intentional consolidation is reviewed separately.

## Important

Do not treat status labels as real-time marketplace guarantees.

Dead, inactive, acquired, and active classifications must remain conservative. If official closure or status evidence is weak, use inactive or under-review wording rather than overclaiming.

For Tokenized Collectibles, marketplace status, physical backing, custody, redemption, randomized-sale models, and buyback models are separate claims. Each stronger claim requires matching evidence.

## Main commands

```text
npm install
npm run generate:stats
npm run generate:sitemap
npm run validate
npm run validate:candidates
npm run validate:latest-batch
npm run validate:tokenized
npm run test:monitoring:tokenized-url
npm run monitor:tokenized
npm run monitor:tokenized:smoke
npm run monitor:tokenized:live
npm run build
npm run check
```

`npm run check` runs generation, canonical validation, candidate validation, latest-batch duplicate validation, Tokenized Collectibles validation, URL-monitor classification tests, offline monitoring, and the site build.

## Tokenized Collectibles operations

Operational documentation:

- `docs/tokenized-collectibles-methodology.md`
- `docs/tokenized-collectibles-operations.md`
- `docs/tokenized-collectibles-monitoring.md`
- `docs/tokenized-collectibles-review.md`

Automated monitoring may write only to:

```text
data-staging/monitoring/tokenized-collectibles/**
```

It must not directly change canonical marketplace, event, or evidence files. Any justified correction requires a separate reviewed pull request.

## Monitoring schedule

The Tokenized Collectibles monitoring workflow runs every Monday at 03:00 UTC and can also be started manually.

The workflow:

1. runs internal quality and candidate-state checks
2. checks official and evidence URLs
3. verifies that canonical files did not change
4. creates or updates a monitoring-only pull request when findings exist
5. creates no pull request when no monitoring output changed

## Development notes

- `data/batch-42` remains outside the published mainline and must not be revived without a fresh audit.
- GitHub search alone is not sufficient for duplicate checking.
- Monitoring reports are review inputs, not canonical updates.
- External URL failures must be reviewed manually before changing status.

## Next maintenance work

- observe the first full live monitoring run
- review and resolve monitoring findings
- continue evidence and archive improvements
- add new marketplace records in small reviewed groups
- extract reusable monitoring components only after the MAG implementation is stable

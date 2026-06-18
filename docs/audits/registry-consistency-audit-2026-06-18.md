# MAG registry consistency audit — 2026-06-18

## Scope

This audit covers canonical marketplace, event, and evidence records; human-facing HTML; generated statistics; version and manifest metadata; public JSON; sitemap and robots; discovery links; JSON-LD; metadata; OGP; README; and build-output validation.

The batch-42 record-growth work remains paused until this consistency repair is merged and production is verified.

## Confirmed pre-fix problems

1. `data/stats.json` was a checked-in 2026-05-23 artifact with 200 marketplaces, 202 events, and 406 evidence notes.
2. Astro loaded all split canonical JSON files, while `scripts/static-build.mjs` loaded only `data/marketplaces.json`, `data/events.json`, and `data/evidence.json`.
3. The previous stats logic counted `inactive` in both active-side and faded-side summaries.
4. Public KPI wording used `Reviewed` or `Reviewed share` even though the canonical value was `reviewed_staging` and meant source-reviewed draft, not public-quality completion.
5. The repository did not implement `/version.json`, `/data/manifest.json`, consolidated public canonical JSON, `llms.txt`, or `ai.txt`.
6. Public HTML had no machine-readable discovery links to version, manifest, or record JSON.
7. Build output was not checked against canonical record counts and identities.

## Repair design

- Treat only `data/marketplaces.json`, `data/marketplaces-batch-*.json`, `data/events.json`, `data/events-batch-*.json`, `data/evidence.json`, and `data/evidence-batch-*.json` as canonical input.
- Generate HTML statistics and machine-readable files from the same canonical input.
- Publish `schema_version`, `generated_at`, and `canonical_only` metadata.
- Keep `review_status` as the fixed machine-readable field.
- Define `reviewed_staging` as Source-reviewed draft and `public_quality_reviewed` as Public-quality reviewed.
- Expose unresolved work through `record_quality_flags`.
- Define active-side as active + limited and faded-side as inactive + dead + acquired + merged + rebranded.
- Mark chain scope and platform roles as multi-valued breakdowns whose totals may exceed marketplace count.
- Validate post-build HTML, public JSON, manifest, version, sitemap, discovery links, canonical URLs, JSON-LD, meta descriptions, OGP, llms.txt, ai.txt, and robots.txt.

## Expected current canonical counts

The operator-reported current values are:

- Marketplaces: 385
- Events: 388
- Evidence: 811

The new CI does not hard-code those numbers. It recomputes them from canonical files and fails if any HTML or machine-readable output differs.

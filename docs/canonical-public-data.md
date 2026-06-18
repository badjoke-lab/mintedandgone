# MAG canonical public data

Canonical build inputs are all reviewed JSON series files matching these prefixes:

- `data/marketplaces*.json`
- `data/events*.json`
- `data/evidence*.json`

Research, candidate, staging, monitoring, generated stats, and history files are excluded.

The build generates `/version.json`, `/data/manifest.json`, public record JSON, stats, `llms.txt`, `ai.txt`, sitemap entries, and HTML from the same canonical input.

`review_status` uses fixed values:

- `reviewed_staging`: source-reviewed canonical draft; open flags may remain; not public-quality completion.
- `public_quality_reviewed`: stricter public-quality review completed.

Unresolved work remains machine-readable in `record_quality_flags`.

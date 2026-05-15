# Minted & Gone

Minted & Gone is a static-first NFT marketplace historical registry and field guide.

It records NFT marketplaces as historical entries: active, limited, inactive, dead, acquired, merged, rebranded, or unknown.

## Current status

This repository currently contains:

- project specification docs
- stats-ready data schema
- methodology
- candidate plan
- mock data
- HTML mock reference
- image mock references

The first implementation target is a static Astro site using mock data only.

## Important

The current JSON records are mock data for layout testing. They are not verified canonical public records.

## Next step

Use `docs/08-minted-and-gone-codex-implementation-task.md` as the implementation instruction.

## Implementation note

Implemented:
- Astro static site scaffold with warm field-guide styling.
- Data loading from JSON mock records.
- Marketplace index and generated detail page source files.
- Stats generation and stats page source files.
- Methodology, About, and Submit pages.
- Validation and stats-generation scripts.

Run:
- `npm install`
- `npm run generate:stats`
- `npm run validate`
- `npm run dev`
- `npm run build`

Known limitations:
- Uses mock data only.
- No verified v0 seed records yet.
- No real submit form yet.
- No production domain configured.
- In restricted environments where npm registry access is blocked, scripts fall back to local static validation/build helpers so `npm run check` can still verify generated output.

Next:
- Create v0 seed records from `docs/07-minted-and-gone-v0-seed-selection.md`.

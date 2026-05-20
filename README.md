# Minted & Gone

Minted & Gone is a static-first NFT marketplace historical registry and field guide.

It records NFT marketplaces as historical entries: active, limited, inactive, dead, acquired, merged, rebranded, or unknown.

## Current status

This repository currently contains:

- Astro static site implementation
- source-reviewed draft marketplace records
- generated marketplace encyclopedia pages
- stats, sitemap, validation, and build scripts
- methodology, about, stats, submit, and encyclopedia pages
- static robots.txt with sitemap reference
- HTML and image mock references used only as visual design references

The current site is an early source-reviewed draft registry. Records are evidence-backed enough for review, but they are not final public-quality certifications.

## Data status

Current draft data contains:

- 17 marketplace records
- 20 timeline events
- 39 evidence notes
- reviewed staging coverage for all current marketplace records
- no fictional placeholder records

Current status mix:

- active: 9
- inactive: 4
- dead: 3
- acquired: 1

## Data file layout

Base files:

- `data/marketplaces.json`
- `data/events.json`
- `data/evidence.json`

Additional batch files:

- `data/evidence-lg-art-lab.json`
- `data/marketplaces-batch-02.json`
- `data/events-batch-02.json`
- `data/evidence-batch-02.json`

The site loader, validator, stats generator, and sitemap generator currently combine these files. Future batches should either follow this split-file pattern or be consolidated intentionally.

## Important

Do not treat status labels as real-time marketplace monitoring. Draft records preserve uncertainty through confidence levels, evidence notes, and record quality flags.

Dead, inactive, acquired, and active classifications should remain conservative. If official closure or status evidence is weak, use inactive or under-review wording rather than overclaiming.

## Implementation note

Implemented:

- Astro static site scaffold with warm field-guide styling
- Data loading from JSON records and split batch files
- Marketplace index and generated detail pages
- Stats generation and stats page
- Sitemap generation
- Methodology, About, and Submit pages
- Validation and build scripts
- Static robots.txt with sitemap reference

Run:

- `npm install`
- `npm run generate:stats`
- `npm run generate:sitemap`
- `npm run validate`
- `npm run build`
- `npm run check`

`npm run check` runs:

```txt
generate:stats → generate:sitemap → validate → build
```

## Next steps

- Run terminal check after pulling latest main
- Run browser review for the home, encyclopedia, detail, stats, about, methodology, and submit pages
- Continue replacing draft flags with stronger official and archived sources where possible
- Add the next batch of NFT marketplace records in small reviewed groups
- Improve card density and visual alignment against the approved image references

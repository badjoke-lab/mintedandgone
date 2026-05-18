# Minted & Gone

Minted & Gone is a static-first NFT marketplace historical registry and field guide.

It records NFT marketplaces as historical entries: active, limited, inactive, dead, acquired, merged, rebranded, or unknown.

## Current status

This repository currently contains:

- Astro static site implementation
- source-reviewed draft marketplace records
- generated marketplace encyclopedia pages
- stats generation and validation scripts
- methodology, about, stats, submit, and encyclopedia pages
- static sitemap and robots.txt
- HTML and image mock references used only as visual design references

The current site is an early source-reviewed draft registry. Records are evidence-backed enough for review, but they are not final public-quality certifications.

## Data status

Current draft data contains:

- 11 marketplace records
- 13 timeline events
- 26 evidence notes
- reviewed staging coverage for all current marketplace records

The archive no longer includes fictional placeholder records.

## Important

Do not treat status labels as real-time marketplace monitoring. Draft records preserve uncertainty through confidence levels, evidence notes, and record quality flags.

Dead, inactive, acquired, and active classifications should remain conservative. If official closure or status evidence is weak, use inactive or under-review wording rather than overclaiming.

## Implementation note

Implemented:

- Astro static site scaffold with warm field-guide styling
- Data loading from JSON records
- Marketplace index and generated detail pages
- Stats generation and stats page
- Methodology, About, and Submit pages
- Validation and stats-generation scripts
- Static sitemap and robots.txt

Run:

- `npm install`
- `npm run generate:stats`
- `npm run validate`
- `npm run build`
- `npm run check`

## Next steps

- Run browser review for the home, encyclopedia, detail, stats, about, methodology, and submit pages
- Continue replacing draft flags with stronger sources where possible
- Add the next batch of NFT marketplace records in small reviewed groups
- Improve card density and visual alignment against the approved image references

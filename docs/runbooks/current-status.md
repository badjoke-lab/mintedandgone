# Minted & Gone Current Status

Last updated: 2026-06-04

## Current position

Minted & Gone is an NFT marketplace historical registry and field guide. The repository currently includes:

- static site foundation
- JSON-driven marketplace records
- generated encyclopedia pages
- stats, sitemap, validation, and build scripts
- methodology, about, submit, support, and contact pages
- guide pages
- glossary index and glossary detail pages
- updates index and update detail pages
- internal-linking components for related glossary terms and related records
- browser/mobile review checklist
- ongoing reviewed record batches

The public product should remain registry-first. Reading pages support the archive; they should not turn the site into a generic NFT blog.

## Latest completed work

### Registry foundation and v0 reading layer

Completed:

- Route audit for the existing public surface.
- `/guides/` index.
- `/guides/what-happens-when-nft-marketplace-shuts-down/`.
- `/guides/frontend-vs-smart-contract-what-remains/`.
- `/glossary/` index.
- `/updates/` index.
- v0 release-hardening checklist.
- Footer discovery links for Guides, Glossary, Updates, Submit correction, Contact, and Support.
- Duplicate slug cleanup for batch-35.
- CSS warning cleanup for mobile subpage/stat styles.

### v0.5 guide expansion

Completed:

- `/guides/how-to-check-old-nft-marketplace-pages/`.
- `/guides/do-nfts-disappear-when-a-marketplace-closes/`.
- `/guides/what-is-an-nft-marketplace-aggregator/`.
- `/guides/what-is-an-nft-launchpad-marketplace/`.

The guide layer remains focused on source-backed marketplace history, archive interpretation, and layer separation. It avoids broad claims that a marketplace closure automatically means NFT, metadata, media, wallet display, or asset-path disappearance.

### Glossary detail pages

Completed:

- Shared glossary term data in `src/data/glossaryTerms.ts`.
- `/glossary/[slug]/` detail pages for 20 glossary terms.
- Sitemap coverage for glossary detail pages.

Current glossary terms include:

- `nft-marketplace`
- `marketplace-frontend`
- `smart-contract`
- `asset-metadata`
- `collection-page`
- `trading-history`
- `aggregator`
- `launchpad-marketplace`
- `community-fork`
- `marketplace-shutdown`
- `frontend-closed`
- `contract-deprecated`
- `asset-migration`
- `archived-url`
- `dead-domain`
- `rebrand`
- `acquisition`
- `delisting`
- `royalties`
- `creator-fee`

### Update detail pages

Completed:

- Shared update entry data in `src/data/updateEntries.ts`.
- `/updates/[slug]/` detail pages for registry update entries.
- Sitemap coverage for update detail pages.

Current update detail pages:

- `/updates/v0-reading-layer-added/`
- `/updates/v0-5-guide-expansion-added/`
- `/updates/glossary-detail-pages-added/`
- `/updates/reviewed-record-batch-36-added/`

### Internal linking improvements

Completed:

- `RelatedGlossaryLinks` component.
- Related glossary term blocks across the guide pages.
- `RelatedRecordLinks` component.
- Related record blocks for aggregator, launchpad, frontend, and old-page checking guides where verified existing record slugs were available.

Pending:

- Additional related-record blocks for remaining guide pages where safe, verified record links are available.

### Reviewed record batches

Completed:

- Batch-36 currently contains two reviewed-staging marketplace records:
  - `foundation-marketplace`
  - `manifold`
- Matching batch-36 event records.
- Matching batch-36 evidence records with official-domain and Wayback archive-search references.

Duplicate cleanup:

- Removed duplicate batch-36 records for `magic-eden`, `superrare`, and `zora`.
- Removed batch-37 and batch-38 files because their records duplicated existing marketplace slugs already present elsewhere in the registry.
- Corrected the update entry and sitemap route from the earlier batch-36-to-38 summary to the current batch-36-only update.

Remaining batch-36 records are conservative reviewed-staging entries with review flags for scope, current live state, asset status, and contract status where appropriate.

### Registry update entry

Completed:

- Added `/updates/reviewed-record-batch-36-added/`.
- Updated sitemap generation to include the corrected update entry.
- The update entry summarizes batch 36 as a registry change, not NFT news.

### Browser/mobile review checklist

Completed:

- Added `docs/runbooks/browser-mobile-review-checklist.md`.
- The checklist covers desktop routes, mobile widths, representative record pages, navigation flows, wording checks, record data checks, and pass criteria.
- Latest baseline in the checklist reflects the passing state: sitemap generated with 380 URLs, validation passed, and static build passed with 380 pages built.

## Build and validation status

Latest validation/build result:

- `npm run check` passed on 2026-06-04 after duplicate cleanup.
- Stats generation passed.
- Sitemap generation passed with 380 URLs.
- Data validation passed.
- Static build passed with 380 pages built.

Previous recorded successful validation/build results:

- 350 pages built after the v0 reading-layer and hardening pass.
- 351 pages built after the old marketplace page guide.
- 352 pages built after the NFT disappearance guide.
- 374 pages built after glossary detail pages.
- 377 pages built after update detail pages.

## Product direction

Minted & Gone is not an NFT trading site and not a generic NFT blog. It is an NFT marketplace historical registry and field guide.

Registry pages remain the main product. Reading pages support the registry through education, search intake, and internal links.

NFT ownership or testnet NFT experience remains postponed.

## Version plan

### v0 baseline

Goal: make the registry credible and navigable.

Implemented:

- Home page
- Marketplace encyclopedia / registry index
- Marketplace detail pages
- Methodology
- About
- Submit / correction path
- Stats / archive-at-a-glance support
- Sitemap and robots support
- Validation and build scripts
- Source-reviewed seed records
- v0 reading layer
- browser/mobile review checklist

Recommended before public push:

- browser review
- mobile review
- key link review

### v0.5

Goal: expand search-intake pages without weakening the registry.

Implemented:

- four v0.5 guide pages
- 20 glossary detail pages
- 4 update detail pages
- guide-to-glossary linking
- guide-to-record linking for selected pages
- batch-36 reviewed-staging records
- validation/build passed after duplicate cleanup

Planned:

- more related-record links where verified record slugs exist
- additional update entries when meaningful registry changes are made
- continue with another small reviewed record batch only after checking existing registry coverage first

Target data direction:

- 50 to 80 marketplace records if quality remains acceptable
- 5 to 6 guides total
- 20 to 30 glossary terms
- 2 to 4 update entries

### v1

Goal: make Minted & Gone feel like a research archive, not only a list.

Planned additions:

- Research Notes
- Dead Marketplace Discovery Log
- Marketplace Shutdown Timeline
- Chain pages
- Category pages
- additional reviewed record batches

Target data direction:

- 100 to 150 marketplace records
- 150 to 250 events
- 300 to 500 evidence notes
- 8 to 10 guides total
- around 40 glossary terms

### v1.5 or later

Goal: reconsider educational NFT experience only after the registry and reading layer have value.

Possible additions:

- testnet Archive Pass
- Archive Shelf
- educational badge/quest layer

Current status: postponed.

## Next work

Recommended next options:

1. Review browser/mobile display using `docs/runbooks/browser-mobile-review-checklist.md`.
2. Add related-record links to remaining guide pages only where verified record slugs are available.
3. Continue with another small reviewed record batch only after checking existing registry coverage first.

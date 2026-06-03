# Minted & Gone Current Status

Last updated: 2026-06-03

## Current position

Minted & Gone is past the bare foundation stage. The repository has the static site foundation, JSON-driven marketplace records, generated encyclopedia pages, stats/sitemap/validation scripts, methodology/about/submit pages, v0 reading-layer pages, v0.5 guide pages, glossary detail pages, update detail pages, and internal-linking components.

The earlier v0 plan should be treated as partially complete, not restarted.

## Latest completed work

### PR-039

Merged: `docs: add current status runbook`.

- Added this runbook.
- Fixed the merge-by-merge reporting rule.
- Reset the roadmap against the actual repository state.

### PR-040 equivalent

Committed directly to `main` because new branch creation was blocked by the tool safety layer.

- Added `docs/runbooks/route-audit.md`.
- Confirmed `/encyclopedia/` remains the current registry route for v0.
- Confirmed separate `/gone/` and `/active/` pages are not v0 blockers while status filtering exists.
- Identified the reading-layer gap: `/guides/`, two core guides, `/glossary/`, and `/updates/`.

### PR-041 to PR-046 equivalent

Committed directly to `main` because branch creation remained blocked.

- Added `/guides/`, two v0 core guides, `/glossary/`, and `/updates/`.
- Added `docs/runbooks/v0-release-hardening-checklist.md`.
- Updated sitemap coverage for the new reading-layer routes.
- Added footer links to Guides, Glossary, and Updates without replacing the registry as the main header focus.
- Fixed duplicate batch-35 slugs that initially blocked validation.
- Fixed CSS selector warnings in mobile subpage/stat styles.
- Confirmed local terminal check passed at the time with 350 pages built.

### PR-047 equivalent

- Added `/guides/how-to-check-old-nft-marketplace-pages/` as the first v0.5 reading-layer guide.
- Updated `/guides/` and sitemap.
- Confirmed local terminal check passed after the change: sitemap generated with 351 URLs, validation passed, and 351 pages built.

### PR-048 equivalent

- Added `/guides/do-nfts-disappear-when-a-marketplace-closes/` as the second v0.5 reading-layer guide.
- Updated `/guides/` and sitemap.
- Confirmed local terminal check passed after the change: sitemap generated with 352 URLs, validation passed, and 352 pages built.

### PR-049 equivalent

- Added `/guides/what-is-an-nft-marketplace-aggregator/` as the third v0.5 reading-layer guide.
- Updated `/guides/` and sitemap.
- Kept the guide focused on aggregator-specific layers and avoided claiming that aggregator closure means every indexed marketplace or asset disappeared.

### PR-050 equivalent

- Added `/guides/what-is-an-nft-launchpad-marketplace/` as the fourth v0.5 reading-layer guide.
- Updated `/guides/` and sitemap.
- Kept the guide focused on launchpad-specific layers and avoided claiming that launchpad or campaign-page closure means minted assets, contracts, or metadata disappeared.

### PR-051 equivalent

- Added shared glossary term data in `src/data/glossaryTerms.ts`.
- Updated `/glossary/` to use shared term data.
- Added `/glossary/[slug]/` detail pages for 20 glossary terms.
- Updated sitemap generation to include glossary term pages.
- Confirmed local terminal check passed after the change: sitemap generated with 374 URLs, validation passed, and 374 pages built.

### PR-052 equivalent

- Added shared update entry data in `src/data/updateEntries.ts`.
- Updated `/updates/` to use shared update entry data.
- Added `/updates/[slug]/` detail pages for registry update entries.
- Updated sitemap generation to include update detail pages.
- Confirmed local terminal check passed after the change: sitemap generated with 377 URLs, validation passed, and 377 pages built.

### PR-053 equivalent

- Added `RelatedGlossaryLinks` component.
- Added related glossary term blocks to all six guide pages.
- Strengthened guide-to-glossary internal linking without changing sitemap route count.
- Terminal check is pending because terminal access is currently unavailable.

### PR-054 equivalent

Committed directly to `main` because branch creation remained blocked.

- Added `RelatedRecordLinks` component.
- Added related record blocks to the launchpad and aggregator guides using only verified existing record slugs from batch-35.
- Linked to confirmed records such as `sequence-marketplace`, `recur-marketplace`, `mythical-market`, and `veve-market`.
- Kept related-record links conservative and evidence-aware; no new claims were added about asset status, safety, ownership, or disappearance.
- Terminal check is pending because terminal access is currently unavailable.

## Operating rule

After each merged PR or PR-equivalent commit, update this file before moving to the next work item. Each update must include:

1. what was merged or committed,
2. the full remaining schedule,
3. the current position,
4. the next PR to open.

If branch creation is blocked and a direct commit is the only available path, record that exception here before continuing.

## Product direction

Minted & Gone is not an NFT trading site and not a generic NFT blog. It is an NFT marketplace historical registry and field guide.

Registry pages remain the main product. Reading pages support the registry through education, search intake, and internal links.

NFT ownership or testnet NFT experience remains postponed.

## Version plan

### v0 baseline

Goal: make the registry credible and navigable.

Current assessment: implemented at source/build level. Browser/mobile visual review is still useful, but terminal validation/build no longer blocked v0 as of the last successful check.

### v0 reading layer

Required state:

- Guides index: done
- What happens when an NFT marketplace shuts down?: done
- Frontend vs smart contract: what actually remains?: done
- Glossary index: done
- Updates index / registry changelog entry point: done

Do not expand into broad NFT blogging.

### v0 release hardening

Current status:

- metadata structure checked
- sitemap route list checked at source level
- reading-layer footer discovery added
- hardening checklist added
- duplicate slug validation issue fixed
- CSS warning fixed
- `npm run check` passed locally with 350 pages built before PR-047, 351 pages built after PR-047, 352 pages built after PR-048, 374 pages built after PR-051, and 377 pages built after PR-052
- terminal check after PR-053 and PR-054 is pending because terminal access is currently unavailable
- browser/mobile visual review remains recommended

### v0.5

Current status:

- first v0.5 guide added: `/guides/how-to-check-old-nft-marketplace-pages/`
- second v0.5 guide added: `/guides/do-nfts-disappear-when-a-marketplace-closes/`
- third v0.5 guide added: `/guides/what-is-an-nft-marketplace-aggregator/`
- fourth v0.5 guide added: `/guides/what-is-an-nft-launchpad-marketplace/`
- glossary detail page structure added for 20 terms
- update detail page structure added for 3 entries
- guide-to-glossary internal linking added
- related-record link component added
- related-record blocks added to aggregator and launchpad guides

Planned additions:

- continue related-record links for other guide pages where verified records are available
- additional reviewed record batches

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

## PR schedule from here

### PR-055: Next reviewed content batch

Recommended next options:

- continue related-record links for shutdown / frontend / old-page / disappearance guides using verified record slugs only
- reviewed record batch

### PR-056 and later: Record and content batches

Expected pattern:

- record batch PRs
- reading page PRs
- internal-linking PRs
- current-status update after every merge

## Current next action

Proceed with the next reviewed content/record batch. Terminal check remains pending until terminal access is available again.

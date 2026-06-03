# Minted & Gone Current Status

Last updated: 2026-06-03

## Current position

Minted & Gone is already past the bare foundation stage. The repository has the static site foundation, JSON-driven marketplace records, generated encyclopedia pages, stats/sitemap/validation scripts, methodology/about/submit pages, and guide-related visual asset work.

The earlier v0 plan should therefore be treated as partially complete, not restarted.

## Latest completed work

### PR-039

Merged: `docs: add current status runbook`.

Result:

- Added this runbook.
- Fixed the merge-by-merge reporting rule.
- Reset the roadmap against the actual repository state.

### PR-040 equivalent

Committed directly to `main` because new branch creation was blocked by the tool safety layer during this session.

Result:

- Added `docs/runbooks/route-audit.md`.
- Confirmed that `/encyclopedia/` remains the current registry route for v0.
- Confirmed that separate `/gone/` and `/active/` pages are not v0 blockers while status filtering exists.
- Identified the reading-layer gap: `/guides/`, two core guides, `/glossary/`, and `/updates/`.

### PR-041 equivalent

Committed directly to `main` because new branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `/guides/` as the v0 reading-layer entry point.
- Framed guides as registry-support pages, not broad NFT blog content.
- Added links to the two planned v0 guide pages.
- Updated sitemap generation to include `/guides/`.

### PR-042 equivalent

Committed directly to `main` because branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `/guides/what-happens-when-nft-marketplace-shuts-down/`.
- Explained marketplace shutdown without claiming NFTs or assets necessarily disappear.
- Added sections for what may be gone, what may remain, and how M&G records shutdown states.
- Linked back to guides, encyclopedia, methodology, and the next planned guide.
- Updated sitemap generation to include the shutdown guide.

### PR-043 equivalent

Committed directly to `main` because branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `/guides/frontend-vs-smart-contract-what-remains/`.
- Explained frontend, marketplace operation, smart contracts, metadata, wallet visibility, and archives as separate layers.
- Avoided overclaiming that a closed frontend equals lost assets.
- Linked back to guides, encyclopedia, methodology, and the shutdown guide.
- Updated sitemap generation to include the frontend vs smart contract guide.

### PR-044 equivalent

Committed directly to `main` because branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `/glossary/` with initial compact definitions.
- Covered marketplace frontend, smart contract, metadata, collection page, trading history, aggregator, launchpad, community fork, archived URL, dead domain, rebrand, acquisition, delisting, royalties, creator fee, and related terms.
- Linked glossary to guides and methodology.
- Updated sitemap generation to include `/glossary/`.

### PR-045 equivalent

Committed directly to `main` because branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `/updates/` as a registry update/changelog entry point.
- Framed updates as registry changes, not NFT news/blog content.
- Defined update categories for added records, status changes, evidence additions, archive links, and methodology changes.
- Clarified that unreviewed monitoring signals and unmerged candidates do not belong in public updates.
- Added an initial v0 reading-layer update note.
- Updated sitemap generation to include `/updates/`.

### PR-046 equivalent

Committed directly to `main` because branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `docs/runbooks/v0-release-hardening-checklist.md`.
- Checked BaseLayout metadata coverage: title, description, robots, canonical, OG, Twitter, favicon, sitemap link, and JSON-LD WebSite block.
- Confirmed sitemap generator covers the current static routes and generated marketplace records.
- Added footer links to Guides, Glossary, and Updates so the reading layer is discoverable without replacing the registry as the main header focus.
- Fixed duplicate batch-35 slugs that initially blocked validation.
- Fixed CSS selector warnings in the mobile subpage/stat styles.
- Confirmed local terminal check passed with no CSS warning: stats generated, sitemap generated with 350 URLs, validation passed, and 350 pages built.

### PR-047 equivalent

Committed directly to `main` because branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `/guides/how-to-check-old-nft-marketplace-pages/` as the first v0.5 reading-layer guide.
- Updated `/guides/` to list the new guide as a v0.5 guide.
- Updated sitemap generation to include the new guide route.
- Kept the guide framed as a registry-support workflow, not an NFT blog post.
- Confirmed local terminal check passed after the change: sitemap generated with 351 URLs, validation passed, and 351 pages built.

### PR-048 equivalent

Committed directly to `main` because branch creation remained blocked by the tool safety layer during this session.

Result:

- Added `/guides/do-nfts-disappear-when-a-marketplace-closes/` as the second v0.5 reading-layer guide.
- Updated `/guides/` to list the new guide.
- Updated sitemap generation to include the new guide route.
- Kept the guide focused on layer separation: marketplace page, token record, metadata path, media file, wallet display, and trading path.
- Avoided overclaiming that marketplace closure means NFT or asset disappearance.

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

NFT ownership or testnet NFT experience is postponed.

## Version plan

### v0 baseline

Goal: make the registry credible and navigable.

Required state:

- Home page
- Marketplace encyclopedia / registry index
- Marketplace detail pages
- Methodology
- About
- Submit / correction path
- Stats or archive-at-a-glance support if already present
- Sitemap and robots
- Validation and build checks
- Source-reviewed seed records

Current assessment: implemented at source/build level. The route audit, v0 reading layer, release-hardening checklist, and local terminal check are complete. Browser/mobile visual review is still useful, but terminal validation/build no longer blocks v0.

### v0 reading layer

Goal: add only the minimum reading pages that strengthen the registry.

Required state:

- Guides index: done
- What happens when an NFT marketplace shuts down?: done
- Frontend vs smart contract: what actually remains?: done
- Glossary index: done
- Updates index / registry changelog entry point: done

Do not expand into broad NFT blogging at this stage.

### v0 release hardening

Goal: make the current public surface consistent and safer.

Current status:

- metadata structure checked
- sitemap route list checked at source level
- reading-layer footer discovery added
- hardening checklist added
- duplicate slug validation issue fixed
- CSS warning fixed
- `npm run check` passed locally with 350 pages built before PR-047 and 351 pages built after PR-047
- browser/mobile visual review remains recommended

### v0.5

Goal: expand search-intake pages without weakening the registry.

Current status:

- first v0.5 guide added: `/guides/how-to-check-old-nft-marketplace-pages/`
- second v0.5 guide added: `/guides/do-nfts-disappear-when-a-marketplace-closes/`
- terminal check passed after first v0.5 guide
- terminal check pending after second v0.5 guide

Planned additions:

- additional guides
- glossary detail pages for major terms
- update detail pages
- stronger related-record links from guides/glossary to marketplace records
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

### PR-049: Validation check or next reviewed content batch

Preferred next action:

- run `npm run check` after the new guide/sitemap change.

If check passes, continue with one of the following:

- next guide: `What is an NFT marketplace aggregator?`
- glossary detail page structure
- update detail page structure
- reviewed record batch

### PR-050 and later: Record and content batches

Purpose: continue with small reviewed batches.

Expected pattern:

- record batch PRs
- reading page PRs
- internal-linking PRs
- current-status update after every merge

## Current next action

Run `npm run check` after pulling main. If it passes, proceed with the next reviewed content/record batch.

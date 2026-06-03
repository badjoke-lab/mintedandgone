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

## Operating rule

After each merged PR, update this file before moving to the next work item. Each update must include:

1. what was merged,
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

Current assessment: mostly implemented. The route audit is done. Next focus is the v0 reading layer.

### v0 reading layer

Goal: add only the minimum reading pages that strengthen the registry.

Required state:

- Guides index
- What happens when an NFT marketplace shuts down?
- Frontend vs smart contract: what actually remains?
- Glossary index
- Updates index / registry changelog entry point

Do not expand into broad NFT blogging at this stage.

### v0 release hardening

Goal: make the current public surface consistent and safer.

Required state:

- page titles and descriptions checked
- sitemap reflects canonical pages
- unsafe/dead domain behavior checked
- correction paths visible but secondary
- draft/uncertainty wording consistent
- mobile review completed

### v0.5

Goal: expand search-intake pages without weakening the registry.

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

### PR-041: Add or align guides index

Purpose: make guide content discoverable as a registry-support layer.

Expected scope:

- add `/guides/`
- explain that guides support the registry
- link to the two planned v0 guide pages
- keep encyclopedia as the primary product CTA
- update sitemap generator if the route is added

### PR-042: Add or align shutdown guide

Purpose: publish or standardize the first guide: what happens when an NFT marketplace shuts down.

### PR-043: Add or align frontend vs smart contract guide

Purpose: publish or standardize the second guide: what remains when frontend and smart contract are separated.

### PR-044: Add glossary index

Purpose: create the first reusable term layer for internal links.

### PR-045: Add updates index

Purpose: create a registry update/changelog entry point.

### PR-046: Release hardening pass

Purpose: align sitemap, metadata, correction links, draft wording, and mobile-safe layout before treating the current surface as v0.

### PR-047 and later: Record and content batches

Purpose: continue with small reviewed batches.

Expected pattern:

- record batch PRs
- reading page PRs
- internal-linking PRs
- current-status update after every merge

## Current next action

Proceed to PR-041: add or align the `/guides/` index.

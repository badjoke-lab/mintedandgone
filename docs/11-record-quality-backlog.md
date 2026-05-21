# Minted & Gone record quality backlog

Status: active internal backlog  
Scope: current 20 source-reviewed draft marketplace records  
Last updated: 2026-05-21

This document tracks record-quality work after the first 20-record seed set. It does not block all publication work. It makes the remaining uncertainty visible and actionable.

## Current registry state

Expected current totals:

- marketplace records: 20
- timeline events: 23
- evidence notes: 45
- review status: all current records are `reviewed_staging`
- confidence: all current records are `medium`
- fictional placeholder records: 0

Status mix:

- active: 12
- inactive: 4
- dead: 3
- acquired: 1

Interpretation:

- `reviewed_staging` means the record is source-backed enough to exist as a draft record.
- `reviewed_staging` does not mean final public-quality certification.
- `medium` confidence is acceptable for v0 draft display if the remaining flags stay visible.

## Flag summary

| Flag | Count | Meaning |
|---|---:|---|
| `current_status_live_unverified` | 12 | Current public frontend appears live or is represented as live, but direct periodic review is still needed. |
| `needs_official_launch_source` | 10 | Launch timing is supported by secondary/context sources, but a stronger official source is desirable. |
| `needs_exact_archive_capture` | 7 | Wayback wildcard exists, but exact archived captures should be selected. |
| `needs_contract_review` | 6 | Contract or on-chain marketplace behavior still needs review. |
| `needs_official_status_source` | 4 | Status cannot be finalized without stronger official status, wind-down, or current-service source. |
| `needs_frontend_review` | 4 | Current frontend behavior needs direct verification. |
| `needs_asset_status_review` | 3 | User asset handling or post-shutdown asset status needs review. |
| `needs_current_frontend_review` | 2 | Current frontend behavior should be checked even though status is less ambiguous. |
| `needs_successor_review` | 2 | Predecessor/successor or community-continuation relation needs stronger review. |
| `needs_official_shutdown_archive` | 1 | Official shutdown notice should be archived or located directly. |
| `needs_app_status_review` | 1 | App-specific marketplace behavior needs review. |
| `needs_protocol_status_review` | 1 | Protocol/onchain scope needs review beyond website availability. |

## Priority model

### P0 — status-sensitive and final-quality blockers

Resolve these before calling a record final public-quality:

- `needs_official_status_source`
- `needs_frontend_review`
- `needs_exact_archive_capture`
- `needs_asset_status_review`
- `needs_official_shutdown_archive`
- `needs_contract_review` for dead/inactive records

### P1 — public confidence improvements

Important but usually not status-changing:

- `needs_official_launch_source`
- `current_status_live_unverified`
- `needs_current_frontend_review`

### P2 — context and lineage polish

Useful for clarity and future detail quality:

- `needs_successor_review`
- `needs_app_status_review`
- `needs_protocol_status_review`

## P0 backlog

### Kraken NFT

Current status: `inactive`  
Open flags:

- `needs_official_status_source`
- `needs_frontend_review`
- `needs_asset_status_review`
- `needs_exact_archive_capture`

Required work:

1. Check current `kraken.com/nft` behavior.
2. Look for official Kraken NFT wind-down, pause, delisting, or product-status source.
3. Select an exact archived capture for the original marketplace surface.
4. Review whether NFT ownership, account, withdrawal, or asset access information is documented.

Do not change to `dead` without strong official closure or permanent shutdown source.

### X2Y2

Current status: `inactive`  
Open flags:

- `needs_official_status_source`
- `needs_frontend_review`
- `needs_contract_review`
- `needs_exact_archive_capture`

Required work:

1. Check current `x2y2.io` frontend behavior.
2. Locate official source for status, wind-down, or continued operation.
3. Select exact archived captures for marketplace launch/active state and later state.
4. Review contract/on-chain accessibility before stronger asset or dead-status claims.

Do not classify as `dead` unless official shutdown or equivalent strong evidence is found.

### Coinbase NFT

Current status: `inactive`  
Open flags:

- `needs_official_status_source`
- `needs_frontend_review`
- `needs_asset_status_review`
- `needs_exact_archive_capture`

Required work:

1. Check current `nft.coinbase.com` behavior.
2. Look for official Coinbase NFT product-status, closure, or wind-down statement.
3. Select exact archived captures for launch/beta and later state.
4. Review user asset path and whether assets were wallet/account based or external chain based.

Do not mark as `dead` without stronger official status source.

### Quix

Current status: `inactive`  
Open flags:

- `needs_official_status_source`
- `needs_frontend_review`
- `needs_contract_review`
- `needs_exact_archive_capture`

Required work:

1. Check current `qx.app` behavior.
2. Locate official Quix / Quixotic status or wind-down source.
3. Select exact archived captures for active marketplace state and later unavailable state.
4. Review Optimism contract / marketplace traces if making asset or contract claims.

Do not mark as `dead` unless shutdown or wind-down evidence is strong.

### Hic et Nunc

Current status: `dead`  
Open flags:

- `needs_successor_review`
- `needs_exact_archive_capture`
- `needs_contract_review`

Required work:

1. Select exact archived capture for original `hicetnunc.xyz` state.
2. Review Teia / community continuation relationship from stronger sources.
3. Review Tezos contract / marketplace trace claims before finalizing asset-path wording.

### GameStop NFT

Current status: `dead`  
Open flags:

- `needs_exact_archive_capture`
- `needs_contract_review`

Required work:

1. Select exact archived capture for GameStop NFT marketplace before shutdown.
2. Select exact archived capture or official support notice for shutdown state if available.
3. Review Ethereum / Immutable X asset and contract handling wording.

### LG Art Lab

Current status: `dead`  
Open flags:

- `needs_official_shutdown_archive`
- `needs_asset_status_review`
- `needs_exact_archive_capture`
- `needs_contract_review`

Required work:

1. Locate or archive exact official LG shutdown notice.
2. Verify asset transfer / user wallet path from official or archived source.
3. Select exact archived marketplace captures.
4. Review Hedera / Ethereum chain handling if asserting asset status.

This is the highest-priority dead record to strengthen because it has a specific 2025 shutdown date.

### KnownOrigin

Current status: `acquired`  
Open flag:

- `needs_current_frontend_review`

Required work:

1. Check current `knownorigin.io` frontend behavior.
2. Confirm whether the independent marketplace surface is limited, redirected, archive-like, or still usable.
3. Keep acquisition status unless stronger evidence shows full shutdown or rebrand.

## P1 backlog

### Active marketplace launch-source group

Records:

- OpenSea
- Blur
- Magic Eden
- Rarible
- SuperRare
- Foundation
- LooksRare
- VeVe
- Zora
- Objkt

Shared flag:

- `needs_official_launch_source`

Required work:

1. Locate official launch/history/about source for each marketplace.
2. Prefer official blog, company about page, press release, documentation, or archived official page.
3. If official launch source cannot be found, retain secondary source and keep the flag.
4. Do not overfit exact day if only year-level support is available.

### Active live-unverified group

Records:

- OpenSea
- Blur
- Magic Eden
- Teia
- Rarible
- SuperRare
- Foundation
- LooksRare
- VeVe
- Zora
- Objkt
- MakersPlace

Shared flag:

- `current_status_live_unverified`

Required work:

1. Directly check current marketplace URL.
2. Confirm the public surface is reachable and still represents the same marketplace identity.
3. Do not treat simple homepage reachability as a contract or marketplace-function audit.
4. If checked, update notes/evidence before removing the flag.

### Current frontend review group

Records:

- KnownOrigin
- MakersPlace

Shared flag:

- `needs_current_frontend_review`

Required work:

1. Check whether the marketplace still supports browsing, listing, buying/selling, or only archival/brand pages.
2. Update `frontend_status` if needed.
3. Add evidence note for current state.

## P2 backlog

### Teia / Hic et Nunc successor relation

Records:

- Hic et Nunc
- Teia

Open flag:

- `needs_successor_review`

Required work:

1. Clarify whether Teia should be modeled as successor, community fork, continuation, or related marketplace.
2. Avoid overstating a direct corporate successor relationship.
3. Use community/official documentation carefully and label as lineage/context support.

### VeVe app status

Record:

- VeVe

Open flag:

- `needs_app_status_review`

Required work:

1. Review app-marketplace behavior separately from website behavior.
2. Confirm whether marketplace functionality is web-only, app-only, or hybrid.
3. Update notes without turning the record into an app-store listing.

### Zora protocol status

Record:

- Zora

Open flag:

- `needs_protocol_status_review`

Required work:

1. Separate Zora website, marketplace surface, protocol, and chain/network concepts.
2. Avoid reducing Zora to only a marketplace if the product has evolved into broader onchain media/protocol tooling.
3. Add source notes explaining scope.

## Recommended next work order

### Step 1 — Fix status-sensitive inactive records

Work order:

1. Kraken NFT
2. Coinbase NFT
3. X2Y2
4. Quix

Reason:

These are `inactive` rather than `dead`, and each depends on official status / frontend review. They affect classification quality most.

### Step 2 — Strengthen dead records

Work order:

1. LG Art Lab
2. GameStop NFT
3. Hic et Nunc

Reason:

Dead records need strong archive and asset-path handling because they are the core historical value of the site.

### Step 3 — Clean active records in batches

Work order:

1. OpenSea / Rarible / Blur / Magic Eden
2. SuperRare / Foundation / MakersPlace
3. LooksRare / VeVe / Zora / Objkt / Teia

Reason:

Active records can remain `source-reviewed draft`, but official launch/current frontend review makes the site feel less provisional.

### Step 4 — Only then add batch-04

Do not rush batch-04 before the current 20-record seed has a clearer quality map.

Batch-04 candidates remain:

- Nifty Gateway
- Solanart
- Solsea
- Fractal
- Binance NFT
- NFT Showroom

Nifty Gateway should not be classified quickly because acquisition, rebrand, studio identity, and marketplace status are complex.

## Rules for closing a flag

A flag should only be removed when the supporting work is recorded.

Minimum requirements:

- Add or update evidence when a source supports the change.
- Update notes when a manual frontend/app/protocol check supports the change.
- Do not remove `needs_exact_archive_capture` just because a wildcard Wayback URL exists.
- Do not remove `current_status_live_unverified` unless current availability was checked and recorded.
- Do not remove `needs_official_status_source` unless an official or high-quality status source is added.

## Publication interpretation

This backlog does not mean the site cannot be shown.

It means:

- Current records are acceptable as source-reviewed drafts.
- Final public-quality claims should wait for P0 completion.
- The site should continue to present uncertainty openly.
- Methodology and detail pages should explain `reviewed_staging`, confidence, evidence, and flags.

## Next document dependency

After this backlog, the next non-visual document should be:

```txt
docs/12-methodology-about-copy-plan.md
```

Purpose:

- Make `/methodology/` explain source-reviewed draft status.
- Make `/about/` explain the project without sounding like a trading dashboard or final certification database.

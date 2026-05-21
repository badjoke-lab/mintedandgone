# Minted & Gone methodology / about copy plan

Status: implementation planning  
Scope: `/methodology/` and `/about/` copy strengthening  
Last updated: 2026-05-21

This document defines the next non-visual content pass after the first 20-record seed set and record quality backlog.

The goal is to make the site explain itself clearly while current records remain `source-reviewed draft` rather than final certified records.

## Why this pass is needed

The current registry has real source-reviewed draft records, but many records still carry explicit quality flags.

That is acceptable if the site explains:

- what a source-reviewed draft means
- what confidence means
- how status is assigned conservatively
- why some records are inactive rather than dead
- why archived URLs matter
- why records remain open to correction

Without this copy pass, the site can look unfinished instead of transparent.

## Page roles

### `/methodology/`

Role:

- definition and trust page
- explains how records are classified, sourced, and limited
- should be more formal and precise

The methodology page should answer:

- What does Minted & Gone count?
- What is a marketplace record?
- What do status labels mean?
- What do confidence and review status mean?
- Why are some records not classified as dead?
- How are evidence and archives used?
- How should users interpret uncertainty?

### `/about/`

Role:

- project explanation page
- softer and shorter than methodology
- explains why the archive exists and what it is not

The about page should answer:

- What is Minted & Gone?
- Why preserve NFT marketplace history?
- Who is it for?
- What is it not?
- How can corrections be submitted?

## Tone rules

Use the same voice as the rest of the site:

- archival
- calm
- transparent
- non-hype
- non-dashboard
- non-certification
- historically minded

Avoid:

- claiming final authority
- implying live monitoring accuracy
- sounding like an investment product
- sounding like a trading dashboard
- hiding uncertainty

## Core terms to define

### Source-reviewed draft

Recommended meaning:

A record that has been checked against at least some source material and is no longer a fictional placeholder, but still may have open flags for official sources, archives, frontend checks, contract review, asset paths, or successor relationships.

Recommended copy:

> A source-reviewed draft is a real registry entry backed by source material, but it is not a final certification. Some details may remain open to correction, especially current frontend status, exact archive captures, contract behavior, or asset handling after shutdown.

### Confidence

Recommended meaning:

Confidence is not popularity and not safety. It is the current strength of the record based on available sources and unresolved flags.

Recommended copy:

> Confidence describes the current strength of the record, not the quality or safety of the marketplace. A medium-confidence record may be useful and source-backed while still needing stronger official or archived sources.

### Review status

Recommended meaning:

Review status describes the current editorial state of the record.

Recommended values to explain:

- `reviewed_staging`
- `reviewed`
- `verified`
- `needs_review`

Current site mainly uses `reviewed_staging`.

### Status

Recommended meaning:

Status describes the marketplace's current or final registry state.

Values:

- `active`
- `inactive`
- `dead`
- `acquired`
- other future values if used later

The methodology must explain that Minted & Gone avoids dead classification when official closure evidence is weak.

### Archive URL

Recommended meaning:

Archived URLs are historical access points. For dead or altered marketplaces, archived URLs are often more important than the original current domain.

Recommended copy:

> Original marketplace domains are preserved as historical identifiers, but they may later expire, redirect, or be repurposed. For closed or changed marketplaces, Minted & Gone prefers archived captures when available.

### Record quality flags

Recommended meaning:

Flags are not errors; they are visible reminders of what still needs review.

Recommended copy:

> Record quality flags identify unresolved review work. They may point to missing official launch sources, missing exact archive captures, unverified current frontend status, contract review, asset-path review, or successor-lineage review.

## `/methodology/` proposed structure

### 1. Header

Title:

```txt
Methodology
```

Lead:

```txt
How Minted & Gone records NFT marketplaces, classifies their status, and handles uncertainty.
```

### 2. What this archive counts

Cover:

- NFT marketplaces
- CEX-operated NFT marketplace features
- brand marketplaces
- chain-specific marketplaces
- community continuation projects
- active and faded marketplace histories

Do not claim complete coverage.

### 3. What this archive does not count

Cover:

- trading volume rankings
- investment recommendations
- token prices
- NFT collection rankings
- marketplace safety scores
- real-time availability monitoring
- full smart contract audits

### 4. Record model

Explain:

- marketplace record
- timeline event
- evidence note

Recommended text:

> Each entry is built from three layers: the marketplace record, timeline events, and evidence notes. The marketplace record describes the identity and current classification. Timeline events explain major changes. Evidence notes show the sources used to support those claims.

### 5. Status classification

Explain conservative status handling.

Required language:

- active means represented as currently operating or reachable in this draft
- inactive means current status is unclear or no longer clearly operating, but shutdown is not confirmed
- dead means the original marketplace surface is treated as gone based on stronger evidence
- acquired means the independent marketplace identity changed through acquisition

Recommended caution:

> When evidence is weak, Minted & Gone prefers inactive or under-review wording rather than declaring a marketplace dead.

### 6. Confidence and review status

Explain:

- confidence is evidence strength
- confidence is not quality/safety/popularity
- reviewed_staging means usable draft, not final certification

### 7. Evidence and source handling

Explain:

- official pages
- marketplace pages
- archive captures
- reporting
- research references
- database references

Rules:

- official status sources are preferred for shutdown/current-state claims
- research/database sources can support context but should not alone determine current status
- Wikipedia-style references, when used, should only be cross-checks

### 8. URL and archive handling

Explain:

- original URLs retained as history
- original URLs may be unsafe, dead, redirected, or repurposed later
- archive URL is often the safer primary historical path

### 9. What flags mean

Explain that flags are transparent TODOs.

Examples:

- `needs_official_launch_source`
- `current_status_live_unverified`
- `needs_frontend_review`
- `needs_exact_archive_capture`
- `needs_contract_review`
- `needs_asset_status_review`
- `needs_successor_review`

### 10. Corrections

Explain what users should send:

- marketplace name
- page URL
- what looks wrong
- source links
- archive links if available

## `/about/` proposed structure

### 1. Header

Title:

```txt
About Minted & Gone
```

Lead:

```txt
A quiet archive of NFT marketplaces: the ones still active, the ones that faded, and the traces they left behind.
```

### 2. What it is

Recommended text:

> Minted & Gone is a historical registry for NFT marketplaces. It tracks marketplace identities, status changes, shutdowns, acquisitions, community continuations, and evidence notes in one place.

### 3. Why it exists

Recommended text:

> NFT marketplaces can disappear quietly. Domains expire, product pages change, support notices vanish, and old platform histories become hard to reconstruct. This archive preserves those traces so collectors, researchers, builders, and curious readers can understand how the marketplace landscape changed over time.

### 4. What it is not

Recommended bullets:

- not a trading dashboard
- not an investment guide
- not a marketplace ranking
- not a safety certification
- not a full smart-contract audit
- not a real-time monitoring guarantee

### 5. How to read the records

Recommended text:

> Records should be read as evidence-backed historical drafts. Some entries are stronger than others. Confidence levels, evidence notes, archived URLs, and record quality flags explain what is known and what still needs review.

### 6. Correction invitation

Recommended text:

> If you know of a missing marketplace, archived source, official shutdown notice, or correction, submit it with source links. Minted & Gone is designed to improve over time.

## Implementation plan

### Step 1 — inspect current pages

Files likely involved:

- `src/pages/methodology.astro`
- `src/pages/about.astro`

If routes are directory-based, check:

- `src/pages/methodology/index.astro`
- `src/pages/about/index.astro`

### Step 2 — update methodology copy

Replace thin or generic copy with the structure above.

Acceptance:

- source-reviewed draft is explained
- conservative status handling is explained
- flags are explained
- evidence and archive handling are explained

### Step 3 — update about copy

Replace generic about copy with shorter project-positioning copy.

Acceptance:

- clear project identity
- clear non-goals
- clear correction invitation

### Step 4 — run check

Command:

```bash
npm run check
```

Acceptance:

- stats generated
- sitemap generated
- validation passed
- build passed

## Copy risks to avoid

Do not say:

- fully verified archive
- official database
- complete marketplace list
- real-time status tracker
- safe / unsafe marketplace recommendation
- final classification

Prefer:

- source-reviewed draft
- evidence-backed record
- current classification
- open to correction
- archived trace
- status under review

## Next action

Implement this plan before adding batch-04.

Reason:

The site already has 20 records. Before adding more, it needs stronger explanatory pages so the draft-state records are interpreted correctly.

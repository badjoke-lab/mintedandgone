# Tokenized Collectibles Operations

Status: operational specification

## Purpose

This document defines how Minted & Gone maintains the `tokenized_collectibles` category after the initial implementation.

The category records marketplaces that connect a digital ownership or trading layer to physical collectibles. It does not treat every RWA project, card collection, tokenization vendor, or mystery-pack site as a marketplace.

## Canonical safety rule

Automated monitoring must never directly modify:

```text
data/marketplaces*.json
data/events*.json
data/evidence*.json
```

Monitoring may only create or update:

```text
data-staging/monitoring/tokenized-collectibles/**
```

A canonical record change requires a separate reviewed pull request.

## Current publication set

The initial category contains eight reviewed services:

- Courtyard
- Collector Crypt
- Phygitals
- Tradible
- PACKS
- TCG STORE
- Holos
- Artifacte

Deadstock remains a research hold because its exact Web3 service identity and official domain are unresolved.

## Required record layers

Every published category entity must have:

1. one marketplace entity
2. at least one review or lifecycle event
3. at least three evidence records
4. official or first-party marketplace evidence
5. physical-backing, custody, redemption, or legal evidence
6. archive coverage

Stronger claims require matching claim-scoped evidence:

- `physical_1_to_1` requires `physical_backing`
- non-unknown custody requires `custody`
- active or restricted redemption requires `redemption`
- mystery pack or gacha requires `randomized_sale`
- platform buyback requires `buyback`

## Adding a new service

Use this order:

1. add the service to the research candidate ledger
2. scan every `data/marketplaces*.json` file
3. compare slug, canonical name, aliases, domain, URL, and predecessor/successor relationships
4. confirm that a native marketplace or market surface exists
5. collect first-party evidence
6. keep unresolved fields as `unknown` or `unclear`
7. add entity, event, evidence, and candidate decision records in one reviewed pull request
8. run `npm run check`

GitHub search alone is never sufficient for duplicate checking.

## Status discipline

Marketplace status, physical backing, custody, and redemption are separate concepts.

Examples:

- an active marketplace may have unknown redemption
- an active marketplace may use third-party custody
- physical assets may remain while the frontend becomes inactive
- a working website does not prove one-to-one backing

Monitoring signals must not automatically change `status`, `asset_backing`, `custody_model`, or `redemption_status`.

## Operator commands

```text
npm run validate:tokenized
npm run monitor:tokenized
npm run monitor:tokenized:smoke
npm run monitor:tokenized:live
npm run monitor:tokenized:live:publish
npm run test:monitoring:tokenized-url
npm run check
```

## Weekly operating flow

```text
scheduled monitoring
→ internal quality checks
→ candidate-state checks
→ official and evidence URL checks
→ canonical guard
→ no findings: no pull request
→ findings: monitoring-only pull request
→ operator review
→ separate canonical correction pull request when justified
```

## Review priority

1. critical reference or duplicate failures
2. high official URL or unsupported claim findings
3. medium evidence, archive, or stale-record findings
4. low unresolved fields and research holds

## Prohibited automation

The monitoring workflow must not:

- change marketplace status
- declare a service dead
- determine legal title or bankruptcy protection
- replace evidence automatically
- create a marketplace record automatically
- merge its own pull request

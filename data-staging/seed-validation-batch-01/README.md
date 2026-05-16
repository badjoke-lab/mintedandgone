# Seed Validation Batch 01

Status: staging review batch  
Scope: record-generation validation for Minted & Gone  
Canonical promotion: not yet approved

## Purpose

This batch tests whether Minted & Gone can produce usable historical NFT marketplace records beyond visual mock data.

The goal is not to maximize record count.  
The goal is to validate the record shape across three common marketplace outcomes:

1. active marketplace
2. dead / shut down marketplace
3. acquired / absorbed marketplace

If these three cases work, the project can safely move from visual mock validation to real seed data generation.

## Included records

| Case | Record | Intended status | Why included |
|---|---|---:|---|
| Active | OpenSea | `active` | Tests the baseline active marketplace case. |
| Dead | GameStop NFT | `dead` | Tests brand-operated marketplace shutdown handling. |
| Acquired | KnownOrigin | `acquired` | Tests acquisition / independent-identity loss handling. |

## Files

```txt
data-staging/seed-validation-batch-01/
  marketplaces.json
  events.json
  evidence.json
  README.md
```

## Review goals

This batch should answer the following questions before canonical promotion:

```txt
1. Can marketplace records describe active, dead, and acquired cases cleanly?
2. Can event records explain how the final status was reached?
3. Can evidence records show which source supports which claim?
4. Do the fields render properly in /encyclopedia/ and /encyclopedia/[slug]/?
5. Are uncertainty and weak-source areas visible rather than hidden?
```

## Promotion criteria

A record can move from this staging batch into canonical data only if it satisfies the following:

```txt
- no duplicate slug in data/marketplaces.json
- source URLs are reachable or archived
- at least 2 evidence records per non-active/dead-side record
- status is supported by evidence
- launch/end dates use correct precision
- what_is_gone / what_remains / where_users_or_assets_went are not speculative beyond the sources
- confidence and review_status reflect source strength
- npm run check passes after insertion
```

## Known weak points

### OpenSea

Current weakness:

```txt
- active status is only treated as public-domain availability, not a full operational audit
- launch year needs stronger primary-source confirmation
```

Canonical promotion requirement:

```txt
- add stronger official/about/company source if available
- keep current status as live_unverified unless a formal verification rule exists
```

### GameStop NFT

Current weakness:

```txt
- shutdown is supported by secondary reporting
- official archived shutdown notice should be added if available
- contract_status and asset_status require more careful review
```

Canonical promotion requirement:

```txt
- add official GameStop archived notice or official support page capture
- verify whether Ethereum / Immutable X scope is accurate for the final marketplace state
- confirm what users could still access after shutdown
```

### KnownOrigin

Current weakness:

```txt
- acquisition is supported by secondary reporting in this staging draft
- official eBay / KnownOrigin / press-release source should be added
- frontend_status is marked limited but requires current-state review
```

Canonical promotion requirement:

```txt
- add official acquisition announcement or press-release source
- verify current KnownOrigin domain behavior
- decide whether status should remain acquired, become limited, or be modeled as acquired + later winddown event
```

## Output expectation

This batch should not be merged into canonical data blindly.

Next step:

```txt
1. review evidence strength
2. replace weak sources with official/archived sources where possible
3. decide whether each record is promotable
4. if promotable, apply to canonical JSON in a separate commit
5. run npm run check
6. inspect /encyclopedia/ and detail pages
```

## Decision

Current decision:

```txt
staging only
```

Do not remove the existing mock records until at least one real batch has passed display and validation checks.

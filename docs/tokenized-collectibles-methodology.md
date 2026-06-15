# Tokenized Collectibles Methodology

## Purpose

This document defines how Minted & Gone (MAG) records markets that connect NFTs or blockchain tokens to physically stored collectibles.

The category is intended for historical marketplace research. It is not a price tracker, investment guide, endorsement, custody audit, or guarantee that a physical asset exists.

## Category name

Canonical category:

```text
tokenized_collectibles
```

Preferred public label:

```text
Tokenized Collectibles
```

Descriptive label where additional clarity is needed:

```text
Physical-backed NFT Markets
```

The broad term `RWA` must not be used as the only classification because it includes unrelated financial, property, commodity, and credit products.

## Inclusion criteria

A service may be included when all of the following can be established:

1. A physical collectible or defined physical collectible pool exists.
2. An NFT or blockchain token represents a claim, ownership record, redemption right, or platform-controlled interest connected to the physical item or pool.
3. The service provides a market function, such as primary sale, secondary trading, auction, randomized sale, platform buyback, or redemption-linked transfer.
4. The service can be identified as a distinct marketplace or market surface rather than only a collection, campaign, wallet, or informational website.
5. At least one official source supports the physical-backing relationship.

Typical included assets:

- trading cards
- sports cards
- graded collectible cards
- comics
- memorabilia
- sneakers
- watches
- other individually identifiable collectibles

## Exclusions

Exclude or hold a candidate when it is only:

- a conventional physical-goods store with no tokenized ownership or redemption layer
- an NFT collection using photographs or artwork of physical objects without a claim on the objects
- a one-time promotional mint without an identifiable market function
- a price index, portfolio tracker, lending product, fund, or fractional investment product without a collectible marketplace
- a tokenization vendor that does not operate or expose a market surface
- an unverified project for which physical backing is asserted only by social posts or third-party promotion
- a white-label deployment that is not independently identifiable as a marketplace

## Record model

MAG remains marketplace-entity first.

```text
marketplace entity
  -> lifecycle and operational events
  -> evidence records
```

Tokenized collectible records do not create a separate top-level record system. They use optional fields on the existing marketplace entity and category-specific event types.

## Core optional fields

The following fields may be present only where relevant:

```json
{
  "asset_backing": "physical_1_to_1",
  "platform_roles": [
    "marketplace",
    "custody_orchestrator",
    "redemption_operator"
  ],
  "custody_model": "third_party_vault",
  "redemption_status": "active",
  "randomized_sale_model": "none",
  "buyback_model": "open_market_only",
  "asset_categories": [
    "trading_cards"
  ]
}
```

These fields are additive and must not be inserted into unrelated historical records merely to satisfy uniformity.

## Enumerations

### `asset_backing`

```text
physical_1_to_1
physical_pool_backed
physical_redeemable
physical_nonredeemable
mixed
unclear
```

- `physical_1_to_1`: one token corresponds to one specifically identified physical item.
- `physical_pool_backed`: the token or product is connected to a managed pool rather than one immutable physical item.
- `physical_redeemable`: physical redemption is offered, but the available evidence does not establish a strict permanent one-to-one model.
- `physical_nonredeemable`: physical backing is claimed but holders do not have ordinary physical redemption rights.
- `mixed`: more than one materially different backing model operates on the same market surface.
- `unclear`: backing is claimed but the precise structure cannot be established.

### `platform_roles`

Multiple values are allowed.

```text
marketplace
tokenizer
issuer
custody_orchestrator
mystery_pack_operator
buyback_counterparty
redemption_operator
auction_operator
```

### `custody_model`

```text
platform_vault
third_party_vault
issuer_vault
distributed_custody
self_custody
unknown
```

### `redemption_status`

```text
active
restricted
paused
ended
not_offered
unknown
```

Marketplace status and redemption status must remain separate. A marketplace can remain online while redemption is restricted or paused.

### `randomized_sale_model`

```text
none
mystery_pack
gacha
repack
multiple
unknown
```

### `buyback_model`

```text
none
instant_buyback
platform_offer
open_market_only
restricted
unknown
```

## Evidence requirements

A published tokenized-collectibles record requires at least three evidence records:

1. An official service or marketplace source establishing the entity and market function.
2. An official terms, custody, redemption, logistics, help, proof-of-backing, or equivalent source establishing the relationship with physical collectibles.
3. An archive capture or preserved historical source.

Additional evidence should be included when available:

- official launch or shutdown announcement
- custodian or vault documentation
- chain or contract documentation
- official redemption fee and regional restriction documentation
- reliable independent reporting

The following claims require official or contractual evidence and must not be inferred from marketing language alone:

- one-to-one physical backing
- legal ownership transfer
- physical redemption availability
- insurance coverage
- identity of the custodian
- guaranteed buyback
- insolvency protection
- verifiable randomness

When the backing relationship is plausible but not sufficiently proven, use `asset_backing: unclear`, `redemption_status: unknown`, lower confidence, and a review flag. Do not promote a stronger claim from a third-party article alone.

## Status rules

The existing MAG marketplace status describes the market entity, not the physical asset.

Examples:

```text
active marketplace + active redemption
active marketplace + paused redemption
inactive marketplace + restricted asset-return process
dead marketplace + unresolved physical custody
acquired marketplace + continuing redemption under a successor
```

A live domain is not sufficient evidence of an active marketplace. A failed domain is not sufficient evidence of permanent closure.

## Category-specific events

Allowed event types for this category include:

```text
tokenization_launch
marketplace_launch
mystery_pack_launch
physical_redemption_launch
redemption_paused
redemption_resumed
redemption_ended
custodian_changed
vault_migrated
insurance_changed
buyback_launched
buyback_policy_changed
chain_migrated
marketplace_shutdown
insolvency_announced
asset_return_process_announced
```

Events concerning custody, redemption, insolvency, or asset return receive higher historical priority than routine pack launches or token-price movements.

## Randomized-sale treatment

MAG records the existence and lifecycle of mystery packs, gacha, and repack systems, but does not certify fairness or expected value.

The existence of an on-chain transaction or randomness component does not establish that all of the following are independently verifiable:

- inventory composition
- pack odds
- random-number generation
- price references
- platform margin
- buyback pricing

Use `randomness_verifiability` only when a later schema revision defines it and supporting technical evidence exists.

## Token-price treatment

Utility or ecosystem token prices are outside MAG's primary scope.

Record token-related events only when they materially change the marketplace, including:

- token launch tied to marketplace operation
- change in marketplace utility
- rewards or buyback-policy change
- migration or replacement
- discontinuation

Do not create events for ordinary token-price movements.

## Initial candidate groups

Priority research group:

```text
Courtyard
Collector Crypt
PACKS
TCG STORE
```

Secondary research group:

```text
Deadstock
Holos
Phygitals
Tradible
Artifacte
```

Candidate presence in this document does not mean the service has passed duplicate, scope, status, or evidence review.

## Publication rule

No tokenized-collectibles candidate may be published until:

- repository-wide duplicate checks are complete
- the marketplace boundary is established
- backing and redemption claims are supported at the stated confidence level
- marketplace, event, and evidence references are internally consistent
- validation passes
- a human has reviewed the final diff

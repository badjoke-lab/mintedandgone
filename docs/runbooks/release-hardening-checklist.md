# Minted & Gone Release Hardening Checklist

Last updated: 2026-06-03

## Purpose

This checklist defines the remaining checks before treating the current Minted & Gone surface as v0-ready.

The goal is not to add broad new product areas. The goal is to make the existing registry, reading layer, sitemap, correction path, and uncertainty wording consistent.

## Current public surface

Core registry routes:

- `/`
- `/encyclopedia/`
- `/encyclopedia/[slug]/`
- `/stats/`
- `/methodology/`
- `/about/`
- `/submit/`
- `/support/`
- `/contact/`

v0 reading layer routes:

- `/guides/`
- `/guides/what-happens-when-nft-marketplace-shuts-down/`
- `/guides/frontend-vs-smart-contract-what-remains/`
- `/glossary/`
- `/updates/`

## Checks before v0-ready label

### 1. Sitemap coverage

Required:

- `scripts/generate-sitemap.ts` includes all static routes above.
- Marketplace detail URLs are generated from all `data/marketplaces*.json` files.
- `public/sitemap.xml` is regenerated after route changes.

Status: reading-layer static routes are included.

### 2. Header and footer navigation

Required:

- Registry remains primary.
- Reading layer is discoverable.
- Submit/correction remains visible but secondary.
- Support is present but not treated as the main product action.

Status: header now exposes Guides, Glossary, and Updates; footer already links to reading-layer routes.

### 3. Metadata

Required:

- Every top-level page has a clear title.
- Page descriptions avoid NFT trading, investment, or marketplace-safety language.
- Canonical and Open Graph output come from `BaseLayout`.

Status: `BaseLayout` provides canonical, description, Open Graph, Twitter card, favicon, sitemap link, and JSON-LD site metadata.

### 4. Wording safety

Required:

- Do not claim that NFTs disappear just because a marketplace frontend closes.
- Do not describe a marketplace as dangerous, fraudulent, or unsafe without reviewed evidence.
- Use draft/uncertainty wording where evidence is still incomplete.
- Keep marketplace availability, frontend state, contracts, metadata, and user asset visibility separated.

Status: methodology and guides follow this direction; record pages continue to expose draft/review notes.

### 5. Correction path

Required:

- `/submit/` is reachable from header or record pages.
- Record detail pages include a correction nudge.
- Footer includes a correction path.

Status: present.

### 6. Domain and archive behavior

Required:

- Historical URLs and archive URLs are treated as evidence/reference, not endorsement.
- Closed or changed marketplaces should prefer archive/history wording.
- Direct domain behavior should remain conservative.

Status: record detail pages include archive blocks and draft notes; deeper domain-link behavior should be rechecked during browser review.

### 7. Mobile/browser review

Required manual browser checks:

- home
- encyclopedia index
- at least three detail pages with different statuses
- stats
- methodology
- guides index
- both guide pages
- glossary
- updates
- submit

Status: pending browser review.

## Remaining blockers

No known structural blocker from the route/content audit.

Remaining work before v0-ready wording:

1. Run `npm run check` locally or in CI.
2. Browser-check the routes listed above.
3. Fix any visible layout breakage or broken route.
4. Regenerate sitemap if route files changed.

## Next work after hardening

After this checklist is satisfied, continue with reviewed record/content batches instead of expanding into NFT experience features.

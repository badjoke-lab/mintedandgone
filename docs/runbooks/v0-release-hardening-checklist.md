# Minted & Gone v0 Release Hardening Checklist

Last updated: 2026-06-03

## Scope

This checklist records the v0 hardening pass after the reading layer was added.

The goal is not to declare Minted & Gone final. The goal is to ensure the current public surface is consistent enough to treat as a v0 draft registry.

## Completed in this pass

### Static route coverage

Current static routes expected in sitemap generation:

- `/`
- `/encyclopedia/`
- `/stats/`
- `/guides/`
- `/guides/what-happens-when-nft-marketplace-shuts-down/`
- `/guides/frontend-vs-smart-contract-what-remains/`
- `/glossary/`
- `/updates/`
- `/methodology/`
- `/about/`
- `/submit/`
- `/support/`
- `/contact/`

Marketplace detail routes are generated from `data/marketplaces*.json` as `/encyclopedia/[slug]/`.

### Metadata coverage

`BaseLayout.astro` provides:

- viewport
- title
- meta description
- robots
- canonical URL
- Open Graph title/description/type/url/image
- Twitter card metadata
- favicon
- sitemap link
- JSON-LD WebSite block

Most top-level pages pass a route-specific title. New reading-layer pages also pass route-specific descriptions.

### Reading layer navigation

Footer now links to:

- Guides
- Glossary
- Updates
- Submit correction
- Contact
- Support

The main header remains registry-first and does not push Guides above the encyclopedia.

### Wording safety

The new reading-layer pages avoid claims that:

- NFTs automatically disappear when a marketplace closes
- assets were necessarily lost
- a closed frontend proves on-chain records are gone
- a marketplace is unsafe, dangerous, or a scam

Preferred wording used:

- frontend closed
- marketplace operation ended
- may remain readable
- may remain visible elsewhere
- source review is needed
- records are draft and open to correction

## Still requires terminal/browser verification

These items should be checked outside the GitHub file-editing tool:

- run `npm run check`
- confirm generated `public/sitemap.xml` includes new static routes
- browser review for `/guides/`, both guide pages, `/glossary/`, `/updates/`
- mobile review for header/footer wrapping and guide/glossary/update pages
- check that all CTA links resolve after build
- check that new pages do not create CSS regressions

## v0 release position

After this pass, the v0 reading layer is in place and the public surface is structurally ready for terminal/browser verification.

Do not call the project final. It remains a source-reviewed draft archive.

## Next work

After terminal/browser verification, continue with PR-047 and later:

- small reviewed record batches
- internal-link improvements
- additional guide/glossary/update detail pages for v0.5

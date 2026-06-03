# Minted & Gone Route Audit

Last updated: 2026-06-03

## Current position

The repository is not starting from zero. It already has the static site foundation, JSON records, encyclopedia pages, stats, sitemap generation, validation, methodology, about, submit, support, and contact pages.

## Current public routes

- `/`
- `/encyclopedia/`
- `/encyclopedia/[slug]/`
- `/stats/`
- `/methodology/`
- `/about/`
- `/submit/`
- `/support/`
- `/contact/`

## v0 route decision

Keep `/encyclopedia/` as the main marketplace registry route for v0. Do not block v0 on adding separate `/gone/` and `/active/` pages because status filtering already exists on the encyclopedia page.

## Reading layer gap

Add these next:

- `/guides/`
- `/guides/what-happens-when-nft-marketplace-shuts-down/`
- `/guides/frontend-vs-smart-contract-what-remains/`
- `/glossary/`
- `/updates/`

## Defer

- `/research-notes/`
- `/timeline/`
- `/chains/`
- `/categories/`
- `/testnet-pass/`
- `/archive-shelf/`

## Next PR

PR-041 should add `/guides/` as the v0 reading-layer entry point and update sitemap generation if needed.

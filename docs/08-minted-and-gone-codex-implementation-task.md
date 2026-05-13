# 08-minted-and-gone-codex-implementation-task.md

# Minted & Gone Codex Implementation Task

Status: implementation task / ready to hand to Codex  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`, `02-minted-and-gone-schema-stats-ready.md`, `03-minted-and-gone-methodology.md`, `04-minted-and-gone-candidates.md`, `04.5-minted-and-gone-mock-seed.md`, `05-minted-and-gone-html-mock-plan.md`, `06-minted-and-gone-implementation-plan.md`, `07-minted-and-gone-v0-seed-selection.md`  
UI source: `minted-and-gone-html-mock.html`  
Purpose: GitHub/Codex implementation instruction  
Core rule: Implement v0 as a static-first Astro site. No runtime DB/API.

---

## 0. Task summary for Codex

Implement **Minted & Gone**, a static-first NFT marketplace historical registry and field guide.

The site should feel like:

```txt
illustrated encyclopedia
field guide
storybook archive
warm paper registry
```

It must **not** look like:

```txt
crypto trading dashboard
NFT price ranking site
HEI clone
dark analytics dashboard
```

Build a static Astro site using the provided mock data first.  
Do not create production seed data yet.  
Do not add runtime APIs, databases, login, comments, price feeds, or NFT market data integrations.

---

## 1. Primary implementation goal

Create a working static site with these routes:

```txt
/                         Top page
/marketplaces/            Marketplace index with search/filter
/marketplace/[slug]/      Static detail pages from JSON
/stats/                   Static stats page
/methodology/             Longform methodology page
/about/                   Short about page
/submit/                  Submit/correction guide page
```

Use the existing HTML mock as the visual direction:

```txt
minted-and-gone-html-mock.html
```

The production implementation should improve it slightly, especially:

```txt
mobile readability
filter compactness
card hierarchy
status chip clarity
longform spacing
```

Do not redesign from scratch.

---

## 2. Required technology

Use:

```txt
Astro static site
TypeScript
Vanilla CSS
Small client-side JavaScript only for search/filter
Node scripts for validation and stats generation
```

Do not use:

```txt
runtime DB
server API
Cloudflare D1/KV/R2
login/auth
React runtime unless absolutely necessary
chart library
large animation library
Tailwind unless project already uses it
```

The site must be deployable on Cloudflare Pages as a static site.

---

## 3. Required directory structure

Create or adapt this structure.

```txt
minted-and-gone/
  docs/
    00-minted-and-gone-v0-spec.md
    01-minted-and-gone-design.md
    02-minted-and-gone-schema-stats-ready.md
    03-minted-and-gone-methodology.md
    04-minted-and-gone-candidates.md
    04.5-minted-and-gone-mock-seed.md
    05-minted-and-gone-html-mock-plan.md
    06-minted-and-gone-implementation-plan.md
    07-minted-and-gone-v0-seed-selection.md
    08-minted-and-gone-codex-implementation-task.md

  data/
    marketplaces.json
    events.json
    evidence.json
    stats.json
    stats-history.json

  mock-data/
    mock-marketplaces.json
    mock-events.json
    mock-evidence.json
    mock-stats.json

  scripts/
    validate-data.ts
    generate-stats.ts

  src/
    pages/
      index.astro
      marketplaces.astro
      marketplace/[slug].astro
      stats.astro
      methodology.astro
      about.astro
      submit.astro

    components/
      SiteHeader.astro
      SiteFooter.astro
      BookHero.astro
      BrowseShelf.astro
      MarketplaceCard.astro
      FilterPanel.astro
      FactGrid.astro
      WhatRemainsBlock.astro
      UrlArchiveBlock.astro
      Timeline.astro
      EvidenceList.astro
      StatsKpiGrid.astro
      StatsBreakdown.astro
      LongformLayout.astro
      EmptyState.astro
      StatusChip.astro
      Tags.astro

    lib/
      data.ts
      filters.ts
      format.ts
      stats.ts
      schema.ts

    styles/
      tokens.css
      base.css
      layout.css
      components.css
      pages.css

  public/
    favicon.svg
    robots.txt

  astro.config.mjs
  package.json
  tsconfig.json
```

If the repository already has a structure, adapt cleanly instead of blindly replacing it.

---

## 4. Data rule for first implementation

Use mock data first.

Source files:

```txt
mock-data/mock-marketplaces.json
mock-data/mock-events.json
mock-data/mock-evidence.json
mock-data/mock-stats.json
```

Copy the mock files into `data/` for the first working implementation:

```txt
data/marketplaces.json
data/events.json
data/evidence.json
data/stats.json
```

Create:

```txt
data/stats-history.json
```

with one snapshot based on mock stats.

Important:

```txt
These records are mock records.
Add visible mock-data warnings in footer or development note if needed.
Do not claim the records are verified canonical public data.
```

---

## 5. Data model requirements

Implement TypeScript types or runtime validation based on the schema doc.

Required marketplace fields:

```txt
id
slug
canonical_name
aliases
status
category
marketplace_scope
chain_scope
origin_bucket
summary
confidence
review_status
record_quality_flags
last_verified_at
```

Recommended fields to display when present:

```txt
launch_year
end_year
closure_reason
frontend_status
contract_status
asset_status
country_or_origin
official_url_original
official_domain_original
official_url_status
archived_url
successor_marketplace
predecessor_marketplace
what_is_gone
what_remains
where_users_or_assets_went
notes
```

Required event fields:

```txt
id
marketplace_id
event_type
event_date
event_date_precision
title
description
confidence
```

Required evidence fields:

```txt
id
marketplace_id
source_type
title
url
publisher
published_at
reliability
claim_scope
```

---

## 6. Visual design requirements

Follow the HTML mock direction.

Use:

```txt
warm paper background
ivory cards
large serif headings
soft rounded paper cards
thin decorative rules
subtle shadows
classification chips
field-guide style sections
```

Avoid:

```txt
black dashboard
neon crypto aesthetic
TradingView-style charts
large NFT artwork grid
busy price widgets
heavy animations
glassmorphism
```

## 6.1 CSS tokens

Create `src/styles/tokens.css` with warm palette variables:

```txt
--bg
--bg-soft
--paper
--paper-deep
--ink
--ink-soft
--muted
--line
--line-soft
--forest
--forest-soft
--gold
--gold-soft
--redwood
--redwood-soft
--bluegreen
--bluegreen-soft
--violet
--violet-soft
--shadow-soft
--shadow-card
```

Use Georgia or serif fallback for large headings.  
Use system sans-serif for body/UI.

---

## 7. Page requirements

---

## 7.1 `/` Top page

Build from HTML mock.

Required sections:

```txt
SiteHeader
BookHero
Field note / archive at a glance card
BrowseShelf
Featured records
Recently gone / faded records
About teaser
SiteFooter
```

Data rules:

```txt
Featured records may be manually selected by slug.
Recently gone should use dead/acquired/merged/rebranded records sorted by end_year/end_date where possible.
Archive at a glance should use stats.json.
```

Acceptance:

```txt
Looks like an encyclopedia/field guide cover.
Does not look like an NFT ranking or investment site.
Clear CTA to browse marketplaces.
```

---

## 7.2 `/marketplaces/`

Required:

```txt
Search input
Status filters
Category filters
Chain filters
Result count
Marketplace cards
Empty state
Clear filters
```

Client JS behavior:

```txt
Filter by search text
Filter by status
Filter by category
Filter by chain_scope
Clear filters
Update result count
Show empty state
```

Progressive behavior:

```txt
Without JS, all cards should still render.
With JS, filtering should enhance the page.
```

Mobile requirement:

```txt
Filters must not dominate the page.
Use compact chips or collapsible filter block on narrow screens.
```

---

## 7.3 `/marketplace/[slug]/`

Generate one static page per marketplace.

Use `getStaticPaths()`.

Required:

```txt
Breadcrumb
Record hero
Status chips
FactGrid
WhatRemainsBlock
UrlArchiveBlock
Timeline
EvidenceList
Related marketplace section
Correction prompt
Disclaimer note
```

Display order:

```txt
1. Name / summary / status
2. FactGrid
3. What is gone / What remains / Where users or assets went
4. URL / archive
5. Timeline
6. Evidence
7. Related / correction
```

Acceptance:

```txt
WhatRemainsBlock appears above timeline and evidence.
frontend_status / contract_status / asset_status are visible.
Evidence is visible, not hidden behind tabs.
Unknown fields display gracefully.
```

---

## 7.4 `/stats/`

Use `data/stats.json`.

Required:

```txt
KPI cards
Status breakdown
Category breakdown
Marketplace scope breakdown
Chain breakdown
Coverage / quality section
Launch/end year preview if available
Methodology note
```

No chart library.  
Use CSS bars or simple tables.

Acceptance:

```txt
Feels like field-guide appendix.
Does not feel like market dashboard.
Shows registry coverage and quality.
```

---

## 7.5 `/methodology/`

Use the methodology content from:

```txt
03-minted-and-gone-methodology.md
```

Create a readable longform page.

Required sections:

```txt
How to read this guide
What counts
What does not count
Status definitions
Frontend / contract / asset status
Evidence rules
Confidence levels
Stats methodology
Corrections
Disclaimer
```

Acceptance:

```txt
Longform is readable on mobile.
Looks like appendix / field guide notes.
```

---

## 7.6 `/about/`

Create a shorter page.

Required content:

```txt
What Minted & Gone is
Why it exists
What it records
What it does not do
Link to methodology
Link to submit/correction
```

Must say:

```txt
not investment advice
not legal advice
not real-time availability guarantee
```

---

## 7.7 `/submit/`

No real form in v0.

Required:

```txt
Suggest a missing marketplace
Submit a correction
What to include checklist
Source URL request
Archive URL request
No promotional listing disclaimer
```

Use placeholder links:

```txt
Google Form placeholder
GitHub Issue placeholder
```

---

## 8. Component requirements

## 8.1 StatusChip

Support statuses:

```txt
active
limited
inactive
dead
acquired
merged
rebranded
unknown
```

Each status should have distinct but soft color treatment.

## 8.2 MarketplaceCard

Show:

```txt
canonical_name
status chip
category tag
marketplace_scope tag
chain tags
summary
year range
confidence
review_status
```

Clicking or linking should go to:

```txt
/marketplace/[slug]/
```

## 8.3 FactGrid

Show:

```txt
status
category
scope
chain
frontend_status
contract_status
asset_status
confidence
```

## 8.4 WhatRemainsBlock

Three cards:

```txt
What is gone?
What remains?
Where did users or assets go?
```

This is the core differentiator.  
Do not bury it.

## 8.5 EvidenceList

Show:

```txt
title
publisher
source_type
reliability
claim_scope
published_at/accessed_at
archive indicator if present
```

Because mock evidence URLs are placeholder, avoid making them look like verified sources.

## 8.6 StatsBreakdown

Use CSS bars.  
Do not use chart libraries.

---

## 9. Utility functions

Implement in `src/lib/format.ts`:

```txt
formatLabel(value)
formatStatus(value)
formatYearRange(record)
formatDatePrecision(date, precision)
formatChain(chain)
formatCategory(category)
formatScope(scope)
isClosedSide(status)
isFadedSide(status)
isTransitioned(status)
```

Implement in `src/lib/data.ts`:

```txt
getMarketplaces()
getMarketplaceBySlug(slug)
getEventsForMarketplace(id)
getEvidenceForMarketplace(id)
getRelatedMarketplaces(record)
getFeaturedMarketplaces()
getRecentlyGoneMarketplaces()
```

Implement in `src/lib/filters.ts`:

```txt
buildSearchText(record)
filterMarketplaces(records, filters)
sortMarketplaces(records, sort)
getFilterOptions(records)
```

---

## 10. Scripts

## 10.1 `scripts/validate-data.ts`

Validate:

```txt
required marketplace fields
unique marketplace id
unique slug
valid status enum
valid category/scope/origin fields
chain_scope is non-empty array
unknown chain not mixed with other chains
event marketplace_id exists
evidence marketplace_id exists
evidence event_id exists if present
stats source counts match data counts
```

Output:

```txt
Validation passed
or grouped errors/warnings
```

Do not fail on warnings.  
Fail on errors.

## 10.2 `scripts/generate-stats.ts`

Input:

```txt
data/marketplaces.json
data/events.json
data/evidence.json
```

Output:

```txt
data/stats.json
data/stats-history.json
```

Generate:

```txt
total_marketplaces
total_events
total_evidence
active_total
limited_total
inactive_total
dead_total
transitioned_total
faded_total
archive_coverage
high_confidence_share
reviewed_share
by_status
by_category
by_marketplace_scope
by_chain
by_confidence
by_review_status
record_quality_flags
launch_year
end_year
```

---

## 11. package scripts

Add package scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "validate": "tsx scripts/validate-data.ts",
    "generate:stats": "tsx scripts/generate-stats.ts",
    "check": "npm run validate && npm run generate:stats && npm run build"
  }
}
```

Use `tsx` for TypeScript scripts if needed.

---

## 12. SEO / metadata

Add basic metadata.

Required:

```txt
page title
meta description
canonical URL placeholder or relative-safe value
OG title/description
robots.txt
favicon.svg
```

Do not overdo SEO before real seed data exists.

---

## 13. Accessibility requirements

Must have:

```txt
semantic landmarks
visible focus states
proper heading order
labels for search/filter controls
sufficient contrast
reduced motion respect
no hover-only critical interaction
```

---

## 14. Responsive requirements

Check at:

```txt
1440px
1280px
768px
390px
360px
```

Required behavior:

```txt
desktop: hero 2-column, index sidebar + cards
mobile: 1-column, compact filters, readable cards
longform: readable line length
stats: no horizontal overflow
```

---

## 15. Terminal gate

Before finishing, run:

```bash
npm run validate
npm run generate:stats
npm run build
```

Or:

```bash
npm run check
```

Completion requires:

```txt
no build errors
no validation errors
stats generated
all static pages generated
```

---

## 16. Browser gate

Manually inspect:

```txt
/
/marketplaces/
/marketplace/x2y2/
/marketplace/opensea/
/stats/
/methodology/
/about/
/submit/
```

Check:

```txt
HEIとは別物に見える
paper/field-guide style is preserved
cards are readable
filters work
WhatRemainsBlock is prominent
evidence is visible
stats feels like appendix
mobile is not broken
```

---

## 17. Important constraints

Do not:

```txt
replace the concept with a generic SaaS landing page
turn it into an NFT investment dashboard
add real market price data
add wallet connect
add login
add comments
add DB/API
use mock records as verified public claims
hide evidence entirely
remove What is gone / What remains block
```

---

## 18. Expected final deliverable from Codex

A pull request or commit with:

```txt
Astro static site working
mock data loaded into data/
Top page implemented
Marketplaces page implemented
Detail pages generated
Stats page implemented
Methodology/About/Submit pages implemented
CSS matching HTML mock direction
validate script implemented
generate-stats script implemented
npm run check passes
```

Also include a short implementation note:

```txt
what was implemented
how to run locally
what scripts to run
known limitations
next step: replace mock data with v0 seed records
```

---

## 19. Implementation note template

Codex should add or output this summary after implementation:

```txt
Implemented:
- Astro static site scaffold
- Data loading from JSON
- Marketplace index and detail pages
- Stats generation and stats page
- Methodology/About/Submit pages
- Warm field-guide visual system based on HTML mock

Run:
- npm install
- npm run generate:stats
- npm run validate
- npm run dev
- npm run build

Known limitations:
- Uses mock data only
- No verified v0 seed records yet
- No real submit form yet
- No production domain configured

Next:
- Create v0 seed records from 07-minted-and-gone-v0-seed-selection.md
```

---

## 20. Final instruction

Implement this as a static-first, warm field-guide style registry.

Treat the HTML mock as the visual source of truth.  
Treat the schema and methodology docs as the data/classification source of truth.  
Use mock data only for the first implementation.  
Do not invent verified facts.

The first implementation is successful when it can be opened locally, built statically, filtered on the marketplace index, and viewed as generated detail pages for all mock records.

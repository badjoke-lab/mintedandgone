# Minted & Gone next record batch 01

Purpose: prepare the next small source-reviewed draft batch before editing `data/marketplaces.json`, `data/events.json`, and `data/evidence.json`.

Status: planning / source-gathering. Do not treat this file as canonical data.

## Batch rule

- Add records in small batches of 5.
- Avoid dead or shutdown claims unless there is strong official or high-quality reporting support.
- If current status is unclear, use `inactive` or keep `active` with review flags rather than overclaiming.
- Every record should start with at least two evidence notes.
- Wikipedia may be used only as a low-reliability cross-check, not as the main source for status.
- arXiv/research papers may support entity or market context, but should not be used alone to prove current status.

## Candidate set A

### 1. Rarible

Suggested initial status: `active`

Suggested fields:

- slug: `rarible`
- category: `general`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `multi_chain`
- launch_year: `2019` or `2020` after source review
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`

Candidate evidence:

- Rarible marketplace home: `https://rarible.com/`
- Vogue Business marketplace overview: `https://www.voguebusiness.com/technology/mapping-the-net-a-porters-of-nfts`
- Investopedia marketplace guide: `https://www.investopedia.com/how-to-buy-and-sell-nfts-6361693`

Reason to include: major general NFT marketplace; useful active comparison record.

### 2. SuperRare

Suggested initial status: `active`

Suggested fields:

- slug: `superrare`
- category: `art_curated`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `ethereum`
- launch_year: `2018` after source review
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`

Candidate evidence:

- SuperRare marketplace home: `https://superrare.com/`
- Vogue Business marketplace overview: `https://www.voguebusiness.com/technology/mapping-the-net-a-porters-of-nfts`
- Prada / Adidas SuperRare auction context: `https://www.vogue.com/article/prada-teams-up-with-adidas-to-launch-first-re-source-nft`

Reason to include: major curated digital-art marketplace; complements KnownOrigin / Foundation / Hic et Nunc records.

### 3. Foundation

Suggested initial status: `active`

Suggested fields:

- slug: `foundation`
- category: `art_curated`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `ethereum`
- launch_year: `2021`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_launch_source`
  - `current_status_live_unverified`

Candidate evidence:

- Foundation marketplace home: `https://foundation.app/`
- arXiv Foundation NFT auctions paper: `https://arxiv.org/abs/2109.12321`
- Vogue Business marketplace overview: `https://www.voguebusiness.com/technology/mapping-the-net-a-porters-of-nfts`

Reason to include: major Ethereum art marketplace and strong research-context candidate.

### 4. LG Art Lab

Suggested initial status: `dead`

Suggested fields:

- slug: `lg-art-lab`
- category: `brand_marketplace`
- marketplace_scope: `brand_marketplace`
- chain_scope: `hedera`, `ethereum` if both are kept; otherwise start with `multi_chain`
- launch_year: `2022`
- end_year: `2025`
- end_date: `2025-06-17`
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_shutdown_archive`
  - `needs_asset_status_review`
  - `needs_exact_archive_capture`

Candidate evidence:

- The Verge shutdown report: `https://www.theverge.com/news/633272/lg-art-lab-nft-marketplace-shutdown`
- LG Art Lab original/current domain or support notice: source still needs direct official capture
- Wayback search for official page: `https://web.archive.org/web/*/https://lgartlab.com/`

Reason to include: strong dead-side candidate with a clear shutdown timeline and user-asset handling angle.

### 5. Nifty Gateway / Nifty Gateway Studio

Suggested initial status: `inactive` or `rebranded` / `acquired` after source review

Suggested fields:

- slug: `nifty-gateway`
- category: `art_curated`
- marketplace_scope: `standalone_marketplace`
- chain_scope: `ethereum`
- launch_year: `2018` or `2019` after source review
- confidence: `medium`
- review_status: `reviewed_staging`
- flags:
  - `needs_official_status_source`
  - `needs_frontend_review`
  - `needs_acquisition_review`
  - `needs_rebrand_review`

Candidate evidence:

- Nifty Gateway / Studio home: `https://www.niftygateway.com/`
- Gemini acquisition reference: `https://www.gemini.com/blog/gemini-acquires-nifty-gateway`
- Nifty Gateway Studio cross-check: `https://en.wikipedia.org/wiki/Nifty_Gateway_Studio`

Reason to include: historically important marketplace with acquisition / rebrand / shutdown-status complexity. Do not classify as dead without stronger official status source.

## Preferred next implementation

Use Candidate set A as the next data batch, but add in the following order:

1. Rarible
2. SuperRare
3. Foundation
4. LG Art Lab
5. Nifty Gateway

If source strength is insufficient during implementation, defer Nifty Gateway and replace it with another active marketplace candidate such as LooksRare or VeVe.

## Expected data impact if all 5 are added

Approximate only. Regenerate stats from data after implementation.

- marketplaces: 16
- events: 18 or 19 depending on whether Nifty Gateway gets acquisition/rebrand event
- evidence: 36+ if two evidence notes are added per record
- reviewed_staging: 16
- low confidence: 0
- fictional records: 0

## Implementation warning

Do not add this batch by copying status claims blindly. Each candidate must be added as a conservative source-reviewed draft with explicit flags where official launch, official current status, exact archive capture, frontend status, contract status, or asset handling is still incomplete.

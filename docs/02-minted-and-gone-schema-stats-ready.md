# 02-minted-and-gone-schema.md

# Minted & Gone Data Schema

Status: draft / implementation-level schema source of truth  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`  
Scope: canonical JSON data, stats-ready fields, generated stats files, enum definitions, relationships, validation rules, derived display values  
Core rule: v0 は静的JSONのみ。DB/APIなし。stats も静的生成で扱う。

---

## 0. この文書の役割

この文書は、Minted & Gone v0〜v0.5 のデータ構造を固定する。

この文書が決めるもの:

- canonical JSON ファイル
- stats 生成用 JSON ファイル
- 各レコード型
- 必須フィールド
- 任意フィールド
- stats 対応の補助フィールド
- enum
- ID規則
- slug規則
- 日付規則
- URL規則
- record間の関係
- validation rules
- derived values
- search / filter 用 index 生成方針
- stats 集計方針
- v0でやらないデータ設計

この文書は、データの「意味」を説明する methodology ではなく、**実装上の型・制約・検証ルール**を定義する。

---

## 1. Data files

## 1.1 Canonical data files

v0 の canonical data は以下の3ファイルで固定する。

```txt
data/marketplaces.json
data/events.json
data/evidence.json
```

役割:

```txt
marketplaces.json = NFT marketplace 本体
events.json       = marketplace に起きた時系列イベント
evidence.json     = entity / event / status / URL 等の根拠
```

## 1.2 Generated stats files

v0.5 で `/stats` を作るため、以下の生成ファイルを追加する。

```txt
data/stats.json
data/stats-history.json
```

役割:

```txt
stats.json         = 現在の canonical data から生成した最新スナップショット
stats-history.json = 過去スナップショットの履歴
```

## 1.3 Canonical と generated の違い

```txt
canonical = 手動レビュー対象の元データ
generated = canonical からスクリプトで作る集計結果
```

`stats.json` と `stats-history.json` は、原則として手編集しない。

## 1.4 DBは使わない

v0〜v0.5 では以下を使わない。

```txt
D1
KV
R2
PostgreSQL
SQLite runtime DB
API server
server-side search
user-generated DB
```

## 1.5 JSON運用方針

- canonical JSON は GitHub repo で管理する
- 変更は Pull Request で行う想定
- v0 では build 時に canonical JSON を読み込む
- v0.5 では build 前または build 中に stats JSON を生成する
- クライアント側では軽い検索・フィルタのみ行う
- 500件を超えるまでは単一JSONでよい
- 1000件を超えたら index JSON / detail JSON 分割を検討する

---

## 2. Relationship model

3レコードの関係はこれで固定する。

```txt
marketplace 1 --- n event
marketplace 1 --- n evidence
event       1 --- n evidence
```

## 2.1 marketplace を中心にする

すべての event / evidence は `marketplace_id` を持つ。

## 2.2 event_id は evidence では任意

`evidence.event_id` は任意。  
理由は、根拠には以下の2種類があるため。

```txt
entity全体の根拠: marketplace_id のみ
特定eventの根拠: marketplace_id + event_id
```

## 2.3 successor / predecessor は文字列slugで持つ

v0 では別テーブルを作らない。

```txt
successor_marketplace: slug | null
predecessor_marketplace: slug | null
```

将来、関係が複雑化した場合のみ relationships JSON を追加検討する。

---

## 3. ID conventions

## 3.1 ID prefix

Minted & Gone のIDは `mag_` prefix を使う。

```txt
marketplace id = mag_nfm_000001
event id       = mag_ev_000001
evidence id    = mag_src_000001
```

## 3.2 ID形式

```regex
^mag_nfm_[0-9]{6}$
^mag_ev_[0-9]{6}$
^mag_src_[0-9]{6}$
```

## 3.3 ID採番

- 6桁ゼロ埋め
- 一度使ったIDは再利用しない
- 削除したレコードのIDも再利用しない
- PRで追加する場合は既存最大値 + 1 から採番

## 3.4 IDとslugの違い

```txt
id   = 内部参照用。不変。
slug = URL用。原則不変だが、明らかな誤りは修正可。
```

---

## 4. Slug conventions

## 4.1 基本ルール

`slug` は URL に使う。

```txt
/marketplace/[slug]
```

## 4.2 slug 生成規則

- lowercase
- 英数字とハイフンのみ
- 空白は `-`
- `&` は `and`
- `.` は原則削除またはハイフン
- 連続ハイフンは禁止
- 先頭末尾ハイフンは禁止

例:

```txt
X2Y2                -> x2y2
Nifty Gateway      -> nifty-gateway
Hic et Nunc        -> hic-et-nunc
Crypto.com NFT     -> crypto-com-nft
OpenSea Pro        -> opensea-pro
```

## 4.3 slug正規表現

```regex
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

## 4.4 slug uniqueness

`marketplaces.json` 内で slug は必ず一意。

---

## 5. Date conventions

## 5.1 日付形式

基本は ISO date。

```txt
YYYY-MM-DD
```

例:

```txt
2025-04-30
```

## 5.2 年しか分からない場合

年しか分からない場合は、無理に `YYYY-01-01` にしない。

以下の2フィールドを使う。

```txt
launch_date: null
launch_year: 2021
```

不確かな日付を正確な日付のように見せない。

## 5.3 month precision

月まで分かる場合は、以下を許可する。

```txt
YYYY-MM
```

ただし validator では `date_precision` を併用する。

## 5.4 date_precision

日付の精度を明示する。

```txt
exact
month
year
approximate
unknown
```

marketplace では以下を持てる。

```txt
launch_date_precision
end_date_precision
```

event では以下を持てる。

```txt
event_date_precision
```

## 5.5 表示ルール

```txt
exact       -> Apr 30, 2025
month       -> Apr 2025
year        -> 2025
approximate -> c. 2025
unknown     -> Unknown
```

---

## 6. Core enum definitions

---

## 6.1 status

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

### status validation

- 必須
- 上記以外禁止
- `dead / acquired / merged / rebranded` の場合、`closure_reason` は `not_applicable` 以外を推奨
- `active` の場合、`closure_reason` は `not_applicable` または null

---

## 6.2 category

`category` は marketplace のジャンル・主領域を表す。

```txt
general
art_curated
gaming
metaverse_land
music
sports
collectibles
pfp
chain_specific
aggregator
cex_nft_market
brand_marketplace
protocol_ui
launchpad_marketplace
other
unknown
```

### category validation

- 必須
- 上記以外禁止

---

## 6.3 marketplace_scope

`marketplace_scope` は marketplace の形態を表す。  
`category` がジャンル、`marketplace_scope` が構造である。

```txt
standalone_marketplace
aggregator
cex_feature
brand_marketplace
game_marketplace
metaverse_marketplace
launchpad_marketplace
protocol_ui
collection_specific_marketplace
unknown
other
```

### marketplace_scope validation

- stats 対応のため必須
- 上記以外禁止

---

## 6.4 chain_scope

`chain_scope` は string array。

初期許可値:

```txt
ethereum
solana
polygon
bitcoin_ordinals
tezos
cardano
flow
bnb_chain
avalanche
arbitrum
optimism
base
ronin
immutable
wax
multi_chain
unknown
other
```

### chain_scope validation

- 必須
- 配列
- 1個以上
- すべて lowercase snake_case
- unknown と他チェーンの併用は禁止

許可:

```json
["ethereum"]
["ethereum", "polygon"]
["multi_chain"]
["unknown"]
```

禁止:

```json
[]
["Ethereum"]
["unknown", "ethereum"]
```

---

## 6.5 origin_bucket

`country_or_origin` は国名・地域・ecosystem が混ざりやすいため、stats 用に `origin_bucket` を持つ。

```txt
country
global
chain_ecosystem
company_origin
region
unknown
other
```

### origin_bucket validation

- stats 対応のため必須
- `country_or_origin = unknown` の場合、原則 `origin_bucket = unknown`
- `Ethereum ecosystem` などは `chain_ecosystem`
- `Global` は `global`

---

## 6.6 frontend_status

```txt
active
limited
dead
redirected
unknown
not_applicable
```

---

## 6.7 contract_status

```txt
accessible
partially_accessible
deprecated
unknown
not_applicable
```

---

## 6.8 asset_status

```txt
user_assets_remain
migrated
withdrawal_required
lost_or_unclear
not_applicable
unknown
```

---

## 6.9 closure_reason

```txt
market_decline
funding_failure
parent_company_shutdown
acquisition_winddown
regulatory_pressure
security_incident
voluntary_shutdown
rebrand
merge
community_fork
unknown
not_applicable
```

### closure_reason validation

- `status = active` の場合: `not_applicable` or null
- `status = dead` の場合: `not_applicable` 禁止
- `status = acquired` の場合: `acquisition_winddown` 推奨
- `status = merged` の場合: `merge` 推奨
- `status = rebranded` の場合: `rebrand` 推奨
- 不明な場合は `unknown`

---

## 6.10 official_url_status

```txt
live_verified
live_unverified
dead_domain
redirected
repurposed
unsafe
unknown
```

### official_url_status validation

- URLがある場合は必須推奨
- `unsafe` の場合、UIで通常リンク禁止
- `dead_domain / repurposed / unsafe` の場合、dead-side detail では original URL を main CTA にしない

---

## 6.11 confidence

```txt
high
medium
low
```

---

## 6.12 review_status

stats で「確認済み率」「要レビュー率」「seed仮置き率」を出すために使う。

```txt
seed
reviewed
needs_review
needs_update
deprecated
```

### review_status validation

- stats 対応のため必須
- 初期seedで未精査なら `seed`
- 公開品質チェック済みなら `reviewed`
- 根拠不足なら `needs_review`
- 古くなった可能性があるなら `needs_update`
- 使わなくなった旧レコードなら `deprecated`

---

## 6.13 record_quality_flags

stats で補完対象を集計するための配列。

```txt
missing_archive
single_source
zero_evidence
uncertain_launch_date
uncertain_end_date
weak_status_evidence
needs_frontend_review
needs_contract_review
needs_asset_status_review
needs_origin_review
needs_successor_review
needs_summary_review
possible_out_of_scope
```

### record_quality_flags validation

- 配列
- 空配列可
- 上記以外禁止

---

## 6.14 impact_level

```txt
low
medium
high
critical
```

---

## 6.15 status_effect

```txt
none
active
limited
inactive
dead
acquired
merged
rebranded
```

---

## 6.16 event_type

```txt
launched
funding_announced
acquired
merged
rebranded
trading_paused
minting_paused
withdrawal_only_started
shutdown_announced
shutdown_effective
frontend_closed
contract_deprecated
asset_migration_announced
security_incident
regulatory_action
community_forked
reopened
other
```

---

## 6.17 source_type

```txt
official_statement
official_blog
official_social
support_article
archive_capture
news_article
company_announcement
regulatory_notice
marketplace_page
community_reference
database_reference
other
```

---

## 6.18 reliability

```txt
high
medium
low
```

---

## 6.19 claim_scope

```txt
entity
event
status
closure_reason
launch_date
end_date
url_history
ownership
asset_status
contract_status
frontend_status
```

---

## 7. `data/marketplaces.json` schema

## 7.1 File shape

```json
[
  {
    "id": "mag_nfm_000001",
    "slug": "x2y2",
    "canonical_name": "X2Y2"
  }
]
```

Top-level は array。

---

## 7.2 Required fields

stats 対応後の required はこれで固定する。

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

---

## 7.3 Strongly recommended fields

```txt
launch_date
launch_date_precision
launch_year
end_date
end_date_precision
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

---

## 7.4 Optional fields

```txt
native_name
parent_company
acquirer
related_marketplaces
external_references
created_at
updated_at
```

---

## 7.5 Marketplace field definitions

### id

Type: string  
Required: yes  
Pattern:

```regex
^mag_nfm_[0-9]{6}$
```

### slug

Type: string  
Required: yes  
Pattern:

```regex
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

### canonical_name

Type: string  
Required: yes  
Length: 1〜120

### aliases

Type: string[]  
Required: yes  
Default: []

### status

Type: enum  
Required: yes  
Enum: `status`

### category

Type: enum  
Required: yes  
Enum: `category`

### marketplace_scope

Type: enum  
Required: yes  
Enum: `marketplace_scope`

### chain_scope

Type: string[]  
Required: yes  
Enum items: `chain_scope`

### origin_bucket

Type: enum  
Required: yes  
Enum: `origin_bucket`

### launch_date

Type: string | null  
Required: recommended  
Format: `YYYY-MM-DD` or `YYYY-MM`  
Use with: `launch_date_precision`

### launch_year

Type: number | null  
Required: recommended if exact launch_date unknown

### launch_date_precision

Type: enum  
Values:

```txt
exact
month
year
approximate
unknown
```

### end_date

Type: string | null  
Required: recommended for closed-side records  
Format: `YYYY-MM-DD` or `YYYY-MM`

### end_year

Type: number | null

### end_date_precision

Type: enum  
Values:

```txt
exact
month
year
approximate
unknown
```

### closure_reason

Type: enum | null  
Required: conditional  
Enum: `closure_reason`

### frontend_status

Type: enum  
Required: recommended  
Enum: `frontend_status`

### contract_status

Type: enum  
Required: recommended  
Enum: `contract_status`

### asset_status

Type: enum  
Required: recommended  
Enum: `asset_status`

### country_or_origin

Type: string | null  
Required: recommended  
Examples:

```txt
United States
Global
Ethereum ecosystem
Tezos ecosystem
unknown
```

### official_url_original

Type: string | null  
Required: recommended

### official_domain_original

Type: string | null  
Required: recommended if official URL exists

### official_url_status

Type: enum  
Required: recommended  
Enum: `official_url_status`

### archived_url

Type: string | null  
Required: recommended for closed-side records

### successor_marketplace

Type: string | null  
Value: marketplace slug

### predecessor_marketplace

Type: string | null  
Value: marketplace slug

### summary

Type: string  
Required: yes  
Length: 40〜400 recommended

### what_is_gone

Type: string | null  
Required: recommended for limited/dead/acquired/merged/rebranded

### what_remains

Type: string | null  
Required: recommended for all records

### where_users_or_assets_went

Type: string | null  
Required: recommended for closed/transition records

### confidence

Type: enum  
Required: yes  
Enum: `confidence`

### review_status

Type: enum  
Required: yes  
Enum: `review_status`

### record_quality_flags

Type: string[]  
Required: yes  
Default: []  
Enum items: `record_quality_flags`

### last_verified_at

Type: string  
Required: yes  
Format: `YYYY-MM-DD`

### notes

Type: string  
Required: recommended  
Default: ""

---

## 7.6 Marketplace full example

```json
{
  "id": "mag_nfm_000001",
  "slug": "x2y2",
  "canonical_name": "X2Y2",
  "aliases": [],
  "status": "dead",
  "category": "general",
  "marketplace_scope": "standalone_marketplace",
  "chain_scope": ["ethereum"],
  "origin_bucket": "unknown",
  "launch_date": null,
  "launch_date_precision": "year",
  "launch_year": 2022,
  "end_date": "2025-04-30",
  "end_date_precision": "exact",
  "end_year": 2025,
  "closure_reason": "voluntary_shutdown",
  "frontend_status": "dead",
  "contract_status": "accessible",
  "asset_status": "user_assets_remain",
  "country_or_origin": "unknown",
  "official_url_original": "https://x2y2.io/",
  "official_domain_original": "x2y2.io",
  "official_url_status": "dead_domain",
  "archived_url": null,
  "successor_marketplace": null,
  "predecessor_marketplace": null,
  "summary": "NFT marketplace that ended marketplace operations while on-chain assets and contracts may remain accessible.",
  "what_is_gone": "The marketplace trading frontend and official marketplace operation ended.",
  "what_remains": "NFTs and relevant on-chain records may remain accessible outside the original marketplace.",
  "where_users_or_assets_went": "Users may need to use wallets, archives, or other marketplaces depending on the asset.",
  "confidence": "medium",
  "review_status": "seed",
  "record_quality_flags": ["missing_archive", "needs_origin_review"],
  "last_verified_at": "2026-05-12",
  "notes": "Example shape. Final data requires source review."
}
```

---

## 8. `data/events.json` schema

## 8.1 File shape

Top-level は array。

```json
[
  {
    "id": "mag_ev_000001",
    "marketplace_id": "mag_nfm_000001"
  }
]
```

---

## 8.2 Required fields

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

---

## 8.3 Strongly recommended fields

```txt
impact_level
status_effect
source_count
sort_order
notes
```

---

## 8.4 Optional fields

```txt
start_date
end_date
location
counterparty_name
counterparty_marketplace_slug
amount_text
asset_text
is_major_event
```

---

## 8.5 Event field definitions

### id

Type: string  
Required: yes  
Pattern:

```regex
^mag_ev_[0-9]{6}$
```

### marketplace_id

Type: string  
Required: yes  
Must exist in `marketplaces.json`

### event_type

Type: enum  
Required: yes  
Enum: `event_type`

### event_date

Type: string | null  
Required: yes, null allowed only if `event_date_precision = unknown`

### event_date_precision

Type: enum  
Required: yes  
Values:

```txt
exact
month
year
approximate
unknown
```

### title

Type: string  
Required: yes  
Length: 3〜140

### description

Type: string  
Required: yes  
Length: 20〜600 recommended

### confidence

Type: enum  
Required: yes

### impact_level

Type: enum  
Required: recommended

### status_effect

Type: enum  
Required: recommended

### source_count

Type: number  
Required: recommended  
Must equal count of evidence records linked to this event where feasible.

### sort_order

Type: number  
Required: recommended  
Default: 1

### counterparty_marketplace_slug

Type: string | null  
Must match existing marketplace slug if not null.

### is_major_event

Type: boolean  
Default: false

---

## 8.6 Event full example

```json
{
  "id": "mag_ev_000001",
  "marketplace_id": "mag_nfm_000001",
  "event_type": "shutdown_announced",
  "event_date": "2025-03-31",
  "event_date_precision": "exact",
  "title": "Marketplace shutdown announced",
  "description": "The marketplace announced that NFT marketplace operations would end.",
  "confidence": "high",
  "impact_level": "critical",
  "status_effect": "dead",
  "source_count": 2,
  "sort_order": 1,
  "notes": ""
}
```

---

## 9. `data/evidence.json` schema

## 9.1 File shape

Top-level は array。

```json
[
  {
    "id": "mag_src_000001",
    "marketplace_id": "mag_nfm_000001"
  }
]
```

---

## 9.2 Required fields

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

## 9.3 Strongly recommended fields

```txt
event_id
archived_url
accessed_at
language
notes
```

---

## 9.4 Optional fields

```txt
author
quote_excerpt
snapshot_date
is_primary
is_paywalled
is_official_domain
```

---

## 9.5 Evidence field definitions

### id

Type: string  
Required: yes  
Pattern:

```regex
^mag_src_[0-9]{6}$
```

### marketplace_id

Type: string  
Required: yes  
Must exist in `marketplaces.json`

### event_id

Type: string | null  
Required: recommended  
If not null, must exist in `events.json` and event.marketplace_id must match.

### source_type

Type: enum  
Required: yes

### title

Type: string  
Required: yes  
Length: 3〜240

### url

Type: string  
Required: yes  
Must be URL-like.

### publisher

Type: string  
Required: yes

### published_at

Type: string | null  
Required: yes, null allowed if unknown

### archived_url

Type: string | null

### accessed_at

Type: string | null  
Format: `YYYY-MM-DD`

### reliability

Type: enum  
Required: yes

### claim_scope

Type: enum  
Required: yes

### language

Type: string | null  
Examples:

```txt
en
ja
zh
ko
unknown
```

### quote_excerpt

Type: string | null  
Length: 0〜300 recommended  
Do not store long copyrighted excerpts.

### is_primary

Type: boolean | null

### is_paywalled

Type: boolean | null

### is_official_domain

Type: boolean | null

---

## 9.6 Evidence full example

```json
{
  "id": "mag_src_000001",
  "marketplace_id": "mag_nfm_000001",
  "event_id": "mag_ev_000001",
  "source_type": "official_statement",
  "title": "Marketplace shutdown notice",
  "url": "https://example.com/shutdown",
  "publisher": "Example Marketplace",
  "published_at": "2025-03-31",
  "archived_url": "https://web.archive.org/...",
  "accessed_at": "2026-05-12",
  "reliability": "high",
  "claim_scope": "end_date",
  "language": "en",
  "author": null,
  "quote_excerpt": null,
  "snapshot_date": null,
  "is_primary": true,
  "is_paywalled": false,
  "is_official_domain": true,
  "notes": "Used to verify shutdown timing."
}
```

---

## 10. Stats generated files

---

## 10.1 `data/stats.json`

`stats.json` は最新スナップショット1件を持つ。

Top-level shape:

```json
{
  "generated_at": "2026-05-12T00:00:00Z",
  "source": {
    "marketplaces_count": 0,
    "events_count": 0,
    "evidence_count": 0
  },
  "kpis": {},
  "breakdowns": {},
  "coverage": {},
  "quality": {},
  "distributions": {},
  "completeness": {}
}
```

## 10.2 `data/stats-history.json`

`stats-history.json` は時系列スナップショットを持つ。

```json
[
  {
    "snapshot_date": "2026-05-12",
    "generated_at": "2026-05-12T00:00:00Z",
    "total_marketplaces": 50,
    "total_events": 80,
    "total_evidence": 140,
    "active_total": 12,
    "faded_total": 38,
    "archive_coverage": 0.62,
    "high_confidence_share": 0.41,
    "reviewed_share": 0.30
  }
]
```

## 10.3 stats.json required sections

```txt
generated_at
source
kpis
breakdowns
coverage
quality
distributions
completeness
```

## 10.4 kpis

```json
{
  "total_marketplaces": 50,
  "active_total": 12,
  "limited_total": 5,
  "inactive_total": 4,
  "dead_total": 20,
  "transitioned_total": 9,
  "faded_total": 38,
  "total_events": 80,
  "total_evidence": 140,
  "archive_coverage": 0.62,
  "high_confidence_share": 0.41,
  "reviewed_share": 0.30
}
```

## 10.5 breakdowns

```json
{
  "by_status": {},
  "by_category": {},
  "by_marketplace_scope": {},
  "by_chain": {},
  "by_origin_bucket": {},
  "by_closure_reason": {},
  "by_frontend_status": {},
  "by_contract_status": {},
  "by_asset_status": {},
  "by_official_url_status": {},
  "by_confidence": {},
  "by_review_status": {},
  "by_event_type": {},
  "by_event_impact_level": {},
  "by_event_status_effect": {},
  "by_evidence_source_type": {},
  "by_evidence_reliability": {},
  "by_evidence_claim_scope": {}
}
```

## 10.6 coverage

```json
{
  "archive_coverage": {
    "count": 31,
    "total": 50,
    "share": 0.62
  },
  "closed_side_archive_coverage": {
    "count": 24,
    "total": 33,
    "share": 0.727
  },
  "launch_date_known": {},
  "end_date_known_closed_side": {},
  "origin_known": {},
  "official_domain_known": {},
  "what_remains_present": {},
  "what_is_gone_present_closed_side": {},
  "asset_status_known": {},
  "contract_status_known": {},
  "frontend_status_known": {}
}
```

## 10.7 quality

```json
{
  "review_status": {},
  "record_quality_flags": {},
  "evidence_depth": {
    "zero": 0,
    "one": 0,
    "two_to_four": 0,
    "five_plus": 0
  },
  "closed_side_with_two_or_more_evidence": {},
  "low_confidence_records": 0,
  "needs_review_records": 0,
  "stale_records_365d": 0
}
```

## 10.8 distributions

```json
{
  "launch_year": {},
  "end_year": {},
  "lifespan_years": {
    "average": null,
    "median": null,
    "buckets": {}
  },
  "last_verified_recency": {
    "0_30_days": 0,
    "31_90_days": 0,
    "91_180_days": 0,
    "181_365_days": 0,
    "366_plus_days": 0,
    "unknown": 0
  }
}
```

## 10.9 completeness

```json
{
  "summary_present": {},
  "notes_present": {},
  "aliases_present": {},
  "successor_present": {},
  "predecessor_present": {},
  "country_or_origin_present": {},
  "what_is_gone_present": {},
  "what_remains_present": {},
  "where_users_or_assets_went_present": {}
}
```

---

## 11. Stats derivation rules

## 11.1 active_side

```ts
const activeSideStatuses = ["active", "limited", "inactive"];
```

## 11.2 dead_side

```ts
const deadSideStatuses = ["dead", "acquired", "merged", "rebranded"];
```

## 11.3 faded_side

```ts
const fadedSideStatuses = ["limited", "inactive", "dead", "acquired", "merged", "rebranded"];
```

## 11.4 transitioned_total

```ts
const transitionedStatuses = ["acquired", "merged", "rebranded"];
```

## 11.5 closed_side

stats上では `closed_side` を以下にする。

```ts
const closedSideStatuses = ["dead", "acquired", "merged", "rebranded"];
```

## 11.6 archive_coverage

```txt
marketplaces with archived_url / total marketplaces
```

## 11.7 closed_side_archive_coverage

```txt
closed_side marketplaces with archived_url / closed_side marketplaces
```

## 11.8 evidence_depth buckets

```txt
0
1
2-4
5+
```

## 11.9 lifespan_years

対象:

```txt
launch_year と end_year が両方ある closed_side records
```

計算:

```txt
end_year - launch_year
```

同年終了は 0 とする。

## 11.10 recency buckets

`last_verified_at` から生成する。

```txt
0–30 days
31–90 days
91–180 days
181–365 days
366+ days
unknown
```

---

## 12. Stats page capability

このschemaで `/stats` は以下を生成できる。

```txt
総marketplace数
status別
active-side / faded-side / dead-side
category別
marketplace_scope別
chain別
origin_bucket別
closure_reason別
frontend_status別
contract_status別
asset_status別
official_url_status別
confidence別
review_status別
record_quality_flags別
launch year分布
end year分布
平均 lifespan
archive coverage
evidence depth
evidence source_type別
evidence reliability別
evidence claim_scope別
event件数
event_type別
impact_level別
status_effect別
last_verified_at freshness
record completeness
```

HEI並みに多項目のstatsページを作れるが、MAGでは特に以下を前面に出す。

```txt
frontend / contract / asset 状態
what remains coverage
marketplace_scope
origin_bucket
review_status / quality flags
```

---

## 13. Cross-file validation rules

## 13.1 marketplace validation

Error:

```txt
missing required field
duplicate id
duplicate slug
invalid id format
invalid slug format
invalid enum
empty canonical_name
chain_scope empty
unknown chain mixed with other chains
status = dead and closure_reason = not_applicable
active with end_date but no explanation
invalid URL format for official_url_original
invalid URL format for archived_url
invalid marketplace_scope
invalid origin_bucket
invalid review_status
invalid record_quality_flags item
```

Warning:

```txt
summary too short
confidence low with no notes
last_verified_at older than 365 days
closed record without archived_url
closed record without what_is_gone
closed record without what_remains
closed record with evidence count < 2
origin_bucket = unknown
marketplace_scope = unknown
review_status = seed on public record
record_quality_flags includes possible_out_of_scope
```

## 13.2 event validation

Error:

```txt
missing required field
duplicate event id
marketplace_id not found
invalid event_type
invalid impact_level
invalid status_effect
invalid date format
event_id format invalid
```

Warning:

```txt
source_count = 0
source_count does not match linked evidence count
description too short
critical event without evidence
shutdown_effective without end_date on marketplace
```

## 13.3 evidence validation

Error:

```txt
missing required field
duplicate evidence id
marketplace_id not found
event_id not found
evidence.event_id marketplace mismatch
invalid source_type
invalid reliability
invalid claim_scope
url missing
```

Warning:

```txt
archived_url missing for closed-side source
published_at null
accessed_at null
reliability low with no notes
claim_scope = event but event_id null
quote_excerpt too long
```

## 13.4 URL safety validation

Error:

```txt
official_url_status = unsafe and UI marks original URL as main link
```

Warning:

```txt
dead_domain without archived_url
repurposed without notes
redirected without successor or notes
live_unverified older than 180 days
```

## 13.5 stats validation

Error:

```txt
stats.json missing required top-level section
stats source counts do not match canonical JSON counts
stats-history latest snapshot does not match stats.json key KPIs
invalid generated_at format
```

Warning:

```txt
stats-history empty
stats generated_at older than canonical updated_at
coverage denominator is zero
unexpected empty breakdown for populated canonical field
```

---

## 14. Derived values

実装側で生成してよい派生値。

## 14.1 year_range

Input:

```txt
launch_year / launch_date
end_year / end_date
```

Output examples:

```txt
2021–2025
2021–
?–2025
Unknown
```

## 14.2 dead_side boolean

```ts
const deadSideStatuses = ["dead", "acquired", "merged", "rebranded"];
```

## 14.3 faded_side boolean

```ts
const fadedSideStatuses = ["limited", "inactive", "dead", "acquired", "merged", "rebranded"];
```

## 14.4 archive_available boolean

```ts
Boolean(archived_url)
```

## 14.5 evidence_count

marketplace_id ごとの evidence 件数。

## 14.6 event_count

marketplace_id ごとの event 件数。

## 14.7 linked_evidence_count

event_id ごとの evidence 件数。

## 14.8 display_status_label

status enum をUI表示に変換。

例:

```txt
active -> Active
limited -> Limited
rebranded -> Rebranded
```

## 14.9 completeness_flags_auto

record_quality_flags とは別に、実装側で一時的に作れる派生値。

```txt
missing_summary
missing_archive
missing_origin
missing_contract_status
missing_asset_status
missing_what_remains
```

---

## 15. Search index schema

v0 では実ファイルとして search index を持たなくてもよい。  
ただし実装上は以下の形に正規化する。

```ts
type SearchIndexItem = {
  id: string;
  slug: string;
  canonical_name: string;
  aliases: string[];
  status: string;
  category: string;
  marketplace_scope: string;
  chain_scope: string[];
  origin_bucket: string;
  official_domain_original: string | null;
  summary: string;
  searchText: string;
};
```

## 15.1 searchText に含めるもの

```txt
canonical_name
aliases
official_domain_original
category
marketplace_scope
chain_scope
country_or_origin
summary
```

## 15.2 正規化

- lowercase
- trim
- punctuation removal where safe
- multiple spaces collapse

---

## 16. Filter schema

UI filter state の形。

```ts
type MarketplaceFilters = {
  q: string;
  status: string[];
  category: string[];
  marketplace_scope: string[];
  chain: string[];
  origin_bucket?: string[];
  frontend_status?: string[];
  contract_status?: string[];
  asset_status?: string[];
  closure_reason?: string[];
  confidence?: string[];
  review_status?: string[];
};
```

v0で前面に出すフィルタ:

```txt
q
status
category
chain
```

v0.5 / stats後に前面化候補:

```txt
marketplace_scope
origin_bucket
```

advanced扱い:

```txt
frontend_status
contract_status
asset_status
closure_reason
confidence
review_status
```

---

## 17. Sort schema

許可する sort。

```txt
default
name_asc
recently_ended
oldest_launched
status
category
marketplace_scope
chain
review_status
```

## 17.1 default sort

```txt
1. faded_side first
2. end_year/end_date desc
3. active records
4. canonical_name asc
```

## 17.2 recently_ended

```txt
end_date desc
end_year desc
unknown last
canonical_name asc
```

## 17.3 oldest_launched

```txt
launch_date asc
launch_year asc
unknown last
canonical_name asc
```

---

## 18. Minimal TypeScript types

実装時に使う最小型。

```ts
export type MarketplaceStatus =
  | "active"
  | "limited"
  | "inactive"
  | "dead"
  | "acquired"
  | "merged"
  | "rebranded"
  | "unknown";

export type Confidence = "high" | "medium" | "low";

export type MarketplaceScope =
  | "standalone_marketplace"
  | "aggregator"
  | "cex_feature"
  | "brand_marketplace"
  | "game_marketplace"
  | "metaverse_marketplace"
  | "launchpad_marketplace"
  | "protocol_ui"
  | "collection_specific_marketplace"
  | "unknown"
  | "other";

export type OriginBucket =
  | "country"
  | "global"
  | "chain_ecosystem"
  | "company_origin"
  | "region"
  | "unknown"
  | "other";

export type ReviewStatus =
  | "seed"
  | "reviewed"
  | "needs_review"
  | "needs_update"
  | "deprecated";

export type Marketplace = {
  id: string;
  slug: string;
  canonical_name: string;
  aliases: string[];
  status: MarketplaceStatus;
  category: string;
  marketplace_scope: MarketplaceScope;
  chain_scope: string[];
  origin_bucket: OriginBucket;
  launch_date?: string | null;
  launch_date_precision?: string;
  launch_year?: number | null;
  end_date?: string | null;
  end_date_precision?: string;
  end_year?: number | null;
  closure_reason?: string | null;
  frontend_status?: string;
  contract_status?: string;
  asset_status?: string;
  country_or_origin?: string | null;
  official_url_original?: string | null;
  official_domain_original?: string | null;
  official_url_status?: string;
  archived_url?: string | null;
  successor_marketplace?: string | null;
  predecessor_marketplace?: string | null;
  summary: string;
  what_is_gone?: string | null;
  what_remains?: string | null;
  where_users_or_assets_went?: string | null;
  confidence: Confidence;
  review_status: ReviewStatus;
  record_quality_flags: string[];
  last_verified_at: string;
  notes?: string;
};

export type MarketplaceEvent = {
  id: string;
  marketplace_id: string;
  event_type: string;
  event_date: string | null;
  event_date_precision: string;
  title: string;
  description: string;
  confidence: Confidence;
  impact_level?: string;
  status_effect?: string;
  source_count?: number;
  sort_order?: number;
  notes?: string;
};

export type MarketplaceEvidence = {
  id: string;
  marketplace_id: string;
  event_id?: string | null;
  source_type: string;
  title: string;
  url: string;
  publisher: string;
  published_at: string | null;
  archived_url?: string | null;
  accessed_at?: string | null;
  reliability: "high" | "medium" | "low";
  claim_scope: string;
  language?: string | null;
  notes?: string;
};

export type StatsSnapshot = {
  generated_at: string;
  source: {
    marketplaces_count: number;
    events_count: number;
    evidence_count: number;
  };
  kpis: Record<string, number>;
  breakdowns: Record<string, Record<string, number>>;
  coverage: Record<string, unknown>;
  quality: Record<string, unknown>;
  distributions: Record<string, unknown>;
  completeness: Record<string, unknown>;
};
```

---

## 19. Validation / stats generation scripts

## 19.1 validate script

```txt
scripts/validate-data.ts
```

検査対象:

```txt
data/marketplaces.json
data/events.json
data/evidence.json
data/stats.json
data/stats-history.json
```

## 19.2 stats generation script

```txt
scripts/generate-stats.ts
```

入力:

```txt
data/marketplaces.json
data/events.json
data/evidence.json
```

出力:

```txt
data/stats.json
data/stats-history.json
```

## 19.3 stats generation rule

- canonical を直接変更しない
- stats は canonical から再生成可能であること
- stats-history は snapshot を append する
- 同じ snapshot_date がある場合は上書きまたは置換でよい

---

## 20. v0 seed data minimum

v0 seed では以下を守る。

## 20.1 marketplace

最低:

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

できる限り:

```txt
frontend_status
contract_status
asset_status
what_is_gone
what_remains
```

## 20.2 event

最低1件。

代表例:

```txt
launched
shutdown_announced
shutdown_effective
acquired
rebranded
```

## 20.3 evidence

最低1本、望ましくは2本。

public preview に出す dead/closed records は2本以上を目標にする。

---

## 21. Example mini dataset

```json
{
  "marketplaces": [
    {
      "id": "mag_nfm_000001",
      "slug": "example-market",
      "canonical_name": "Example Market",
      "aliases": [],
      "status": "dead",
      "category": "general",
      "marketplace_scope": "standalone_marketplace",
      "chain_scope": ["ethereum"],
      "origin_bucket": "unknown",
      "launch_date": null,
      "launch_date_precision": "unknown",
      "launch_year": 2021,
      "end_date": "2025-04-30",
      "end_date_precision": "exact",
      "end_year": 2025,
      "closure_reason": "voluntary_shutdown",
      "frontend_status": "dead",
      "contract_status": "accessible",
      "asset_status": "user_assets_remain",
      "country_or_origin": "unknown",
      "official_url_original": "https://example.invalid/",
      "official_domain_original": "example.invalid",
      "official_url_status": "dead_domain",
      "archived_url": null,
      "successor_marketplace": null,
      "predecessor_marketplace": null,
      "summary": "Example NFT marketplace record used to test schema behavior.",
      "what_is_gone": "The marketplace frontend and trading operation ended.",
      "what_remains": "On-chain assets may remain accessible through wallets or other marketplaces.",
      "where_users_or_assets_went": "Users may need to rely on wallets, archives, or alternative marketplaces.",
      "confidence": "medium",
      "review_status": "seed",
      "record_quality_flags": ["missing_archive"],
      "last_verified_at": "2026-05-12",
      "notes": "Schema example only."
    }
  ],
  "events": [
    {
      "id": "mag_ev_000001",
      "marketplace_id": "mag_nfm_000001",
      "event_type": "shutdown_effective",
      "event_date": "2025-04-30",
      "event_date_precision": "exact",
      "title": "Marketplace operations ended",
      "description": "The marketplace ended its primary NFT trading operations.",
      "confidence": "medium",
      "impact_level": "critical",
      "status_effect": "dead",
      "source_count": 1,
      "sort_order": 1,
      "notes": ""
    }
  ],
  "evidence": [
    {
      "id": "mag_src_000001",
      "marketplace_id": "mag_nfm_000001",
      "event_id": "mag_ev_000001",
      "source_type": "official_statement",
      "title": "Example shutdown notice",
      "url": "https://example.invalid/notice",
      "publisher": "Example Market",
      "published_at": "2025-04-01",
      "archived_url": null,
      "accessed_at": "2026-05-12",
      "reliability": "high",
      "claim_scope": "event",
      "language": "en",
      "notes": "Schema example only."
    }
  ]
}
```

---

## 22. v0で作らないデータ構造

v0 では以下を作らない。

```txt
users.json
comments.json
ratings.json
collections.json
nfts.json
contracts.json
market_volume.json
floor_prices.json
screenshots.json
logos.json
chains.json
categories.json
relationships.json
```

理由:

- 無料運営を守る
- 対象範囲を広げすぎない
- まず marketplace historical registry として成立させる

---

## 23. Future migration notes

## 23.1 500件超

検討:

```txt
marketplaces-index.json
marketplaces-detail/[slug].json
```

## 23.2 1000件超

検討:

```txt
static detail JSON split
search index generation
precomputed stats
```

## 23.3 D1移行

将来、D1へ移行する場合もこの3テーブルから始める。

```txt
marketplaces
events
evidence
stats_snapshots
```

ただし v0〜v0.5 ではやらない。

---

## 24. Schema acceptance checklist

```txt
[ ] 3 canonical JSON files onlyで成立する
[ ] stats.json / stats-history.json を生成できる
[ ] marketplace / event / evidence の関係が明確
[ ] NFT特有の frontend / contract / asset 状態を持てる
[ ] What is gone / What remains を表示できる
[ ] URL安全ルールを表現できる
[ ] evidence が entity / event どちらにも紐づけられる
[ ] active / limited / dead / acquired / rebranded を表現できる
[ ] marketplace_scope で形態別statsを作れる
[ ] origin_bucket でorigin系statsを作れる
[ ] review_status でレビュー品質statsを作れる
[ ] record_quality_flags で補完対象statsを作れる
[ ] 日付の不確実性を表現できる
[ ] 30〜50件 seed に耐える
[ ] 500件程度まで拡張できる
[ ] 無料運営を壊さない
```

---

## 25. 最終結論

Minted & Gone v0 の canonical schema は、以下の3本で固定する。

```txt
marketplaces.json
events.json
evidence.json
```

v0.5 の stats は以下を generated files として追加する。

```txt
stats.json
stats-history.json
```

この schema の中核は、通常の status だけではなく、NFT marketplace 特有の以下を持つ点である。

```txt
frontend_status
contract_status
asset_status
what_is_gone
what_remains
where_users_or_assets_went
```

stats 対応として、以下も必須級フィールドとして持つ。

```txt
marketplace_scope
origin_bucket
review_status
record_quality_flags
```

これにより、単なる dead marketplace list ではなく、**マーケットは消えたが、何が残ったのかまで記録し、さらに構成・品質・残存状態まで集計できる図鑑型歴史台帳**として成立させる。

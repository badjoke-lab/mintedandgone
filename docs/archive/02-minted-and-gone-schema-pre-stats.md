# 02-minted-and-gone-schema.md

# Minted & Gone Data Schema

Status: draft / implementation-level schema source of truth  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`  
Scope: canonical JSON data, enum definitions, relationships, validation rules, derived display values  
Core rule: v0 は静的JSONのみ。DB/APIなし。

---

## 0. この文書の役割

この文書は、Minted & Gone v0 のデータ構造を固定する。

この文書が決めるもの:

- canonical JSON ファイル
- 各レコード型
- 必須フィールド
- 任意フィールド
- enum
- ID規則
- slug規則
- 日付規則
- URL規則
- record間の関係
- validation rules
- derived values
- search / filter 用 index 生成方針
- v0でやらないデータ設計

この文書は、データの「意味」を説明する methodology ではなく、**実装上の型・制約・検証ルール**を定義する。

---

## 1. v0 canonical data files

v0 の canonical data は以下の3ファイルで固定する。

```txt
data/marketplaces.json
data/events.json
data/evidence.json
```

## 1.1 役割

```txt
marketplaces.json = NFT marketplace 本体
 events.json       = marketplace に起きた時系列イベント
 evidence.json     = entity / event / status / URL 等の根拠
```

## 1.2 DBは使わない

v0 では以下を使わない。

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

## 1.3 JSON運用方針

- canonical JSON は GitHub repo で管理する
- 変更は Pull Request で行う想定
- v0 では build 時に JSON を読み込む
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

ただし v0 の簡易実装では `launch_date` に `YYYY-01-01` を仮置きしない。  
不確かな日付を正確な日付のように見せないため。

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

## 6.3 chain_scope

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

## 6.4 frontend_status

```txt
active
limited
dead
redirected
unknown
not_applicable
```

---

## 6.5 contract_status

```txt
accessible
partially_accessible
deprecated
unknown
not_applicable
```

---

## 6.6 asset_status

```txt
user_assets_remain
migrated
withdrawal_required
lost_or_unclear
not_applicable
unknown
```

---

## 6.7 closure_reason

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

## 6.8 official_url_status

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

## 6.9 confidence

```txt
high
medium
low
```

---

## 6.10 impact_level

```txt
low
medium
high
critical
```

---

## 6.11 status_effect

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

## 6.12 event_type

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

## 6.13 source_type

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

## 6.14 reliability

```txt
high
medium
low
```

---

## 6.15 claim_scope

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

```txt
id
slug
canonical_name
aliases
status
category
chain_scope
summary
confidence
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

### chain_scope

Type: string[]  
Required: yes  
Enum items: `chain_scope`

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
Required: recommended for dead-side records  
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
Required: recommended for dead-side records

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
  "chain_scope": ["ethereum"],
  "launch_date": "2022-01-01",
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

## 10. Cross-file validation rules

## 10.1 marketplace validation

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
```

## 10.2 event validation

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

## 10.3 evidence validation

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
archived_url missing for dead-side source
published_at null
accessed_at null
reliability low with no notes
claim_scope = event but event_id null
quote_excerpt too long
```

## 10.4 URL safety validation

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

---

## 11. Derived values

実装側で生成してよい派生値。

## 11.1 year_range

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

## 11.2 dead_side boolean

```ts
const deadSideStatuses = ["dead", "acquired", "merged", "rebranded"];
```

`limited` と `inactive` は dead-side には含めないが、トップでは faded-side として強調可。

## 11.3 faded_side boolean

```ts
const fadedSideStatuses = ["limited", "inactive", "dead", "acquired", "merged", "rebranded"];
```

## 11.4 archive_available boolean

```ts
Boolean(archived_url)
```

## 11.5 evidence_count

marketplace_id ごとの evidence 件数。

## 11.6 event_count

marketplace_id ごとの event 件数。

## 11.7 linked_evidence_count

event_id ごとの evidence 件数。

## 11.8 display_status_label

status enum をUI表示に変換。

例:

```txt
active -> Active
limited -> Limited
rebranded -> Rebranded
```

---

## 12. Search index schema

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
  chain_scope: string[];
  official_domain_original: string | null;
  summary: string;
  searchText: string;
};
```

## 12.1 searchText に含めるもの

```txt
canonical_name
aliases
official_domain_original
category
chain_scope
summary
```

## 12.2 正規化

- lowercase
- trim
- punctuation removal where safe
- multiple spaces collapse

---

## 13. Filter schema

UI filter state の形。

```ts
type MarketplaceFilters = {
  q: string;
  status: string[];
  category: string[];
  chain: string[];
  frontend_status?: string[];
  contract_status?: string[];
  asset_status?: string[];
  closure_reason?: string[];
  confidence?: string[];
};
```

v0で前面に出すフィルタ:

```txt
q
status
category
chain
```

advanced扱い:

```txt
frontend_status
contract_status
asset_status
closure_reason
confidence
```

---

## 14. Sort schema

許可する sort。

```txt
default
name_asc
recently_ended
oldest_launched
status
category
chain
```

## 14.1 default sort

```txt
1. faded_side first
2. end_year/end_date desc
3. active records
4. canonical_name asc
```

## 14.2 recently_ended

```txt
end_date desc
end_year desc
unknown last
canonical_name asc
```

## 14.3 oldest_launched

```txt
launch_date asc
launch_year asc
unknown last
canonical_name asc
```

---

## 15. Minimal TypeScript types

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

export type Marketplace = {
  id: string;
  slug: string;
  canonical_name: string;
  aliases: string[];
  status: MarketplaceStatus;
  category: string;
  chain_scope: string[];
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
```

---

## 16. Validation implementation outline

v0 では Zod / JSON Schema のどちらでもよい。  
推奨は Zod。

```txt
scripts/validate-data.ts
```

検査対象:

```txt
data/marketplaces.json
data/events.json
data/evidence.json
```

出力:

```txt
Validation passed
または
errors / warnings list
```

CIは後回しでもよいが、実装時にローカル validate は用意する。

---

## 17. v0 seed data minimum

v0 seed では以下を守る。

## 17.1 marketplace

最低:

```txt
id
slug
canonical_name
aliases
status
category
chain_scope
summary
confidence
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

## 17.2 event

最低1件。

代表例:

```txt
launched
shutdown_announced
shutdown_effective
acquired
rebranded
```

## 17.3 evidence

最低1本、望ましくは2本。

public preview に出す dead/closed records は2本以上を目標にする。

---

## 18. Example mini dataset

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
      "chain_scope": ["ethereum"],
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

## 19. v0で作らないデータ構造

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

## 20. Future migration notes

## 20.1 500件超

検討:

```txt
marketplaces-index.json
marketplaces-detail/[slug].json
```

## 20.2 1000件超

検討:

```txt
static detail JSON split
search index generation
precomputed stats
```

## 20.3 D1移行

将来、D1へ移行する場合もこの3テーブルから始める。

```txt
marketplaces
events
evidence
```

ただし v0 ではやらない。

---

## 21. Schema acceptance checklist

```txt
[ ] 3 JSON files onlyで成立する
[ ] marketplace / event / evidence の関係が明確
[ ] NFT特有の frontend / contract / asset 状態を持てる
[ ] What is gone / What remains を表示できる
[ ] URL安全ルールを表現できる
[ ] evidence が entity / event どちらにも紐づけられる
[ ] active / limited / dead / acquired / rebranded を表現できる
[ ] 日付の不確実性を表現できる
[ ] 30〜50件 seed に耐える
[ ] 500件程度まで拡張できる
[ ] 無料運営を壊さない
```

---

## 22. 最終結論

Minted & Gone v0 の schema は、以下の3本で固定する。

```txt
marketplaces.json
events.json
evidence.json
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

これにより、単なる dead marketplace list ではなく、**マーケットは消えたが、何が残ったのかまで記録する図鑑型歴史台帳**として成立させる。

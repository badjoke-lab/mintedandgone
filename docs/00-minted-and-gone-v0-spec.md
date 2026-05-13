# 00-minted-and-gone-v0-spec.md

# Minted & Gone v0 実装レベル仕様書

Status: draft / pre-development source of truth  
Project: Minted & Gone  
Purpose: NFT marketplace historical registry  
Deployment target: Cloudflare Pages free static site  
Primary design direction: illustrated encyclopedia / picture book / field guide  
Core rule: HEI と同じ見た目・同じ情報設計にしない

---

## 0. この仕様書の役割

この文書は、Minted & Gone の開発に入る前に固定する **最上位仕様書**である。

この仕様書は次を決める。

- サイトの目的
- 対象範囲
- 対象外範囲
- status 判定
- NFT marketplace 特有の状態管理
- データ構造
- JSON ファイル構成
- ページ構成
- 各ページの表示項目
- 各ページの挙動
- 検索・フィルタ・並び順
- 詳細ページの情報設計
- methodology / about / submit の役割
- 無料運営構成
- 実装フェーズ
- 開発着手条件

この文書より後に作る文書は、原則としてこの仕様に従う。

後続文書の想定:

```txt
01-design.md
02-schema.md
03-methodology.md
04-v0-seed-plan.md
05-html-mock-plan.md
06-implementation-plan.md
```

---

## 1. プロジェクト概要

## 1.1 サイト名

```txt
Minted & Gone
```

## 1.2 一文説明

```txt
Minted & Gone is a field-guide style historical registry of NFT marketplaces — active, faded, acquired, rebranded, and gone.
```

日本語説明:

```txt
Minted & Gone は、現役・縮小・閉鎖・買収・リブランド・消滅した NFT マーケットプレイスを記録する図鑑型の歴史台帳である。
```

## 1.3 サイトの目的

Minted & Gone は、NFT マーケットプレイスの現在状態と歴史的変化を記録する。

記録するもの:

- いつ始まったか
- どのチェーン・カテゴリに属するか
- 現在も使えるか
- 機能が縮小したか
- 閉鎖したか
- 買収・統合・リブランドされたか
- フロントエンドは残っているか
- コントラクトやユーザー資産は残っているか
- ユーザーや作品はどこへ移ったか
- 判断根拠は何か

## 1.4 サイトの非目的

Minted & Gone は以下ではない。

```txt
NFT価格ランキングサイト
NFTコレクションランキングサイト
投資判断サイト
フロア価格追跡サイト
リアルタイム取引量ダッシュボード
NFTマーケットの安全性スコアサイト
NFTプロジェクト全般の墓場
NFTコレクション墓場
ウォレット/ギャラリー/ミントページ一覧
```

---

## 2. 基本方針

## 2.1 最初は無料運営を優先する

v0 は完全無料運営を前提にする。

採用する構成:

```txt
GitHub repository
Cloudflare Pages Git integration
Static build
JSON files in repository
Client-side search/filter
Static detail pages
No DB
No API
No auth
No image uploads
No scheduled scraping in v0 public site
```

使わないもの:

```txt
D1
KV
R2
Workers runtime API
user login
user accounts
user-generated public comments
image storage
real-time market data API
paid data API
```

## 2.2 HEI とは別物として設計する

HEI は暗く硬い historical registry である。  
Minted & Gone は、絵本・百科事典・図鑑の方向で設計する。

禁止する方向:

```txt
HEI風の黒い監査台帳UI
取引所リスト風の密テーブル中心UI
Web3ネオン風
NFT投資サイト風
SaaSランディング風
ランキングサイト風
```

採用する方向:

```txt
絵本
百科事典
図鑑
紙の本
分類札
索引
見開き
標本カード
余白
小さな挿絵
古い本の章立て
```

## 2.3 dead 側を主役にするが active も扱う

Minted & Gone は dead NFT marketplace だけの墓場ではない。

扱う状態:

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

ただし、サイト価値の中心は次である。

```txt
閉鎖
縮小
withdrawal-only
mint停止
frontend dead / contract alive
買収後終了
リブランド
移管
コミュニティ継続
```

---

## 3. 対象範囲

## 3.1 入れる対象

Minted & Gone に掲載できる対象は、原則として「独立した名前・URL・NFT売買機能を持つ marketplace」である。

含める:

```txt
NFT marketplace
NFT marketplace aggregator
CEX-operated NFT marketplace
chain-specific NFT marketplace
curated art NFT marketplace
gaming NFT marketplace
metaverse land marketplace
music NFT marketplace
sports / collectibles NFT marketplace
brand marketplace if it had meaningful marketplace behavior
historical marketplace that later closed
marketplace absorbed by another service
marketplace rebranded into another service
community-forked marketplace
```

## 3.2 条件付きで入れる対象

以下は個別判断にする。

```txt
launchpad with secondary marketplace behavior
mint platform that later became marketplace
wallet with marketplace tab
game item marketplace
metaverse internal marketplace
collection-specific marketplace
protocol marketplace UI
aggregator-only interface
```

入れる条件:

- 独立したブランド名がある
- 公式 URL または archived URL がある
- NFT の売買・出品・入札・二次流通・mint のいずれかが中核機能である
- 状態を根拠付きで判定できる
- 単なる一時的キャンペーンページではない

## 3.3 入れない対象

除外する:

```txt
単なるNFTコレクション
単発mintページ
ただのギャラリー
NFT表示だけのウォレット機能
個別ブランドの一時販売ページ
個別ゲーム内ショップだけで外部marketplace性がないもの
PFPコレクションの公式販売ページだけのもの
根拠が薄すぎるもの
詐欺コレクション単体
NFT価格比較だけのサイト
NFTニュースサイト
NFT分析サイト
NFT portfolio tracker
```

## 3.4 境界判定ルール

迷う場合は、次の順で判定する。

1. ユーザー同士の売買・出品・入札があったか
2. 独立した marketplace 名として認識できるか
3. 公式 URL または archive で実体を確認できるか
4. active / limited / inactive / dead の判定が可能か
5. 単なる collection / mint / gallery と区別できるか

上記を満たせない場合は `out_of_scope` とする。

---

## 4. status 仕様

## 4.1 status 一覧

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

## 4.2 status 定義

### active

中核機能が現在も使える状態。

例:

```txt
出品できる
購入できる
入札できる
二次流通ができる
mintまたは取引機能が現役
```

### limited

一部機能だけが残っている状態。

例:

```txt
withdrawal-only
閲覧のみ
移管のみ
購入停止
mint停止だが閲覧可能
secondary saleのみ
新規出品停止
一部チェーンだけ停止
```

### inactive

実質的に動いていないが、完全終了とは断定できない状態。

例:

```txt
公式更新停止
取引活動がほぼない
サイトは残っているが機能不明
閉鎖告知はないが利用実態が見えない
```

### dead

マーケットプレイスとして終了した状態。

例:

```txt
公式閉鎖告知あり
売買不可
サービス終了
サイト消滅
親会社が終了
移管期限終了
```

### acquired

買収され、独立した marketplace としての扱いが変わった状態。

例:

```txt
他社に買収
買収後に縮小
買収後に閉鎖
買収先サービスに吸収
```

### merged

他サービスへ統合された状態。

例:

```txt
ユーザー・資産・ブランドが別サービスへ統合
旧marketplaceの独立ページが終了
```

### rebranded

後継ブランドが明確にある状態。

例:

```txt
名称変更
プロダクト名変更
後継サービスへ移行
```

### unknown

判定不能。

例:

```txt
根拠不足
状態確認不可
複数説あり
公式情報なし
```

---

## 5. NFT marketplace 特有の状態

NFT marketplace では、単純な active / dead だけでは足りない。

必ず以下を補助状態として扱う。

```txt
frontend_status
contract_status
asset_status
```

## 5.1 frontend_status

```txt
active
limited
dead
redirected
unknown
not_applicable
```

意味:

- `active`: UI が使える
- `limited`: 一部 UI のみ使える
- `dead`: UI が消滅または使えない
- `redirected`: 別サービスへリダイレクト
- `unknown`: 未確認
- `not_applicable`: コントラクトやプロトコル中心で独立 frontend がない

## 5.2 contract_status

```txt
accessible
partially_accessible
deprecated
unknown
not_applicable
```

意味:

- `accessible`: コントラクトが残り、参照可能
- `partially_accessible`: 一部のみ参照可能
- `deprecated`: 非推奨・旧コントラクト化
- `unknown`: 未確認
- `not_applicable`: コントラクト情報が対象外または不明

## 5.3 asset_status

```txt
user_assets_remain
migrated
withdrawal_required
lost_or_unclear
not_applicable
unknown
```

意味:

- `user_assets_remain`: NFT はユーザーウォレット等に残る
- `migrated`: 後継先・別サービスへ移行
- `withdrawal_required`: ユーザー側の移管・出金が必要だった
- `lost_or_unclear`: 資産状態が不明または問題あり
- `not_applicable`: 対象外
- `unknown`: 未確認

## 5.4 詳細ページで必ず説明する3項目

各 marketplace 詳細では以下を表示する。

```txt
What is gone?
What remains?
Where did users or assets go?
```

内部フィールド:

```txt
what_is_gone
what_remains
where_users_or_assets_went
```

---

## 6. shutdown / transition reason 仕様

status とは別に、終了・移行理由を持つ。

フィールド名:

```txt
closure_reason
```

値:

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

## 6.1 closure_reason 定義

### market_decline

NFT 市場低迷や取引量減少が主因。

### funding_failure

資金不足・事業継続困難。

### parent_company_shutdown

親会社・親サービスの方針や終了。

### acquisition_winddown

買収後の終了・縮小・吸収。

### regulatory_pressure

規制・法務・コンプライアンス要因。

### security_incident

ハック、不正流出、脆弱性、重大インシデントが主因。

### voluntary_shutdown

運営側の自主終了。

### rebrand

後継ブランドへの移行。

### merge

別サービスへの統合。

### community_fork

公式は終了したが、コミュニティ版や派生が継続。

### unknown

不明。

### not_applicable

active など終了理由が不要な場合。

---

## 7. marketplace category 仕様

フィールド名:

```txt
category
```

値:

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

---

## 8. chain / ecosystem 仕様

フィールド名:

```txt
chain_scope
```

配列で持つ。

例:

```json
["ethereum"]
["solana"]
["ethereum", "polygon"]
["bitcoin_ordinals"]
["multi_chain"]
["tezos"]
["cardano"]
["unknown"]
```

v0 では chain を厳密な正規化テーブルにはしない。  
ただし表示上は主要チェーン名をタグ化する。

---

## 9. データ構造

v0 では3本の JSON を canonical data とする。

```txt
data/marketplaces.json
data/events.json
data/evidence.json
```

## 9.1 marketplace_entity

`data/marketplaces.json` に置く。

### 必須フィールド

```txt
id
slug
canonical_name
status
category
chain_scope
summary
confidence
last_verified_at
```

### 強く推奨フィールド

```txt
aliases
launch_date
end_date
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

### 任意フィールド

```txt
native_name
parent_company
acquirer
related_marketplaces
logo_policy
external_references
```

### JSON 形

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
  "end_date": "2025-04-30",
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

## 9.2 marketplace_event

`data/events.json` に置く。

### 必須フィールド

```txt
id
marketplace_id
event_type
event_date
title
description
confidence
```

### 強く推奨

```txt
impact_level
status_effect
source_count
sort_order
notes
```

### event_type

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

### impact_level

```txt
low
medium
high
critical
```

### status_effect

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

### JSON 形

```json
{
  "id": "mag_ev_000001",
  "marketplace_id": "mag_nfm_000001",
  "event_type": "shutdown_announced",
  "event_date": "2025-03-31",
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

## 9.3 marketplace_evidence

`data/evidence.json` に置く。

### 必須フィールド

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

### 強く推奨

```txt
event_id
archived_url
accessed_at
language
notes
```

### source_type

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

### reliability

```txt
high
medium
low
```

### claim_scope

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

### JSON 形

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
  "notes": "Used to verify shutdown timing."
}
```

---

## 10. confidence 仕様

```txt
high
medium
low
```

### high

- 公式発表
- 公式サポート記事
- 親会社発表
- 規制文書
- 複数の信頼できる報道
- archive で確認可能

### medium

- 信頼できる二次情報
- 業界メディア
- DB系参照
- 公式情報は弱いが複数ソースあり

### low

- コミュニティ投稿中心
- 根拠が薄い
- 日付や状態が推定
- 追加検証が必要

---

## 11. URL 仕様

## 11.1 URL フィールド

```txt
official_url_original
official_domain_original
official_url_status
archived_url
```

## 11.2 official_url_status

```txt
live_verified
live_unverified
dead_domain
redirected
repurposed
unsafe
unknown
```

## 11.3 表示ルール

### active / limited / inactive

- official URL をリンク可
- `live_verified` は通常リンク
- `live_unverified` は注意表示付き
- `unknown` は未確認ラベル付き

### dead / acquired / merged / rebranded

- original URL は史料として表示
- 原則として main CTA は archived URL
- `dead_domain / repurposed / unsafe` は直接リンクしない
- `redirected` は旧URLと現在の遷移先を分けて表示

---

## 12. ページ構成

v0 のページはこれで固定する。

```txt
/
/marketplaces
/marketplace/[slug]
/methodology
/about
/submit
```

後回し:

```txt
/stats
/timeline
/chains
/categories
/updates
```

---

## 13. `/` トップページ仕様

## 13.1 役割

トップページは「表紙 + 図鑑の入口」である。  
全件一覧そのものではない。

## 13.2 表示構成

上から:

```txt
1. Header
2. Hero / book cover section
3. Browse the encyclopedia
4. Featured records
5. Recently gone / recently updated
6. Archive at a glance
7. What is Minted & Gone?
8. Footer
```

## 13.3 Header

表示:

```txt
Minted & Gone
Marketplaces
Methodology
About
Submit
```

## 13.4 Hero

必須要素:

```txt
site name
short tagline
one-sentence explanation
primary CTA: Browse the encyclopedia
secondary CTA: Read methodology
small illustration / book-like motif
```

## 13.5 Browse cards

表示する導線:

```txt
Active
Limited
Inactive
Dead
Acquired / Merged
Rebranded
By Chain
By Category
```

## 13.6 Archive at a glance

表示する軽い数値:

```txt
total marketplaces
active count
dead / closed count
limited / inactive count
chains covered
evidence count
```

v0 では stats ページではなく、トップの軽い summary として表示する。

## 13.7 挙動

- Browse cards クリックで `/marketplaces?status=dead` などへ遷移
- Featured record クリックで詳細へ遷移
- 検索窓を置く場合は `/marketplaces?q=` に送る
- トップ上では複雑な filtering はしない

---

## 14. `/marketplaces` 一覧ページ仕様

## 14.1 役割

図鑑の索引ページ。  
全 marketplace を検索・フィルタして探す。

## 14.2 PC レイアウト

基本:

```txt
left: filter panel
center: record cards / compact index
right: selected preview or guide note
```

ただし v0 実装を軽くする場合は、右 preview は省略可。

## 14.3 Mobile レイアウト

```txt
search
filter toggle
active filters summary
card list
pagination or simple all-list
```

## 14.4 検索対象

```txt
canonical_name
aliases
official_domain_original
summary
chain_scope
category
```

## 14.5 フィルタ

```txt
status
category
chain_scope
frontend_status
contract_status
asset_status
closure_reason
confidence
```

v0 初期表示では以下だけ前面に出す。

```txt
status
category
chain
```

残りは advanced filters にするか後回し。

## 14.6 カード表示項目

各カードに表示:

```txt
canonical_name
status chip
category chip
chain tags
years: launch year – end year
summary short
frontend / contract mini status
View record
```

閉鎖済みでは追加:

```txt
closure_reason
what remains short label
archive available icon
```

## 14.7 並び順

default:

```txt
1. dead / limited / inactive / acquired / merged / rebranded
2. active
3. end_date desc where available
4. canonical_name asc
```

ユーザー選択:

```txt
Name A-Z
Recently ended
Oldest launched
Status
Category
Chain
```

## 14.8 Empty state

表示:

```txt
No marketplace records match these filters.
Clear filters
Submit a correction or suggestion
```

---

## 15. `/marketplace/[slug]` 詳細ページ仕様

## 15.1 役割

1 marketplace の図鑑ページ。  
「何だったのか」「何が消えたのか」「何が残るのか」「根拠は何か」を見せる。

## 15.2 表示構成

```txt
1. Breadcrumb
2. Record hero
3. Facts at a glance
4. Status of the marketplace
5. What is gone / What remains / Where assets went
6. Overview
7. Timeline
8. Evidence
9. Related marketplaces
10. Correction prompt
```

## 15.3 Record hero

表示:

```txt
canonical_name
aliases
status chip
category chip
chain tags
years
short summary
```

## 15.4 Facts at a glance

表示:

```txt
Status
Category
Chain / ecosystem
Launch date
End date
Closure reason
Frontend status
Contract status
Asset status
Confidence
Last verified
```

## 15.5 Status of the marketplace

NFT特有の状態を見せる。

```txt
Marketplace status
Frontend status
Contract status
Asset status
Official URL status
Archive status
```

## 15.6 What is gone / What remains

必須表示:

```txt
What is gone?
What remains?
Where did users or assets go?
```

これは Minted & Gone の中核差別化要素。

## 15.7 URL block

表示:

```txt
Original URL
Original domain
URL status
Archived URL
```

挙動:

- active系は original URL をリンク可
- dead系は archived URL を主導線
- unsafe / repurposed / dead_domain は original URL を直接踏ませない

## 15.8 Timeline

event を時系列で表示する。

各 event:

```txt
event_date
event_type chip
title
description
impact_level
status_effect
linked evidence count
```

並び順:

```txt
event_date asc
sort_order asc
```

## 15.9 Evidence

表示:

```txt
title
publisher
published_at
source_type
reliability
claim_scope
url
archived_url
accessed_at
```

挙動:

- evidence の URL は原典として扱う
- archived_url がある場合は archive link を併記
- reliability を chip 表示
- claim_scope を表示し、何を根拠づけるか明示

## 15.10 Related marketplaces

表示候補:

```txt
successor_marketplace
predecessor_marketplace
same parent company
same chain
same category
```

v0 では successor / predecessor がある場合のみ表示でよい。

---

## 16. `/methodology` 仕様

## 16.1 役割

巻末の分類ルール。  
このサイトが何をどう判定するかを明記する。

## 16.2 デザイン

```txt
図鑑の巻末解説
紙面風
章立て
定義カード
比較表
余白多め
小さな注釈欄
```

## 16.3 構成

```txt
1. How to read this guide
2. What counts as an NFT marketplace
3. What does not count
4. Status definitions
5. Frontend / contract / asset status
6. Closure and transition reasons
7. URL and archive handling
8. Evidence rules
9. Confidence levels
10. Uncertainty and revisions
11. Corrections
12. Disclaimer
```

## 16.4 必須説明

必ず書く:

```txt
NFT collection と NFT marketplace は違う
mint page と marketplace は違う
frontend が死んでも contract / assets が残る場合がある
status は最終分類ではなく、根拠により更新される
unknown を無理に埋めない
投資助言ではない
```

---

## 17. `/about` 仕様

## 17.1 役割

図鑑の「はじめに」。  
プロジェクトの目的と雰囲気を伝える。

## 17.2 構成

```txt
1. What is Minted & Gone?
2. Why NFT marketplaces need an archive
3. What this project tracks
4. What this project does not do
5. How records are maintained
6. Community corrections
7. Disclaimer
```

## 17.3 トーン

methodology より柔らかい。  
ただし曖昧にしすぎない。

方向:

```txt
Every marketplace has a story.
Some are still alive. Some faded. Some were acquired, rebranded, abandoned, or closed.
Minted & Gone records those stories as a public historical guide.
```

---

## 18. `/submit` 仕様

## 18.1 役割

修正・追加候補の入口。

v0 ではフォーム自体を自前実装しない。  
Google Form または GitHub Issue へ送る導線ページとする。

## 18.2 表示内容

```txt
Submit a correction
Suggest a marketplace
What to include
What not to submit
Link to Google Form
Link to GitHub Issues
```

## 18.3 送ってもらう項目

```txt
marketplace name
page URL if existing
what is wrong or missing
source URL
archive URL if available
optional note
contact optional
```

---

## 19. デザイン挙動仕様

## 19.1 全体トーン

```txt
warm
paper-like
encyclopedic
slightly nostalgic
browsable
collectible
story-aware
```

## 19.2 色方向

```txt
background: ivory / warm paper
text: dark charcoal / brown-black
accent: forest green / muted red / dusty gold / blue-green
status colors: soft and readable, not neon
```

## 19.3 UI要素

使う:

```txt
book cover hero
field-guide cards
classification tags
thin decorative rules
paper panels
small illustration motifs
section labels
index-like navigation
```

使わない:

```txt
heavy dark dashboard
neon glow
glassmorphism
crypto exchange table UI
animated trading widgets
large NFT artwork grids
```

## 19.4 カード挙動

- カード全体クリックで詳細へ遷移
- archive link や external link は個別クリック
- status chip はクリック可能にする場合、一覧フィルタへ遷移
- hover は軽く浮く程度

## 19.5 モバイル挙動

- 1カラム
- filter は折りたたみ
- card は大きくしすぎない
- 詳細ページは facts → what remains → timeline → evidence の順
- sticky header は軽量なら可

---

## 20. SEO / metadata 仕様

v0 で最低限入れる。

## 20.1 共通

```txt
title
description
canonical
OG title
OG description
OG image
Twitter card
robots
sitemap.xml
```

## 20.2 詳細ページ title

形式:

```txt
{Marketplace Name} — Minted & Gone
```

## 20.3 詳細ページ description

形式:

```txt
Historical record for {Marketplace Name}, including status, category, chain, timeline, evidence, and what remains.
```

## 20.4 sitemap

含める:

```txt
/
/marketplaces
/marketplace/[slug]
/methodology
/about
/submit
```

---

## 21. アクセシビリティ仕様

最低限:

```txt
semantic HTML
visible focus state
sufficient color contrast
buttons and links distinguishable
alt text for decorative/non-decorative images
no text baked into important images
reduced motion respected
keyboard navigation for filters
```

---

## 22. パフォーマンス仕様

無料運営・静的サイト前提。

守ること:

```txt
large image assets を置かない
marketplace logo を大量保存しない
external font を増やしすぎない
CSS中心で雰囲気を作る
client JS を重くしない
JSON は v0 では単一ファイルで可
500件を超えたらJSON分割検討
```

件数目安:

```txt
0-100 records: single JSON
100-500 records: still single JSON OK
500-1000 records: split by index/detail検討
1000+ records: generated static detail + lightweight index JSON
```

---

## 23. v0 seed 方針

## 23.1 初期件数

v0 開発開始時:

```txt
30〜50件
```

内訳:

```txt
active major: 10〜15
closed / dead / limited: 15〜25
acquired / merged / rebranded: 5〜10
```

## 23.2 優先候補カテゴリ

```txt
有名NFTマーケット
閉鎖が確認しやすいNFTマーケット
CEX系NFTマーケットの終了例
アート特化マーケット
チェーン特化マーケット
買収・統合されたマーケット
```

## 23.3 seed quality gate

1 record につき最低:

```txt
entity 1件
event 1件以上
evidence 2本以上が望ましい
status根拠
URLまたはarchive根拠
```

最低公開ライン:

```txt
20件でもUI検証は可
30件でv0 internal preview
50件でpublic preview候補
```

---

## 24. 実装ディレクトリ案

フレームワーク未確定でも、構造は以下に寄せる。

```txt
minted-and-gone/
  data/
    marketplaces.json
    events.json
    evidence.json

  src/
    pages/
      index
      marketplaces
      marketplace/[slug]
      methodology
      about
      submit

    components/
      SiteHeader
      SiteFooter
      MarketplaceCard
      StatusChip
      ChainTag
      FactGrid
      Timeline
      EvidenceList
      ArchiveLink
      FilterPanel
      PageShell
      LongformPage

    lib/
      loadData
      filterMarketplaces
      sortMarketplaces
      getMarketplaceBySlug
      getEventsForMarketplace
      getEvidenceForMarketplace
      formatDate
      formatYearRange
      statusLabels

  public/
    favicon.svg
    og-image.png

  docs/
    00-minted-and-gone-v0-spec.md
    01-design.md
    02-schema.md
    03-methodology.md
```

---

## 25. 開発前成果物

開発に入る前に、以下を作る。

```txt
0. 00-minted-and-gone-v0-spec.md
1. DESIGN.md
2. schema.md
3. methodology draft
4. about draft
5. v0 seed candidate list
6. HTML mock for top page
7. HTML mock for list page
8. HTML mock for detail page
9. HTML mock for longform pages
```

---

## 26. 開発フェーズ

## Phase 0: 仕様固定

成果物:

```txt
00-minted-and-gone-v0-spec.md
```

完了条件:

```txt
対象範囲が固定
ページ構成が固定
データ構造が固定
status定義が固定
無料運営構成が固定
```

## Phase 1: DESIGN.md

成果物:

```txt
01-design.md
```

完了条件:

```txt
色・フォント・余白・カード・装飾・モバイル方針が固定
HEI風禁止ルールが明文化
```

## Phase 2: Schema / Methodology

成果物:

```txt
02-schema.md
03-methodology.md
```

完了条件:

```txt
JSON schemaが固定
status判定が固定
対象/対象外が固定
```

## Phase 3: Seed candidate list

成果物:

```txt
04-v0-seed-candidates.md
```

完了条件:

```txt
30〜50件候補
active/dead/acquired/rebrandedのバランスあり
重複・対象外チェック前提
```

## Phase 4: HTML mock

成果物:

```txt
top mock
marketplaces mock
detail mock
longform mock
mobile確認
```

完了条件:

```txt
画像モックの世界観をHTML/CSSで再現可能
主要ページのUIが確認可能
```

## Phase 5: Static implementation

成果物:

```txt
Cloudflare Pages static site
JSON loading
search/filter
static detail pages
methodology/about/submit
```

完了条件:

```txt
local build成功
all routes表示
mobile表示確認
basic SEO出力
```

## Phase 6: Public preview

成果物:

```txt
pages.dev preview
```

完了条件:

```txt
30〜50 seed records表示
主要ページ崩れなし
correction導線あり
methodologyあり
```

---

## 27. v0 合格条件

Minted & Gone v0 は以下を満たしたら合格。

```txt
1. 開いた瞬間にNFT marketplaceの図鑑だと分かる
2. HEIとは別デザインに見える
3. active / dead / limited / acquired / rebranded が見分けられる
4. 詳細ページで What is gone / What remains が分かる
5. 根拠リンクが表示される
6. Methodologyで判定基準が読める
7. Aboutでプロジェクト意図が伝わる
8. 無料運営構成を壊していない
9. モバイルで最低限読める
10. 30〜50件のseedで空っぽに見えない
```

---

## 28. v0 ではやらないこと

```txt
DB導入
ログイン
ユーザー投稿保存
コメント欄
リアルタイムランキング
NFT価格取得
コレクション別フロア価格
画像大量保存
マーケットロゴ大量保存
自動スクレイピング公開運用
statsページ
timelineページ
multi-language
paid/pro plan
```

---

## 29. 将来拡張

v0 後に検討する。

```txt
/stats
/timeline
/chains
/categories
/updates
monthly update log
research backlog
GitHub issue integration
auto monitoring
multi-language
D1 migration
```

ただし、v0 の価値が出るまでは後回し。

---

## 30. 最終結論

開発前にまず固定すべき 0 番はこの仕様書である。

開発順は次で固定する。

```txt
0. 仕様書
1. DESIGN.md
2. schema.md
3. methodology/about草案
4. v0 seed候補
5. HTML mock
6. static implementation
7. pages.dev preview
```

Minted & Gone は、NFT marketplace のランキングではなく、**NFT marketplace の生死・縮小・移行・残存状態を記録する図鑑型歴史台帳**として作る。

v0 は無料運営を守り、静的JSONとCloudflare Pagesだけで成立させる。

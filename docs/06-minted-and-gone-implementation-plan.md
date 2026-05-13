# 06-minted-and-gone-implementation-plan.md

# Minted & Gone Implementation Plan

Status: draft / implementation-ready plan  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`, `02-minted-and-gone-schema-stats-ready.md`, `03-minted-and-gone-methodology.md`, `04-minted-and-gone-candidates.md`, `04.5-minted-and-gone-mock-seed.md`, `05-minted-and-gone-html-mock-plan.md`  
UI source: `minted-and-gone-html-mock.html`  
Core rule: static-first, free-operation, no runtime DB/API for v0.

---

## 0. この文書の役割

この文書は、Minted & Gone を HTMLモックから実装へ移すための実装計画書である。

ここで決めるもの:

- 採用する実装構成
- ページ構成
- ディレクトリ構成
- データ構成
- コンポーネント構成
- stats生成方針
- v0 seed JSON化の位置づけ
- 実装順序
- terminal gate / browser gate
- 公開前チェック
- やらないこと

ここでやらないもの:

- 本番seed 30〜50件の実調査
- 正式 `marketplaces.json` の完成
- 実コードの作成
- デプロイ作業

---

## 1. 現状

完了済み:

```txt
0. 仕様書作成
1. DESIGN.md
2. stats対応データスキーマ
3. status / methodology
4. 候補リスト
4.5 HTMLモック用 mock seed
5. HTMLモック
```

HTMLモックの判断:

```txt
方向性は採用
HEIとは別物に見える
紙 / 図鑑 / 百科事典 / 記録帳の雰囲気は成立
全面作り直しは不要
実装前に軽いpolishを入れる
```

---

## 2. 実装方針の結論

Minted & Gone v0 は、**静的サイト**として実装する。

採用方針:

```txt
static-first
JSON canonical data
build-time page generation
client-side light search/filter
static generated stats
Cloudflare Pages free operation
```

使わない:

```txt
runtime DB
runtime API
ログイン
ユーザー投稿DB
画像大量保存
NFT価格/出来高API
リアルタイム更新
重いchart library
```

---

## 3. 推奨技術構成

## 3.1 推奨スタック

```txt
Astro static site
TypeScript
vanilla CSS
small vanilla JS for filters
Node scripts for validation/stats generation
Cloudflare Pages deploy
```

理由:

```txt
静的ページ生成に向いている
Markdown/longformページと相性が良い
React runtimeを必須にしない
Cloudflare Pagesで無料運営しやすい
JSON dataからdetail pageを生成しやすい
```

## 3.2 代替案

代替として以下も可能。

```txt
Vite + vanilla TS
Next.js static export
plain HTML/CSS/JS
```

ただし、v0の推奨は Astro とする。

---

## 4. 公開構成

## 4.1 v0 URL structure

```txt
/                         Top
/marketplaces/            Index / search / filters
/marketplace/[slug]/      Detail page
/stats/                   Stats
/methodology/             Methodology
/about/                   About
/submit/                  Submit / correction guide
```

## 4.2 optional future URLs

```txt
/chains/
/chains/[chain]/
/categories/
/categories/[category]/
/timeline/
```

v0では作らない。

---

## 5. 推奨ディレクトリ構成

standalone repo の場合:

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
    check-links.ts

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
    og.png
    robots.txt

  astro.config.mjs
  package.json
  tsconfig.json
```

既存repoに組み込む場合も、上記構成をそのままサブディレクトリへ移植する。

---

## 6. Data implementation

## 6.1 canonical data

v0の正式データは以下。

```txt
data/marketplaces.json
data/events.json
data/evidence.json
```

## 6.2 generated data

build前またはbuild中に生成する。

```txt
data/stats.json
data/stats-history.json
```

## 6.3 mock data

HTMLモック・開発初期のみ使用。

```txt
mock-data/mock-marketplaces.json
mock-data/mock-events.json
mock-data/mock-evidence.json
mock-data/mock-stats.json
```

## 6.4 `src/lib/data.ts`

役割:

```txt
marketplaces/events/evidence/stats の読み込み
id / slug lookup
marketplaceごとの events/evidence 結合
related marketplace 解決
detail page 生成用 data 整形
```

## 6.5 `src/lib/format.ts`

役割:

```txt
status label
category label
scope label
chain label
date precision display
year range
URL display safety
```

## 6.6 `src/lib/filters.ts`

役割:

```txt
searchText生成
status filter
category filter
chain filter
marketplace_scope filter
origin_bucket filter
sort
empty state判定
```

---

## 7. Page implementation details

## 7.1 `/` Top page

Source: HTMLモックの hero / browse shelf / featured / archive at a glance を採用。

必須要素:

```txt
BookHero
BrowseShelf
Featured records
Recently gone / faded records
Archive at a glance
About teaser
Footer
```

実装方針:

```txt
Featured records は手動指定slugでよい
Recently gone は status dead/acquired/merged/rebranded + end_year desc
Archive at a glance は stats.json から読む
```

完了条件:

```txt
開いた瞬間に図鑑/本の入口に見える
NFT価格サイトに見えない
Marketplacesへの導線が明確
```

---

## 7.2 `/marketplaces/`

必須要素:

```txt
Search box
Status filters
Category filters
Chain filters
Optional advanced filters
Marketplace cards
Result count
Empty state
```

v0で表に出すfilter:

```txt
q
status
category
chain
```

v0.5以降に前面化:

```txt
marketplace_scope
origin_bucket
frontend_status
contract_status
asset_status
confidence
review_status
```

実装方針:

```txt
初期表示は static cards
filter/search は small client JS
URL query sync はv0では任意
```

完了条件:

```txt
30〜50件で快適
100〜150件でも実用可能
mobileでfilterが邪魔にならない
```

---

## 7.3 `/marketplace/[slug]/`

必須要素:

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

表示順:

```txt
1. Marketplace name / summary / status
2. FactGrid
3. What is gone / What remains / Where users or assets went
4. URL / archive
5. Timeline
6. Evidence
7. Related / correction
```

完了条件:

```txt
What remains が必ず見える
statusだけでなく frontend/contract/asset status が見える
Evidence が隠れすぎていない
HEI風の監査台帳ではなく図鑑項目に見える
```

---

## 7.4 `/stats/`

v0から作る。  
ただし、巨大なdashboardではなく、巻末統計として軽く作る。

必須要素:

```txt
KPI cards
status breakdown
category breakdown
marketplace_scope breakdown
chain breakdown
coverage / quality section
launch/end year distribution preview
methodology note
```

読み込み:

```txt
data/stats.json
```

完了条件:

```txt
statsがHEIより柔らかい
市場ランキングに見えない
データ品質・coverageが伝わる
```

---

## 7.5 `/methodology/`

Source:

```txt
03-minted-and-gone-methodology.md
```

必須章:

```txt
How to read this guide
What counts
What does not count
Status definitions
Frontend / contract / asset status
Closure and transition reasons
Evidence rules
Confidence levels
Stats methodology
Corrections
Disclaimer
```

完了条件:

```txt
巻末解説に見える
長文でも読みやすい
status判断に戻ってこられる
```

---

## 7.6 `/about/`

役割:

```txt
短い前書き
なぜ作るか
何を記録するか
投資サイトではないこと
methodologyへの導線
```

完了条件:

```txt
Methodologyより柔らかい
短く読める
サイトの立ち位置が分かる
```

---

## 7.7 `/submit/`

v0ではフォーム埋め込み不要。  
Google Form または GitHub Issue へのリンクを置く。

必須要素:

```txt
Suggest missing marketplace
Submit correction
What to include checklist
No investment / listing request disclaimer
```

完了条件:

```txt
何を送ればいいか分かる
なりすまし・宣伝導線に見えない
```

---

## 8. Component implementation details

## 8.1 SiteHeader

```txt
logo / name
Marketplaces
Stats
Methodology
About
Submit
```

mobile:

```txt
折り返しでよい
hamburgerはv0では不要
```

## 8.2 MarketplaceCard

表示:

```txt
canonical_name
status chip
category tag
scope tag
chain tags
summary
year range
confidence / review status
```

修正反映:

```txt
モックより本文を少し読みやすくする
meta文字を小さくしすぎない
status chipをカード上部で見やすくする
```

## 8.3 WhatRemainsBlock

3枚構成:

```txt
What is gone?
What remains?
Where did users or assets go?
```

このblockはdetail pageの中核。  
Timelineより上に置く。

## 8.4 Stats components

```txt
StatsKpiGrid
StatsBreakdown
StatsCoverageCard
StatsQualityFlags
```

chart libraryは使わない。  
CSS barで十分。

---

## 9. HTMLモックから反映するUI修正

スクショ確認後の修正方針。

## 9.1 採用するもの

```txt
紙色背景
大きなserifタイトル
カード型一覧
field note / archive at a glance
What changed? block
巻末統計風 stats
longformの紙面レイアウト
```

## 9.2 polishするもの

```txt
モバイルで本文・metaが小さすぎる箇所を調整
フィルタはmobileで折りたたみまたはコンパクト化
カードごとの差を少し出す
dead / acquired / active の分類札を少し強める
絵文字アイコンは本番では軽いSVGまたはCSS iconへ置換候補
Featured cardsを少し特別扱いする
```

## 9.3 まだやらないもの

```txt
大型画像
各marketplaceロゴ
NFTアート画像グリッド
dark mode
重いアニメーション
```

---

## 10. Implementation phases

## Phase 1: Project setup

作業:

```txt
Astro project作成
TypeScript設定
ディレクトリ作成
docs投入
mock-data投入
基本CSS投入
```

完了条件:

```txt
npm install成功
npm run dev成功
空ページ表示
```

## Phase 2: Design foundation

作業:

```txt
tokens.css
base.css
layout.css
components.css
pages.css
SiteHeader / SiteFooter
LongformLayout
基本card/chip/button
```

完了条件:

```txt
HTMLモックの紙色・カード感を再現
PC/mobileで基本崩れなし
```

## Phase 3: Mock data integration

作業:

```txt
mock-data読み込み
src/lib/data.ts 作成
format.ts 作成
MarketplaceCard に流し込み
Detail previewではなく実detail page生成の準備
```

完了条件:

```txt
mock 12件が一覧に出る
slug lookupできる
events/evidenceを結合できる
```

## Phase 4: Page build

作業:

```txt
Top page
Marketplaces page
Marketplace detail page
Stats page
Methodology page
About page
Submit page
```

完了条件:

```txt
全ページが静的に開ける
detail pageがslugごとに生成される
404/unknown slugが破綻しない
```

## Phase 5: Search and filters

作業:

```txt
client-side search
status filter
category filter
chain filter
clear filters
empty state
```

完了条件:

```txt
30〜50件想定で快適
mobileでfilterが邪魔にならない
JS無効時も最低限一覧は見える
```

## Phase 6: Stats generation

作業:

```txt
scripts/generate-stats.ts
stats.json生成
stats-history.json更新
/stats に反映
```

完了条件:

```txt
canonical data件数とstats source countが一致
status/category/scope/chain breakdownが出る
archive coverage / quality flagsが出る
```

## Phase 7: Validation

作業:

```txt
scripts/validate-data.ts
schema validation
cross-file validation
URL safety warning
stats validation
```

完了条件:

```txt
npm run validate が通る
重複id/slugを検出できる
event/evidenceの参照切れを検出できる
```

## Phase 8: v0 seed JSON化

HTMLモック実装後に、候補リストから30〜50件を選ぶ。

作業:

```txt
04 candidatesからv0対象を45件前後選定
5〜10件単位で調査
marketplaces.json作成
events.json作成
evidence.json作成
stats生成
validate
```

重要:

```txt
いきなり100件作らない
1件ずつの手作業ペースに戻さない
5〜10件単位でbatch化する
```

完了条件:

```txt
30〜50 public preview records
closed-sideは可能な限り2 evidence以上
archive coverageを確認
confidence / review_status / record_quality_flagsが入っている
```

## Phase 9: SEO / publish preparation

作業:

```txt
title / description
canonical
OGP
favicon
robots.txt
sitemap.xml
JSON-LD optional
footer disclaimer
```

完了条件:

```txt
主要ページのmetaが入る
sitemapに主要URLが入る
OGPが最低限ある
```

## Phase 10: Cloudflare Pages deploy

作業:

```txt
GitHub repo接続
Cloudflare Pages project作成
build command設定
pages.dev preview
本番ドメインは後で検討
```

完了条件:

```txt
pages.devで表示
Top / Marketplaces / Detail / Stats / Methodology / About / Submit が開く
mobile確認済み
```

---

## 11. Terminal gate

実装中、以下を通す。

```txt
npm run build
npm run validate
npm run generate:stats
```

必要なら:

```txt
npm run check
npm run lint
```

合格条件:

```txt
build errorなし
validation errorなし
stats count不一致なし
未参照event/evidenceなし
重複slugなし
```

---

## 12. Browser gate

最低確認幅:

```txt
desktop: 1440px
laptop: 1280px
tablet: 768px
mobile: 390px
narrow mobile: 360px
```

確認ページ:

```txt
/
/marketplaces/
/marketplace/x2y2/
/stats/
/methodology/
/about/
/submit/
```

確認項目:

```txt
headerが破綻しない
cardsが読める
filtersが邪魔にならない
FactGridが崩れない
WhatRemainsBlockが目立つ
Statsが縦長すぎない
Longformが読める
```

---

## 13. v0 public acceptance criteria

公開前の合格条件。

```txt
[ ] HEIと別物の見た目になっている
[ ] Topが表紙として成立している
[ ] 30〜50 recordsが入っている
[ ] detail pageが全record分生成される
[ ] evidenceが表示される
[ ] what_is_gone / what_remains が表示される
[ ] stats pageが動く
[ ] methodology/about/submitがある
[ ] build/validateが通る
[ ] mobile 360pxで致命的崩れがない
[ ] no DB/APIで動く
[ ] Cloudflare Pagesで表示できる
```

---

## 14. やらないこと

v0ではやらない。

```txt
ログイン
ユーザー投稿DB
コメント
レーティング
NFT価格/出来高取得
各marketplaceロゴ収集
NFT画像収集
スクリーンショット大量保存
D1/KV/R2利用
リアルタイム監視
多言語化
dark mode
有料機能
```

---

## 15. 次に作る成果物

この実装計画の次は以下。

```txt
07-minted-and-gone-v0-seed-selection.md
```

内容:

```txt
v0に入れる30〜50件の選定
優先順位
調査順
batch分け
各候補の最低確認source方針
```

その後:

```txt
08-minted-and-gone-codex-implementation-task.md
```

内容:

```txt
Codex / GitHub作業用の具体タスク指示書
```

---

## 16. 最終結論

Minted & Gone は、HTMLモックの方向性を採用し、Astroベースの静的サイトとして実装する。

v0の中心は以下。

```txt
静的JSON
静的detail page生成
軽い検索・フィルタ
What is gone / What remains の明確表示
巻末統計風stats
Cloudflare Pages無料運営
```

次の実作業は、実装前に **v0 seed選定** を固定すること。  
その後、Codex/GitHub作業用の実装タスク文を作り、実装に入る。

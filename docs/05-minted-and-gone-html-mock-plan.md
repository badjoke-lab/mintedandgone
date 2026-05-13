# 05-minted-and-gone-html-mock-plan.md

# Minted & Gone HTML Mock Plan

Status: draft / pre-implementation visual mock plan  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`, `02-minted-and-gone-schema-stats-ready.md`, `03-minted-and-gone-methodology.md`, `04-minted-and-gone-candidates.md`, `04.5-minted-and-gone-mock-seed.md`  
Output target: `minted-and-gone-html-mock.html`  
Core rule: This mock is for visual and layout validation, not production implementation.

---

## 0. この文書の役割

この文書は、Minted & Gone の実装前に作る HTMLモックの範囲・目的・確認項目を固定する。

この段階では、まだ本番実装に入らない。

HTMLモックの目的は以下。

```txt
DESIGN.md の方向性がHTML/CSSで成立するか確認する
HEIと別物に見えるか確認する
mock seed 12件で一覧・詳細・statsが成立するか確認する
PC / tablet / mobileで破綻しないか確認する
実装前にページ構成の手戻りを減らす
```

---

## 1. 作成する成果物

この段階で作る成果物は2つ。

```txt
05-minted-and-gone-html-mock-plan.md
minted-and-gone-html-mock.html
```

補助データ:

```txt
mock-data/mock-marketplaces.json
mock-data/mock-events.json
mock-data/mock-evidence.json
mock-data/mock-stats.json
```

ただし、HTMLモックは単体で見られるようにするため、必要なmock dataはHTML内にも埋め込んでよい。

---

## 2. HTMLモックの形式

## 2.1 ルーティングはしない

実装前の確認用なので、複数ページのルーティングは不要。

1つのHTMLに以下のページ相当を並べる。

```txt
Top page section
Marketplaces list section
Marketplace detail section
Stats preview section
Methodology / About longform section
Submit / correction section
```

## 2.2 1ファイル構成

HTMLモックは以下を1ファイルにまとめる。

```txt
HTML
CSS
minimal JavaScript
mock data
```

理由:

```txt
ブラウザで直接開いて確認できる
GitHubに貼る前に単体レビューできる
CSS方針を一目で確認できる
```

---

## 3. HTMLモックで作る画面

## 3.1 Top page

役割:

```txt
表紙
図鑑の入口
サイトの世界観を伝える
```

表示するもの:

```txt
Header
Hero / book cover
Browse the encyclopedia cards
Featured records
Recently gone
Archive at a glance
About teaser
Footer
```

確認項目:

```txt
絵本・百科事典・図鑑の方向性が出るか
NFT投資サイトに見えないか
Marketplacesへの導線が分かるか
```

---

## 3.2 Marketplaces list page

役割:

```txt
図鑑の索引
全recordを検索・フィルタして探す画面
```

表示するもの:

```txt
Search box
Status filters
Category filters
Chain filters
Active filter summary
Marketplace cards
Empty state
```

確認項目:

```txt
12件のmock seedがカードで自然に並ぶか
status chipが分かるか
category / chain / scope が読めるか
カード密度が高すぎないか
mobileで巨大化しないか
```

---

## 3.3 Marketplace detail page

役割:

```txt
1 marketplace の図鑑ページ
what is gone / what remains を見せる
```

表示するもの:

```txt
Breadcrumb
Record hero
Status chips
FactGrid
What is gone / What remains / Where users or assets went
URL / Archive block
Timeline
Evidence list
Related marketplace placeholder
Correction prompt
```

確認項目:

```txt
詳細ページがHEIの監査台帳に見えないか
図鑑の1項目に見えるか
What remains が自然に読めるか
Evidenceが隠れすぎていないか
```

---

## 3.4 Stats preview page

役割:

```txt
将来の /stats の軽い見本
```

表示するもの:

```txt
KPI cards
Status breakdown
Category breakdown
Scope breakdown
Archive coverage
Quality flags preview
```

確認項目:

```txt
HEIほど硬すぎず、図鑑の巻末統計に見えるか
statsが重いダッシュボードに見えないか
データ品質・coverageが伝わるか
```

---

## 3.5 Methodology / About longform page

役割:

```txt
巻末解説
はじめに
判定基準の説明
```

表示するもの:

```txt
How to read this guide
What counts as an NFT marketplace
Status definitions
Evidence and confidence
Stats note
Disclaimer
```

確認項目:

```txt
長文ページが読みやすいか
余白・章見出し・定義カードが効いているか
AboutとMethodologyの雰囲気が合うか
```

---

## 4. 使用するmock records

HTMLモックでは `04.5-minted-and-gone-mock-seed.md` の12件を使う。

```txt
OpenSea
Blur
Magic Eden
Kraken NFT
X2Y2
Hic et Nunc
Teia
KnownOrigin
GameStop NFT
Quix
Coinbase NFT
Example Unknown Market
```

この12件で以下を確認する。

```txt
active
inactive
dead
acquired
unknown
aggregator
CEX feature
art curated
brand marketplace
chain-specific
community fork
```

---

## 5. デザイン実装方針

## 5.1 色

DESIGN.mdのwarm paper paletteを使う。

```txt
ivory / warm paper background
charcoal / brown-black text
forest green
redwood
muted gold
bluegreen
violet
```

## 5.2 フォント

外部フォントは使わない。

```txt
H1/H2: Georgia / serif fallback
body/UI: system sans-serif
```

## 5.3 装飾

使う:

```txt
paper cards
classification tags
book-cover hero
thin decorative rules
small line icons / emoji-level symbols if lightweight
```

使わない:

```txt
large NFT artwork grid
neon
black dashboard
heavy animation
glassmorphism
```

---

## 6. インタラクション

HTMLモックでは最小限のJSを使う。

実装する:

```txt
search filter
status filter
category filter
chain filter
card click updates detail preview
clear filters
```

実装しない:

```txt
real routing
API fetch
persistent state
URL query sync
complex chart library
```

---

## 7. Responsive behavior

## Desktop

```txt
Top hero: 2-column
Marketplaces: filter sidebar + cards
Detail: 2-column facts / story layout
Stats: grid
Longform: centered narrow column
```

## Tablet

```txt
Hero collapses gradually
Cards 2-column
Detail becomes 1-column if narrow
```

## Mobile

```txt
1-column
Filters as stacked chips
Cards compact
FactGrid 1-column
Stats cards 2-column or 1-column
Longform full-width
```

---

## 8. HTMLモック合格条件

```txt
[ ] HEIに見えない
[ ] NFT投資ランキングに見えない
[ ] 図鑑/百科事典/絵本方向に見える
[ ] Top pageが表紙に見える
[ ] 一覧カードが読みやすい
[ ] detailで What is gone / What remains が目立つ
[ ] evidenceが確認できる
[ ] statsが巻末統計に見える
[ ] mobileで破綻しない
[ ] CSS中心で軽い
[ ] 実装に移せる構造になっている
```

---

## 9. HTMLモック後の判断

HTMLモック確認後、次のどれかを行う。

```txt
A. デザインOK → 実装計画へ進む
B. デザイン修正 → DESIGN.mdを修正
C. データ表示不足 → schemaまたはmock seedを修正
D. statsが重すぎる → stats pageをv0.5へ後回し
E. detailが弱い → What remains blockを再設計
```

---

## 10. 最終結論

次に作るHTMLモックは、実装ではなく visual / layout / IA validation である。

作るもの:

```txt
minted-and-gone-html-mock.html
```

含めるもの:

```txt
Top
Marketplaces
Detail
Stats preview
Methodology/About
Submit correction
```

これを確認してから、正式な実装計画とv0 seed JSON化へ進む。

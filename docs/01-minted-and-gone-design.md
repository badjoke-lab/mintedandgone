# 01-minted-and-gone-design.md

# Minted & Gone DESIGN.md

Status: draft / visual source of truth  
Project: Minted & Gone  
Scope: visual design, layout, UI components, responsive behavior, implementation-facing design rules  
Depends on: `00-minted-and-gone-v0-spec.md`  
Primary direction: illustrated encyclopedia / picture book / field guide  
Core rule: HEI と同じ見た目にしない

---

## 0. この文書の役割

この文書は、Minted & Gone の **見た目・レイアウト・UIコンポーネント・レスポンシブ挙動の source of truth** である。

この文書が決めるもの:

- 全体のビジュアル方針
- HEIとの差別化ルール
- 色
- タイポグラフィ
- 余白
- レイアウト
- カード
- タグ
- 詳細ページの見せ方
- longformページの見せ方
- モバイル崩し方
- CSS実装時の設計指針
- 使ってよい装飾 / 禁止する装飾
- v0合格条件

この文書が決めないもの:

- データスキーマ
- status の定義
- evidence ルール
- 掲載対象の判定
- seed データ
- 自動収集パイプライン

それらは別仕様で扱う。

---

## 1. デザインコンセプト

## 1.1 一言コンセプト

```txt
A warm field guide to NFT marketplaces — living, fading, and gone.
```

日本語では:

```txt
生きている、消えかけた、消えた NFT マーケットプレイスを収集・分類・観察する図鑑。
```

## 1.2 デザインの3本柱

Minted & Gone の見た目は、次の3要素を混ぜる。

```txt
絵本 = 親しみ、余白、物語感
百科事典 = 整理、信頼感、参照しやすさ
図鑑 = 分類、観察、コレクション感
```

## 1.3 目指す感覚

ユーザーが開いた瞬間に、以下を感じること。

```txt
これはNFT投資サイトではない
これはただの墓場サイトでもない
NFTマーケットの図鑑・記録帳だ
消えたものにも物語がある
現役も死んだものも同じ棚で見られる
```

## 1.4 デザインキーワード

```txt
warm
paper-like
field guide
storybook
encyclopedia
archive
catalogue
index
specimen card
chapter page
quietly playful
soft but structured
```

---

## 2. HEIとの差別化ルール

## 2.1 HEI側の性格

HEI は以下の方向。

```txt
暗い
硬い
監査的
台帳的
dense table
quiet registry
crypto exchange historical registry
```

## 2.2 Minted & Gone側の性格

Minted & Gone は以下の方向。

```txt
明るい
紙っぽい
図鑑的
カード中心
章立て
索引的
少し物語感がある
分類して眺める楽しさがある
```

## 2.3 禁止事項

Minted & Gone では禁止する。

```txt
HEIと同じ黒背景・密テーブル中心UI
Vercel風の無機質な黒白UI
取引所監査台帳風
Web3ネオン
サイバーパンク
NFT投資・価格ランキング風
大型NFT画像グリッド中心UI
過度なグラデーション
glassmorphism
派手なアニメーション
トレーディングダッシュボード風
```

## 2.4 必ず守る差別化

```txt
テーブルよりカード/図鑑索引を優先する
黒背景ではなく紙色を基本にする
status は柔らかい分類札として見せる
詳細ページは dossier ではなく図鑑の1項目にする
Methodology は監査文書ではなく巻末解説にする
About はサービス説明ではなく「はじめに」にする
```

---

## 3. 全体トーン

## 3.1 トーン

```txt
暖かい
落ち着いている
軽いノスタルジー
少し手触りがある
信頼できる
読み物として疲れない
分類が気持ちいい
```

## 3.2 避けるトーン

```txt
暗すぎる
怖すぎる
墓場感が強すぎる
煽りが強い
NFTバブルっぽい
投資情報っぽい
子供向けに寄りすぎる
装飾過多
```

## 3.3 死んだマーケットの扱い

Dead / closed / gone を扱うが、ホラーにしない。

良い方向:

```txt
標本
古いページ
閉じた章
消えた棚
アーカイブ
記録
```

悪い方向:

```txt
墓石だらけ
血や骸骨
過剰な死の演出
詐欺暴露サイト風
煽り見出し
```

---

## 4. カラーパレット

## 4.1 基本方針

- 紙色をベースにする
- 文字は真っ黒ではなく濃いチャコール / ブラウンブラック
- status 色は柔らかく、分類札として使う
- 原色・ネオン色は禁止
- NFTらしさは色ではなく、構造と言葉で出す

## 4.2 推奨CSS変数

```css
:root {
  --bg: #f4ecd9;
  --bg-soft: #fbf6ea;
  --paper: #fffaf0;
  --paper-deep: #efe3c8;
  --ink: #2d261b;
  --ink-soft: #5f5445;
  --muted: #867765;
  --line: #d8c7a7;
  --line-soft: #eadcc2;

  --forest: #3f6f58;
  --forest-soft: #dce9de;
  --gold: #b8893d;
  --gold-soft: #f2e2bb;
  --redwood: #9b5549;
  --redwood-soft: #ead1ca;
  --bluegreen: #427d83;
  --bluegreen-soft: #d8eaeb;
  --violet: #7b6b8f;
  --violet-soft: #e4deed;
  --grayblue: #667987;
  --grayblue-soft: #dfe7eb;

  --danger: #a33f35;
  --danger-soft: #ead0cc;

  --shadow-soft: 0 10px 28px rgba(61, 45, 24, 0.10);
  --shadow-card: 0 14px 38px rgba(61, 45, 24, 0.14);

  --radius-lg: 28px;
  --radius-md: 18px;
  --radius-sm: 12px;
}
```

## 4.3 背景

基本背景:

```txt
#f4ecd9 / warm parchment
```

セクション背景:

```txt
#fffaf0 / paper card
#fbf6ea / light page
#efe3c8 / chapter contrast
```

## 4.4 status 色

```txt
active     = forest green
limited    = dusty gold / amber
inactive   = gray blue
 dead       = redwood / muted brick
acquired   = bluegreen
merged     = bluegreen + neutral
rebranded  = muted violet
unknown    = warm gray
```

CSS例:

```css
.status-active {
  background: var(--forest-soft);
  color: var(--forest);
  border-color: rgba(63, 111, 88, 0.28);
}

.status-limited {
  background: var(--gold-soft);
  color: #7b5f22;
  border-color: rgba(184, 137, 61, 0.32);
}

.status-dead {
  background: var(--redwood-soft);
  color: var(--redwood);
  border-color: rgba(155, 85, 73, 0.30);
}
```

## 4.5 リンク色

通常リンク:

```txt
bluegreen
```

Archive link:

```txt
forest or bluegreen with small archive icon
```

危険URL:

```txt
redwood / danger
直接リンクしない
```

## 4.6 色の使用比率

```txt
背景・紙色: 70%
文字・罫線: 20%
アクセント: 8%
警告色: 2%
```

---

## 5. タイポグラフィ

## 5.1 基本方針

- 見出しは図鑑・本の章タイトル感
- 本文は読みやすさ優先
- UIラベルは小さく整理
- 装飾書体を使いすぎない
- 外部フォント依存は最小限

## 5.2 推奨フォント方針

無料運営・軽量性を優先し、v0 は system font で開始してよい。

```css
--font-body: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-display: Georgia, "Times New Roman", serif;
```

ただし、完全にクラシックに寄せすぎると読みにくい。  
そのため、実装では以下を基本にする。

```txt
H1/H2: serif寄りまたはserif fallback
body/UI: system sans-serif
labels: system sans-serif uppercase/small caps風
```

## 5.3 見出し

### H1

用途:

```txt
トップヒーロー
ページタイトル
詳細ページのmarketplace名
```

指定:

```css
font-size: clamp(40px, 7vw, 88px);
line-height: 0.95;
letter-spacing: -0.04em;
font-family: var(--font-display);
font-weight: 700;
```

### H2

用途:

```txt
章タイトル
Browse the encyclopedia
Recently gone
How to read this guide
```

指定:

```css
font-size: clamp(26px, 4vw, 44px);
line-height: 1.05;
letter-spacing: -0.03em;
font-family: var(--font-display);
```

### H3

用途:

```txt
カード群の小見出し
詳細ページの各セクション
```

指定:

```css
font-size: 20px;
line-height: 1.2;
font-weight: 700;
```

## 5.4 本文

```css
font-size: 16px;
line-height: 1.7;
color: var(--ink-soft);
```

Longformでは:

```css
font-size: 17px;
line-height: 1.8;
max-width: 760px;
```

## 5.5 ラベル

```css
font-size: 12px;
line-height: 1;
letter-spacing: 0.08em;
text-transform: uppercase;
font-weight: 700;
color: var(--muted);
```

---

## 6. 余白・レイアウト

## 6.1 全体幅

推奨:

```txt
max-width: 1180px〜1240px
```

トップのヒーローは広めにしてよい。  
本文ページは狭める。

```css
.page-shell {
  width: min(calc(100% - 32px), 1220px);
  margin-inline: auto;
}

.longform-shell {
  width: min(calc(100% - 32px), 860px);
  margin-inline: auto;
}
```

## 6.2 セクション間隔

```css
section {
  margin-block: 56px;
}

@media (max-width: 720px) {
  section {
    margin-block: 36px;
  }
}
```

## 6.3 カード内余白

```txt
small card: 16px〜20px
medium card: 22px〜28px
hero card: 32px〜48px
```

## 6.4 密度

HEIより余白を取る。  
ただし、SaaS LPのように空白だらけにしない。

```txt
トップ = 余白多め
一覧 = 中密度
詳細 = 中密度 + 読み物感
methodology/about = 読みやすさ優先
```

---

## 7. 表面・枠線・影

## 7.1 紙面パネル

基本カード:

```css
.paper-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
}
```

## 7.2 図鑑カード

```css
.field-card {
  background: linear-gradient(180deg, #fffaf0 0%, #f8efd9 100%);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.field-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}
```

hoverは軽く。大きく動かさない。

## 7.3 枠線

枠線は重要。  
図鑑・カード・分類札の雰囲気を出す。

使う:

```txt
thin border
dashed divider
small ornamental rule
section underline
```

使わない:

```txt
太い黒枠だらけ
漫画風の強すぎる枠
glass border
neon border
```

## 7.4 装飾罫

章見出し下に細い罫線を置いてよい。

```css
.chapter-rule {
  height: 1px;
  background: linear-gradient(90deg, var(--line), transparent);
}
```

---

## 8. アイコン・装飾

## 8.1 方針

画像を大量に使わず、CSSと軽いSVGで世界観を作る。

使ってよい:

```txt
小さな本アイコン
虫眼鏡
分類札
紙片
羽ペン風ではない軽い線画
星ではなく小さな印
archive icon
link icon
```

使わない:

```txt
大量のNFT画像
マーケットロゴ大量保存
派手な3Dアイコン
スカル / 墓石の多用
NFT猿系の連想
過度な手書き風
```

## 8.2 イラスト

v0 では大きなイラストを必須にしない。

許可:

```txt
トップに軽い本・棚・カードの抽象イラスト
各ページに小さな章アイコン
空状態の小さな挿絵
```

禁止:

```txt
ページごとに重い画像背景
各marketplaceのロゴ保存
AI生成画像を大量配置
```

---

## 9. コンポーネント仕様

## 9.1 SiteHeader

## 役割

サイト全体の主要ナビ。

## 表示項目

```txt
Minted & Gone
Marketplaces
Methodology
About
Submit
```

## 見た目

```txt
紙面上部の章ナビ
軽い罫線
sticky可
背景は半透明紙色でもよい
```

## 挙動

- desktop: 横並び
- mobile: ロゴ + menu button または折り返し
- active page を下線または小さな札で表示
- Submit は強すぎないCTA

## CSS方向

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: rgba(244, 236, 217, 0.88);
  border-bottom: 1px solid var(--line-soft);
}
```

---

## 9.2 Hero / BookCover

## 役割

トップページで「図鑑である」と伝える。

## 表示項目

```txt
Minted & Gone
短いtagline
説明文
primary CTA
secondary CTA
小さな分類/記録モチーフ
```

## 見た目

```txt
本の表紙
紙の見開き
大きな余白
serif見出し
柔らかい分類札
```

## 禁止

```txt
暗いWeb3 hero
価格チャート
NFT画像グリッド
派手なCTAボタン
```

---

## 9.3 BrowseCard

## 役割

トップページの探索入口。

## 種類

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

## 表示項目

```txt
title
short description
count if available
small icon
```

## 挙動

クリックで `/marketplaces` にクエリ付き遷移。

例:

```txt
/marketplaces?status=dead
/marketplaces?category=art_curated
```

---

## 9.4 MarketplaceCard

## 役割

一覧ページの基本単位。  
図鑑の「1項目」として見せる。

## 表示項目

```txt
canonical_name
status chip
category chip
chain tags
years
summary short
frontend/contract mini status
View record
archive indicator if available
```

## 見た目

```txt
標本カード
紙片
分類札
ほどよい影
角丸大きめ
```

## 挙動

- カード全体クリックで詳細へ
- `View record` も詳細へ
- archive link は別クリック
- status chip は将来フィルタリンク化可

## compact variant

モバイル・一覧密度を上げる場合:

```txt
Name + chips
summary 1-2 lines
years + chain + what remains mini line
```

---

## 9.5 StatusChip

## 役割

status を分類札として表示。

## 値

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

## 形

```css
.status-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid currentColor;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}
```

## 注意

- 色だけで意味を伝えない
- 必ずテキストを出す
- mobileでも読めるサイズにする

---

## 9.6 ChainTag / CategoryTag

## 役割

図鑑の分類ラベル。

## 見た目

- status chip より控えめ
- 紙の小ラベル風
- borderあり
- 背景は薄い

## 例

```txt
Ethereum
Solana
Tezos
Bitcoin Ordinals
Art curated
Aggregator
Gaming
```

---

## 9.7 FactGrid

## 役割

詳細ページの基本情報。

## 表示項目

```txt
Status
Category
Chain
Launch date
End date
Closure reason
Frontend status
Contract status
Asset status
Confidence
Last verified
```

## 見た目

```txt
小さな標本ラベルのグリッド
label + value
2〜3列
mobileは1列
```

---

## 9.8 WhatRemainsBlock

## 役割

Minted & Gone の中核差別化コンポーネント。

## 表示項目

```txt
What is gone?
What remains?
Where did users or assets go?
```

## 見た目

```txt
3枚の紙片カード
または1つの大きな見開きブロック
```

## 重要度

詳細ページでは Timeline より上に置く。  
このサイトがただのリストではないことを示すため。

---

## 9.9 URL / Archive Block

## 役割

公式URL・archive・危険URLを安全に見せる。

## 表示項目

```txt
Original URL
Domain
URL status
Archived URL
```

## dead系表示

- archived URL を main action にする
- original URL は史料表示
- unsafe / repurposed / dead_domain は直接リンクしない

## 見た目

```txt
小さな注意付きの資料カード
archive linkは青緑またはforest
unsafeはredwood warning
```

---

## 9.10 Timeline

## 役割

marketplace の履歴を時系列で見せる。

## 見た目

```txt
図鑑の観察記録
日付 + event chip + title + short description
```

## 禁止

```txt
派手な縦線アニメーション
事件性を煽る演出
```

## 並び

```txt
event_date asc
sort_order asc
```

---

## 9.11 EvidenceList

## 役割

根拠を表示する。

## 見た目

```txt
巻末注 / 参考文献
小さめ
情報密度高め
```

## 表示項目

```txt
title
publisher
published_at
source_type
reliability
claim_scope
archive link
```

## 注意

- evidence は目立たせすぎないが、隠さない
- reliability を表示する
- archive がある場合は見えるようにする

---

## 9.12 LongformPage

## 役割

Methodology / About / Submit 共通の文章ページ。

## 見た目

```txt
本の巻末
読みやすい本文幅
章見出し
定義カード
比較表
注釈欄
```

## 本文幅

```txt
680〜820px
```

## longformで使う要素

```txt
section heading
paragraph
definition card
table
note callout
small illustration optional
```

---

## 10. ページ別デザイン仕様

---

## 10.1 `/` Top Page

## 役割

表紙 + 図鑑の入口。

## 見た目

```txt
大きな本の表紙
warm paper background
大きなserif見出し
分類カード
featured cards
軽い数値ブロック
```

## 構成

```txt
Header
Hero / book cover
Browse the encyclopedia
Featured records
Recently gone / updated
Archive at a glance
About teaser
Footer
```

## 重要ルール

- 全件一覧をトップに置かない
- 表紙感を優先する
- ただし装飾だけで終わらせず、Marketplacesへの導線を強くする

---

## 10.2 `/marketplaces`

## 役割

図鑑索引。

## PC layout

```txt
Left: filters
Center: cards / index list
Right: optional guide / selected preview
```

v0では右カラム省略可。

## Mobile layout

```txt
Search
Filter toggle
Active filter summary
Cards
```

## 見た目

```txt
索引ページ
カード一覧
分類札
棚から探す感覚
```

## 禁止

```txt
HEI風テーブルのみ
巨大NFT画像グリッド
ランキング順位表示
```

---

## 10.3 `/marketplace/[slug]`

## 役割

図鑑の1項目。

## 見た目

```txt
見開きページ
左: identity / facts
右: what remains / timeline
下: evidence
```

PCでは2カラム気味にしてよい。  
Mobileでは完全縦積み。

## 重要表示順

```txt
Hero
Facts
What is gone / What remains
URL / Archive
Overview
Timeline
Evidence
Related
Correction
```

## 重要ルール

- What remains を上部に置く
- Timelineより先にNFT特有の残存状態を見せる
- Evidenceは必ず表示する

---

## 10.4 `/methodology`

## 役割

巻末の分類ルール。

## 見た目

```txt
百科事典の巻末解説
章番号風
定義カード
比較表
注釈欄
```

## 必須セクション

```txt
How to read this guide
What counts as an NFT marketplace
What does not count
Status definitions
Frontend / contract / asset status
Closure and transition reasons
URL and archive handling
Evidence rules
Confidence levels
Uncertainty and revisions
Corrections
Disclaimer
```

---

## 10.5 `/about`

## 役割

図鑑の「はじめに」。

## 見た目

```txt
短い前書き
大きめの余白
小さな説明カード
柔らかい本文
```

## methodologyとの差

- About は柔らかい
- Methodology は定義中心
- About は短くてよい
- Methodology は詳しくてよい

---

## 10.6 `/submit`

## 役割

修正・追加候補の入口。

## 見た目

```txt
案内ページ
紙のメモ風
Submit correction CTA
GitHub Issue CTA
必要な情報のチェックリスト
```

## CTA

強すぎる販売ボタン風にしない。  
分類帳への協力依頼として見せる。

---

## 11. レスポンシブ仕様

## 11.1 ブレークポイント

```css
--bp-mobile: 720px;
--bp-tablet: 960px;
--bp-desktop: 1200px;
```

## 11.2 Desktop

- header 横並び
- top hero は2カラム可
- marketplaces は filter + cards
- detail は2カラム可
- longform は中央読み幅

## 11.3 Tablet

- hero は1〜2カラム
- filters は上部または左に残す
- detail は1カラム寄り

## 11.4 Mobile

- 1カラム
- header は簡略化
- filters は折りたたみ
- cards はcompact
- facts は1列
- timeline/evidence は縦積み
- longform は本文幅100%

## 11.5 Mobileで削らない情報

削ってはいけない:

```txt
status
category
chain
what remains
confidence
archive/evidence導線
```

削ってよい/折りたたんでよい:

```txt
long notes
related marketplaces
advanced filters
evidence詳細メタ
```

---

## 12. インタラクション仕様

## 12.1 Hover

- カードは少し浮く
- リンクは下線または色変化
- status chip は大きく動かさない

## 12.2 Focus

必須。

```css
:focus-visible {
  outline: 3px solid rgba(66, 125, 131, 0.45);
  outline-offset: 3px;
}
```

## 12.3 Motion

v0では最小限。

許可:

```txt
hover lift
small opacity transition
filter open/close
```

禁止:

```txt
parallax
large page transition
scroll animation多用
animated counters
canvas animation
```

## 12.4 reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 13. 検索・フィルタUI

## 13.1 Search input

見た目:

```txt
紙面上の検索欄
角丸
薄い罫線
虫眼鏡アイコン optional
```

## 13.2 Filter panel

分類棚のように見せる。

項目:

```txt
Status
Category
Chain
```

Advanced:

```txt
Frontend status
Contract status
Asset status
Closure reason
Confidence
```

## 13.3 Active filter summary

表示例:

```txt
Showing Dead + Limited · Ethereum · Art curated
```

## 13.4 Clear filters

空状態・filter summary に表示。

---

## 14. 空状態 / エラー状態

## 14.1 Empty results

文言:

```txt
No marketplace records match these filters.
Try clearing filters, or suggest a missing marketplace.
```

見た目:

```txt
小さな紙片
虫眼鏡 or 空の棚の軽い線画
Clear filters
Submit suggestion
```

## 14.2 Missing detail

```txt
This marketplace record could not be found.
Return to the encyclopedia.
```

## 14.3 Data incomplete callout

詳細ページやmethodologyで使用。

```txt
This record may be incomplete. If you know reliable sources, submit a correction.
```

---

## 15. SEO / OGP視覚方針

## 15.1 OGP画像

v0では共通OGP 1枚でよい。

方向:

```txt
paper background
Minted & Gone title
small classification cards
field guide style
no heavy NFT art
```

## 15.2 favicon

方向:

```txt
small book
M&G monogram
classification tag
```

---

## 16. アクセシビリティ

## 16.1 色

- status は色だけで区別しない
- 文字ラベル必須
- contrast を確保

## 16.2 HTML

- semantic headings
- nav / main / footer
- button と link を正しく使う
- cards 全体クリックでも内部リンクの重複に注意

## 16.3 キーボード

- filter 操作可能
- focus visible
- skip link 推奨

## 16.4 画像

- 装飾画像は `alt=""`
- 意味のある図は alt を入れる
- 重要テキストを画像化しない

---

## 17. パフォーマンス

## 17.1 基本方針

無料運営を壊さない。

守る:

```txt
CSS中心
軽いSVGのみ
画像最小
外部フォント最小
JS最小
```

## 17.2 禁止

```txt
大量画像背景
marketplaceロゴ大量保存
NFT画像の外部ホットリンク
重いアニメーション
クライアントで巨大JSONを何度もfetch
```

## 17.3 推奨

```txt
single CSS bundle
static generated pages
small index JSON
lazy load optional sections only if needed
```

---

## 18. 実装用CSS構造案

```txt
styles/
  tokens.css
  base.css
  layout.css
  components.css
  pages.css
```

## 18.1 tokens.css

- colors
- radius
- shadows
- spacing
- breakpoints

## 18.2 base.css

- reset
- typography
- body background
- link
- focus

## 18.3 layout.css

- shell
- grid
- longform
- responsive helpers

## 18.4 components.css

- header
- footer
- cards
- chips
- filters
- fact grid
- timeline
- evidence

## 18.5 pages.css

- top page
- marketplaces
- detail
- longform

---

## 19. 実装コンポーネント一覧

```txt
SiteHeader
SiteFooter
BookHero
BrowseCard
ArchiveAtGlance
MarketplaceCard
StatusChip
CategoryTag
ChainTag
FilterPanel
SearchBox
ActiveFilterSummary
FactGrid
WhatRemainsBlock
UrlArchiveBlock
Timeline
TimelineEvent
EvidenceList
EvidenceItem
RelatedMarketplaces
LongformPage
DefinitionCard
NoteCallout
SubmitPrompt
EmptyState
```

---

## 20. ページ別合格条件

## 20.1 Top

```txt
開いた瞬間に図鑑/本の入口に見える
NFT投資サイトに見えない
Marketplacesへの導線が明確
Featured / Recently gone がカードで見える
```

## 20.2 Marketplaces

```txt
検索・フィルタが分かる
カードが図鑑項目に見える
status/category/chainが一目で分かる
モバイルでも探せる
```

## 20.3 Detail

```txt
何のmarketplaceか分かる
statusが分かる
What is gone / What remains が分かる
timelineが読める
evidenceが確認できる
archive導線が安全に表示される
```

## 20.4 Methodology

```txt
巻末解説に見える
定義が読める
status/closure/evidenceの意味が分かる
長文でも疲れない
```

## 20.5 About

```txt
なぜ存在するか分かる
柔らかいが曖昧すぎない
Methodologyとの差がある
```

## 20.6 Submit

```txt
何を送ればよいか分かる
Google Form / GitHub Issue へ迷わず進める
強すぎるCTAではない
```

---

## 21. v0でやらないデザイン

```txt
dark mode
複数テーマ
大型イラストシステム
各marketplace専用画像
ロゴ収集
カード反転アニメーション
timelineアニメーション
3D表現
リアルタイムチャート
statsダッシュボード
```

---

## 22. 将来拡張時のデザイン方針

## 22.1 `/stats`

図鑑の統計ページとして作る。

```txt
派手なdashboardではなく、巻末統計ページ
bar / table / small chart 中心
```

## 22.2 `/timeline`

歴史年表として作る。

```txt
古い年表
章ごとの時代区切り
marketplace cardsへの導線
```

## 22.3 `/chains`

チェーン別の棚として作る。

```txt
Ethereum shelf
Solana shelf
Tezos shelf
Ordinals shelf
```

## 22.4 Multi-language

英語rootを基本にし、将来日本語を足す場合も図鑑トーンを維持する。

---

## 23. デザイン検証チェックリスト

実装前/実装後に確認する。

```txt
[ ] HEIに見えない
[ ] 黒い監査台帳に見えない
[ ] NFT投資ランキングに見えない
[ ] トップが表紙に見える
[ ] 一覧が図鑑索引に見える
[ ] 詳細が図鑑の1項目に見える
[ ] Methodologyが巻末解説に見える
[ ] 紙色ベースになっている
[ ] statusが色だけに依存していない
[ ] モバイルでカードが巨大化しすぎていない
[ ] evidenceが隠れすぎていない
[ ] archive導線が安全に見える
[ ] 画像なしでも成立する
[ ] CSS中心で再現できる
[ ] 無料運営を壊す重さになっていない
```

---

## 24. 最終結論

Minted & Gone のデザインは、HEIの派生UIではない。

```txt
HEI = quiet registry / dark archival index
Minted & Gone = warm illustrated encyclopedia / field guide
```

v0では、紙・図鑑カード・分類札・巻末解説・見開き感をCSS中心で再現する。

最優先は、以下の3点である。

```txt
1. 開いた瞬間にNFT marketplace図鑑だと分かる
2. 詳細で What is gone / What remains が自然に読める
3. 無料運営を壊さない軽量な実装で成立する
```

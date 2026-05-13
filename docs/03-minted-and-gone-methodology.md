# 03-minted-and-gone-methodology.md

# Minted & Gone Methodology

Status: draft / classification and publication methodology  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`, `02-minted-and-gone-schema-stats-ready.md`  
Scope: target rules, status rules, evidence rules, confidence rules, URL/archive handling, uncertainty handling, stats interpretation  
Core rule: Do not force certainty. If the evidence is weak, use `unknown`, `inactive`, `needs_review`, or lower confidence.

---

## 0. この文書の役割

この文書は、Minted & Gone に掲載する NFT marketplace をどう判定し、どう分類し、どう公開するかを定義する。

この文書が決めるもの:

- 何を NFT marketplace として扱うか
- 何を対象外にするか
- `active / limited / inactive / dead / acquired / merged / rebranded / unknown` の判定基準
- NFT marketplace 特有の `frontend_status / contract_status / asset_status` の判定基準
- `closure_reason` の使い分け
- URL / archive の扱い
- evidence の優先順位
- confidence の付け方
- date precision の扱い
- review_status / record_quality_flags の使い方
- stats ページで数字を読むときの注意点
- 修正・更新・異議申し立ての扱い
- disclaimer

この文書は、サイト上では `/methodology` ページの元になる。  
また、v0候補リスト作成時の判定基準として使う。

---

## 1. Minted & Gone の基本姿勢

Minted & Gone は、NFT marketplace の現在状態と歴史的変化を記録する図鑑型の歴史台帳である。

Minted & Gone が記録するのは、単なる「いま使えるNFTマーケット一覧」ではない。

記録するもの:

```txt
いつ始まったか
どのようなNFT marketplaceだったか
現在も使えるか
機能が縮小したか
閉鎖したか
買収・統合・リブランドされたか
フロントエンドは残っているか
コントラクトは参照できるか
NFTやユーザー資産は残っているか
後継・移管先があるか
どの根拠でそう判断しているか
```

Minted & Gone の中心的な問いはこれである。

```txt
What is gone?
What remains?
Where did users or assets go?
```

日本語では:

```txt
何が消えたのか。
何が残っているのか。
ユーザーや資産はどこへ行ったのか。
```

---

## 2. What counts as an NFT marketplace

## 2.1 対象にするもの

Minted & Gone で扱う NFT marketplace は、原則として以下を満たすものとする。

```txt
独立した名前・ブランドがある
公式URLまたはarchiveで実体を確認できる
NFTの売買・出品・入札・二次流通・mint販売のいずれかが中核機能である
active / limited / inactive / dead / acquired / merged / rebranded のいずれかに分類できる
根拠となるsourceを示せる
```

## 2.2 入れる対象

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
brand marketplace with meaningful marketplace behavior
historical marketplace that later closed
marketplace absorbed by another service
marketplace rebranded into another service
community-forked marketplace
```

## 2.3 条件付きで入れる対象

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

条件付き対象を入れる場合は、`marketplace_scope` と `notes` に理由を残す。

例:

```txt
marketplace_scope = launchpad_marketplace
notes = Initially a mint platform, but included because it later supported marketplace-style secondary trading.
```

---

## 3. What does not count

## 3.1 原則対象外

以下は原則として対象外。

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

## 3.2 out_of_scope の判断

次のどれかに該当する場合は、掲載しないか `possible_out_of_scope` として保留する。

```txt
ユーザー間売買が確認できない
marketplace名として独立していない
一時的なmintキャンペーンにすぎない
公式URLやarchiveがない
collectionやgalleryとの区別ができない
状態判定に必要な根拠がない
```

## 3.3 判断に迷う場合

迷った場合は、無理に掲載しない。

候補リスト上では以下の扱いにする。

```txt
review_status = needs_review
record_quality_flags includes possible_out_of_scope
confidence = low
```

公開レコードにする場合も、notes で対象性が曖昧であることを明記する。

---

## 4. Status definitions

Minted & Gone の主 status は以下である。

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

## 4.1 active

`active` は、中核的な marketplace 機能が現在も利用可能な状態。

判定例:

```txt
出品できる
購入できる
入札できる
二次流通できる
mint販売またはmarketplace機能が現役
公式サイトが稼働している
公式または現在ページで稼働確認できる
```

注意:

- 過去に買収されたが、現在も同じ marketplace として動いている場合は `active` とし、買収は event として記録する。
- 過去にインシデントがあっても、現在の中核機能が動いていれば `active` にできる。

## 4.2 limited

`limited` は、一部機能だけが残っている状態。

判定例:

```txt
withdrawal-only
閲覧のみ
移管のみ
購入停止
出品停止
mint停止
secondary saleのみ
一部チェーンのみ稼働
終了予定だが猶予期間中
```

使う場面:

```txt
完全な dead ではない
ユーザーがまだ何らかの操作をできる
ただし通常の marketplace とは言えない
```

## 4.3 inactive

`inactive` は、実質的に活動していないが、完全終了とは断定できない状態。

判定例:

```txt
公式更新が長期間止まっている
取引・出品・入札の実態が見えない
サイトは残っているが機能が不明
閉鎖告知はない
archiveや外部情報から停止気味だが dead と断定できない
```

重要ルール:

```txt
閉鎖根拠が弱い場合は dead にしない。
inactive に逃がす。
```

## 4.4 dead

`dead` は、marketplace としての中核機能が終了した状態。

判定例:

```txt
公式終了告知がある
サービス終了日が示されている
売買・出品・入札ができない
公式サイトが消滅している
親会社や運営が終了を発表している
移管期限・withdrawal期間が終了している
```

注意:

NFT marketplace では、marketplace が dead でも NFT や smart contract が残ることがある。  
その場合でも、marketplace operation が終了していれば `dead` にできる。

## 4.5 acquired

`acquired` は、買収によって独立した marketplace としての扱いが変わった状態。

使う場面:

```txt
買収後に旧marketplaceが終了した
買収先に吸収された
旧ブランドの独立性が失われた
買収後に機能が大きく縮小された
```

使わない場面:

```txt
買収されたが現在も同じブランドで通常稼働している
```

その場合は:

```txt
status = active
event_type = acquired
```

## 4.6 merged

`merged` は、別サービスへ統合され、旧 marketplace が独立して存在しなくなった状態。

判定例:

```txt
顧客・アカウント・作品・マーケット機能が別サービスへ統合
旧URLが後継サービスへ誘導
旧ブランドが独立ページとして終了
```

## 4.7 rebranded

`rebranded` は、後継ブランドが明確に存在する状態。

判定例:

```txt
名称変更
プロダクト名変更
旧URLが新ブランドへ移行
公式が後継名を示している
```

注意:

- ただのデザイン刷新では `rebranded` にしない。
- 後継名・後継サービスが明確な場合のみ使う。

## 4.8 unknown

`unknown` は、状態判定に必要な根拠が不足している場合に使う。

使う場面:

```txt
公式情報がない
サイト状態が確認できない
外部情報が矛盾している
対象性はあるが現状不明
```

重要ルール:

```txt
unknown は失敗ではない。
不確実なものを正確そうに見せないための安全な分類である。
```

---

## 5. Status decision tree

候補を見つけたら、次の順で判定する。

## 5.1 対象性

```txt
1. NFT marketplace と言えるか？
2. 単なるcollection / mint / galleryではないか？
3. 公式URLまたはarchiveはあるか？
4. 根拠sourceはあるか？
```

対象性が弱い場合:

```txt
review_status = needs_review
record_quality_flags includes possible_out_of_scope
```

## 5.2 現在状態

```txt
1. 現在も売買・出品・入札できるか？
   yes -> active

2. 一部機能のみ残っているか？
   yes -> limited

3. 公式終了・閉鎖・売買不可が確認できるか？
   yes -> dead / acquired / merged / rebranded を検討

4. 買収・統合・リブランドの明確な後継があるか？
   yes -> acquired / merged / rebranded

5. 活動が見えないが終了根拠が弱いか？
   yes -> inactive

6. どれも判断できないか？
   yes -> unknown
```

## 5.3 status 優先順位

複数に見える場合は以下で判断する。

```txt
rebranded: 後継ブランドが明確
merged: 別サービスへの統合が明確
acquired: 買収により独立性を失った
dead: marketplace operation が終了し、後継/統合より閉鎖扱いが自然
limited: 一部機能が残る
inactive: 実質停止気味だが断定不可
active: 中核機能が現役
unknown: 判定不能
```

---

## 6. NFT-specific auxiliary statuses

NFT marketplace では、主 status だけでは不十分である。

必ず以下を補助的に見る。

```txt
frontend_status
contract_status
asset_status
```

---

## 6.1 frontend_status

```txt
active
limited
dead
redirected
unknown
not_applicable
```

### active

公式UIが通常利用できる。

### limited

閲覧・移管・一部機能のみ利用できる。

### dead

公式UIが消滅、または利用不能。

### redirected

旧URLが別サービス・後継ブランド・親会社ページへ誘導される。

### unknown

確認できない。

### not_applicable

独立した frontend を持たない、または frontend を評価対象にしない。

---

## 6.2 contract_status

```txt
accessible
partially_accessible
deprecated
unknown
not_applicable
```

### accessible

関連コントラクトが参照可能、またはオンチェーン上で残っていることが確認できる。

### partially_accessible

一部だけ参照可能。

### deprecated

旧コントラクト化、非推奨化、後継コントラクトへ移行。

### unknown

コントラクト状態が未確認。

### not_applicable

CEX系NFT marketplaceなど、コントラクト評価が直接適用しにくい。

---

## 6.3 asset_status

```txt
user_assets_remain
migrated
withdrawal_required
lost_or_unclear
not_applicable
unknown
```

### user_assets_remain

NFTや関連資産がユーザーウォレット等に残る。

### migrated

後継サービス・別marketplace・別コントラクトへ移行。

### withdrawal_required

ユーザー側で移管・withdrawal・claim が必要だった。

### lost_or_unclear

資産状態が不明、または問題がある可能性がある。

### not_applicable

対象外。

### unknown

確認できない。

---

## 6.4 補助statusの表示方針

詳細ページでは主 status より下に、必ず以下を表示する。

```txt
Marketplace status
Frontend status
Contract status
Asset status
```

これにより、次のようなNFT特有の状態を表現できる。

```txt
Marketplace: dead
Frontend: dead
Contract: accessible
Assets: user_assets_remain
```

---

## 7. Closure and transition reasons

`closure_reason` は、終了・移行・縮小の主な理由を示す。

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

## 7.1 market_decline

NFT市場低迷、取引量低下、需要減少が主な理由と確認できる場合。

## 7.2 funding_failure

資金難、運営資金不足、事業継続困難が主な理由の場合。

## 7.3 parent_company_shutdown

親会社・親サービスの終了や方針転換が主な理由の場合。

## 7.4 acquisition_winddown

買収後の統合・縮小・終了が主な理由の場合。

## 7.5 regulatory_pressure

規制・法務・コンプライアンス要因が主な理由の場合。

## 7.6 security_incident

ハック、不正流出、脆弱性、重大インシデントが主因の場合。

## 7.7 voluntary_shutdown

運営側が自主的な終了を発表した場合。

## 7.8 rebrand

後継ブランドへの移行が中心の場合。

## 7.9 merge

別サービスへの統合が中心の場合。

## 7.10 community_fork

公式は終了したが、コミュニティ版や派生サービスが継続した場合。

## 7.11 unknown

理由が不明な場合。

## 7.12 not_applicable

active など終了理由が不要な場合。

---

## 8. Marketplace category and scope

Minted & Gone では、`category` と `marketplace_scope` を分ける。

```txt
category = 何を主に扱ったmarketplaceか
marketplace_scope = どのような形態のmarketplaceか
```

## 8.1 category

例:

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

## 8.2 marketplace_scope

例:

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

## 8.3 使い分け例

```txt
OpenSea:
  category = general
  marketplace_scope = standalone_marketplace

Blur:
  category = general
  marketplace_scope = aggregator or standalone_marketplace depending on record decision

Kraken NFT:
  category = cex_nft_market
  marketplace_scope = cex_feature

Hic et Nunc:
  category = art_curated or chain_specific
  marketplace_scope = standalone_marketplace
```

---

## 9. Origin handling

## 9.1 country_or_origin

`country_or_origin` は自由記述に近い表示用フィールド。

例:

```txt
United States
Global
Ethereum ecosystem
Tezos ecosystem
unknown
```

## 9.2 origin_bucket

`origin_bucket` は stats 用の分類。

```txt
country
global
chain_ecosystem
company_origin
region
unknown
other
```

## 9.3 なぜ分けるか

NFT marketplace は、通常の企業国籍だけでは整理しにくい。

混ざりやすいもの:

```txt
会社所在地
創業地
チェーンecosystem
グローバル運営
CEX親会社の所在地
プロトコル起点
```

そのため、stats では `origin_bucket` を使い、表示では `country_or_origin` を使う。

---

## 10. URL and archive handling

## 10.1 URL status

```txt
live_verified
live_unverified
dead_domain
redirected
repurposed
unsafe
unknown
```

## 10.2 active / limited のURL表示

active / limited の場合:

```txt
official_url_status = live_verified なら通常リンク
official_url_status = live_unverified なら注意付きリンク
unknown は未確認表示
```

## 10.3 dead / acquired / merged / rebranded のURL表示

closed-side の場合:

```txt
original URL は史料として表示
archived URL を優先表示
unsafe / repurposed / dead_domain は直接リンクを避ける
redirected は旧URLと遷移先を分けて説明する
```

## 10.4 archive の優先度

archive は、closed-side records で特に重要。

優先:

```txt
公式閉鎖告知のarchive
旧公式トップページのarchive
終了告知ページのarchive
サービス説明ページのarchive
サポート記事のarchive
```

## 10.5 unsafe URL

`official_url_status = unsafe` の場合:

```txt
通常リンクにしない
警告付きで表示する
可能ならarchiveだけを案内する
```

---

## 11. Evidence rules

## 11.1 evidence の基本方針

Minted & Gone は、根拠を持つ歴史台帳である。  
各 record は、できる限り evidence によって状態を説明する。

## 11.2 source priority

信頼度の優先順位:

```txt
1. official statement
2. official blog / support article
3. parent company / acquirer announcement
4. regulatory / court / government source
5. archived official page
6. credible news article
7. reputable database / directory
8. community reference
9. social post / forum reference
```

## 11.3 dead / shutdown records

closed-side records では、原則として2本以上の evidence を目標にする。

望ましい構成:

```txt
公式またはarchive 1本
信頼できる二次情報 1本
```

最低ライン:

```txt
公式または信頼できるsource 1本 + notesで不確実性を明示
```

## 11.4 active records

active records は、dead records ほど厚くなくてよい。

最低ライン:

```txt
公式サイトまたは公式ページ
現在稼働を示すsource
```

ただし、公開するなら evidence 1本以上は必須。

## 11.5 acquired / merged / rebranded records

必要な根拠:

```txt
買収・統合・リブランドを示すsource
旧marketplaceとの連続性を示すsource
旧URLまたは旧ブランドのarchive
```

## 11.6 community reference

コミュニティ投稿だけで dead / scam / shutdown を断定しない。

使える用途:

```txt
候補発見
補助的な時系列
archive探索の手がかり
不確実性のnotes
```

使えない用途:

```txt
単独根拠でdead確定
単独根拠で詐欺扱い
単独根拠で資産喪失扱い
```

---

## 12. Evidence source types

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

## 12.1 source_type の使い方

- 公式ページ: `official_statement`, `official_blog`, `support_article`, `marketplace_page`
- 親会社や買収先: `company_announcement`
- 規制当局: `regulatory_notice`
- Wayback等: `archive_capture`
- 報道: `news_article`
- DBやdirectory: `database_reference`
- X/Discord/forum等: `community_reference`

---

## 13. Reliability rules

```txt
high
medium
low
```

## 13.1 high

```txt
公式発表
公式サポート記事
親会社・買収先の発表
規制当局・裁判所文書
archived official page
複数の信頼できる報道
```

## 13.2 medium

```txt
信頼できる業界メディア
広く使われるdatabase / directory
公式ではないが複数sourceで整合する情報
```

## 13.3 low

```txt
コミュニティ投稿
フォーラム
個人ブログ
SNS投稿
根拠の弱いdirectory
```

---

## 14. Confidence rules

Record 全体の confidence は、source の強さと判定の確実性で決める。

```txt
high
medium
low
```

## 14.1 high confidence

条件:

```txt
公式または一次sourceがある
statusが明確
重要日付が確認できる
archiveまたは複数sourceで補強されている
```

## 14.2 medium confidence

条件:

```txt
公式sourceは弱いが、信頼できる二次sourceがある
statusはおおむね判断できる
日付や理由の一部が不確実
```

## 14.3 low confidence

条件:

```txt
sourceが薄い
状態判定に推定が含まれる
公式sourceが見つからない
対象性がやや曖昧
```

low confidence の場合は、必ず `notes` または `record_quality_flags` で理由を残す。

---

## 15. Date precision rules

不明な日付を正確に見せない。

使う値:

```txt
exact
month
year
approximate
unknown
```

## 15.1 exact

日付まで確認できる。

## 15.2 month

年月まで確認できる。

## 15.3 year

年のみ確認できる。

## 15.4 approximate

おおよその時期のみ。

## 15.5 unknown

不明。

## 15.6 禁止事項

```txt
年しか分からないのに YYYY-01-01 として exact 扱いする
推定終了日を shutdown_effective の exact date にする
外部記事の日付をサービス終了日と混同する
```

---

## 16. Review status and quality flags

stats対応のため、各 record は `review_status` と `record_quality_flags` を持つ。

---

## 16.1 review_status

```txt
seed
reviewed
needs_review
needs_update
deprecated
```

### seed

初期seed。まだ公開品質レビュー前。

### reviewed

公開品質としてレビュー済み。

### needs_review

対象性・status・根拠などに確認が必要。

### needs_update

古い可能性があり、再確認が必要。

### deprecated

古い設計・重複・別recordへ移行済みなど。

---

## 16.2 record_quality_flags

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

## 16.3 quality flags の使い方

quality flags は、公開を止めるためだけではない。  
statsページで補完状況を見せるためにも使う。

例:

```txt
record_quality_flags = ["single_source", "missing_archive"]
```

意味:

```txt
掲載はできるが、今後の補完対象である
```

---

## 17. Stats methodology

Minted & Gone の `/stats` は、市場ランキングではない。  
データ台帳としての構成・品質・歴史的傾向を見るページである。

## 17.1 statsで見るもの

```txt
status別件数
active-side / faded-side / dead-side
category別件数
marketplace_scope別件数
chain別件数
origin_bucket別件数
closure_reason別件数
frontend_status別件数
contract_status別件数
asset_status別件数
official_url_status別件数
confidence別件数
review_status別件数
record_quality_flags別件数
launch year分布
end year分布
lifespan分布
archive coverage
evidence depth
evidence source_type別件数
evidence reliability別件数
event_type別件数
last_verified freshness
record completeness
```

## 17.2 statsで見ないもの

```txt
NFT価格
floor price
出来高
ユーザー数
取引量ランキング
market share
投資スコア
```

## 17.3 statsの注意点

stats は canonical data の状態を反映する。

つまり:

```txt
掲載済みrecordsの集計であり、NFT marketplace 全体の完全な母集団ではない
record数が少ない時期の比率は参考値
unknown が多い場合は、未確認の多さも含めて読む
```

## 17.4 archive coverage の意味

archive coverage は、全marketplaceのうち archived_url を持つ割合である。

ただし:

```txt
archiveがない = 根拠がない ではない
archiveがある = 完全に検証済み ではない
```

## 17.5 confidence share の意味

high confidence share は、強い根拠を持つrecordの割合である。

ただし:

```txt
low confidence record も価値がないわけではない
low confidence は補完・確認対象を示す
```

---

## 18. Uncertainty policy

Minted & Gone は、不確実な情報を無理に断定しない。

## 18.1 不明は unknown にする

```txt
分からない場合は unknown
断定できない場合は inactive / needs_review / low confidence
```

## 18.2 dead 判定は慎重にする

dead は強い分類である。

以下だけでは dead にしない。

```txt
SNS更新が止まっている
取引量が少ない
サイトが一時的に落ちている
コミュニティが dead と言っている
古いdirectoryに載っていない
```

## 18.3 notes に残す

不確実性は `notes` に残す。

例:

```txt
Official shutdown notice not found. Classified as inactive due to lack of visible marketplace activity and unavailable primary interface.
```

---

## 19. Correction and revision policy

Minted & Gone の record は更新される。

## 19.1 修正対象

```txt
status
closure_reason
launch/end date
URL status
archive URL
evidence
confidence
what remains
asset migration
successor/predecessor
```

## 19.2 correction に必要な情報

```txt
marketplace name
existing page URL if any
what should be corrected
source URL
archive URL if available
optional note
```

## 19.3 修正時の扱い

修正が入った場合:

```txt
last_verified_at を更新
notes に必要なら変更理由を書く
confidence を見直す
review_status を見直す
record_quality_flags を見直す
```

---

## 20. Publication rules

## 20.1 Public-ready の最低条件

v0 public preview に出す record は、最低限以下を満たす。

```txt
対象性が説明できる
statusが仮でも決まっている
summaryがある
最低1つのevidenceがある
last_verified_atがある
confidenceがある
review_statusがある
record_quality_flagsがある
```

## 20.2 dead / closed-side の推奨条件

```txt
2 evidence以上
archiveあり
what_is_goneあり
what_remainsあり
end_dateまたはend_yearあり
closure_reasonあり
```

## 20.3 seed の扱い

初期seedでは `review_status = seed` を許可する。  
ただし、公開前に主要recordsは `reviewed` へ上げることを目指す。

---

## 21. Page structure for `/methodology`

サイト表示上の methodology ページは以下の章立てにする。

```txt
1. How to read this guide
2. What counts as an NFT marketplace
3. What does not count
4. Status definitions
5. Frontend / contract / asset status
6. Closure and transition reasons
7. Category, scope, and origin
8. URL and archive handling
9. Evidence rules
10. Confidence levels
11. Dates and uncertainty
12. Stats methodology
13. Corrections and revisions
14. Disclaimer
```

---

## 22. Disclaimer

Minted & Gone は投資助言・法的助言・セキュリティ評価ではない。

表示文:

```txt
Minted & Gone is a historical registry and field guide. It does not provide investment advice, legal advice, security ratings, or real-time marketplace availability guarantees. Records are based on available sources and may be incomplete or revised as better evidence becomes available.
```

日本語メモ:

```txt
Minted & Gone は歴史台帳・図鑑であり、投資助言、法的助言、セキュリティ評価、リアルタイム稼働保証を提供するものではない。掲載情報は入手可能なsourceに基づき、今後修正される可能性がある。
```

---

## 23. Methodology acceptance checklist

この文書は以下を満たす必要がある。

```txt
[ ] NFT marketplace の対象範囲が明確
[ ] 対象外が明確
[ ] status の使い分けが明確
[ ] acquired / merged / rebranded と active event の違いが明確
[ ] frontend / contract / asset status が説明されている
[ ] closure_reason の使い分けが明確
[ ] evidence 優先順位が明確
[ ] confidence の基準が明確
[ ] uncertainty を無理に埋めない方針がある
[ ] stats の読み方が説明されている
[ ] correction policy がある
[ ] disclaimer がある
```

---

## 24. 最終結論

Minted & Gone の methodology は、単なる説明文ではない。

これは、候補を掲載するか、どのstatusにするか、どの根拠を採用するか、どの数字をstatsに出すかを決めるための運用基準である。

最重要ルールは以下である。

```txt
不確実なものを無理に断定しない。
NFT marketplace は frontend が消えても、contract や assets が残る場合がある。
Minted & Gone は、その差を記録する。
```

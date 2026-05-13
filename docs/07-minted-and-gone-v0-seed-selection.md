# 07-minted-and-gone-v0-seed-selection.md

# Minted & Gone v0 Seed Selection

Status: draft / pre-research seed selection  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`, `02-minted-and-gone-schema-stats-ready.md`, `03-minted-and-gone-methodology.md`, `04-minted-and-gone-candidates.md`, `06-minted-and-gone-implementation-plan.md`  
Scope: v0 seed target, selected candidates, batch order, research rules, JSON conversion plan  
Core rule: This is not canonical data. Status and dates remain provisional until source review.

---

## 0. この文書の役割

この文書は、Minted & Gone v0 public preview に入れる seed records を選定するための計画書である。

この文書は正式な `marketplaces.json` ではない。  
ここで決めるのは、どの候補を優先調査し、どの順番で JSON 化するかである。

この文書で決めるもの:

- v0 seed の目標件数
- v0に入れる候補
- active / closed / transitioned / inactive のバランス
- batch分け
- 各batchの調査目的
- 各候補で最低限確認するsource
- JSON化の進め方
- v0公開前の合格条件

この文書でやらないこと:

- 各候補の最終status確定
- 正式な evidence URL 確定
- archive URL の完全取得
- 本番 `marketplaces.json / events.json / evidence.json` の作成

---

## 1. v0 seed target

v0 public preview の目標件数は以下。

```txt
minimum: 30 records
recommended: 45 records
maximum for v0: 50 records
```

本計画では、まず **45 records** を目標にする。

理由:

```txt
30件だとstatsとカテゴリ棚が弱い
50件を超えると初回調査が重い
45件なら active / dead / acquired / chain-specific / CEX / art / gaming を一通り見せられる
```

---

## 2. v0 balance target

v0は active だけでも dead だけでも弱い。  
以下のバランスで進める。

```txt
active major / active baseline: 15
closed / dead / sunset: 18
acquired / merged / rebranded / community continuation: 7
inactive / unclear / needs-review: 5
Total: 45
```

## 2.1 Why this balance

```txt
active records = 現役との比較軸
closed records = Minted & Gone の主価値
transition records = NFT特有の移行・買収・継承を見せる
inactive records = 不確実性を無理にdead化しない方針を見せる
```

---

## 3. v0 selected candidates

以下は v0 seed 用の選定候補である。  
`provisional_status` は仮分類であり、正式statusではない。

| # | Name | provisional_status | category | marketplace_scope | chain_scope | priority | v0 reason |
|---:|---|---|---|---|---|---|---|
| 1 | OpenSea | active | general | standalone_marketplace | multi_chain | high | Active baseline / largest reference point |
| 2 | Blur | active | general | aggregator | ethereum | high | Active pro-trading / aggregator contrast |
| 3 | Magic Eden | active | general | standalone_marketplace | multi_chain | high | Multi-chain baseline, Solana/Bitcoin relevance |
| 4 | Tensor | active | general | standalone_marketplace | solana | high | Solana active marketplace baseline |
| 5 | Rarible | active | general | standalone_marketplace | multi_chain | high | Long-running marketplace baseline |
| 6 | LooksRare | active | general | standalone_marketplace | ethereum | medium | Ethereum marketplace and token-era example |
| 7 | Foundation | active | art_curated | standalone_marketplace | ethereum | high | Art marketplace baseline |
| 8 | SuperRare | active | art_curated | standalone_marketplace | ethereum | high | Curated art marketplace baseline |
| 9 | Zora | active | launchpad_marketplace | protocol_ui | multi_chain | high | Mint / protocol / marketplace boundary case |
| 10 | OpenSea Pro | active | aggregator | aggregator | ethereum | medium | Aggregator lineage / Gem successor angle |
| 11 | OKX NFT | active | cex_nft_market | cex_feature | multi_chain | medium | CEX-operated active example |
| 12 | Binance NFT | active | cex_nft_market | cex_feature | multi_chain | medium | Major CEX NFT baseline |
| 13 | Crypto.com NFT | active | cex_nft_market | cex_feature | multi_chain | medium | CEX / brand-operated active comparison |
| 14 | NBA Top Shot | active | sports | brand_marketplace | flow | high | Custodial sports marketplace baseline |
| 15 | Sorare | active | sports | standalone_marketplace | ethereum | high | Sports/fantasy marketplace baseline |
| 16 | Kraken NFT | dead | cex_nft_market | cex_feature | multi_chain | high | CEX NFT shutdown / withdrawal pattern |
| 17 | Bybit NFT | dead | cex_nft_market | cex_feature | multi_chain | high | CEX NFT shutdown comparison |
| 18 | Nifty Gateway | dead | art_curated | standalone_marketplace | ethereum | high | High-profile pioneer closure |
| 19 | KnownOrigin | acquired | art_curated | standalone_marketplace | ethereum | high | Acquisition / winddown pattern |
| 20 | MakersPlace | dead | art_curated | standalone_marketplace | ethereum | high | Art marketplace closure candidate |
| 21 | Async Art | dead | art_curated | standalone_marketplace | ethereum | high | Art/platform closure candidate |
| 22 | X2Y2 | dead | general | standalone_marketplace | ethereum | high | Frontend gone / contract remains pattern |
| 23 | Hic et Nunc | dead | art_curated | standalone_marketplace | tezos | high | Frontend gone / community continuation case |
| 24 | GameStop NFT | dead | gaming | brand_marketplace | ethereum | high | Brand marketplace shutdown |
| 25 | FTX NFTs | dead | cex_nft_market | cex_feature | multi_chain | high | Exchange collapse-related NFT marketplace |
| 26 | LG Art Lab | dead | brand_marketplace | brand_marketplace | hedera | medium | Brand marketplace closure / asset migration angle |
| 27 | DraftKings Marketplace | dead | sports | brand_marketplace | polygon | medium | Sports/brand marketplace lifecycle |
| 28 | Hyperspace | dead | aggregator | aggregator | solana | high | Solana aggregator shutdown case |
| 29 | Quix | dead | chain_specific | standalone_marketplace | optimism | high | L2 marketplace sunset case |
| 30 | Voice NFT | dead | art_curated | standalone_marketplace | other | medium | NFT platform shutdown candidate |
| 31 | RECUR | dead | brand_marketplace | brand_marketplace | multi_chain | high | Brand NFT platform shutdown / migration angle |
| 32 | Teia | active | art_curated | community_fork | tezos | high | Hic et Nunc continuation / successor contrast |
| 33 | Genie | acquired | aggregator | aggregator | ethereum | high | Acquired aggregator / transition record |
| 34 | Gem | duplicate_or_alias | aggregator | aggregator | ethereum | medium | Predecessor/alias for OpenSea Pro lineage |
| 35 | Fractal | acquired | gaming | game_marketplace | solana | medium | Gaming marketplace acquisition/transition |
| 36 | Objkt | active | chain_specific | standalone_marketplace | tezos | high | Tezos active baseline |
| 37 | fxhash | active | art_curated | standalone_marketplace | tezos | high | Tezos generative art baseline |
| 38 | Exchange.Art | active | art_curated | standalone_marketplace | solana | medium | Solana art marketplace baseline |
| 39 | Axie Marketplace | active | gaming | game_marketplace | ronin | high | Gaming marketplace baseline |
| 40 | Immutable Marketplace | active | gaming | game_marketplace | immutable | high | Gaming ecosystem marketplace baseline |
| 41 | Decentraland Marketplace | active | metaverse_land | metaverse_marketplace | ethereum | high | Metaverse land marketplace baseline |
| 42 | The Sandbox Marketplace | active | metaverse_land | metaverse_marketplace | ethereum | high | Metaverse marketplace baseline |
| 43 | Coinbase NFT | inactive | cex_nft_market | cex_feature | ethereum | high | Inactive / uncertainty policy test |
| 44 | Solanart | inactive | chain_specific | standalone_marketplace | solana | medium | Early Solana marketplace lifecycle candidate |
| 45 | CNFT.io | inactive | chain_specific | standalone_marketplace | cardano | medium | Early Cardano marketplace lifecycle candidate |

---

## 4. Batch plan

v0 seed は 45件を一気に作らない。  
5〜10件単位の batch で進める。

---

## Batch 1: Foundation active baselines

Target: 8 records

```txt
OpenSea
Blur
Magic Eden
Tensor
Rarible
Foundation
SuperRare
Zora
```

目的:

```txt
active record の基本形を作る
現役marketplaceでも evidence / status / frontend / contract / asset をどう書くか決める
Top / index / detail の見本にする
```

最低確認source:

```txt
公式サイト
公式docsまたはabout/support
現在のmarketplace機能が分かるページ
```

---

## Batch 2: High-value closed-side records

Target: 8 records

```txt
Kraken NFT
X2Y2
Nifty Gateway
KnownOrigin
MakersPlace
Async Art
GameStop NFT
RECUR
```

目的:

```txt
Minted & Gone の中心価値を作る
What is gone / What remains の実例を作る
closed-side detail page を完成させる
```

最低確認source:

```txt
公式終了告知またはsupport記事
archive
信頼できる報道または会社発表
```

推奨:

```txt
2 evidence以上
archived_urlあり
end_yearまたはend_dateあり
what_is_gone / what_remainsあり
```

---

## Batch 3: CEX NFT comparison

Target: 7 records

```txt
OKX NFT
Binance NFT
Crypto.com NFT
Kraken NFT
Bybit NFT
FTX NFTs
Coinbase NFT
```

注意:

```txt
Kraken NFT は Batch 2 と重複するため、作業上は再利用する。
```

目的:

```txt
CEX系NFT marketplaceのactive/dead/inactive比較を作る
CEX featureとしての marketplace_scope を確認する
asset_status / withdrawal_required の扱いを固める
```

最低確認source:

```txt
公式NFTページ
CEX support notice
closure / withdrawal notice
archive
```

---

## Batch 4: Tezos lineage and community continuation

Target: 5 records

```txt
Hic et Nunc
Teia
Objkt
fxhash
Kalamint or OneOf after research
```

目的:

```txt
frontend dead + community continuation の代表例を作る
successor/predecessor 表示を確認する
chain_ecosystem origin_bucket を使う
```

最低確認source:

```txt
archive
community/official continuation references
marketplace current page
credible explanatory source
```

---

## Batch 5: Solana / L2 / chain-specific lifecycle

Target: 7 records

```txt
Magic Eden
Tensor
Hyperspace
Solanart
Exchange.Art
Quix
CNFT.io
```

注意:

```txt
Magic Eden / Tensor は Batch 1 と重複するため、作業上は再利用する。
```

目的:

```txt
chain-specific marketplaceを増やす
Solana / Optimism / Cardano の棚を作る
active / inactive / dead の比較を作る
```

最低確認source:

```txt
公式サイトまたはarchive
shutdown/sunset notice if closed
current marketplace page if active
```

---

## Batch 6: Gaming / metaverse / sports / brand

Target: 10 records

```txt
Axie Marketplace
Immutable Marketplace
Decentraland Marketplace
The Sandbox Marketplace
NBA Top Shot
Sorare
DraftKings Marketplace
LG Art Lab
Fractal
Voice NFT
```

目的:

```txt
general/art/CEX以外の棚を成立させる
gaming / metaverse / sports / brand marketplaceを入れる
NFT marketplace の範囲が広すぎないか検証する
```

最低確認source:

```txt
公式marketplace page
support/FAQ
closure notice if closed
archive
credible news source if needed
```

---

## Batch 7: Final balancing batch

Target: 5〜7 records

候補:

```txt
LooksRare
OpenSea Pro
Gem
Genie
Bybit NFT
SolSea
DigitalEyes
JPG Store
AtomicHub
```

目的:

```txt
v0の不足カテゴリを補う
active/dead/transition/inactiveの比率を調整する
statsの偏りを減らす
```

---

## 5. De-duplication rules

## 5.1 Duplicate / alias handling

以下は特に注意する。

```txt
Gem / OpenSea Pro
Hic et Nunc / Teia / forks
VIV3 / BloctoBay / Flow marketplace lineage
collection-specific marketplace vs parent marketplace
protocol UI vs marketplace
```

## 5.2 Gem handling

Gem は v0で独立recordにするか、OpenSea Pro の predecessor として扱うかを調査後に決める。

初期方針:

```txt
Gem = duplicate_or_alias or acquired/predecessor candidate
OpenSea Pro = current/detail candidate
```

## 5.3 Hic et Nunc / Teia handling

初期方針:

```txt
Hic et Nunc = dead original marketplace
Teia = active/community continuation record
```

ただし、正式化前にlineage sourceを確認する。

---

## 6. Minimum source policy by record type

## 6.1 Active record

最低:

```txt
公式marketplace page 1本
公式docs/support/aboutのいずれか 1本が望ましい
```

必須判断:

```txt
現役marketplaceとして機能しているか
marketplace_scopeは何か
chain_scopeは何か
```

## 6.2 Dead / closed record

最低:

```txt
公式終了告知またはsupport記事 1本
archiveまたは報道 1本
```

可能なら:

```txt
2 evidence以上
archiveあり
end_dateまたはend_yearあり
what_is_gone / what_remainsあり
```

## 6.3 Acquired / merged / rebranded record

最低:

```txt
買収・統合・リブランドsource 1本
旧marketplaceとの連続性source 1本
旧URLまたはarchive
```

## 6.4 Inactive / unclear record

最低:

```txt
公式URLまたはarchive
状態不明を示すnotes
low confidence
review_status = needs_review
record_quality_flags includes weak_status_evidence
```

重要:

```txt
inactiveをdeadにしない
不確実な場合はunknown/inactiveで止める
```

---

## 7. JSON conversion order

正式JSON化は以下の順で行う。

```txt
1. marketplaces.json draft
2. events.json draft
3. evidence.json draft
4. validate-data
5. generate-stats
6. page rendering check
7. review_status / record_quality_flags adjustment
```

## 7.1 Per-record minimum JSON

各recordに最低限入れる。

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

closed-sideでは追加で必須寄り:

```txt
end_year or end_date
closure_reason
frontend_status
asset_status
what_is_gone
what_remains
where_users_or_assets_went
archived_url if available
```

## 7.2 Per-record event minimum

各recordに最低1 event。

代表:

```txt
launched
shutdown_announced
shutdown_effective
acquired
rebranded
community_forked
other
```

## 7.3 Per-record evidence minimum

各recordに最低1 evidence。  
closed-sideは2 evidence以上を目標。

---

## 8. v0 seed acceptance criteria

v0 seed JSON化の合格条件。

```txt
[ ] 30〜50 recordsある
[ ] active baselineが10件以上ある
[ ] closed-sideが15件以上ある
[ ] acquired/merged/rebranded/community continuationが5件以上ある
[ ] CEX系が5件以上ある
[ ] art curatedが5件以上ある
[ ] gaming/metaverse/sports/brandが合計8件以上ある
[ ] chain_scopeがEthereumだけに偏りすぎない
[ ] 全recordにeventが1件以上ある
[ ] 全recordにevidenceが1件以上ある
[ ] closed-sideの主要recordは2 evidence以上ある
[ ] stats.jsonが生成できる
[ ] validate-dataが通る
```

---

## 9. v0 selected records if 45 is too heavy

45件が重い場合は、最小30件に落とす。

## 9.1 Minimum 30 set

```txt
OpenSea
Blur
Magic Eden
Tensor
Rarible
Foundation
SuperRare
Zora
OKX NFT
Binance NFT
NBA Top Shot
Sorare
Kraken NFT
X2Y2
Nifty Gateway
KnownOrigin
MakersPlace
Async Art
GameStop NFT
RECUR
Hic et Nunc
Teia
Genie
Objkt
fxhash
Hyperspace
Quix
Axie Marketplace
Decentraland Marketplace
Coinbase NFT
```

## 9.2 30件版の目的

```txt
まず公開previewを成立させる
残り15件はv0.1追加batchへ回す
```

---

## 10. Next deliverable

この文書の次に作るもの。

```txt
08-minted-and-gone-codex-implementation-task.md
```

内容:

```txt
GitHub/Codexへ渡す実装指示書
Astro構成
ディレクトリ作成
mock data投入
HTMLモックのUI反映
build/validate/generate-stats scripts
terminal gate
browser gate
```

---

## 11. Final conclusion

v0 seed は **45件目標** で進める。  
ただし、初回公開を早める必要があれば **30件版** に落とせる。

作業は以下の順で進める。

```txt
1. 45件候補をbatchに分ける
2. Batch 1〜2を先に調査
3. activeとclosedの基本JSON形を固める
4. Batch 3以降を追加
5. 30件到達時点でpreview可能
6. 45件到達でv0 seed完成
```

重要なのは、1件ずつ延々と追加するのではなく、**5〜10件単位のbatchでJSON化すること**である。

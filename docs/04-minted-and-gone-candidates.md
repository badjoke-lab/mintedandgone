# 04-minted-and-gone-candidates.md

# Minted & Gone Candidate Plan

Status: draft / candidate pool, not canonical data  
Project: Minted & Gone  
Depends on: `00-minted-and-gone-v0-spec.md`, `01-minted-and-gone-design.md`, `02-minted-and-gone-schema-stats-ready.md`, `03-minted-and-gone-methodology.md`  
Scope: final record target, phase schedule, v0 candidate pool, v1/v2 expansion backlog, v3+ discovery lanes  
Core rule: This file is not `marketplaces.json`. It is a research queue.

---

## 0. この文書の役割

この文書は、Minted & Gone に掲載する NFT marketplace 候補を整理するための計画書である。

この文書は canonical data ではない。

この文書でやること:

- 最終的な全レコード数の見込みを決める
- phase別の到達件数を決める
- v0候補を具体名つきで広めに集める
- v1/v2で拡張する候補カテゴリを整理する
- v3以降の探索レーンを整理する
- 候補を `include_v0 / include_later / needs_research / out_of_scope / duplicate_or_alias` に分ける準備をする

この文書でやらないこと:

- 正式な entity/event/evidence JSON 作成
- 各候補の最終status確定
- evidence URL の完全検証
- archive URL の完全取得
- 全候補の公開品質レビュー

---

## 1. Final record target

Minted & Gone の最終的な実用到達目標は以下。

```txt
v0 public preview: 30〜50 records
v1 usable registry: 100〜150 records
v2 meaningful registry: 300 records
v3 strong registry: 500 records
mature version: 800〜1,000 records
extended ceiling: 1,200〜1,500 records
```

## 1.1 実用上の最終目標

最も現実的な成熟目標:

```txt
800〜1,000 records
```

この範囲なら、主要NFT marketplace、閉鎖済み、中堅、CEX系、チェーン特化、アート特化、ゲーム系、メタバース系、地域/カテゴリ特化までかなり拾える。

## 1.2 拡張上限

品質を維持した上限:

```txt
1,200〜1,500 records
```

これ以上は、以下が混ざりやすくなる。

```txt
単発mint page
collection-specific shop
game内だけの小規模shop
wallet内NFT機能
一時販売ページ
NFT gallery
NFT portfolio tool
```

そのため、2,000件以上を最初から目標にしない。

---

## 2. Phase schedule

## Phase 0: Planning and mock

Target:

```txt
0 canonical records
candidate pool and mock only
```

作業:

```txt
仕様書
DESIGN.md
schema
methodology
candidate plan
HTML mock
```

## Phase 1: v0 public preview

Target:

```txt
30〜50 records
```

狙い:

```txt
サイトとして成立するか確認
デザインとデータ構造を検証
what is gone / what remains の見せ方を確認
```

内訳目安:

```txt
active major: 10〜15
closed / dead / limited: 15〜25
acquired / merged / rebranded: 5〜10
unclear / inactive: 3〜5
```

## Phase 2: v1 usable registry

Target:

```txt
100〜150 records
```

狙い:

```txt
有名どころを一通り押さえる
closed-side recordsを厚くする
CEX系・アート特化・チェーン特化を拡張
```

## Phase 3: v2 meaningful registry

Target:

```txt
300 records
```

狙い:

```txt
statsページが意味を持ち始める
カテゴリ別・チェーン別の棚が成立する
NFT marketplace historical registry として独自性が出る
```

## Phase 4: v3 strong registry

Target:

```txt
500 records
```

狙い:

```txt
dead / inactive / acquired / rebranded の価値が強くなる
主要ecosystemを広くカバーする
調査対象として参照価値が出る
```

## Phase 5: Mature version

Target:

```txt
800〜1,000 records
```

狙い:

```txt
主要・中堅・閉鎖済み・地域/チェーン/カテゴリ特化まで広くカバー
statsが長期運用に耐える
補完対象と高品質recordsの差が見える
```

## Phase 6: Extended ceiling

Target:

```txt
1,200〜1,500 records
```

狙い:

```txt
境界事例もかなり含める
ただし possible_out_of_scope / needs_review が増える
品質管理が重くなる
```

---

## 3. Candidate status labels

候補リスト上の分類。

```txt
include_v0
include_later
needs_research
out_of_scope
duplicate_or_alias
```

## 3.1 include_v0

v0候補として優先。  
30〜50件のseedに入れる可能性が高い。

条件:

```txt
有名
status判定しやすい
根拠が取りやすい
Minted & Goneらしい what remains が書ける
カテゴリ/チェーン/状態のバランスに効く
```

## 3.2 include_later

v1/v2以降で追加する候補。

条件:

```txt
対象性は高い
ただしv0に入れる優先度は低い
調査量が多い
カテゴリ補強向き
```

## 3.3 needs_research

追加調査が必要。

条件:

```txt
対象性が少し曖昧
statusが不明
公式URLやarchiveが未確認
marketplaceかmint/collection/gatewayか不明
```

## 3.4 out_of_scope

Minted & Goneの対象外。

条件:

```txt
単なるNFT collection
単発mint page
NFT gallery
portfolio tracker
analytics tool
marketplace性がない
```

## 3.5 duplicate_or_alias

別候補の別名・統合先・旧名として扱う。

---

## 4. Candidate fields

候補リストでは、正式schemaより軽い形で管理する。

```txt
name
candidate_status
likely_status
category
marketplace_scope
chain_scope
priority
why_candidate
evidence_hint
notes
```

正式な `marketplaces.json` にはまだ変換しない。

---

## 5. v0 detailed candidate pool

このセクションは、v0の30〜50件を選ぶための広めの候補プールである。

目標:

```txt
80〜120 candidates
```

本版では **100件** を置く。  
ここから調査後に30〜50件へ絞る。

注意:

```txt
この表の likely_status は仮分類。
実際のstatusは調査後に methodology に従って決定する。
needs_research は失敗ではなく、調査待ちを意味する。
```

| # | Name | candidate_status | likely_status | category | marketplace_scope | chain_scope | priority | why_candidate / evidence hint |
|---:|---|---|---|---|---|---|---|---|
| 1 | OpenSea | include_v0 | active | general | standalone_marketplace | multi_chain | high | Major baseline active marketplace |
| 2 | Blur | include_v0 | active | general | aggregator | ethereum | high | Major trader-focused marketplace / aggregator |
| 3 | Magic Eden | include_v0 | active | general | standalone_marketplace | multi_chain | high | Major multi-chain marketplace, Solana/Bitcoin relevance |
| 4 | Tensor | include_v0 | active | general | standalone_marketplace | solana | high | Major Solana NFT marketplace |
| 5 | Rarible | include_v0 | active | general | standalone_marketplace | multi_chain | high | Long-running marketplace, useful baseline |
| 6 | LooksRare | include_v0 | active | general | standalone_marketplace | ethereum | high | Major Ethereum marketplace, token-era example |
| 7 | Foundation | include_v0 | active | art_curated | standalone_marketplace | ethereum | high | Art marketplace baseline |
| 8 | SuperRare | include_v0 | active | art_curated | standalone_marketplace | ethereum | high | Curated art marketplace baseline |
| 9 | Zora | include_v0 | active | launchpad_marketplace | protocol_ui | multi_chain | high | Mint/protocol/marketplace boundary case |
| 10 | Manifold | needs_research | active | launchpad_marketplace | launchpad_marketplace | ethereum | medium | Mint platform / gallery / marketplace boundary case |
| 11 | OpenSea Pro | include_v0 | active | aggregator | aggregator | ethereum | high | Aggregator example; formerly Gem lineage |
| 12 | Gem | duplicate_or_alias | acquired | aggregator | aggregator | ethereum | high | Historical aggregator acquired by OpenSea; alias/predecessor case |
| 13 | Genie | include_v0 | acquired | aggregator | aggregator | ethereum | high | Historical aggregator acquired by Uniswap |
| 14 | Reservoir | include_v0 | active | aggregator | aggregator | ethereum | high | Infrastructure/aggregator style candidate |
| 15 | Element | include_v0 | active | aggregator | aggregator | multi_chain | medium | NFT marketplace aggregator candidate |
| 16 | OKX NFT | include_v0 | active | cex_nft_market | cex_feature | multi_chain | high | CEX-operated NFT marketplace example |
| 17 | Binance NFT | include_v0 | active | cex_nft_market | cex_feature | multi_chain | high | Major CEX NFT marketplace example |
| 18 | Coinbase NFT | include_v0 | inactive | cex_nft_market | cex_feature | ethereum | high | Important CEX NFT marketplace lifecycle candidate |
| 19 | Crypto.com NFT | include_v0 | active | cex_nft_market | cex_feature | multi_chain | medium | CEX/brand-operated NFT marketplace example |
| 20 | Kraken NFT | include_v0 | dead | cex_nft_market | cex_feature | multi_chain | high | Strong withdrawal-only → dead case |
| 21 | Bybit NFT | include_v0 | dead | cex_nft_market | cex_feature | multi_chain | high | CEX NFT shutdown candidate |
| 22 | Nifty Gateway | include_v0 | dead | art_curated | standalone_marketplace | ethereum | high | High-profile pioneer closure |
| 23 | KnownOrigin | include_v0 | dead | art_curated | standalone_marketplace | ethereum | high | eBay acquisition / shutdown case |
| 24 | MakersPlace | include_v0 | dead | art_curated | standalone_marketplace | ethereum | high | Art marketplace closure candidate |
| 25 | Async Art | include_v0 | dead | art_curated | standalone_marketplace | ethereum | high | Art/platform shutdown candidate |
| 26 | X2Y2 | include_v0 | dead | general | standalone_marketplace | ethereum | high | Strong marketplace shutdown / contract remains case |
| 27 | Hic et Nunc | include_v0 | dead | art_curated | standalone_marketplace | tezos | high | Frontend gone / community continuation case |
| 28 | Teia | include_v0 | active | art_curated | community_fork | tezos | high | Hic et Nunc community continuation / fork lineage |
| 29 | Objkt | include_v0 | active | chain_specific | standalone_marketplace | tezos | high | Major Tezos marketplace |
| 30 | fxhash | include_v0 | active | art_curated | standalone_marketplace | tezos | high | Generative art marketplace candidate |
| 31 | Kalamint | needs_research | inactive | art_curated | standalone_marketplace | tezos | medium | Tezos art marketplace, status requires checking |
| 32 | OneOf | needs_research | inactive | music | standalone_marketplace | tezos | medium | Music/brand NFT marketplace candidate |
| 33 | Solanart | include_v0 | inactive | chain_specific | standalone_marketplace | solana | high | Early Solana marketplace lifecycle candidate |
| 34 | SolSea | include_v0 | inactive | chain_specific | standalone_marketplace | solana | high | Early Solana marketplace lifecycle candidate |
| 35 | DigitalEyes | include_v0 | inactive | chain_specific | standalone_marketplace | solana | high | Early Solana marketplace lifecycle candidate |
| 36 | Exchange.Art | include_v0 | active | art_curated | standalone_marketplace | solana | high | Solana art marketplace candidate |
| 37 | Hyperspace | include_v0 | dead | aggregator | aggregator | solana | high | Solana aggregator / shutdown candidate |
| 38 | Metaplex | needs_research | active | launchpad_marketplace | protocol_ui | solana | medium | Protocol/marketplace boundary; likely not normal marketplace |
| 39 | Fractal | include_v0 | acquired | gaming | game_marketplace | solana | high | Gaming NFT marketplace, acquisition/transition candidate |
| 40 | GameStop NFT | include_v0 | dead | gaming | brand_marketplace | ethereum | high | High-profile brand marketplace shutdown |
| 41 | FTX NFTs | include_v0 | dead | cex_nft_market | cex_feature | multi_chain | high | Exchange collapse-related NFT marketplace candidate |
| 42 | LG Art Lab | include_v0 | dead | brand_marketplace | brand_marketplace | hedera | high | Brand marketplace closure, asset migration angle |
| 43 | DraftKings Marketplace | include_v0 | dead | sports | brand_marketplace | polygon | high | Sports/brand marketplace lifecycle candidate |
| 44 | NBA Top Shot | include_v0 | active | sports | brand_marketplace | flow | high | Major custodial/brand marketplace baseline |
| 45 | NFL ALL DAY | include_v0 | active | sports | brand_marketplace | flow | medium | Sports marketplace candidate |
| 46 | UFC Strike | include_v0 | active | sports | brand_marketplace | flow | medium | Sports marketplace candidate |
| 47 | Sorare | include_v0 | active | sports | standalone_marketplace | ethereum | high | Sports/fantasy marketplace baseline |
| 48 | Candy Digital | include_v0 | active | collectibles | brand_marketplace | polygon | medium | Brand/sports/collectibles marketplace candidate |
| 49 | ThetaDrop | include_v0 | active | collectibles | standalone_marketplace | theta | medium | Chain-specific entertainment NFT marketplace candidate |
| 50 | VeVe | include_v0 | active | collectibles | brand_marketplace | immutable | medium | Collectibles marketplace candidate |
| 51 | Decentraland Marketplace | include_v0 | active | metaverse_land | metaverse_marketplace | ethereum | high | Metaverse land marketplace baseline |
| 52 | The Sandbox Marketplace | include_v0 | active | metaverse_land | metaverse_marketplace | ethereum | high | Metaverse land / assets marketplace baseline |
| 53 | Axie Marketplace | include_v0 | active | gaming | game_marketplace | ronin | high | Game marketplace baseline |
| 54 | Immutable Marketplace | include_v0 | active | gaming | game_marketplace | immutable | high | Gaming ecosystem marketplace baseline |
| 55 | Treasure Marketplace | include_v0 | active | gaming | game_marketplace | arbitrum | medium | Gaming ecosystem marketplace candidate |
| 56 | Enjin Marketplace | include_v0 | active | gaming | standalone_marketplace | other | medium | Gaming/NFT marketplace candidate |
| 57 | JPG Store | include_v0 | active | chain_specific | standalone_marketplace | cardano | high | Major Cardano NFT marketplace |
| 58 | CNFT.io | include_v0 | inactive | chain_specific | standalone_marketplace | cardano | high | Early Cardano marketplace lifecycle candidate |
| 59 | Tokhun | include_v0 | active | chain_specific | standalone_marketplace | cardano | medium | Cardano marketplace candidate |
| 60 | Artano | include_v0 | inactive | art_curated | standalone_marketplace | cardano | medium | Cardano art marketplace candidate |
| 61 | Cardahub | needs_research | inactive | chain_specific | standalone_marketplace | cardano | medium | Cardano marketplace candidate, status check needed |
| 62 | SpaceBudz Marketplace | needs_research | active | collection_specific | collection_specific_marketplace | cardano | low | Collection-specific boundary test |
| 63 | AtomicHub | include_v0 | active | chain_specific | standalone_marketplace | wax | high | Major WAX marketplace |
| 64 | NeftyBlocks | include_v0 | active | chain_specific | standalone_marketplace | wax | medium | WAX marketplace candidate |
| 65 | NFTrade | include_v0 | active | general | standalone_marketplace | multi_chain | medium | Multi-chain marketplace candidate |
| 66 | TofuNFT | include_v0 | active | general | standalone_marketplace | multi_chain | medium | Multi-chain marketplace lifecycle candidate |
| 67 | Treasureland | needs_research | inactive | general | standalone_marketplace | multi_chain | medium | Multi-chain marketplace candidate, status check needed |
| 68 | BakerySwap NFT | needs_research | active | launchpad_marketplace | launchpad_marketplace | bnb_chain | medium | BNB NFT marketplace/launchpad boundary |
| 69 | Refinable | needs_research | inactive | general | standalone_marketplace | multi_chain | medium | Older marketplace candidate |
| 70 | AirNFTs | needs_research | inactive | general | standalone_marketplace | bnb_chain | medium | BNB marketplace candidate, status check needed |
| 71 | Mintable | include_v0 | active | general | standalone_marketplace | ethereum | medium | Long-running marketplace candidate |
| 72 | Mintbase | include_v0 | active | chain_specific | standalone_marketplace | other | medium | NEAR-origin marketplace candidate |
| 73 | Paras | include_v0 | active | art_curated | standalone_marketplace | other | medium | NEAR NFT marketplace candidate |
| 74 | NFT Showroom | needs_research | active | art_curated | standalone_marketplace | other | medium | Hive NFT marketplace candidate |
| 75 | GhostMarket | include_v0 | active | general | standalone_marketplace | multi_chain | medium | Multi-chain marketplace candidate |
| 76 | Blockparty | needs_research | inactive | collectibles | standalone_marketplace | ethereum | medium | Older brand/collectibles marketplace candidate |
| 77 | Portion | needs_research | inactive | art_curated | standalone_marketplace | ethereum | medium | Art/collectibles marketplace candidate |
| 78 | CryptoPunks Marketplace | include_v0 | active | pfp | collection_specific_marketplace | ethereum | medium | Collection-specific but historically important |
| 79 | Sudoswap | include_v0 | active | general | protocol_ui | ethereum | high | AMM-style NFT marketplace/protocol candidate |
| 80 | NFTX | needs_research | active | general | protocol_ui | ethereum | medium | Liquidity/protocol boundary candidate |
| 81 | Quix | include_v0 | dead | chain_specific | standalone_marketplace | optimism | high | L2 marketplace sunset candidate |
| 82 | Stratos | needs_research | inactive | chain_specific | standalone_marketplace | arbitrum | medium | L2 marketplace candidate |
| 83 | Cargo | needs_research | inactive | general | launchpad_marketplace | ethereum | medium | Older NFT creation/marketplace candidate |
| 84 | VIV3 | needs_research | inactive | chain_specific | standalone_marketplace | flow | medium | Early Flow marketplace candidate |
| 85 | BloctoBay | include_v0 | active | chain_specific | standalone_marketplace | flow | medium | Flow marketplace candidate |
| 86 | Ethernity | include_v0 | active | collectibles | brand_marketplace | ethereum | medium | Entertainment/collectibles marketplace candidate |
| 87 | Autograph | needs_research | inactive | sports | brand_marketplace | polygon | medium | Brand/sports NFT platform, marketplace status check |
| 88 | Voice NFT | include_v0 | dead | art_curated | standalone_marketplace | other | high | NFT platform closure candidate |
| 89 | RECUR | include_v0 | dead | brand_marketplace | brand_marketplace | multi_chain | high | Brand NFT platform shutdown candidate |
| 90 | HEN Community Forks | needs_research | rebranded | art_curated | community_fork | tezos | medium | Possible alias/lineage mapping group |
| 91 | Viv3 / Flow Marketplace lineage | duplicate_or_alias | unknown | chain_specific | standalone_marketplace | flow | low | Needs dedupe with VIV3/BloctoBay |
| 92 | Quidd | needs_research | active | collectibles | brand_marketplace | ethereum | medium | Collectibles marketplace candidate |
| 93 | OpenSea Seaport | out_of_scope | active | protocol_ui | protocol_ui | multi_chain | low | Protocol, not marketplace record unless as event/reference |
| 94 | Art Blocks Marketplace | needs_research | active | art_curated | collection_specific_marketplace | ethereum | medium | Collection/platform-specific boundary |
| 95 | Verse Works | needs_research | active | art_curated | standalone_marketplace | ethereum | medium | Art marketplace candidate |
| 96 | Sansa | needs_research | active | aggregator | aggregator | ethereum | medium | Art/NFT aggregator candidate |
| 97 | Joepegs | include_v0 | active | chain_specific | standalone_marketplace | avalanche | medium | Avalanche marketplace candidate |
| 98 | Salvor | include_v0 | active | chain_specific | standalone_marketplace | avalanche | medium | Avalanche marketplace candidate |
| 99 | Rand Gallery | include_v0 | active | chain_specific | standalone_marketplace | other | medium | Algorand marketplace candidate |
| 100 | Algogems | needs_research | inactive | art_curated | standalone_marketplace | other | medium | Algorand marketplace candidate |

---

## 6. v0 selection rule

上の100件から、v0では30〜50件に絞る。

## 6.1 v0で優先するもの

```txt
OpenSea / Blur / Magic Eden / Tensor / Rarible などのactive基準点
Kraken NFT / X2Y2 / Nifty Gateway / KnownOrigin / MakersPlace などのclosed-side
Hic et Nunc / Teia のfrontend dead + community continuation
CEX系NFT marketplaceのactive/dead比較
Tezos / Solana / Cardano / WAX / Flow / Ronin / Immutable などecosystem別の代表
```

## 6.2 v0で後回しにするもの

```txt
collection-specificすぎるもの
marketplaceかprotocolか曖昧なもの
公式URLやarchiveが見つかりにくいもの
activeだが特徴の薄い小規模候補
```

## 6.3 v0の理想構成

```txt
active major: 12
closed/dead/limited: 20
acquired/merged/rebranded: 8
inactive/unclear: 5
合計: 45前後
```

---

## 7. v1 / v2 expansion backlog

このセクションは、v1/v2で100〜300件へ拡張するための候補棚である。

ここでは正式なstatusを決めない。  
カテゴリ別の探索対象として扱う。

---

## 7.1 Ethereum / EVM general marketplaces

追加候補:

```txt
Rarible Protocol ecosystem
LooksRare legacy marketplace records
OpenSea collection storefront variants
X2Y2 related records
NFTfi marketplace-related surfaces
NiftyKit marketplace surfaces
MintGate
NFTify
Origin Story
Origin Protocol NFT marketplace
Rally NFT marketplace-related surfaces
Showtime
TokenTrove
NFTKEY
Fantom NFT marketplace candidates
PaintSwap
Artion
Kalamint-style art marketplaces on EVM
Treasureland legacy records
```

Expected phase:

```txt
v1 / v2
```

---

## 7.2 Aggregators and pro-trading UIs

追加候補:

```txt
Alpha Sharks
Reservoir marketplace surfaces
Element deeper records
OpenSea Pro lineage records
Gem legacy pages
Genie legacy pages
Uniswap NFT marketplace interface
Sansa
NFTNerds marketplace tools
Flip marketplace candidates
TraitSniper trading surfaces
Rarity.tools marketplace links
Icy.tools marketplace surfaces
Blur Blend-related marketplace records
```

Expected phase:

```txt
v1 / v2
```

---

## 7.3 CEX-operated NFT marketplaces

追加候補:

```txt
OKX NFT deeper chain records
Binance NFT deeper records
Coinbase NFT lifecycle details
Crypto.com NFT deeper records
Gate NFT / Magic Box
KuCoin NFT / Windvane
Huobi NFT / iBox-related candidates
MEXC NFT-related marketplace candidates
Bitget NFT
Bittrex Global NFT candidates
FTX NFTs deeper records
Gemini / Nifty Gateway parent records
```

Expected phase:

```txt
v1 / v2
```

---

## 7.4 Tezos ecosystem

追加候補:

```txt
Objkt deeper records
fxhash deeper records
Teia lineage
Kalamint deeper records
OneOf deeper records
Versum
8bidou
Rarible Tezos support record
Hic et Nunc forks and mirrors
Typed marketplace candidates
DNS.xyz Tezos-related marketplace candidates
```

Expected phase:

```txt
v1 / v2
```

---

## 7.5 Solana ecosystem

追加候補:

```txt
Solanart deeper records
SolSea deeper records
DigitalEyes deeper records
Exchange.Art deeper records
Magic Eden Solana history
Tensor deeper records
Hyperspace shutdown details
Fractal lifecycle
Yawww
Coral Cube
Solport
Alpha Art
Holaplex marketplace surfaces
Formfunction
Elixir marketplace candidates
```

Expected phase:

```txt
v1 / v2
```

---

## 7.6 Cardano ecosystem

追加候補:

```txt
JPG Store deeper records
CNFT.io deeper records
Tokhun deeper records
Artano deeper records
Cardahub deeper records
SpaceBudz marketplace boundary
Epoch Art
Genesis House
AdaNFT marketplace candidates
Fibo marketplace candidates
JamOnBread marketplace candidates
```

Expected phase:

```txt
v1 / v2
```

---

## 7.7 Flow / Dapper ecosystem

追加候補:

```txt
NBA Top Shot deeper records
NFL ALL DAY deeper records
UFC Strike deeper records
VIV3 deeper records
BloctoBay deeper records
Versus marketplace candidates
Dapper Sports marketplace surfaces
LaLiga Golazos marketplace
Disney Pinnacle marketplace surfaces
```

Expected phase:

```txt
v1 / v2
```

---

## 7.8 WAX / collectibles ecosystem

追加候補:

```txt
AtomicHub deeper records
NeftyBlocks deeper records
NFTHive
WAXStash marketplace
Collectables.io
Topps NFT marketplace candidates
Funko Digital Pop marketplace surfaces
```

Expected phase:

```txt
v1 / v2
```

---

## 7.9 Gaming marketplaces

追加候補:

```txt
Axie Marketplace deeper records
Immutable Marketplace deeper records
Treasure Marketplace deeper records
Fractal deeper records
OpenLoot
Sequence Marketplace
Gala Games marketplace
Enjin Marketplace deeper records
Ultra marketplace
Mavis Market
Aqua NFT marketplace
GameStop NFT deeper records
Rarible gaming vertical candidates
Mythical Marketplace
Blankos Block Party marketplace
Illuvium marketplace
Gods Unchained marketplace
Guild of Guardians marketplace
```

Expected phase:

```txt
v1 / v2
```

---

## 7.10 Metaverse and land marketplaces

追加候補:

```txt
Decentraland Marketplace deeper records
The Sandbox Marketplace deeper records
Somnium Space marketplace
Voxels marketplace
Otherside marketplace surfaces
Netvrk marketplace
Upland marketplace
Worldwide Webb marketplace surfaces
Highstreet marketplace
Mona marketplace candidates
```

Expected phase:

```txt
v1 / v2
```

---

## 7.11 Art curated / creator marketplaces

追加候補:

```txt
Foundation deeper records
SuperRare deeper records
KnownOrigin deeper records
MakersPlace deeper records
Async Art deeper records
Nifty Gateway deeper records
Verse Works deeper records
Art Blocks marketplace boundary
Quantum Art
Feral File marketplace candidates
Sedition Art
Objkt / fxhash art records
Exchange.Art art records
Portion deeper records
Blockparty deeper records
Cargo deeper records
Mintbase creator marketplace records
```

Expected phase:

```txt
v1 / v2
```

---

## 7.12 Music / entertainment / brand marketplaces

追加候補:

```txt
OneOf deeper records
Royal marketplace candidates
Sound.xyz marketplace boundary
Catalog Works
Async Music records
Ethernity deeper records
Autograph deeper records
Candy Digital deeper records
ThetaDrop deeper records
VeVe deeper records
LG Art Lab deeper records
Recur deeper records
Voice NFT deeper records
Quidd deeper records
```

Expected phase:

```txt
v1 / v2
```

---

## 7.13 L2 / alternative ecosystems

追加候補:

```txt
Quix deeper records
Stratos deeper records
Joepegs deeper records
Salvor deeper records
Rand Gallery deeper records
Algogems deeper records
Paras deeper records
Mintbase deeper records
NFT Showroom deeper records
GhostMarket deeper records
Kadena NFT marketplace candidates
Aptos NFT marketplaces
Sui NFT marketplaces
Starknet NFT marketplace candidates
Base NFT marketplace candidates
Zora Network marketplace candidates
```

Expected phase:

```txt
v1 / v2
```

---

## 8. v3+ discovery lanes

v3以降は、個別候補名を一気に列挙するより、探索レーンを固定して増やす。

## 8.1 Dead / closed marketplace discovery

探索語:

```txt
NFT marketplace shut down
NFT marketplace closure
NFT marketplace discontinued
NFT marketplace sunset
NFT marketplace withdrawal only
NFT platform shutdown
NFT marketplace acquired shutdown
```

対象:

```txt
公式告知
サポート記事
archive
買収後終了
CEX NFT終了
ブランドNFT終了
```

## 8.2 Chain-specific marketplace discovery

対象chain:

```txt
Ethereum
Solana
Tezos
Cardano
Flow
WAX
Ronin
Immutable
Polygon
BNB Chain
Avalanche
Arbitrum
Optimism
Base
Bitcoin Ordinals
Algorand
NEAR
Aptos
Sui
Starknet
```

## 8.3 Category-specific discovery

カテゴリ:

```txt
art curated
gaming
metaverse land
music
sports
collectibles
pfp
brand marketplace
launchpad marketplace
aggregator
CEX NFT marketplace
```

## 8.4 Archive-first discovery

探索先:

```txt
Wayback captures
old marketplace lists
NFT calendar directories
old DappRadar entries
old CoinGecko / CoinMarketCap NFT pages
press releases
support shutdown FAQs
blog sunset posts
```

## 8.5 Community-fork / successor discovery

対象:

```txt
Hic et Nunc style forks
community mirrors
protocol continuation
brand reboots
marketplace-to-protocol transitions
```

---

## 9. Candidate-to-record workflow

候補から正式JSONへ進める流れ。

```txt
1. Candidate list entry
2. Initial source search
3. Target / out-of-scope check
4. likely_status check
5. evidence collection
6. archive check
7. marketplace entity draft
8. event draft
9. evidence draft
10. validation
11. review_status update
12. merge to canonical JSON
```

## 9.1 v0変換時の最低条件

```txt
marketplace entity draftあり
event 1件以上
evidence 1件以上
summaryあり
status仮決定
confidenceあり
review_statusあり
record_quality_flagsあり
```

## 9.2 closed-side推奨条件

```txt
evidence 2件以上
archiveあり
what_is_goneあり
what_remainsあり
end_date or end_yearあり
closure_reasonあり
```

---

## 10. What this file covers

今回の `04-minted-and-gone-candidates.md` で作る範囲:

```txt
Final target: 800〜1,000 records
Extended ceiling: 1,200〜1,500 records
Phase targets: v0 / v1 / v2 / v3 / mature / extended
Detailed v0 candidate pool: 100 named candidates
v1/v2 expansion backlog: category-based candidate shelves
v3+ discovery lanes: search and expansion strategy
```

今回まだ作らないもの:

```txt
正式な marketplaces.json
正式な events.json
正式な evidence.json
各候補の完全なsource URL
全候補のarchive URL
public-ready seed records
```

---

## 11. Acceptance checklist

```txt
[ ] 最終レコード数目標がある
[ ] phase別到達件数がある
[ ] v0候補が80〜120件ある
[ ] v1/v2拡張候補の棚がある
[ ] v3以降の探索レーンがある
[ ] candidate_status の意味が定義されている
[ ] v0選定基準がある
[ ] 正式JSONではないことが明記されている
[ ] HTMLモック前に必要な候補規模感が分かる
```

---

## 12. 最終結論

Minted & Gone の最終的な実用目標は **800〜1,000 records**。  
品質を維持した拡張上限は **1,200〜1,500 records**。

この候補リストでは、まず **v0候補100件** を置き、そこから30〜50件を選んで public preview 用のseed dataへ変換する。

v1/v2ではカテゴリ別バックログから100〜300件へ増やし、v3以降は探索レーンに沿って500件、最終的に800〜1,000件を目指す。

export type GlossaryTerm = {
  slug: string;
  term: string;
  short: string;
  detail: string;
  relatedGuides: Array<{ title: string; href: string }>;
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'nft-marketplace',
    term: 'NFT marketplace',
    short: 'A public or semi-public surface where NFTs can be listed, discovered, bought, sold, minted, or otherwise exchanged.',
    detail: 'Minted & Gone uses this term for marketplace-like surfaces that matter to NFT history. A marketplace record does not determine individual NFT ownership, asset value, or trading safety.',
    relatedGuides: [
      { title: 'What happens when an NFT marketplace shuts down?', href: '/guides/what-happens-when-nft-marketplace-shuts-down/' }
    ]
  },
  {
    slug: 'marketplace-frontend',
    term: 'Marketplace frontend',
    short: 'The website or app interface used to view listings, collection pages, search, account features, or marketplace actions.',
    detail: 'A frontend can close, redirect, or change while contracts, metadata, wallets, archives, or third-party marketplace views may follow separate paths.',
    relatedGuides: [
      { title: 'Frontend vs smart contract', href: '/guides/frontend-vs-smart-contract-what-remains/' }
    ]
  },
  {
    slug: 'smart-contract',
    term: 'Smart contract',
    short: 'On-chain code that may support minting, trading, escrow, royalties, or other marketplace behavior.',
    detail: 'A readable contract does not necessarily mean the original marketplace still operates. A closed marketplace frontend also does not automatically prove that a contract disappeared.',
    relatedGuides: [
      { title: 'Frontend vs smart contract', href: '/guides/frontend-vs-smart-contract-what-remains/' },
      { title: 'Do NFTs disappear when a marketplace closes?', href: '/guides/do-nfts-disappear-when-a-marketplace-closes/' }
    ]
  },
  {
    slug: 'asset-metadata',
    term: 'Asset metadata',
    short: 'Data that describes an NFT, often including name, description, attributes, and media references.',
    detail: 'Metadata availability depends on the metadata path and storage layer. Marketplace closure alone does not settle whether metadata remains available.',
    relatedGuides: [
      { title: 'Do NFTs disappear when a marketplace closes?', href: '/guides/do-nfts-disappear-when-a-marketplace-closes/' }
    ]
  },
  {
    slug: 'collection-page',
    term: 'Collection page',
    short: 'A marketplace-hosted page for a collection.',
    detail: 'A collection page may disappear when a marketplace frontend closes even if tokens, metadata, wallet display, or third-party marketplace views remain available.',
    relatedGuides: [
      { title: 'How to check old NFT marketplace pages', href: '/guides/how-to-check-old-nft-marketplace-pages/' }
    ]
  },
  {
    slug: 'trading-history',
    term: 'Trading history',
    short: 'A record of marketplace activity such as sales or transfers.',
    detail: 'Trading history may exist in marketplace databases, block explorers, third-party indexers, or archives depending on the case and source quality.',
    relatedGuides: [
      { title: 'How to check old NFT marketplace pages', href: '/guides/how-to-check-old-nft-marketplace-pages/' }
    ]
  },
  {
    slug: 'aggregator',
    term: 'Aggregator',
    short: 'A service that combines listings or trading routes from multiple marketplaces.',
    detail: 'Aggregators can remain active even when one indexed marketplace changes or closes. Aggregator closure also does not automatically prove that every indexed marketplace disappeared.',
    relatedGuides: [
      { title: 'What is an NFT marketplace aggregator?', href: '/guides/what-is-an-nft-marketplace-aggregator/' }
    ]
  },
  {
    slug: 'launchpad-marketplace',
    term: 'Launchpad marketplace',
    short: 'A marketplace or product surface focused on new NFT drops, mints, creator releases, or primary sales.',
    detail: 'Launchpads may hand assets off to secondary marketplaces, wallets, or aggregators. A campaign page disappearing does not automatically prove that minted assets disappeared.',
    relatedGuides: [
      { title: 'What is an NFT launchpad marketplace?', href: '/guides/what-is-an-nft-launchpad-marketplace/' }
    ]
  },
  {
    slug: 'community-fork',
    term: 'Community fork',
    short: 'A community-run continuation, fork, or alternative interface after an original marketplace changes, closes, or becomes unavailable.',
    detail: 'Community forks can provide continuity signals, but they should not be treated as proof that the original marketplace is still operating.',
    relatedGuides: [
      { title: 'What happens when an NFT marketplace shuts down?', href: '/guides/what-happens-when-nft-marketplace-shuts-down/' }
    ]
  },
  {
    slug: 'marketplace-shutdown',
    term: 'Marketplace shutdown',
    short: 'A source-backed end or major reduction of marketplace operation.',
    detail: 'Shutdown can refer to the frontend, business operation, marketplace feature, or a specific product surface. Minted & Gone avoids treating closure as automatic asset disappearance.',
    relatedGuides: [
      { title: 'What happens when an NFT marketplace shuts down?', href: '/guides/what-happens-when-nft-marketplace-shuts-down/' }
    ]
  },
  {
    slug: 'frontend-closed',
    term: 'Frontend closed',
    short: 'The original public interface is no longer available or no longer works in its prior marketplace form.',
    detail: 'Frontend closed does not automatically prove tokens, metadata, smart contracts, wallets, or third-party views disappeared.',
    relatedGuides: [
      { title: 'Frontend vs smart contract', href: '/guides/frontend-vs-smart-contract-what-remains/' }
    ]
  },
  {
    slug: 'contract-deprecated',
    term: 'Contract deprecated',
    short: 'A contract or protocol path is no longer recommended, maintained, or used as the current route.',
    detail: 'Deprecated is not the same as erased. Deprecated paths may remain readable or historically important even when no longer recommended.',
    relatedGuides: [
      { title: 'Frontend vs smart contract', href: '/guides/frontend-vs-smart-contract-what-remains/' }
    ]
  },
  {
    slug: 'asset-migration',
    term: 'Asset migration',
    short: 'A source-backed movement or recommended path from one product, contract, metadata route, or marketplace surface to another.',
    detail: 'Migration records should identify what moved, who announced it, and whether user action, successor pages, or alternative marketplaces are involved.',
    relatedGuides: [
      { title: 'What happens when an NFT marketplace shuts down?', href: '/guides/what-happens-when-nft-marketplace-shuts-down/' }
    ]
  },
  {
    slug: 'archived-url',
    term: 'Archived URL',
    short: 'A historical capture or archive search for a page.',
    detail: 'For dead or redirected domains, archive links are often safer historical references than current domains. Archives support history, not current availability.',
    relatedGuides: [
      { title: 'How to check old NFT marketplace pages', href: '/guides/how-to-check-old-nft-marketplace-pages/' }
    ]
  },
  {
    slug: 'dead-domain',
    term: 'Dead domain',
    short: 'A domain that no longer resolves, serves the original marketplace, or remains controlled for the original purpose.',
    detail: 'Domains can expire, redirect, park, or be repurposed. A dead domain should not be treated as proof that assets, metadata, or contracts disappeared.',
    relatedGuides: [
      { title: 'How to check old NFT marketplace pages', href: '/guides/how-to-check-old-nft-marketplace-pages/' }
    ]
  },
  {
    slug: 'rebrand',
    term: 'Rebrand',
    short: 'A marketplace identity changes name, visual identity, product framing, or destination while some continuity may remain.',
    detail: 'A rebrand is not the same as a disappearance. Records should identify predecessor and successor paths when sources support them.',
    relatedGuides: [
      { title: 'How to check old NFT marketplace pages', href: '/guides/how-to-check-old-nft-marketplace-pages/' }
    ]
  },
  {
    slug: 'acquisition',
    term: 'Acquisition',
    short: 'A marketplace or related product becomes owned or absorbed by another company, ecosystem, or product group.',
    detail: 'Acquisition can lead to continuity, integration, shutdown, or rebrand. Minted & Gone records the source-backed path rather than assuming disappearance.',
    relatedGuides: [
      { title: 'What happens when an NFT marketplace shuts down?', href: '/guides/what-happens-when-nft-marketplace-shuts-down/' }
    ]
  },
  {
    slug: 'delisting',
    term: 'Delisting',
    short: 'A collection, asset, or marketplace surface is removed from a listing view.',
    detail: 'Delisting is narrower than marketplace shutdown. A delisted item or collection may have other visibility paths depending on source support.',
    relatedGuides: [
      { title: 'Do NFTs disappear when a marketplace closes?', href: '/guides/do-nfts-disappear-when-a-marketplace-closes/' }
    ]
  },
  {
    slug: 'royalties',
    term: 'Royalties',
    short: 'Creator compensation rules or payments attached to NFT sales.',
    detail: 'Royalties may be implemented through marketplace policy, contracts, metadata standards, or optional creator-fee enforcement. Behavior can change while a marketplace remains active.',
    relatedGuides: [
      { title: 'Frontend vs smart contract', href: '/guides/frontend-vs-smart-contract-what-remains/' }
    ]
  },
  {
    slug: 'creator-fee',
    term: 'Creator fee',
    short: 'A marketplace-level or protocol-level fee intended for creators.',
    detail: 'Creator fee behavior can change even when a marketplace remains active. Records should avoid treating fee-policy changes as marketplace shutdown unless sources support that claim.',
    relatedGuides: [
      { title: 'Frontend vs smart contract', href: '/guides/frontend-vs-smart-contract-what-remains/' }
    ]
  }
];

export type UpdateEntry = {
  slug: string;
  title: string;
  date: string;
  label: string;
  summary: string;
  details: string[];
  links: Array<{ title: string; href: string }>;
};

export const updateEntries: UpdateEntry[] = [
  {
    slug: 'v0-reading-layer-added',
    title: 'v0 reading layer added',
    date: '2026-06-03',
    label: 'Reading layer',
    summary: 'Added the v0 guide index, two core guides, glossary index, and updates entry point as registry-support pages.',
    details: [
      'Added the guides entry point and two core v0 guides for marketplace shutdowns and frontend-versus-contract separation.',
      'Added glossary and updates entry points while keeping the encyclopedia as the main product surface.',
      'Kept the wording conservative so marketplace closure is not treated as automatic asset disappearance.'
    ],
    links: [
      { title: 'Guides', href: '/guides/' },
      { title: 'Glossary', href: '/glossary/' },
      { title: 'Methodology', href: '/methodology/' }
    ]
  },
  {
    slug: 'v0-5-guide-expansion-added',
    title: 'v0.5 guide expansion added',
    date: '2026-06-03',
    label: 'Guides',
    summary: 'Added four v0.5 guide pages for old page checks, NFT disappearance claims, marketplace aggregators, and launchpad marketplaces.',
    details: [
      'Added practical archive-checking guidance for old marketplace domains, redirects, archived URLs, and official notices.',
      'Added a guide clarifying that marketplace closure does not automatically mean NFTs, metadata, media, wallets, or trading paths disappeared.',
      'Added aggregator and launchpad guides to separate marketplace infrastructure, dependencies, primary release surfaces, and campaign pages.'
    ],
    links: [
      { title: 'How to check old NFT marketplace pages', href: '/guides/how-to-check-old-nft-marketplace-pages/' },
      { title: 'Do NFTs disappear when a marketplace closes?', href: '/guides/do-nfts-disappear-when-a-marketplace-closes/' },
      { title: 'What is an NFT marketplace aggregator?', href: '/guides/what-is-an-nft-marketplace-aggregator/' },
      { title: 'What is an NFT launchpad marketplace?', href: '/guides/what-is-an-nft-launchpad-marketplace/' }
    ]
  },
  {
    slug: 'glossary-detail-pages-added',
    title: 'Glossary detail pages added',
    date: '2026-06-03',
    label: 'Glossary',
    summary: 'Added shared glossary term data and generated individual glossary pages for 20 registry terms.',
    details: [
      'Moved glossary definitions into shared data so index and detail pages stay aligned.',
      'Added stable term URLs for concepts such as marketplace frontend, smart contract, asset metadata, aggregator, launchpad marketplace, archived URL, and dead domain.',
      'Kept term pages compact and focused on archive wording rather than broad NFT education.'
    ],
    links: [
      { title: 'Glossary', href: '/glossary/' },
      { title: 'Marketplace frontend', href: '/glossary/marketplace-frontend/' },
      { title: 'Smart contract', href: '/glossary/smart-contract/' },
      { title: 'Archived URL', href: '/glossary/archived-url/' }
    ]
  }
];

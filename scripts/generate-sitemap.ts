import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const readMany = (prefix: string) => readdirSync('data')
  .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
  .sort()
  .flatMap((name) => read('data/' + name));

const site = (process.env.PUBLIC_SITE_URL ?? 'https://mag.badjoke-lab.com').replace(/\/$/, '');
const marketplaces = readMany('marketplaces');

const glossarySlugs = [
  'nft-marketplace',
  'marketplace-frontend',
  'smart-contract',
  'asset-metadata',
  'collection-page',
  'trading-history',
  'aggregator',
  'launchpad-marketplace',
  'community-fork',
  'marketplace-shutdown',
  'frontend-closed',
  'contract-deprecated',
  'asset-migration',
  'archived-url',
  'dead-domain',
  'rebrand',
  'acquisition',
  'delisting',
  'royalties',
  'creator-fee'
];

const updateSlugs = [
  'v0-reading-layer-added',
  'v0-5-guide-expansion-added',
  'glossary-detail-pages-added'
];

const staticPaths = [
  '/',
  '/encyclopedia/',
  '/stats/',
  '/guides/',
  '/guides/what-happens-when-nft-marketplace-shuts-down/',
  '/guides/frontend-vs-smart-contract-what-remains/',
  '/guides/how-to-check-old-nft-marketplace-pages/',
  '/guides/do-nfts-disappear-when-a-marketplace-closes/',
  '/guides/what-is-an-nft-marketplace-aggregator/',
  '/guides/what-is-an-nft-launchpad-marketplace/',
  '/glossary/',
  ...glossarySlugs.map((slug) => '/glossary/' + slug + '/'),
  '/updates/',
  ...updateSlugs.map((slug) => '/updates/' + slug + '/'),
  '/methodology/',
  '/about/',
  '/submit/',
  '/support/',
  '/contact/'
];

const marketplacePaths = marketplaces
  .map((record: { slug: string }) => '/encyclopedia/' + record.slug + '/')
  .sort((a: string, b: string) => a.localeCompare(b));

const paths = [...staticPaths, ...marketplacePaths];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + paths
  .map((path) => '  <url><loc>' + site + path + '</loc></url>')
  .join('\n') + '\n</urlset>\n';

writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap generated: ' + paths.length + ' URLs');

import { writeFileSync } from 'node:fs';
import { readCanonicalMarketplaceFiles } from './generate-sitemap-canonical.ts';

const site = (process.env.PUBLIC_SITE_URL ?? 'https://mag.badjoke-lab.com').replace(/\/$/, '');
const marketplaces = readCanonicalMarketplaceFiles();
const staticPaths = [
  '/', '/encyclopedia/', '/tokenized-collectibles/', '/timeline/', '/evidence/', '/stats/',
  '/guides/', '/guides/what-happens-when-nft-marketplace-shuts-down/',
  '/guides/frontend-vs-smart-contract-what-remains/', '/guides/how-to-check-old-nft-marketplace-pages/',
  '/guides/do-nfts-disappear-when-a-marketplace-closes/', '/guides/what-is-an-nft-marketplace-aggregator/',
  '/guides/what-is-an-nft-launchpad-marketplace/', '/glossary/', '/updates/',
  '/methodology/', '/about/', '/submit/', '/support/', '/contact/'
];
const marketplacePaths = marketplaces.map((record) => `/encyclopedia/${record.slug}/`).sort();
const paths = [...staticPaths, ...marketplacePaths];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + paths.map((path) => `  <url><loc>${site}${path}</loc></url>`).join('\n')
  + '\n</urlset>\n';
writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated: ${paths.length} URLs`);

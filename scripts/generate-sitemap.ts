import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const readMany = (prefix: string) => readdirSync('data')
  .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
  .sort()
  .flatMap((name) => read('data/' + name));

const site = (process.env.PUBLIC_SITE_URL ?? 'https://mag.badjoke-lab.com').replace(/\/$/, '');
const marketplaces = readMany('marketplaces');

const staticPaths = [
  '/',
  '/encyclopedia/',
  '/stats/',
  '/guides/',
  '/guides/what-happens-when-nft-marketplace-shuts-down/',
  '/guides/frontend-vs-smart-contract-what-remains/',
  '/glossary/',
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

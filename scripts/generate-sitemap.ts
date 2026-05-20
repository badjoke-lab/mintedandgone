import { readFileSync, writeFileSync } from 'node:fs';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const site = 'https://mintedandgone.pages.dev';

const marketplaces = [
  ...read('data/marketplaces.json'),
  ...read('data/marketplaces-batch-02.json')
];

const staticPaths = [
  '/',
  '/encyclopedia/',
  '/stats/',
  '/methodology/',
  '/about/',
  '/submit/'
];

const marketplacePaths = marketplaces
  .map((record: { slug: string }) => `/encyclopedia/${record.slug}/`)
  .sort((a: string, b: string) => a.localeCompare(b));

const paths = [...staticPaths, ...marketplacePaths];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
  .map((path) => `  <url><loc>${site}${path}</loc></url>`)
  .join('\n')}\n</urlset>\n`;

writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated: ${paths.length} URLs`);

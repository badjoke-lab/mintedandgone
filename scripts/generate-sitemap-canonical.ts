import { readdirSync, readFileSync } from 'node:fs';

export const readCanonicalMarketplaceFiles = () => readdirSync('data')
  .filter((name) => name.startsWith('marketplaces') && name.endsWith('.json'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .flatMap((name) => JSON.parse(readFileSync(`data/${name}`, 'utf8')));

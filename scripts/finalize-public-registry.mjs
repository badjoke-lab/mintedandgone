import { readFileSync, writeFileSync } from 'node:fs';

const manifestPath = 'public/data/manifest.json';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.source_of_truth.marketplaces = 'All canonical data/marketplaces*.json series files';
manifest.source_of_truth.events = 'All canonical data/events*.json series files';
manifest.source_of_truth.evidence = 'All canonical data/evidence*.json series files';
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

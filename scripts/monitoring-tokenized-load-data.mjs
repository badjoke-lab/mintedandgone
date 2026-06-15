import path from 'node:path';
import { CATEGORY, CANONICAL_PREFIXES } from './monitoring-tokenized-constants.mjs';
import { listJsonFilesByPrefixes, readJson } from './monitoring-tokenized-fs.mjs';

export function loadCanonicalData(root = process.cwd()) {
  const dataDir = path.join(root, 'data');
  const files = listJsonFilesByPrefixes(dataDir, CANONICAL_PREFIXES);
  const groups = { marketplaces: [], events: [], evidence: [] };

  for (const file of files) {
    const name = path.basename(file);
    const records = readJson(file);
    if (!Array.isArray(records)) throw new Error(`${name} must contain a JSON array`);
    if (name.startsWith('marketplaces')) groups.marketplaces.push(...records);
    if (name.startsWith('events')) groups.events.push(...records);
    if (name.startsWith('evidence')) groups.evidence.push(...records);
  }

  const tokenized = groups.marketplaces.filter((record) => record.category === CATEGORY);
  return { ...groups, tokenized, canonicalFiles: files };
}

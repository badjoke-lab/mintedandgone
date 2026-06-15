import path from 'node:path';
import { fingerprintFiles } from './monitoring-tokenized-fs.mjs';
import { loadCanonicalData } from './monitoring-tokenized-load-data.mjs';

export function snapshotCanonical(root = process.cwd()) {
  const { canonicalFiles } = loadCanonicalData(root);
  return fingerprintFiles(canonicalFiles, root);
}

export function assertCanonicalUnchanged(before, after) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changed = [...keys].filter((key) => before[key] !== after[key]);
  if (changed.length) {
    throw new Error(`Monitoring changed canonical files: ${changed.join(', ')}`);
  }
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  snapshotCanonical(process.cwd());
  console.log('Tokenized canonical files are readable.');
}

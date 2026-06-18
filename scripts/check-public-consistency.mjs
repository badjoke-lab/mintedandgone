import { existsSync, readFileSync, readdirSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const readMany = (prefix) => readdirSync('data')
  .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
  .sort()
  .flatMap((name) => read(`data/${name}`));

const canonical = {
  marketplaces: readMany('marketplaces'),
  events: readMany('events'),
  evidence: readMany('evidence')
};
const expected = {
  marketplaces: canonical.marketplaces.length,
  events: canonical.events.length,
  evidence: canonical.evidence.length
};
const errors = [];

const stats = read('data/stats.json');
const version = read('public/version.json');
const manifest = read('public/data/manifest.json');
const publicData = {
  marketplaces: read('public/data/marketplaces.json'),
  events: read('public/data/events.json'),
  evidence: read('public/data/evidence.json')
};

for (const key of Object.keys(expected)) {
  const statsKey = `${key}_count`;
  if (stats.source?.[statsKey] !== expected[key]) errors.push(`stats source ${statsKey} mismatch`);
  if (version.record_counts?.[key] !== expected[key]) errors.push(`version ${key} mismatch`);
  if (manifest.record_counts?.[key] !== expected[key]) errors.push(`manifest ${key} mismatch`);
  if (publicData[key].length !== expected[key]) errors.push(`public ${key}.json mismatch`);
}

if (version.canonical_only !== true || manifest.canonical_only !== true || manifest.data_safety?.canonical_only !== true) {
  errors.push('canonical_only must be true in version and manifest');
}

for (const record of publicData.marketplaces) {
  if (!['draft', 'source_reviewed_draft', 'public_quality'].includes(record.publication_review_state)) {
    errors.push(`${record.id} has invalid publication_review_state`);
  }
  if (!Array.isArray(record.open_review_flags)) errors.push(`${record.id} open_review_flags must be an array`);
}

const distFiles = [
  'dist/index.html',
  'dist/encyclopedia/index.html',
  'dist/stats/index.html',
  'dist/version.json',
  'dist/data/manifest.json',
  'dist/data/marketplaces.json',
  'dist/data/events.json',
  'dist/data/evidence.json',
  'dist/llms.txt',
  'dist/ai.txt',
  'dist/sitemap.xml',
  'dist/robots.txt'
];
for (const path of distFiles) if (!existsSync(path)) errors.push(`missing build output ${path}`);

if (existsSync('dist/index.html')) {
  const html = readFileSync('dist/index.html', 'utf8');
  for (const value of Object.values(expected)) {
    if (!html.includes(String(value))) errors.push(`home HTML does not expose canonical count ${value}`);
  }
  if (!html.includes('/data/manifest.json') || !html.includes('/version.json')) errors.push('home discovery links missing');
}

if (existsSync('dist/encyclopedia/index.html')) {
  const html = readFileSync('dist/encyclopedia/index.html', 'utf8');
  if (!html.includes(`>${expected.marketplaces}<`) && !html.includes(`${expected.marketplaces} results`)) errors.push('encyclopedia count mismatch');
}

if (existsSync('dist/stats/index.html')) {
  const html = readFileSync('dist/stats/index.html', 'utf8');
  for (const value of Object.values(expected)) if (!html.includes(String(value))) errors.push(`stats HTML missing canonical count ${value}`);
}

if (errors.length) {
  console.error(`Public consistency check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Public consistency passed: ${expected.marketplaces} marketplaces, ${expected.events} events, ${expected.evidence} evidence`);

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeDomain(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  try {
    const url = raw.startsWith('http://') || raw.startsWith('https://') ? new URL(raw) : new URL(`https://${raw}`);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim();
  }
}

function add(map, key, value) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function main() {
  const batchFile = process.argv[2];
  if (!batchFile) {
    console.error('Usage: node scripts/check-mag-batch-candidates.mjs data/marketplaces-batch-XX.json');
    process.exit(1);
  }

  const batchPath = path.join(ROOT, batchFile);
  const batch = readJson(batchPath);
  if (!Array.isArray(batch)) throw new Error(`${batchFile} must be a JSON array`);

  const existingFiles = fs
    .readdirSync(DATA_DIR)
    .filter((name) => /^marketplaces.*\.json$/.test(name) && path.join('data', name) !== batchFile)
    .sort();

  const existing = [];
  for (const file of existingFiles) {
    const parsed = readJson(path.join(DATA_DIR, file));
    for (const record of parsed) existing.push({ ...record, __file: file });
  }

  const slugs = new Map();
  const names = new Map();
  const domains = new Map();
  for (const record of existing) {
    add(slugs, record.slug, record);
    add(names, normalizeText(record.canonical_name), record);
    for (const alias of record.aliases || []) add(names, normalizeText(alias), record);
    add(domains, normalizeDomain(record.official_domain_original), record);
    add(domains, normalizeDomain(record.official_url_original), record);
  }

  const batchSlugs = new Map();
  const batchNames = new Map();
  const batchDomains = new Map();
  const problems = [];

  for (const record of batch) {
    const label = `${record.id || '(missing id)'} ${record.canonical_name || '(missing name)'}`;
    const slug = record.slug || '';
    const nameKey = normalizeText(record.canonical_name);
    const domainKey = normalizeDomain(record.official_domain_original || record.official_url_original);

    if (!record.id) problems.push(`${label}: missing id`);
    if (!slug) problems.push(`${label}: missing slug`);
    if (!record.canonical_name) problems.push(`${label}: missing canonical_name`);
    if (!record.official_url_original) problems.push(`${label}: missing official_url_original`);
    if (!record.official_domain_original) problems.push(`${label}: missing official_domain_original`);

    if (slugs.has(slug)) problems.push(`${label}: duplicate existing slug ${slug}`);
    if (names.has(nameKey)) problems.push(`${label}: duplicate existing name/alias ${record.canonical_name}`);
    if (domainKey && domains.has(domainKey)) problems.push(`${label}: duplicate existing domain ${domainKey}`);

    add(batchSlugs, slug, label);
    add(batchNames, nameKey, label);
    add(batchDomains, domainKey, label);
  }

  for (const [slug, values] of batchSlugs) if (slug && values.length > 1) problems.push(`duplicate batch slug ${slug}: ${values.join(' | ')}`);
  for (const [name, values] of batchNames) if (name && values.length > 1) problems.push(`duplicate batch name ${name}: ${values.join(' | ')}`);
  for (const [domain, values] of batchDomains) if (domain && values.length > 1) problems.push(`duplicate batch domain ${domain}: ${values.join(' | ')}`);

  console.log(`MAG batch candidate check: ${batchFile}`);
  console.log(`Existing marketplace records scanned: ${existing.length}`);
  console.log(`Batch records checked: ${batch.length}`);

  if (problems.length) {
    console.error('Batch candidate validation failed:');
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
  }

  console.log('Batch candidate validation passed');
}

main();

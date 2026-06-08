import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const RESEARCH_DIR = path.join(ROOT, 'research');

const ACTIVE_CANDIDATE_STATUSES = new Set(['candidate', 'ready']);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to read JSON: ${path.relative(ROOT, filePath)}\n${error.message}`);
  }
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
    return raw
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();
  }
}

function collectExistingMarketplaces() {
  if (!fs.existsSync(DATA_DIR)) {
    throw new Error('Missing data directory.');
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((name) => /^marketplaces.*\.json$/.test(name))
    .sort();

  const records = [];
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const parsed = readJson(filePath);
    if (!Array.isArray(parsed)) {
      throw new Error(`${path.relative(ROOT, filePath)} must be a JSON array.`);
    }
    for (const record of parsed) {
      records.push({ ...record, __file: file });
    }
  }
  return records;
}

function collectCandidateFiles() {
  if (!fs.existsSync(RESEARCH_DIR)) {
    throw new Error('Missing research directory.');
  }

  return fs
    .readdirSync(RESEARCH_DIR)
    .filter((name) => /^mag-candidate-backlog(?:-[0-9]{3})?\.json$/.test(name))
    .sort()
    .map((name) => path.join(RESEARCH_DIR, name));
}

function collectCandidates() {
  const files = collectCandidateFiles();
  const candidates = [];

  for (const filePath of files) {
    const parsed = readJson(filePath);
    const sourceFile = path.relative(ROOT, filePath);
    const fileCandidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];

    for (const candidate of fileCandidates) {
      candidates.push({ ...candidate, __file: sourceFile });
    }
  }

  return { candidates, files };
}

function addToMap(map, key, value) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function main() {
  const { candidates, files: candidateFiles } = collectCandidates();
  const existing = collectExistingMarketplaces();

  const existingSlugs = new Map();
  const existingNames = new Map();
  const existingDomains = new Map();

  for (const record of existing) {
    addToMap(existingSlugs, record.slug, record);
    addToMap(existingNames, normalizeText(record.canonical_name), record);
    for (const alias of record.aliases || []) {
      addToMap(existingNames, normalizeText(alias), record);
    }
    addToMap(existingDomains, normalizeDomain(record.official_domain_original), record);
    addToMap(existingDomains, normalizeDomain(record.official_url_original), record);
  }

  const candidateIds = new Map();
  const candidateSlugs = new Map();
  const candidateNames = new Map();
  const candidateDomains = new Map();
  const problems = [];

  for (const candidate of candidates) {
    const status = candidate?.consumption?.status || 'candidate';
    const label = `${candidate.candidate_id || '(missing id)'} ${candidate.name || '(missing name)'} in ${candidate.__file || '(unknown file)'}`;

    addToMap(candidateIds, candidate.candidate_id, label);

    if (!ACTIVE_CANDIDATE_STATUSES.has(status)) continue;

    const slug = candidate.slug || '';
    const nameKey = normalizeText(candidate.name);
    const domainKey = normalizeDomain(candidate.domain || candidate.official_url);

    if (!candidate.candidate_id) problems.push(`${label}: missing candidate_id`);
    if (!candidate.name) problems.push(`${label}: missing name`);
    if (!slug) problems.push(`${label}: missing slug`);
    if (!candidate.official_url) problems.push(`${label}: missing official_url`);
    if (!candidate.domain) problems.push(`${label}: missing domain`);
    if (!candidate.consumption || !candidate.consumption.status) problems.push(`${label}: missing consumption.status`);

    if (existingSlugs.has(slug)) {
      const hits = existingSlugs.get(slug).map((r) => `${r.slug} in ${r.__file}`).join(', ');
      problems.push(`${label}: slug already exists (${hits})`);
    }

    if (existingNames.has(nameKey)) {
      const hits = existingNames.get(nameKey).map((r) => `${r.canonical_name} in ${r.__file}`).join(', ');
      problems.push(`${label}: name/alias already exists (${hits})`);
    }

    if (domainKey && existingDomains.has(domainKey)) {
      const hits = existingDomains.get(domainKey).map((r) => `${r.canonical_name} in ${r.__file}`).join(', ');
      problems.push(`${label}: domain already exists (${domainKey}: ${hits})`);
    }

    addToMap(candidateSlugs, slug, label);
    addToMap(candidateNames, nameKey, label);
    addToMap(candidateDomains, domainKey, label);
  }

  for (const [id, entries] of candidateIds) {
    if (id && entries.length > 1) problems.push(`Duplicate candidate id ${id}: ${entries.join(' | ')}`);
  }
  for (const [slug, entries] of candidateSlugs) {
    if (slug && entries.length > 1) problems.push(`Duplicate candidate slug ${slug}: ${entries.join(' | ')}`);
  }
  for (const [name, entries] of candidateNames) {
    if (name && entries.length > 1) problems.push(`Duplicate candidate name ${name}: ${entries.join(' | ')}`);
  }
  for (const [domain, entries] of candidateDomains) {
    if (domain && entries.length > 1) problems.push(`Duplicate candidate domain ${domain}: ${entries.join(' | ')}`);
  }

  const activeCandidates = candidates.filter((candidate) => ACTIVE_CANDIDATE_STATUSES.has(candidate?.consumption?.status || 'candidate')).length;
  console.log(`MAG candidate backlog check`);
  console.log(`Candidate backlog files scanned: ${candidateFiles.length}`);
  console.log(`Existing marketplace records scanned: ${existing.length}`);
  console.log(`Total backlog candidates scanned: ${candidates.length}`);
  console.log(`Active backlog candidates checked: ${activeCandidates}`);

  if (problems.length) {
    console.error('\nCandidate backlog validation failed:');
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
  }

  console.log('Candidate backlog validation passed');
}

main();

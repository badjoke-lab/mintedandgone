import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const RESEARCH_DIR = path.join(ROOT, 'research');
const LIMIT = Number(process.argv[2] || 10);

const REJECTED_STATUSES = new Set(['consumed', 'hold', 'rejected']);

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
    return raw
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();
  }
}

function parseTsv(filePath) {
  const sourceFile = path.relative(ROOT, filePath);
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter((line) => line.trim() && !line.startsWith('#'));
  if (!lines.length) return [];
  const headers = lines[0].split('\t').map((value) => value.trim());
  return lines.slice(1).map((line, index) => {
    const values = line.split('\t');
    const row = Object.fromEntries(headers.map((header, i) => [header, values[i] || '']));
    return {
      candidate_id: row.candidate_id,
      name: row.name,
      slug: row.slug,
      official_url: row.official_url,
      domain: row.domain,
      candidate_scope: row.candidate_scope,
      category: row.category,
      chain_scope: row.chain_scope,
      priority: row.priority || 'P3',
      status: row.status || 'candidate',
      source_file: sourceFile,
      source_line: index + 2,
    };
  });
}

function collectExistingRecords() {
  const files = fs.readdirSync(DATA_DIR).filter((name) => /^marketplaces.*\.json$/.test(name)).sort();
  const records = [];
  for (const file of files) {
    const parsed = readJson(path.join(DATA_DIR, file));
    for (const record of parsed) records.push({ ...record, __file: file });
  }
  return records;
}

function collectCandidates() {
  const files = fs
    .readdirSync(RESEARCH_DIR)
    .filter((name) => /^mag-candidate-backlog(?:-[0-9]{3})?\.(json|tsv)$/.test(name))
    .sort();

  const candidates = [];
  for (const file of files) {
    const filePath = path.join(RESEARCH_DIR, file);
    if (file.endsWith('.tsv')) {
      candidates.push(...parseTsv(filePath));
      continue;
    }
    const parsed = readJson(filePath);
    for (const candidate of parsed.candidates || []) {
      candidates.push({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        slug: candidate.slug,
        official_url: candidate.official_url,
        domain: candidate.domain,
        candidate_scope: candidate.candidate_scope,
        category: candidate.category,
        chain_scope: Array.isArray(candidate.chain_scope) ? candidate.chain_scope.join(',') : candidate.chain_scope || '',
        priority: candidate.priority || 'P3',
        status: candidate?.consumption?.status || candidate.status || 'candidate',
        source_file: file,
        source_line: null,
      });
    }
  }
  return candidates;
}

function addToMap(map, key, value) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function priorityRank(priority) {
  if (priority === 'P0') return 0;
  if (priority === 'P1') return 1;
  if (priority === 'P2') return 2;
  if (priority === 'P3') return 3;
  return 9;
}

function main() {
  const existing = collectExistingRecords();
  const candidates = collectCandidates();

  const existingSlugs = new Map();
  const existingNames = new Map();
  const existingDomains = new Map();

  for (const record of existing) {
    addToMap(existingSlugs, record.slug, record);
    addToMap(existingNames, normalizeText(record.canonical_name), record);
    for (const alias of record.aliases || []) addToMap(existingNames, normalizeText(alias), record);
    addToMap(existingDomains, normalizeDomain(record.official_domain_original), record);
    addToMap(existingDomains, normalizeDomain(record.official_url_original), record);
  }

  const seenCandidateIds = new Set();
  const selectedKeys = new Set();
  const skipped = [];
  const selected = [];

  const sorted = candidates
    .filter((candidate) => candidate.candidate_id)
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.candidate_id.localeCompare(b.candidate_id));

  for (const candidate of sorted) {
    if (seenCandidateIds.has(candidate.candidate_id)) {
      skipped.push({ candidate, reason: 'duplicate_candidate_id' });
      continue;
    }
    seenCandidateIds.add(candidate.candidate_id);

    if (REJECTED_STATUSES.has(candidate.status)) {
      skipped.push({ candidate, reason: `status_${candidate.status}` });
      continue;
    }

    const slug = candidate.slug || '';
    const nameKey = normalizeText(candidate.name);
    const domainKey = normalizeDomain(candidate.domain || candidate.official_url);

    if (!slug || !candidate.name || !candidate.official_url || !candidate.domain) {
      skipped.push({ candidate, reason: 'missing_required_field' });
      continue;
    }
    if (existingSlugs.has(slug)) {
      skipped.push({ candidate, reason: `existing_slug:${slug}` });
      continue;
    }
    if (existingNames.has(nameKey)) {
      skipped.push({ candidate, reason: `existing_name:${candidate.name}` });
      continue;
    }
    if (domainKey && existingDomains.has(domainKey)) {
      skipped.push({ candidate, reason: `existing_domain:${domainKey}` });
      continue;
    }

    const uniqueKey = `${slug}|${nameKey}|${domainKey}`;
    if (selectedKeys.has(uniqueKey)) {
      skipped.push({ candidate, reason: 'duplicate_with_selected_candidate' });
      continue;
    }
    selectedKeys.add(uniqueKey);
    selected.push(candidate);
    if (selected.length >= LIMIT) break;
  }

  console.log(JSON.stringify({
    existing_marketplace_records_scanned: existing.length,
    candidate_records_scanned: candidates.length,
    selected_count: selected.length,
    selected,
    skipped_sample: skipped.slice(0, 25),
  }, null, 2));

  if (selected.length < LIMIT) {
    console.error(`Only selected ${selected.length} candidates; requested ${LIMIT}.`);
    process.exit(1);
  }
}

main();

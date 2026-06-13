import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');

function readGroup(prefix) {
  const names = fs.readdirSync(dataDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b));
  if (!names.length) throw new Error(`No ${prefix} JSON files found.`);
  return names.flatMap((name) => {
    const value = JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
    if (!Array.isArray(value)) throw new Error(`${name} must contain an array.`);
    return value;
  });
}

function unique(rows, key, label) {
  const seen = new Set();
  for (const row of rows) {
    const value = row?.[key];
    if (!value) throw new Error(`${label} missing ${key}.`);
    if (seen.has(value)) throw new Error(`Duplicate ${label} ${key}: ${value}`);
    seen.add(value);
  }
}

export function countValues(values) {
  return values.reduce((counts, raw) => {
    const value = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

export function collectMagData() {
  const marketplaces = readGroup('marketplaces');
  const events = readGroup('events');
  const evidence = readGroup('evidence');
  unique(marketplaces, 'id', 'marketplace');
  unique(marketplaces, 'slug', 'marketplace');
  unique(events, 'id', 'event');
  unique(evidence, 'id', 'evidence');

  const counts = {
    primary_records: marketplaces.length,
    events: events.length,
    evidence: evidence.length,
  };
  const breakdown = {
    marketplaces: marketplaces.length,
    status: countValues(marketplaces.map((row) => row.status)),
    category: countValues(marketplaces.map((row) => row.category)),
    marketplace_scope: countValues(marketplaces.map((row) => row.marketplace_scope)),
    origin_bucket: countValues(marketplaces.map((row) => row.origin_bucket)),
    closure_reason: countValues(marketplaces.map((row) => row.closure_reason)),
    frontend_status: countValues(marketplaces.map((row) => row.frontend_status)),
    contract_status: countValues(marketplaces.map((row) => row.contract_status)),
    asset_status: countValues(marketplaces.map((row) => row.asset_status)),
    review_status: countValues(marketplaces.map((row) => row.review_status)),
    confidence: countValues(marketplaces.map((row) => row.confidence)),
    chain_scope: countValues(marketplaces.flatMap((row) => row.chain_scope || [])),
    event_type: countValues(events.map((row) => row.event_type)),
    evidence_reliability: countValues(evidence.map((row) => row.reliability)),
    evidence_source_type: countValues(evidence.map((row) => row.source_type)),
  };
  const lastReviewedAt = marketplaces
    .map((row) => row.last_verified_at)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  return { marketplaces, events, evidence, counts, breakdown, lastReviewedAt };
}

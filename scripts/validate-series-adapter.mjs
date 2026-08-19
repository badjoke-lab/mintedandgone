import { existsSync, readFileSync } from 'node:fs';

function readJson(path) {
  if (!existsSync(path)) throw new Error(`${path}: missing`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}

function same(a, b) {
  return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
}

const version = readJson('public/version.json');
const nativeIndex = readJson('public/data/marketplaces.json');
const descriptor = readJson('public/data/series/registry.json');
const index = readJson('public/data/series/index.json');
const errors = [];
const fail = (message) => errors.push(message);

if (descriptor.series_schema_version !== '1.0.0') fail('Series schema version mismatch');
if (descriptor.registry?.id !== 'minted-and-gone') fail('registry ID mismatch');
if (descriptor.registry?.native_project_id !== 'mag') fail('native project ID mismatch');
if (descriptor.registry?.type !== 'nft_marketplace_history') fail('registry type mismatch');
if (descriptor.canonical_only !== true) fail('descriptor must be canonical-only');
if (descriptor.record_counts?.primary_records !== version.record_counts.marketplaces) fail('marketplace count mismatch');
if (descriptor.record_counts?.events !== version.record_counts.events) fail('event count mismatch');
if (descriptor.record_counts?.evidence !== version.record_counts.evidence) fail('evidence count mismatch');
if (descriptor.capabilities?.relationships !== 'adapter') fail('relationship capability must remain adapter during Stage 3');
if (index.record_count !== nativeIndex.record_count) fail('Series/native marketplace count mismatch');

const keys = new Set();
for (const row of index.records ?? []) {
  const native = nativeIndex.records.find((record) => record.id === row.native_record_id && record.slug === row.slug);
  if (!native) {
    fail(`${row.slug}: native identity missing`);
    continue;
  }
  const expectedKey = `minted-and-gone:marketplace_dossier:${native.id}`;
  if (row.global_record_key !== expectedKey) fail(`${row.slug}: global key mismatch`);
  if (keys.has(row.global_record_key)) fail(`${row.slug}: duplicate global key`);
  keys.add(row.global_record_key);

  const dossier = readJson(`public/data/marketplace/${row.slug}.json`);
  const envelope = readJson(`public/data/series/records/${row.slug}.json`);
  if (envelope.object_type !== 'record_envelope') fail(`${row.slug}: envelope object type mismatch`);
  if (envelope.record_key?.native_record_id !== dossier.marketplace?.id) fail(`${row.slug}: native ID mismatch`);
  if (envelope.current_state?.status !== dossier.marketplace?.status) fail(`${row.slug}: status mismatch`);
  if (!same(envelope.events?.records ?? [], dossier.events ?? [])) fail(`${row.slug}: events mismatch`);
  if (!same(envelope.evidence?.records ?? [], dossier.evidence ?? [])) fail(`${row.slug}: evidence mismatch`);
  if ((envelope.relationships ?? []).length !== 0) fail(`${row.slug}: typed relationships must not be emitted during Stage 3`);
  if (envelope.current_state?.native?.predecessor_marketplace !== (dossier.relationships?.predecessor_marketplace ?? null)) fail(`${row.slug}: predecessor preservation mismatch`);
  if (envelope.current_state?.native?.successor_marketplace !== (dossier.relationships?.successor_marketplace ?? null)) fail(`${row.slug}: successor preservation mismatch`);
  if (!same(envelope.provenance?.record_quality_flags ?? [], dossier.marketplace?.record_quality_flags ?? [])) fail(`${row.slug}: review flags mismatch`);
  if (envelope.provenance?.review_status !== dossier.marketplace?.review_status) fail(`${row.slug}: review status mismatch`);
}

const hen = readJson('public/data/series/records/hic-et-nunc.json');
if (hen.current_state?.native?.successor_marketplace !== 'teia') fail('Hic et Nunc native successor not preserved');
if (!hen.provenance?.record_quality_flags?.includes('needs_successor_review')) fail('Hic et Nunc successor review flag not preserved');
if ((hen.relationships ?? []).length !== 0) fail('Hic et Nunc relationship promoted before Stage 5 review');

if (errors.length) {
  console.error(`MAG Series adapter validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`MAG Series adapter validation passed: ${index.record_count} marketplace envelopes`);

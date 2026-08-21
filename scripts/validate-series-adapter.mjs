import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const REGISTRY_ID = 'minted-and-gone';
const AUTHORITY_PATH = 'config/ledger-series-phase9-stage5-mag-local-authority.json';

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

function globalKey(endpoint) {
  return `${endpoint?.registry_id}:${endpoint?.native_record_type}:${endpoint?.native_record_id}`;
}

function relationshipId(relationType, sourceGlobalKey, targetGlobalKey) {
  return `series_rel_${createHash('sha256')
    .update(`${relationType}\n${sourceGlobalKey}\n${targetGlobalKey}`, 'utf8')
    .digest('hex')}`;
}

const version = readJson('public/version.json');
const nativeIndex = readJson('public/data/marketplaces.json');
const descriptor = readJson('public/data/series/registry.json');
const index = readJson('public/data/series/index.json');
const relationships = readJson('public/data/series/relationships.json');
const authority = readJson(AUTHORITY_PATH);
const errors = [];
const fail = (message) => errors.push(message);

if (descriptor.series_schema_version !== '1.0.0') fail('Series schema version mismatch');
if (descriptor.registry?.id !== REGISTRY_ID) fail('registry ID mismatch');
if (descriptor.registry?.native_project_id !== 'mag') fail('native project ID mismatch');
if (descriptor.registry?.type !== 'nft_marketplace_history') fail('registry type mismatch');
if (descriptor.canonical_only !== true) fail('descriptor must be canonical-only');
if (descriptor.record_counts?.primary_records !== version.record_counts.marketplaces) fail('marketplace count mismatch');
if (descriptor.record_counts?.events !== version.record_counts.events) fail('event count mismatch');
if (descriptor.record_counts?.evidence !== version.record_counts.evidence) fail('evidence count mismatch');
if (descriptor.record_counts?.relationships !== 17) fail('relationship count must be 17');
if (descriptor.routes?.relationships !== '/data/series/relationships.json') fail('relationship route mismatch');
if (descriptor.capabilities?.relationships !== 'adapter') fail('relationship capability must be adapter');
if (index.record_count !== nativeIndex.record_count) fail('Series/native marketplace count mismatch');
if (authority.registry_id !== REGISTRY_ID || authority.accepted_count !== 17) fail('unexpected Stage 5 authority identity/count');
if (!Array.isArray(authority.finite_allowlist) || authority.finite_allowlist.length !== 17) fail('authority allowlist must contain 17 rows');
if (!Array.isArray(relationships) || relationships.length !== 17) fail('relationship transport must be a 17-row array');

const keys = new Set();
for (const row of index.records ?? []) {
  const native = nativeIndex.records.find((record) => record.id === row.native_record_id && record.slug === row.slug);
  if (!native) {
    fail(`${row.slug}: native identity missing`);
    continue;
  }
  const expectedKey = `${REGISTRY_ID}:marketplace_dossier:${native.id}`;
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
  if ((envelope.relationships ?? []).length !== 0) fail(`${row.slug}: record-envelope relationships must remain empty during Stage 5 publication`);
  if (envelope.current_state?.native?.predecessor_marketplace !== (dossier.relationships?.predecessor_marketplace ?? null)) fail(`${row.slug}: predecessor preservation mismatch`);
  if (envelope.current_state?.native?.successor_marketplace !== (dossier.relationships?.successor_marketplace ?? null)) fail(`${row.slug}: successor preservation mismatch`);
  if (!same(envelope.provenance?.record_quality_flags ?? [], dossier.marketplace?.record_quality_flags ?? [])) fail(`${row.slug}: review flags mismatch`);
  if (envelope.provenance?.review_status !== dossier.marketplace?.review_status) fail(`${row.slug}: review status mismatch`);
}

const expectedTuples = authority.finite_allowlist.map(([relationType, source, target]) => `${relationType}\n${source}\n${target}`);
const expectedTupleSet = new Set(expectedTuples);
if (expectedTupleSet.size !== expectedTuples.length) fail('authority allowlist contains duplicate tuples');

const actualTupleSet = new Set();
const ids = new Set();
for (const [relationshipIndex, relationship] of (relationships ?? []).entries()) {
  const label = `relationship ${relationshipIndex + 1}`;
  if (relationship.series_schema_version !== '1.0.0') fail(`${label}: schema version mismatch`);
  if (relationship.object_type !== 'relationship_record') fail(`${label}: object type mismatch`);
  if (!['predecessor_of', 'successor_of'].includes(relationship.relation_type)) fail(`${label}: unauthorized relation type`);
  if (relationship.direction !== 'directed') fail(`${label}: direction must be directed`);
  if (relationship.provenance?.basis !== 'native_reviewed_relationship') fail(`${label}: provenance basis mismatch`);
  if (!Array.isArray(relationship.provenance?.native_evidence_refs)) fail(`${label}: native_evidence_refs must be an array`);

  const source = globalKey(relationship.source);
  const target = globalKey(relationship.target);
  if (!keys.has(source)) fail(`${label}: source endpoint does not resolve to a Stage 3 Series record`);
  if (!keys.has(target)) fail(`${label}: target endpoint does not resolve to a Stage 3 Series record`);
  if (source === target) fail(`${label}: self-loop is not authorized`);

  const tuple = `${relationship.relation_type}\n${source}\n${target}`;
  if (!expectedTupleSet.has(tuple)) fail(`${label}: tuple is outside reviewed finite allowlist`);
  if (actualTupleSet.has(tuple)) fail(`${label}: duplicate relationship tuple`);
  actualTupleSet.add(tuple);

  const expectedId = relationshipId(relationship.relation_type, source, target);
  if (relationship.id !== expectedId) fail(`${label}: deterministic ID mismatch`);
  if (ids.has(relationship.id)) fail(`${label}: duplicate relationship ID`);
  ids.add(relationship.id);
}

if (actualTupleSet.size !== expectedTupleSet.size) fail('generated relationship set does not equal reviewed finite allowlist');
for (const tuple of expectedTupleSet) {
  if (!actualTupleSet.has(tuple)) fail(`missing reviewed relationship tuple: ${tuple.replaceAll('\n', ' | ')}`);
}

const hen = readJson('public/data/series/records/hic-et-nunc.json');
if (hen.current_state?.native?.successor_marketplace !== 'teia') fail('Hic et Nunc native successor not preserved');
if (!hen.provenance?.record_quality_flags?.includes('needs_successor_review')) fail('Hic et Nunc successor review flag not preserved');
if ((hen.relationships ?? []).length !== 0) fail('Hic et Nunc record-envelope relationships must remain empty during Stage 5 publication');

if (errors.length) {
  console.error(`MAG Series adapter validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`MAG Series adapter validation passed: ${index.record_count} marketplace envelopes, ${relationships.length} reviewed relationships`);

import { readFileSync } from 'node:fs';
import { loadCanonicalRegistry } from './registry-public-lib.mjs';

const registry = loadCanonicalRegistry();
const stats = JSON.parse(readFileSync('public/data/stats.json', 'utf8'));
const errors = [];
const fail = (message) => errors.push(message);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const countBy = (items, getter) => items.reduce((acc, item) => {
  const raw = getter(item);
  const values = Array.isArray(raw) ? raw : [raw ?? 'unknown'];
  for (const value of values) acc[value || 'unknown'] = (acc[value || 'unknown'] ?? 0) + 1;
  return acc;
}, {});

const fadedStatuses = new Set(['inactive', 'dead', 'acquired', 'merged', 'rebranded']);
const faded = registry.marketplaces.filter((record) => fadedStatuses.has(record.status));
const closureReasons = countBy(faded, (record) => record.closure_reason || 'unknown');
if (!same(stats.breakdowns?.by_closure_reason_faded_side, closureReasons)) fail('closure reason distribution mismatch');

const migrationIds = new Set(registry.events.filter((event) => event.event_type === 'asset_migration_announced').map((event) => event.marketplace_id));
const successorCount = registry.marketplaces.filter((record) => Boolean(record.successor_marketplace)).length;
const predecessorCount = registry.marketplaces.filter((record) => Boolean(record.predecessor_marketplace)).length;
const fadedWithOutcome = faded.filter((record) => Boolean(record.successor_marketplace) || migrationIds.has(record.id)).length;
if (stats.lifecycle?.successor_recorded !== successorCount) fail('successor count mismatch');
if (stats.lifecycle?.predecessor_recorded !== predecessorCount) fail('predecessor count mismatch');
if (stats.lifecycle?.migration_event_recorded !== migrationIds.size) fail('migration-event marketplace count mismatch');
if (stats.lifecycle?.faded_with_successor_or_migration?.count !== fadedWithOutcome) fail('faded successor/migration count mismatch');
if (stats.lifecycle?.faded_with_successor_or_migration?.total !== faded.length) fail('faded successor/migration denominator mismatch');

const lifespanEligible = registry.marketplaces.filter((record) => Number.isInteger(record.launch_year) && Number.isInteger(record.end_year) && record.end_year >= record.launch_year);
const lifespanBuckets = countBy(lifespanEligible, (record) => {
  const years = record.end_year - record.launch_year;
  if (years === 0) return 'same_year';
  if (years <= 2) return '1_2_years';
  if (years <= 5) return '3_5_years';
  if (years <= 10) return '6_10_years';
  return '11_plus_years';
});
if (stats.lifecycle?.lifespan?.eligible_count !== lifespanEligible.length) fail('lifespan eligible count mismatch');
if (!same(stats.lifecycle?.lifespan?.buckets, lifespanBuckets)) fail('lifespan bucket mismatch');

const evidenceByMarketplace = new Map();
for (const item of registry.evidence) {
  const list = evidenceByMarketplace.get(item.marketplace_id) ?? [];
  list.push(item);
  evidenceByMarketplace.set(item.marketplace_id, list);
}
const highReliability = registry.marketplaces.filter((record) => (evidenceByMarketplace.get(record.id) ?? []).some((item) => item.reliability === 'high')).length;
const archivedEvidence = registry.marketplaces.filter((record) => (evidenceByMarketplace.get(record.id) ?? []).some((item) => Boolean(item.archived_url))).length;
if (stats.coverage?.high_reliability_evidence?.count !== highReliability) fail('high-reliability evidence coverage mismatch');
if (stats.coverage?.archived_evidence?.count !== archivedEvidence) fail('archived evidence coverage mismatch');

const eventsByMarketplace = new Map();
for (const event of registry.events) {
  const list = eventsByMarketplace.get(event.marketplace_id) ?? [];
  list.push(event);
  eventsByMarketplace.set(event.marketplace_id, list);
}
const lifecycleDepth = countBy(registry.marketplaces, (record) => {
  const count = (eventsByMarketplace.get(record.id) ?? []).length;
  return count === 0 ? 'zero' : count === 1 ? 'one' : 'multiple';
});
if (!same(stats.quality?.lifecycle_event_depth, lifecycleDepth)) fail('lifecycle event depth mismatch');

const page = readFileSync('src/pages/stats.astro', 'utf8');
for (const marker of ['Lifecycle aftermath', 'Closure / change reasons — faded side', 'Recorded lifespan buckets', 'Successor & migration coverage', 'Coverage & provenance']) {
  if (!page.includes(marker)) fail(`Stats page missing Phase 5 marker: ${marker}`);
}

if (errors.length) {
  console.error(`MAG Phase 5 stats validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`MAG Phase 5 lifecycle stats validation passed: ${registry.marketplaces.length} marketplaces`);

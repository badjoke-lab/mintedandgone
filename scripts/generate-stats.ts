import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const readMany = (prefix) => readdirSync('data')
  .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
  .sort()
  .flatMap((name) => read(`data/${name}`));

const marketplaces = readMany('marketplaces');
const events = readMany('events');
const evidence = readMany('evidence');
const countBy = (items, fn) => items.reduce((acc, item) => { const raw = fn(item); const vals = Array.isArray(raw) ? raw : [raw ?? 'unknown']; for (const v of vals) acc[v || 'unknown'] = (acc[v || 'unknown'] ?? 0) + 1; return acc; }, {});
const transitioned = new Set(['acquired','merged','rebranded']); const faded = new Set(['inactive','dead','acquired','merged','rebranded']);
const archiveCount = marketplaces.filter((m) => Boolean(m.archived_url)).length;
const reviewedCount = marketplaces.filter((m) => ['reviewed','verified','reviewed_staging'].includes(m.review_status)).length;
const highCount = marketplaces.filter((m) => m.confidence === 'high').length;
const stats = {
  generated_at: new Date().toISOString(),
  source: { marketplaces_count: marketplaces.length, events_count: events.length, evidence_count: evidence.length, note: 'Stats generated from source-reviewed draft records. Counts reflect current registry data, not final public-quality certification.' },
  kpis: {
    total_marketplaces: marketplaces.length,
    total_events: events.length,
    total_evidence: evidence.length,
    active_total: marketplaces.filter((m)=>m.status==='active').length,
    limited_total: marketplaces.filter((m)=>m.status==='limited').length,
    inactive_total: marketplaces.filter((m)=>m.status==='inactive').length,
    dead_total: marketplaces.filter((m)=>m.status==='dead').length,
    transitioned_total: marketplaces.filter((m)=>transitioned.has(m.status)).length,
    faded_total: marketplaces.filter((m)=>faded.has(m.status)).length,
    archive_coverage: marketplaces.length ? archiveCount / marketplaces.length : 0,
    high_confidence_share: marketplaces.length ? highCount / marketplaces.length : 0,
    reviewed_share: marketplaces.length ? reviewedCount / marketplaces.length : 0
  },
  breakdowns: {
    by_status: countBy(marketplaces, m=>m.status), by_category: countBy(marketplaces, m=>m.category), by_marketplace_scope: countBy(marketplaces, m=>m.marketplace_scope), by_chain: countBy(marketplaces, m=>m.chain_scope), by_confidence: countBy(marketplaces, m=>m.confidence), by_review_status: countBy(marketplaces, m=>m.review_status)
  },
  coverage: { archive_coverage: { count: archiveCount, total: marketplaces.length, share: marketplaces.length ? archiveCount / marketplaces.length : 0 } },
  quality: { record_quality_flags: countBy(marketplaces.flatMap((m)=>m.record_quality_flags ?? []), x=>x), evidence_depth: countBy(marketplaces, (m) => { const n = evidence.filter((e)=>e.marketplace_id===m.id).length; return n === 0 ? 'zero' : n === 1 ? 'one' : 'multiple'; }) },
  distributions: { launch_year: countBy(marketplaces, m=>m.launch_year ? String(m.launch_year) : 'unknown'), end_year: countBy(marketplaces, m=>m.end_year ? String(m.end_year) : 'unknown') },
  completeness: { what_remains_present: { count: marketplaces.filter((m)=>Boolean(m.what_remains)).length, total: marketplaces.length } }
};
writeFileSync('data/stats.json', `${JSON.stringify(stats, null, 2)}\n`);
writeFileSync('data/stats-history.json', `${JSON.stringify([{ snapshot_at: stats.generated_at, ...stats }], null, 2)}\n`);
console.log('Stats generated');

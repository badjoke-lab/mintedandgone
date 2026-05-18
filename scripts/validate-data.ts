import { readFileSync } from 'node:fs';
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const marketplaces = read('data/marketplaces.json');
const events = read('data/events.json');
const evidence = [...read('data/evidence.json'), ...read('data/evidence-lg-art-lab.json')];
const stats = read('data/stats.json');
const errors = []; const warnings = [];
const statuses = new Set(['active','limited','inactive','dead','acquired','merged','rebranded','unknown']);
const requiredMarketplace = ['id','slug','canonical_name','aliases','status','category','marketplace_scope','chain_scope','origin_bucket','summary','confidence','review_status','record_quality_flags','last_verified_at'];
const ids = new Set(); const slugs = new Set();
for (const [i, m] of marketplaces.entries()) {
  for (const field of requiredMarketplace) if (!(field in m)) errors.push(`marketplaces[${i}] missing ${field}`);
  if (ids.has(m.id)) errors.push(`duplicate marketplace id ${m.id}`); ids.add(m.id);
  if (slugs.has(m.slug)) errors.push(`duplicate marketplace slug ${m.slug}`); slugs.add(m.slug);
  if (!statuses.has(m.status)) errors.push(`${m.slug} invalid status ${m.status}`);
  if (!Array.isArray(m.chain_scope) || m.chain_scope.length === 0) errors.push(`${m.slug} chain_scope must be non-empty array`);
  if (Array.isArray(m.chain_scope) && m.chain_scope.includes('unknown') && m.chain_scope.length > 1) errors.push(`${m.slug} mixes unknown chain with other chains`);
  if (m.confidence === 'low') warnings.push(`${m.slug} has low confidence`);
}
const eventIds = new Set();
for (const [i, e] of events.entries()) {
  for (const field of ['id','marketplace_id','event_type','event_date','event_date_precision','title','description','confidence']) if (!(field in e)) errors.push(`events[${i}] missing ${field}`);
  eventIds.add(e.id);
  if (!ids.has(e.marketplace_id)) errors.push(`${e.id} references missing marketplace ${e.marketplace_id}`);
}
for (const [i, s] of evidence.entries()) {
  for (const field of ['id','marketplace_id','source_type','title','url','publisher','reliability','claim_scope']) if (!(field in s)) errors.push(`evidence[${i}] missing ${field}`);
  if (!ids.has(s.marketplace_id)) errors.push(`${s.id} references missing marketplace ${s.marketplace_id}`);
  if (s.event_id && !eventIds.has(s.event_id)) errors.push(`${s.id} references missing event ${s.event_id}`);
}
if (stats.source) {
  if (stats.source.marketplaces_count !== marketplaces.length) errors.push('stats source marketplaces_count mismatch');
  if (stats.source.events_count !== events.length) errors.push('stats source events_count mismatch');
  if (stats.source.evidence_count !== evidence.length) errors.push('stats source evidence_count mismatch');
}
if (warnings.length) console.warn(`Warnings:\n- ${warnings.join('\n- ')}`);
if (errors.length) { console.error(`Validation failed:\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log('Validation passed');

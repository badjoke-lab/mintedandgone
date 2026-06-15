import { readdirSync, readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const readMany = (prefix) => readdirSync('data')
  .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
  .sort()
  .flatMap((name) => read(`data/${name}`));

const marketplaces = readMany('marketplaces');
const events = readMany('events');
const evidence = readMany('evidence');
const stats = read('data/stats.json');
const errors = []; const warnings = [];
const statuses = new Set(['active','limited','inactive','dead','acquired','merged','rebranded','unknown']);
const requiredMarketplace = ['id','slug','canonical_name','aliases','status','category','marketplace_scope','chain_scope','origin_bucket','summary','confidence','review_status','record_quality_flags','last_verified_at'];

const tokenizedCollectiblesEnums = {
  asset_backing: new Set(['physical_1_to_1','physical_pool_backed','physical_redeemable','physical_nonredeemable','mixed','unclear']),
  platform_roles: new Set(['marketplace','tokenizer','issuer','custody_orchestrator','mystery_pack_operator','buyback_counterparty','redemption_operator','auction_operator']),
  custody_model: new Set(['platform_vault','third_party_vault','issuer_vault','distributed_custody','self_custody','unknown']),
  redemption_status: new Set(['active','restricted','paused','ended','not_offered','unknown']),
  randomized_sale_model: new Set(['none','mystery_pack','gacha','repack','multiple','unknown']),
  buyback_model: new Set(['none','instant_buyback','platform_offer','open_market_only','restricted','unknown'])
};
const tokenizedCollectiblesFields = new Set([
  'asset_backing',
  'platform_roles',
  'custody_model',
  'redemption_status',
  'randomized_sale_model',
  'buyback_model',
  'asset_categories',
  'custodian_name',
  'insurance_status',
  'redemption_fee',
  'redemption_regions',
  'proof_of_backing_model',
  'legal_title_model'
]);

const ids = new Set(); const slugs = new Set();
for (const [i, m] of marketplaces.entries()) {
  for (const field of requiredMarketplace) if (!(field in m)) errors.push(`marketplaces[${i}] missing ${field}`);
  if (ids.has(m.id)) errors.push(`duplicate marketplace id ${m.id}`); ids.add(m.id);
  if (slugs.has(m.slug)) errors.push(`duplicate marketplace slug ${m.slug}`); slugs.add(m.slug);
  if (!statuses.has(m.status)) errors.push(`${m.slug} invalid status ${m.status}`);
  if (!Array.isArray(m.chain_scope) || m.chain_scope.length === 0) errors.push(`${m.slug} chain_scope must be non-empty array`);
  if (Array.isArray(m.chain_scope) && m.chain_scope.includes('unknown') && m.chain_scope.length > 1) errors.push(`${m.slug} mixes unknown chain with other chains`);
  if (m.confidence === 'low') warnings.push(`${m.slug} has low confidence`);

  const hasTokenizedCollectiblesField = [...tokenizedCollectiblesFields].some((field) => field in m);
  if (hasTokenizedCollectiblesField && m.category !== 'tokenized_collectibles') {
    errors.push(`${m.slug} uses tokenized-collectibles fields without category tokenized_collectibles`);
  }

  if (m.category === 'tokenized_collectibles') {
    for (const field of ['asset_backing','platform_roles','custody_model','redemption_status','randomized_sale_model','buyback_model','asset_categories']) {
      if (!(field in m)) errors.push(`${m.slug} tokenized_collectibles record missing ${field}`);
    }

    if (m.asset_backing && !tokenizedCollectiblesEnums.asset_backing.has(m.asset_backing)) {
      errors.push(`${m.slug} invalid asset_backing ${m.asset_backing}`);
    }
    if (!Array.isArray(m.platform_roles) || m.platform_roles.length === 0) {
      errors.push(`${m.slug} platform_roles must be a non-empty array`);
    } else {
      for (const role of m.platform_roles) {
        if (!tokenizedCollectiblesEnums.platform_roles.has(role)) errors.push(`${m.slug} invalid platform role ${role}`);
      }
      if (!m.platform_roles.includes('marketplace')) warnings.push(`${m.slug} tokenized_collectibles record has no marketplace role`);
    }
    if (m.custody_model && !tokenizedCollectiblesEnums.custody_model.has(m.custody_model)) {
      errors.push(`${m.slug} invalid custody_model ${m.custody_model}`);
    }
    if (m.redemption_status && !tokenizedCollectiblesEnums.redemption_status.has(m.redemption_status)) {
      errors.push(`${m.slug} invalid redemption_status ${m.redemption_status}`);
    }
    if (m.randomized_sale_model && !tokenizedCollectiblesEnums.randomized_sale_model.has(m.randomized_sale_model)) {
      errors.push(`${m.slug} invalid randomized_sale_model ${m.randomized_sale_model}`);
    }
    if (m.buyback_model && !tokenizedCollectiblesEnums.buyback_model.has(m.buyback_model)) {
      errors.push(`${m.slug} invalid buyback_model ${m.buyback_model}`);
    }
    if (!Array.isArray(m.asset_categories) || m.asset_categories.length === 0 || m.asset_categories.some((value) => typeof value !== 'string' || value.trim() === '')) {
      errors.push(`${m.slug} asset_categories must be a non-empty string array`);
    }
    if (m.redemption_regions && !Array.isArray(m.redemption_regions)) {
      errors.push(`${m.slug} redemption_regions must be an array when present`);
    }
  }
}

const eventIds = new Set();
for (const [i, e] of events.entries()) {
  for (const field of ['id','marketplace_id','event_type','event_date','event_date_precision','title','description','confidence']) if (!(field in e)) errors.push(`events[${i}] missing ${field}`);
  eventIds.add(e.id);
  if (!ids.has(e.marketplace_id)) errors.push(`${e.id} references missing marketplace ${e.marketplace_id}`);
}

const evidenceByMarketplace = new Map();
for (const [i, s] of evidence.entries()) {
  for (const field of ['id','marketplace_id','source_type','title','url','publisher','reliability','claim_scope']) if (!(field in s)) errors.push(`evidence[${i}] missing ${field}`);
  if (!ids.has(s.marketplace_id)) errors.push(`${s.id} references missing marketplace ${s.marketplace_id}`);
  if (s.event_id && !eventIds.has(s.event_id)) errors.push(`${s.id} references missing event ${s.event_id}`);
  if (!evidenceByMarketplace.has(s.marketplace_id)) evidenceByMarketplace.set(s.marketplace_id, []);
  evidenceByMarketplace.get(s.marketplace_id).push(s);
}

for (const m of marketplaces.filter((record) => record.category === 'tokenized_collectibles')) {
  const sources = evidenceByMarketplace.get(m.id) ?? [];
  const claimScopes = new Set(sources.map((source) => source.claim_scope));

  if (sources.length < 3) errors.push(`${m.slug} tokenized_collectibles record requires at least 3 evidence records`);
  if (!['physical_backing','custody','redemption','legal'].some((scope) => claimScopes.has(scope))) {
    errors.push(`${m.slug} lacks evidence scoped to physical backing, custody, redemption, or legal terms`);
  }
  if (m.asset_backing === 'physical_1_to_1' && !claimScopes.has('physical_backing')) {
    errors.push(`${m.slug} physical_1_to_1 claim requires physical_backing evidence`);
  }
  if (['active','restricted','paused','ended'].includes(m.redemption_status) && !claimScopes.has('redemption')) {
    errors.push(`${m.slug} redemption_status ${m.redemption_status} requires redemption evidence`);
  }
  if (m.custodian_name && !claimScopes.has('custody')) {
    errors.push(`${m.slug} custodian_name requires custody evidence`);
  }
  if (!['none','unknown'].includes(m.randomized_sale_model) && !claimScopes.has('randomized_sale')) {
    warnings.push(`${m.slug} randomized sale model has no randomized_sale evidence`);
  }
}

if (stats.source) {
  if (stats.source.marketplaces_count !== marketplaces.length) errors.push('stats source marketplaces_count mismatch');
  if (stats.source.events_count !== events.length) errors.push('stats source events_count mismatch');
  if (stats.source.evidence_count !== evidence.length) errors.push('stats source evidence_count mismatch');
}
if (warnings.length) console.warn(`Warnings:\n- ${warnings.join('\n- ')}`);
if (errors.length) { console.error(`Validation failed:\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log('Validation passed');

import { readdirSync, readFileSync } from 'node:fs';

const readMany = (prefix) => readdirSync('data')
  .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
  .sort()
  .flatMap((name) => JSON.parse(readFileSync(`data/${name}`, 'utf8')));

const marketplaces = readMany('marketplaces');
const events = readMany('events');
const evidence = readMany('evidence');
const errors = [];

const allowedEventTypes = new Set([
  'launched',
  'rebranded',
  'acquired',
  'merged',
  'shutdown_announced',
  'shutdown_effective',
  'other',
  'status_review',
  'tokenization_launch',
  'marketplace_launch',
  'mystery_pack_launch',
  'physical_redemption_launch',
  'redemption_paused',
  'redemption_resumed',
  'redemption_ended',
  'custodian_changed',
  'vault_migrated',
  'insurance_changed',
  'buyback_launched',
  'buyback_policy_changed',
  'chain_migrated',
  'marketplace_shutdown',
  'insolvency_announced',
  'asset_return_process_announced'
]);

const marketplaceById = new Map(marketplaces.map((item) => [item.id, item]));
const eventById = new Map();
const eventsByMarketplace = new Map();
const evidenceByMarketplace = new Map();
const evidenceByEvent = new Map();

const eventIds = new Set();
for (const event of events) {
  if (eventIds.has(event.id)) errors.push(`duplicate event id ${event.id}`);
  eventIds.add(event.id);
  eventById.set(event.id, event);
  if (!eventsByMarketplace.has(event.marketplace_id)) eventsByMarketplace.set(event.marketplace_id, []);
  eventsByMarketplace.get(event.marketplace_id).push(event);

  const marketplace = marketplaceById.get(event.marketplace_id);
  if (marketplace?.category === 'tokenized_collectibles' && !allowedEventTypes.has(event.event_type)) {
    errors.push(`${event.id} unsupported tokenized event_type ${event.event_type}`);
  }
}

const evidenceIds = new Set();
for (const source of evidence) {
  if (evidenceIds.has(source.id)) errors.push(`duplicate evidence id ${source.id}`);
  evidenceIds.add(source.id);

  if (!evidenceByMarketplace.has(source.marketplace_id)) evidenceByMarketplace.set(source.marketplace_id, []);
  evidenceByMarketplace.get(source.marketplace_id).push(source);

  if (source.event_id) {
    const event = eventById.get(source.event_id);
    if (!event) {
      errors.push(`${source.id} references missing event ${source.event_id}`);
    } else if (event.marketplace_id !== source.marketplace_id) {
      errors.push(`${source.id} marketplace does not match event ${source.event_id}`);
    }
    if (!evidenceByEvent.has(source.event_id)) evidenceByEvent.set(source.event_id, []);
    evidenceByEvent.get(source.event_id).push(source);
  }
}

for (const marketplace of marketplaces.filter((item) => item.category === 'tokenized_collectibles')) {
  const entityEvents = eventsByMarketplace.get(marketplace.id) ?? [];
  const sources = evidenceByMarketplace.get(marketplace.id) ?? [];
  const scopes = new Set(sources.map((source) => source.claim_scope));

  if (entityEvents.length === 0) errors.push(`${marketplace.slug} requires at least one event`);
  if (sources.length < 3) errors.push(`${marketplace.slug} requires at least 3 evidence records`);
  if (!sources.some((source) => source.source_type === 'archive_capture' || source.archived_url)) {
    errors.push(`${marketplace.slug} requires archive evidence`);
  }
  if (marketplace.asset_backing === 'physical_1_to_1' && !scopes.has('physical_backing')) {
    errors.push(`${marketplace.slug} physical_1_to_1 requires physical_backing evidence`);
  }
  if (['active', 'restricted', 'paused', 'ended'].includes(marketplace.redemption_status) && !scopes.has('redemption')) {
    errors.push(`${marketplace.slug} redemption_status requires redemption evidence`);
  }
  if (marketplace.custody_model !== 'unknown' && !scopes.has('custody')) {
    errors.push(`${marketplace.slug} custody_model requires custody evidence`);
  }
  if (!['none', 'unknown'].includes(marketplace.randomized_sale_model) && !scopes.has('randomized_sale')) {
    errors.push(`${marketplace.slug} randomized_sale_model requires randomized_sale evidence`);
  }
  if (!['none', 'open_market_only', 'unknown'].includes(marketplace.buyback_model) && !scopes.has('buyback')) {
    errors.push(`${marketplace.slug} buyback_model requires buyback evidence`);
  }

  for (const event of entityEvents) {
    const linked = evidenceByEvent.get(event.id) ?? [];
    if (Number.isInteger(event.source_count) && event.source_count !== linked.length) {
      errors.push(`${event.id} source_count ${event.source_count} != ${linked.length}`);
    }
  }
}

if (errors.length) {
  console.error(`Tokenized collectibles integrity failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Tokenized collectibles integrity passed');

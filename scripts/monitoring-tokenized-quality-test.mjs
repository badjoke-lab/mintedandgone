import assert from 'node:assert/strict';
import { runRecordQuality } from './monitoring-tokenized-quality.mjs';

function buildData(tokenizedSourceCount = 1) {
  const tokenized = {
    id: 'tokenized-1',
    slug: 'tokenized-one',
    canonical_name: 'Tokenized One',
    category: 'tokenized_collectibles',
    official_url_original: 'https://example.com/',
    archived_url: 'https://web.archive.org/web/*/https://example.com/',
    last_verified_at: '2026-06-16',
    asset_backing: 'physical_1_to_1',
    custody_model: 'platform_vault',
    redemption_status: 'active',
    randomized_sale_model: 'none',
    buyback_model: 'none'
  };
  const unrelated = {
    id: 'legacy-1',
    slug: 'legacy-one',
    canonical_name: 'Legacy One',
    category: 'general'
  };

  return {
    marketplaces: [tokenized, unrelated],
    tokenized: [tokenized],
    events: [
      { id: 'tokenized-event', marketplace_id: 'tokenized-1', source_count: tokenizedSourceCount },
      { id: 'legacy-event', marketplace_id: 'legacy-1', source_count: 99 }
    ],
    evidence: [
      { id: 'tokenized-market', marketplace_id: 'tokenized-1', event_id: 'tokenized-event', claim_scope: 'marketplace', archived_url: 'https://archive.example/market' },
      { id: 'tokenized-backing', marketplace_id: 'tokenized-1', claim_scope: 'physical_backing', archived_url: 'https://archive.example/backing' },
      { id: 'tokenized-custody', marketplace_id: 'tokenized-1', claim_scope: 'custody', archived_url: 'https://archive.example/custody' },
      { id: 'tokenized-redemption', marketplace_id: 'tokenized-1', claim_scope: 'redemption', archived_url: 'https://archive.example/redemption' },
      { id: 'legacy-broken', marketplace_id: 'legacy-1', event_id: 'missing-legacy-event', claim_scope: 'entity' }
    ]
  };
}

const clean = runRecordQuality(buildData(1), { now: new Date('2026-06-16T00:00:00Z') });
assert.equal(clean.findings.some((item) => item.title.includes('legacy-event')), false);
assert.equal(clean.findings.some((item) => item.evidence_id === 'legacy-broken'), false);
assert.equal(clean.findings.filter((item) => item.category === 'source_count_mismatch').length, 0);
assert.equal(clean.summary.scoped_marketplaces, 1);
assert.equal(clean.summary.scoped_events, 1);
assert.equal(clean.summary.scoped_evidence, 4);

const mismatch = runRecordQuality(buildData(2), { now: new Date('2026-06-16T00:00:00Z') });
const mismatches = mismatch.findings.filter((item) => item.category === 'source_count_mismatch');
assert.equal(mismatches.length, 1);
assert.equal(mismatches[0].event_id, 'tokenized-event');
assert.equal(mismatches[0].marketplace_id, 'tokenized-1');

console.log('Tokenized record-quality scope tests passed');

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const readMany = (prefix) => readdirSync('data')
  .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
  .sort()
  .flatMap((name) => read(`data/${name}`));

const generatedAt = new Date().toISOString();
const marketplaces = readMany('marketplaces');
const events = readMany('events');
const evidence = readMany('evidence');
const stats = read('data/stats.json');

const reviewState = (record) => {
  if (record.review_status === 'public_quality') return 'public_quality';
  if (['reviewed_staging', 'reviewed', 'verified'].includes(record.review_status)) return 'source_reviewed_draft';
  return 'draft';
};

const publicMarketplaces = marketplaces.map((record) => ({
  ...record,
  publication_review_state: reviewState(record),
  open_review_flags: [...(record.record_quality_flags ?? [])]
}));

const counts = {
  marketplaces: marketplaces.length,
  events: events.length,
  evidence: evidence.length
};

const statusCounts = stats.breakdowns?.by_status ?? {};
const activeSide = (statusCounts.active ?? 0) + (statusCounts.limited ?? 0) + (statusCounts.inactive ?? 0);
const fadedSide = (statusCounts.dead ?? 0) + (statusCounts.acquired ?? 0) + (statusCounts.merged ?? 0) + (statusCounts.rebranded ?? 0);

const version = {
  project_id: 'mag',
  site_name: 'Minted & Gone',
  registry_type: 'nft_marketplace_history',
  schema_version: '1.0.0',
  generated_at: generatedAt,
  canonical_only: true,
  record_counts: counts,
  review_state_values: ['draft', 'source_reviewed_draft', 'public_quality'],
  verification_marker: 'generated-from-canonical-json'
};

const manifest = {
  project_id: 'mag',
  schema_version: '1.0.0',
  generated_at: generatedAt,
  canonical_only: true,
  data_model: {
    primary_record: 'marketplace',
    supporting_records: ['event', 'evidence'],
    identity_key: 'id',
    public_files: {
      marketplaces: '/data/marketplaces.json',
      events: '/data/events.json',
      evidence: '/data/evidence.json'
    }
  },
  record_counts: counts,
  classification_totals: {
    by_status: statusCounts,
    active_side: activeSide,
    faded_side: fadedSide
  },
  classification_notes: {
    status_is_single_value: true,
    category_may_be_multi_value: false,
    chain_scope_may_be_multi_value: true,
    chain_breakdown_can_exceed_marketplace_total: true,
    active_side_definition: ['active', 'limited', 'inactive'],
    faded_side_definition: ['dead', 'acquired', 'merged', 'rebranded']
  },
  review_states: {
    draft: 'Record exists in canonical data but has not completed source review.',
    source_reviewed_draft: 'Sources were reviewed and the record is publicly usable as a draft, but open review flags may remain.',
    public_quality: 'Record completed the stricter public-quality review standard.'
  },
  data_safety: {
    canonical_only: true,
    excludes_unmerged_candidates: true,
    excludes_internal_monitoring: true,
    excludes_private_notes: true
  }
};

mkdirSync('public/data', { recursive: true });
writeFileSync('public/version.json', `${JSON.stringify(version, null, 2)}\n`);
writeFileSync('public/data/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync('public/data/marketplaces.json', `${JSON.stringify(publicMarketplaces, null, 2)}\n`);
writeFileSync('public/data/events.json', `${JSON.stringify(events, null, 2)}\n`);
writeFileSync('public/data/evidence.json', `${JSON.stringify(evidence, null, 2)}\n`);

writeFileSync('public/llms.txt', `# Minted & Gone\n\nCanonical NFT marketplace historical registry.\n\nGenerated: ${generatedAt}\nSchema version: 1.0.0\nCanonical only: true\nMarketplaces: ${counts.marketplaces}\nEvents: ${counts.events}\nEvidence: ${counts.evidence}\n\nCanonical machine-readable files:\n- /version.json\n- /data/manifest.json\n- /data/marketplaces.json\n- /data/events.json\n- /data/evidence.json\n\nReview states:\n- draft\n- source_reviewed_draft\n- public_quality\n\nA source_reviewed_draft is source-backed and publicly usable, but may retain open_review_flags. It is not a safety certification, ranking, price tracker, or investment recommendation. Unmerged candidates and internal monitoring data are excluded.\n`);
writeFileSync('public/ai.txt', `Minted & Gone canonical registry data\nGenerated: ${generatedAt}\nMarketplaces: ${counts.marketplaces}\nEvents: ${counts.events}\nEvidence: ${counts.evidence}\nManifest: /data/manifest.json\nCanonical records: /data/marketplaces.json, /data/events.json, /data/evidence.json\nReview-state definitions: /methodology/ and /data/manifest.json\n`);

console.log(`Public data generated: ${counts.marketplaces} marketplaces, ${counts.events} events, ${counts.evidence} evidence`);

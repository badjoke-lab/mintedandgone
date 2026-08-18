import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { buildStats, loadCanonicalRegistry, publicRecordEnvelope, REVIEW_STATES, SCHEMA_VERSION } from './registry-public-lib.mjs';

const site = (process.env.PUBLIC_SITE_URL ?? 'https://mag.badjoke-lab.com').replace(/\/$/, '');
const generatedAt = new Date().toISOString();
const buildCommit = process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? null;
const registry = loadCanonicalRegistry();
const stats = buildStats(registry, generatedAt);
const counts = {
  marketplaces: registry.marketplaces.length,
  events: registry.events.length,
  evidence: registry.evidence.length
};

const marketplaceEvents = (marketplaceId) => registry.events
  .filter((event) => event.marketplace_id === marketplaceId)
  .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99) || String(a.event_date).localeCompare(String(b.event_date)) || a.id.localeCompare(b.id));

const marketplaceEvidence = (marketplaceId) => registry.evidence
  .filter((item) => item.marketplace_id === marketplaceId)
  .sort((a, b) => a.id.localeCompare(b.id));

const recordDossier = (marketplace) => ({
  schema_version: SCHEMA_VERSION,
  generated_at: generatedAt,
  canonical_only: true,
  record_type: 'marketplace_dossier',
  marketplace,
  events: marketplaceEvents(marketplace.id),
  evidence: marketplaceEvidence(marketplace.id),
  relationships: {
    predecessor_marketplace: marketplace.predecessor_marketplace ?? null,
    successor_marketplace: marketplace.successor_marketplace ?? null
  },
  urls: {
    human: `${site}/encyclopedia/${marketplace.slug}/`,
    machine: `${site}/data/marketplace/${marketplace.slug}.json`
  }
});

mkdirSync('data', { recursive: true });
mkdirSync('public/data', { recursive: true });
rmSync('public/data/marketplace', { recursive: true, force: true });
mkdirSync('public/data/marketplace', { recursive: true });

writeFileSync('data/stats.json', `${JSON.stringify(stats, null, 2)}\n`);
writeFileSync('data/stats-history.json', `${JSON.stringify([{ snapshot_at: generatedAt, ...stats }], null, 2)}\n`);

writeFileSync('public/data/marketplaces.json', `${JSON.stringify(publicRecordEnvelope('marketplace', registry.marketplaces, generatedAt), null, 2)}\n`);
writeFileSync('public/data/events.json', `${JSON.stringify(publicRecordEnvelope('event', registry.events, generatedAt), null, 2)}\n`);
writeFileSync('public/data/evidence.json', `${JSON.stringify(publicRecordEnvelope('evidence', registry.evidence, generatedAt), null, 2)}\n`);
writeFileSync('public/data/stats.json', `${JSON.stringify(stats, null, 2)}\n`);

for (const marketplace of [...registry.marketplaces].sort((a, b) => a.slug.localeCompare(b.slug))) {
  writeFileSync(`public/data/marketplace/${marketplace.slug}.json`, `${JSON.stringify(recordDossier(marketplace), null, 2)}\n`);
}

const manifest = {
  schema_version: SCHEMA_VERSION,
  generated_at: generatedAt,
  canonical_only: true,
  project_id: 'mag',
  site_name: 'Minted & Gone',
  registry_type: 'nft_marketplace_history',
  source_of_truth: {
    marketplaces: 'data/marketplaces.json and data/marketplaces-batch-*.json',
    events: 'data/events.json and data/events-batch-*.json',
    evidence: 'data/evidence.json and data/evidence-batch-*.json',
    excluded: ['research/**', 'data-staging/**', 'monitoring output', 'candidate backlogs', 'unmerged branches']
  },
  record_counts: counts,
  public_files: {
    marketplaces: `${site}/data/marketplaces.json`,
    events: `${site}/data/events.json`,
    evidence: `${site}/data/evidence.json`,
    stats: `${site}/data/stats.json`,
    version: `${site}/version.json`,
    marketplace_record_template: `${site}/data/marketplace/{slug}.json`
  },
  record_level: {
    enabled: true,
    record_type: 'marketplace_dossier',
    route_template: '/data/marketplace/{slug}.json',
    record_count: counts.marketplaces,
    human_route_template: '/encyclopedia/{slug}/',
    contents: ['marketplace', 'events', 'evidence', 'relationships', 'urls']
  },
  identity_rules: {
    marketplace_primary_key: 'id',
    marketplace_route_key: 'slug',
    event_primary_key: 'id',
    evidence_primary_key: 'id'
  },
  classification_rules: {
    status_is_exclusive: true,
    status_partition: ['active', 'limited', 'inactive', 'dead', 'acquired', 'merged', 'rebranded', 'unknown'],
    active_side: ['active', 'limited'],
    faded_side: ['inactive', 'dead', 'acquired', 'merged', 'rebranded'],
    unknown_side: ['unknown'],
    transitioned_is_subset_of_faded_side: ['acquired', 'merged', 'rebranded'],
    category_is_single_value: true,
    multi_value_fields: ['chain_scope', 'platform_roles'],
    multi_value_totals_may_exceed_marketplace_count: true
  },
  review_model: {
    field: 'review_status',
    allowed_canonical_values: Object.keys(REVIEW_STATES),
    definitions: REVIEW_STATES,
    open_review_flags_field: 'record_quality_flags',
    open_review_flags_meaning: 'Non-empty flags identify unresolved review work. They do not mean the record is an internal candidate, and they do not equal public-quality completion.',
    ambiguous_reviewed_label_disallowed: true
  },
  data_safety: {
    canonical_only: true,
    candidates_included: false,
    internal_monitoring_included: false,
    source_reviewed_drafts_may_have_open_flags: true,
    public_quality_certification_implied: false
  }
};

const version = {
  schema_version: SCHEMA_VERSION,
  generated_at: generatedAt,
  canonical_only: true,
  project_id: 'mag',
  site_name: 'Minted & Gone',
  registry_type: 'nft_marketplace_history',
  build_commit: buildCommit,
  record_counts: counts,
  review_state_field: 'review_status',
  manifest: `${site}/data/manifest.json`,
  record_level: {
    marketplace_record_template: `${site}/data/marketplace/{slug}.json`,
    marketplace_record_count: counts.marketplaces
  }
};

writeFileSync('public/data/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync('public/version.json', `${JSON.stringify(version, null, 2)}\n`);

const llms = `# Minted & Gone\n\nMinted & Gone is a historical registry of NFT marketplaces. It is not a marketplace ranking, price tracker, safety certification, or investment guide.\n\n## Canonical counts\n\n- Marketplaces: ${counts.marketplaces}\n- Events: ${counts.events}\n- Evidence: ${counts.evidence}\n- Generated at: ${generatedAt}\n- Schema version: ${SCHEMA_VERSION}\n- Canonical only: true\n\n## Authoritative machine-readable files\n\n- ${site}/version.json\n- ${site}/data/manifest.json\n- ${site}/data/marketplaces.json\n- ${site}/data/events.json\n- ${site}/data/evidence.json\n- ${site}/data/stats.json\n- ${site}/data/marketplace/{slug}.json — one deterministic canonical dossier per marketplace\n\n## Review-state semantics\n\nreview_status=reviewed_staging means Source-reviewed draft: source-backed and canonical-public, but not final public-quality certification. Open review work is listed in record_quality_flags.\n\nreview_status=public_quality_reviewed means the stricter public-quality review criteria have been completed.\n\nDo not interpret the word reviewed by itself as a safety, legal, completeness, or public-quality guarantee.\n`;

const ai = `Minted & Gone canonical registry\nMarketplaces: ${counts.marketplaces}\nEvents: ${counts.events}\nEvidence: ${counts.evidence}\nGenerated: ${generatedAt}\nSchema: ${SCHEMA_VERSION}\nCanonical only: true\nManifest: ${site}/data/manifest.json\nMarketplace records: ${site}/data/marketplaces.json\nPer-marketplace dossier template: ${site}/data/marketplace/{slug}.json\nEvent records: ${site}/data/events.json\nEvidence records: ${site}/data/evidence.json\nReview state definitions are in the manifest. reviewed_staging means source-reviewed draft, not final public-quality certification.\n`;

writeFileSync('public/llms.txt', llms);
writeFileSync('public/ai.txt', ai);
console.log(`Public registry generated: ${counts.marketplaces} marketplaces, ${counts.events} events, ${counts.evidence} evidence, ${counts.marketplaces} marketplace dossiers`);

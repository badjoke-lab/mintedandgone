import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const SERIES_SCHEMA_VERSION = '1.0.0';
const ADAPTER_VERSION = '1.0.0';
const REGISTRY_ID = 'minted-and-gone';
const RELATIONSHIP_AUTHORITY = 'config/ledger-series-phase9-stage5-mag-local-authority.json';
const site = (process.env.PUBLIC_SITE_URL ?? 'https://mag.badjoke-lab.com').replace(/\/$/, '');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(stableValue(value), null, 2)}\n`);
}

function parseGlobalKey(globalKey) {
  const parts = String(globalKey).split(':');
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error(`Invalid Series global record key: ${globalKey}`);
  }
  return {
    registry_id: parts[0],
    native_record_type: parts[1],
    native_record_id: parts[2],
  };
}

function relationshipId(relationType, sourceGlobalKey, targetGlobalKey) {
  const digest = createHash('sha256')
    .update(`${relationType}\n${sourceGlobalKey}\n${targetGlobalKey}`, 'utf8')
    .digest('hex');
  return `series_rel_${digest}`;
}

const version = readJson('public/version.json');
const manifest = readJson('public/data/manifest.json');
const marketplaces = readJson('public/data/marketplaces.json');
const relationshipAuthority = readJson(RELATIONSHIP_AUTHORITY);

if (version.canonical_only !== true || manifest.canonical_only !== true || marketplaces.canonical_only !== true) {
  throw new Error('MAG native public layer must remain canonical-only');
}
if (version.project_id !== 'mag' || manifest.project_id !== 'mag') {
  throw new Error('Unexpected MAG native project ID');
}
if (marketplaces.record_count !== version.record_counts.marketplaces) {
  throw new Error('MAG marketplace count mismatch');
}
if (relationshipAuthority.registry_id !== REGISTRY_ID || relationshipAuthority.accepted_count !== 17) {
  throw new Error('Unexpected MAG Stage 5 relationship authority');
}
if (!Array.isArray(relationshipAuthority.finite_allowlist) || relationshipAuthority.finite_allowlist.length !== 17) {
  throw new Error('MAG Stage 5 relationship allowlist must contain exactly 17 rows');
}

const outputRoot = 'public/data/series';
const recordRoot = `${outputRoot}/records`;
rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(recordRoot, { recursive: true });

const rows = [];
for (const marketplace of [...marketplaces.records].sort((a, b) => a.slug.localeCompare(b.slug))) {
  const nativePath = `public/data/marketplace/${marketplace.slug}.json`;
  const dossier = readJson(nativePath);
  if (dossier.canonical_only !== true || dossier.record_type !== 'marketplace_dossier') {
    throw new Error(`${marketplace.slug}: unexpected native dossier boundary`);
  }
  if (dossier.marketplace?.id !== marketplace.id || dossier.marketplace?.slug !== marketplace.slug) {
    throw new Error(`${marketplace.slug}: native identity mismatch`);
  }

  const nativeRecordType = dossier.record_type;
  const globalKey = `${REGISTRY_ID}:${nativeRecordType}:${marketplace.id}`;
  const seriesPath = `/data/series/records/${marketplace.slug}.json`;
  const nativeMachineUrl = dossier.urls?.machine ?? `${site}/data/marketplace/${marketplace.slug}.json`;
  const humanUrl = dossier.urls?.human ?? `${site}/encyclopedia/${marketplace.slug}/`;
  const nativeRelationships = dossier.relationships ?? {};

  const envelope = {
    series_schema_version: SERIES_SCHEMA_VERSION,
    object_type: 'record_envelope',
    registry_id: REGISTRY_ID,
    global_record_key: globalKey,
    record_key: {
      native_record_type: nativeRecordType,
      native_record_id: marketplace.id,
      slug: marketplace.slug,
    },
    urls: {
      human: humanUrl,
      machine: `${site}${seriesPath}`,
      native_machine: nativeMachineUrl,
    },
    identity: {
      name: marketplace.canonical_name,
      aliases: Array.isArray(marketplace.aliases) ? marketplace.aliases : [],
    },
    current_state: {
      status: marketplace.status ?? null,
      native: {
        status: marketplace.status ?? null,
        category: marketplace.category ?? null,
        marketplace_scope: marketplace.marketplace_scope ?? null,
        chain_scope: marketplace.chain_scope ?? [],
        frontend_status: marketplace.frontend_status ?? null,
        contract_status: marketplace.contract_status ?? null,
        asset_status: marketplace.asset_status ?? null,
        closure_reason: marketplace.closure_reason ?? null,
        review_status: marketplace.review_status ?? null,
        record_quality_flags: marketplace.record_quality_flags ?? [],
        predecessor_marketplace: nativeRelationships.predecessor_marketplace ?? null,
        successor_marketplace: nativeRelationships.successor_marketplace ?? null,
      },
    },
    events: {
      mode: 'inline',
      records: dossier.events ?? [],
    },
    evidence: {
      mode: 'inline',
      records: dossier.evidence ?? [],
    },
    relationships: [],
    verification: {
      build_commit: version.build_commit ?? null,
      generated_at: version.generated_at ?? dossier.generated_at ?? null,
      last_verified_at: marketplace.last_verified_at ?? null,
    },
    provenance: {
      canonical_only: true,
      adapter: {
        id: 'series-adapter-minted-and-gone',
        version: ADAPTER_VERSION,
      },
      native_manifest: `${site}/data/manifest.json`,
      native_record: nativeMachineUrl,
      review_status: marketplace.review_status ?? null,
      record_quality_flags: marketplace.record_quality_flags ?? [],
      relationship_boundary: 'native predecessor/successor slugs remain preserved in current_state.native; reviewed Stage 5 typed relationships are published only as standalone relationship_record objects',
    },
  };

  writeJson(`${recordRoot}/${marketplace.slug}.json`, envelope);
  rows.push({
    global_record_key: globalKey,
    native_record_type: nativeRecordType,
    native_record_id: marketplace.id,
    slug: marketplace.slug,
    name: marketplace.canonical_name,
    status: marketplace.status ?? null,
    review_status: marketplace.review_status ?? null,
    human_url: humanUrl,
    machine_url: `${site}${seriesPath}`,
    native_machine_url: nativeMachineUrl,
  });
}

const availableGlobalKeys = new Set(rows.map((row) => row.global_record_key));
const relationshipKeys = new Set();
const relationshipIds = new Set();
const relationshipRecords = relationshipAuthority.finite_allowlist.map((entry, index) => {
  if (!Array.isArray(entry) || entry.length !== 3) {
    throw new Error(`MAG Stage 5 relationship row ${index + 1} must be [relation_type, source, target]`);
  }
  const [relationType, sourceGlobalKey, targetGlobalKey] = entry;
  if (!['predecessor_of', 'successor_of'].includes(relationType)) {
    throw new Error(`MAG Stage 5 relationship row ${index + 1} has unauthorized type ${relationType}`);
  }
  if (sourceGlobalKey === targetGlobalKey) {
    throw new Error(`MAG Stage 5 relationship row ${index + 1} is a self-loop`);
  }
  if (!availableGlobalKeys.has(sourceGlobalKey) || !availableGlobalKeys.has(targetGlobalKey)) {
    throw new Error(`MAG Stage 5 relationship row ${index + 1} references a missing Series endpoint`);
  }
  const tupleKey = `${relationType}\n${sourceGlobalKey}\n${targetGlobalKey}`;
  if (relationshipKeys.has(tupleKey)) {
    throw new Error(`MAG Stage 5 relationship row ${index + 1} duplicates a reviewed tuple`);
  }
  relationshipKeys.add(tupleKey);

  const id = relationshipId(relationType, sourceGlobalKey, targetGlobalKey);
  if (relationshipIds.has(id)) throw new Error(`MAG Stage 5 relationship ID collision: ${id}`);
  relationshipIds.add(id);

  return {
    series_schema_version: SERIES_SCHEMA_VERSION,
    object_type: 'relationship_record',
    id,
    relation_type: relationType,
    source: parseGlobalKey(sourceGlobalKey),
    target: parseGlobalKey(targetGlobalKey),
    direction: 'directed',
    provenance: {
      basis: 'native_reviewed_relationship',
      native_evidence_refs: [],
    },
  };
});

const descriptor = {
  series_schema_version: SERIES_SCHEMA_VERSION,
  object_type: 'registry_descriptor',
  registry: {
    id: REGISTRY_ID,
    native_project_id: version.project_id,
    name: 'Minted & Gone',
    type: manifest.registry_type,
    origin: site,
    repository: 'https://github.com/badjoke-lab/mintedandgone',
  },
  canonical_only: true,
  native_contract: {
    schema_version: version.schema_version,
    version_url: `${site}/version.json`,
    manifest_url: `${site}/data/manifest.json`,
  },
  record_counts: {
    primary_records: version.record_counts.marketplaces,
    events: version.record_counts.events,
    evidence: version.record_counts.evidence,
    relationships: relationshipRecords.length,
    native: version.record_counts,
  },
  record_types: [
    {
      series_record_type: 'nft_marketplace',
      native_record_type: 'marketplace_dossier',
      machine_template: '/data/series/records/{slug}.json',
    },
  ],
  routes: {
    descriptor: '/data/series/registry.json',
    index: '/data/series/index.json',
    relationships: '/data/series/relationships.json',
    record_templates: ['/data/series/records/{slug}.json'],
    search: '/encyclopedia/',
    compare: '/compare/',
    stats: '/stats/',
  },
  capabilities: {
    record_json: true,
    events: 'inline',
    evidence: 'inline',
    relationships: 'adapter',
    search: true,
    compare: true,
    stats: true,
  },
  verification: {
    build_commit: version.build_commit ?? null,
    generated_at: version.generated_at ?? null,
  },
  data_safety: {
    canonical_only: true,
    includes_unreviewed_candidates: false,
    includes_internal_monitoring: false,
    includes_private_notes: false,
    ai_generated_canonical_facts: false,
    source_reviewed_drafts_may_have_open_flags: true,
    public_quality_certification_implied: false,
  },
};

const index = {
  series_schema_version: SERIES_SCHEMA_VERSION,
  object_type: 'record_index',
  registry_id: REGISTRY_ID,
  canonical_only: true,
  build_commit: version.build_commit ?? null,
  generated_at: version.generated_at ?? null,
  record_count: rows.length,
  records: rows,
};

writeJson(`${outputRoot}/registry.json`, descriptor);
writeJson(`${outputRoot}/index.json`, index);
writeJson(`${outputRoot}/relationships.json`, relationshipRecords);
console.log(`Generated MAG Series adapter: ${rows.length} marketplace envelopes, ${relationshipRecords.length} reviewed relationships`);

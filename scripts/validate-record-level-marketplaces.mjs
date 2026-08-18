import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { loadCanonicalRegistry, SCHEMA_VERSION } from './registry-public-lib.mjs';

const site = (process.env.PUBLIC_SITE_URL ?? 'https://mag.badjoke-lab.com').replace(/\/$/, '');
const registry = loadCanonicalRegistry();
const root = 'public/data/marketplace';
const errors = [];
const fail = (message) => errors.push(message);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

if (!existsSync(root)) {
  fail(`${root} is missing`);
} else {
  const expectedFiles = [...registry.marketplaces].map((record) => `${record.slug}.json`).sort();
  const actualFiles = readdirSync(root).filter((name) => name.endsWith('.json')).sort();
  if (!same(actualFiles, expectedFiles)) {
    fail(`record-level file set mismatch: expected ${expectedFiles.length}, actual ${actualFiles.length}`);
  }

  for (const marketplace of registry.marketplaces) {
    const path = `${root}/${marketplace.slug}.json`;
    if (!existsSync(path)) {
      fail(`missing dossier ${path}`);
      continue;
    }

    let dossier;
    try {
      dossier = JSON.parse(readFileSync(path, 'utf8'));
    } catch (error) {
      fail(`${path}: invalid JSON: ${error.message}`);
      continue;
    }

    if (dossier.schema_version !== SCHEMA_VERSION) fail(`${path}: schema_version mismatch`);
    if (dossier.canonical_only !== true) fail(`${path}: canonical_only must be true`);
    if (dossier.record_type !== 'marketplace_dossier') fail(`${path}: record_type mismatch`);
    if (!same(dossier.marketplace, marketplace)) fail(`${path}: marketplace payload differs from canonical record`);

    const expectedEvents = registry.events
      .filter((event) => event.marketplace_id === marketplace.id)
      .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99) || String(a.event_date).localeCompare(String(b.event_date)) || a.id.localeCompare(b.id));
    if (!same(dossier.events, expectedEvents)) fail(`${path}: event payload/order mismatch`);

    const expectedEvidence = registry.evidence
      .filter((item) => item.marketplace_id === marketplace.id)
      .sort((a, b) => a.id.localeCompare(b.id));
    if (!same(dossier.evidence, expectedEvidence)) fail(`${path}: evidence payload/order mismatch`);

    const expectedRelationships = {
      predecessor_marketplace: marketplace.predecessor_marketplace ?? null,
      successor_marketplace: marketplace.successor_marketplace ?? null
    };
    if (!same(dossier.relationships, expectedRelationships)) fail(`${path}: relationship projection mismatch`);

    const expectedUrls = {
      human: `${site}/encyclopedia/${marketplace.slug}/`,
      machine: `${site}/data/marketplace/${marketplace.slug}.json`
    };
    if (!same(dossier.urls, expectedUrls)) fail(`${path}: URL projection mismatch`);

    const serialized = JSON.stringify(dossier);
    for (const forbidden of ['candidate_id', 'recommended_action', 'monitoring_signal', 'dedupe_key']) {
      if (serialized.includes(`\"${forbidden}\"`)) fail(`${path}: forbidden internal marker ${forbidden}`);
    }
  }
}

const manifestPath = 'public/data/manifest.json';
if (!existsSync(manifestPath)) {
  fail('public/data/manifest.json is missing');
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest?.public_files?.marketplace_record_template !== `${site}/data/marketplace/{slug}.json`) {
    fail('manifest marketplace_record_template mismatch');
  }
  if (manifest?.record_level?.record_count !== registry.marketplaces.length) {
    fail('manifest record_level.record_count mismatch');
  }
  if (manifest?.record_level?.route_template !== '/data/marketplace/{slug}.json') {
    fail('manifest record_level.route_template mismatch');
  }
}

const versionPath = 'public/version.json';
if (!existsSync(versionPath)) {
  fail('public/version.json is missing');
} else {
  const version = JSON.parse(readFileSync(versionPath, 'utf8'));
  if (version?.record_level?.marketplace_record_count !== registry.marketplaces.length) {
    fail('version record-level marketplace count mismatch');
  }
}

for (const textPath of ['public/llms.txt', 'public/ai.txt']) {
  if (!existsSync(textPath)) {
    fail(`${textPath} is missing`);
    continue;
  }
  const text = readFileSync(textPath, 'utf8');
  if (!text.includes('/data/marketplace/{slug}.json')) fail(`${textPath}: dossier template not advertised`);
}

if (errors.length) {
  console.error(`Record-level marketplace validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Record-level marketplace validation passed: ${registry.marketplaces.length} canonical dossiers`);

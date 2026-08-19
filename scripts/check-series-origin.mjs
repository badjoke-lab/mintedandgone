import { readFileSync } from 'node:fs';

const origin = (process.env.SERIES_ORIGIN ?? '').replace(/\/$/, '');
const expectedCommit = process.env.SERIES_EXPECTED_COMMIT ?? '';
const attempts = Number(process.env.SERIES_VERIFY_ATTEMPTS ?? '20');
const intervalMs = Number(process.env.SERIES_VERIFY_INTERVAL_MS ?? '15000');
if (!origin.startsWith('https://')) throw new Error('SERIES_ORIGIN must be an https origin');

const localNativeIndex = JSON.parse(readFileSync('public/data/marketplaces.json', 'utf8'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(path) {
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${origin}${path}${separator}series_verify=${Date.now()}`, { headers: { 'cache-control': 'no-cache' }, redirect: 'follow' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

async function verifyOnce() {
  const descriptor = await fetchJson('/data/series/registry.json');
  if (descriptor.series_schema_version !== '1.0.0') throw new Error('descriptor schema mismatch');
  if (descriptor.registry?.id !== 'minted-and-gone') throw new Error('descriptor registry ID mismatch');
  if (descriptor.registry?.native_project_id !== 'mag') throw new Error('descriptor native project ID mismatch');
  if (descriptor.canonical_only !== true) throw new Error('descriptor canonical boundary mismatch');
  if (descriptor.capabilities?.relationships !== 'adapter') throw new Error('relationship capability mismatch');
  if (expectedCommit && descriptor.verification?.build_commit !== expectedCommit) {
    throw new Error(`build commit mismatch: expected ${expectedCommit}, got ${descriptor.verification?.build_commit}`);
  }

  const index = await fetchJson('/data/series/index.json');
  if (index.record_count !== localNativeIndex.record_count) throw new Error(`record count mismatch: ${index.record_count} != ${localNativeIndex.record_count}`);
  if (expectedCommit && index.build_commit !== expectedCommit) throw new Error('index build commit mismatch');

  const keys = new Set();
  for (const row of index.records) {
    const native = localNativeIndex.records.find((record) => record.id === row.native_record_id && record.slug === row.slug);
    if (!native) throw new Error(`${row.slug}: native identity missing`);
    const expectedKey = `minted-and-gone:marketplace_dossier:${native.id}`;
    if (row.global_record_key !== expectedKey) throw new Error(`${row.slug}: global key mismatch`);
    if (keys.has(row.global_record_key)) throw new Error(`${row.slug}: duplicate global key`);
    keys.add(row.global_record_key);
  }

  for (const slug of ['opensea', 'hic-et-nunc', 'teia']) {
    const row = index.records.find((item) => item.slug === slug);
    if (!row) throw new Error(`${slug}: missing representative Series index row`);
    const envelope = await fetchJson(`/data/series/records/${slug}.json`);
    if (envelope.global_record_key !== row.global_record_key) throw new Error(`${slug}: envelope global key mismatch`);
    if ((envelope.relationships ?? []).length !== 0) throw new Error(`${slug}: typed relationship emitted before Stage 5`);
  }

  const hen = await fetchJson('/data/series/records/hic-et-nunc.json');
  if (hen.current_state?.native?.successor_marketplace !== 'teia') throw new Error('Hic et Nunc native successor missing');
  if (!hen.provenance?.record_quality_flags?.includes('needs_successor_review')) throw new Error('Hic et Nunc successor review flag missing');
  return { descriptor, index };
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const { descriptor, index } = await verifyOnce();
    console.log('MAG Series adapter origin verification PASS');
    console.log(`origin=${origin}`);
    console.log(`registry_id=${descriptor.registry.id}`);
    console.log(`record_count=${index.record_count}`);
    console.log(`build_commit=${descriptor.verification.build_commit}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(intervalMs);
  }
}
throw lastError;

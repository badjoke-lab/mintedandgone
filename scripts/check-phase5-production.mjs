const expectedCommit = process.argv[2] || process.env.EXPECTED_COMMIT;
const origin = (process.env.MAG_PRODUCTION_ORIGIN || 'https://mag.badjoke-lab.com').replace(/\/$/, '');
const attempts = Number(process.env.MAG_PRODUCTION_VERIFY_ATTEMPTS || 12);
const delayMs = Number(process.env.MAG_PRODUCTION_VERIFY_DELAY_MS || 10000);

if (!expectedCommit) throw new Error('Expected production commit is required');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchText(path) {
  const url = `${origin}${path}${path.includes('?') ? '&' : '?'}verify=${encodeURIComponent(expectedCommit)}-${Date.now()}`;
  const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
}
async function fetchJson(path) {
  const text = await fetchText(path);
  try { return JSON.parse(text); }
  catch (error) { throw new Error(`${path}: invalid JSON: ${error.message}`); }
}

let version;
let lastVersionError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    version = await fetchJson('/version.json');
    if (version.build_commit === expectedCommit) break;
    lastVersionError = new Error(`version build_commit ${version.build_commit ?? 'null'} != expected ${expectedCommit}`);
  } catch (error) {
    lastVersionError = error;
  }
  if (attempt < attempts) await sleep(delayMs);
}
if (!version || version.build_commit !== expectedCommit) throw lastVersionError ?? new Error('Exact production commit was not observed');

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const manifest = await fetchJson('/data/manifest.json');
check(manifest.canonical_only === true, 'manifest canonical_only is not true');
check(manifest.record_level?.enabled === true, 'manifest record-level output is not enabled');
check(manifest.record_level?.record_count === version.record_counts?.marketplaces, 'record-level count does not match version marketplace count');
check(manifest.public_files?.marketplace_record_template === `${origin}/data/marketplace/{slug}.json`, 'manifest marketplace dossier template mismatch');

const hic = await fetchJson('/data/marketplace/hic-et-nunc.json');
check(hic.marketplace?.slug === 'hic-et-nunc', 'Hic et Nunc dossier identity mismatch');
check(hic.marketplace?.status === 'dead', 'Hic et Nunc status mismatch');
check(hic.relationships?.successor_marketplace === 'teia', 'Hic et Nunc successor relationship missing');
check(Array.isArray(hic.events) && Array.isArray(hic.evidence), 'Hic et Nunc dossier event/evidence arrays missing');

const teia = await fetchJson('/data/marketplace/teia.json');
check(teia.marketplace?.slug === 'teia', 'Teia dossier identity mismatch');
check(teia.relationships?.predecessor_marketplace === 'hic-et-nunc', 'Teia predecessor relationship missing');

const gameStop = await fetchJson('/data/marketplace/gamestop-nft.json');
check(gameStop.marketplace?.status === 'dead', 'GameStop NFT status mismatch');
check(gameStop.marketplace?.end_year === 2024, 'GameStop NFT end year mismatch');
check(gameStop.marketplace?.closure_reason === 'parent_company_shutdown', 'GameStop NFT closure reason mismatch');

const encyclopediaHtml = await fetchText('/encyclopedia/');
for (const marker of ['Closure / change reason', 'Lifecycle relationships', 'Evidence / review state', 'data-launch-year', 'data-end-year']) {
  check(encyclopediaHtml.includes(marker), `Encyclopedia missing production marker: ${marker}`);
}

const compareHtml = await fetchText('/compare/');
for (const marker of ['Compare marketplace histories', 'Show differences only', 'Evidence counts describe registry provenance depth']) {
  check(compareHtml.includes(marker), `Compare missing production marker: ${marker}`);
}

const stats = await fetchJson('/data/stats.json');
check(Boolean(stats.breakdowns?.by_closure_reason_faded_side), 'Stats closure-reason distribution missing');
check(Boolean(stats.lifecycle?.lifespan?.buckets), 'Stats lifespan buckets missing');
check(Number.isInteger(stats.lifecycle?.successor_recorded), 'Stats successor count missing');
check(Boolean(stats.coverage?.high_reliability_evidence), 'Stats high-reliability evidence coverage missing');
check(Boolean(stats.coverage?.archived_evidence), 'Stats archived-evidence coverage missing');

const statsHtml = await fetchText('/stats/');
for (const marker of ['Lifecycle aftermath', 'Successor & migration coverage', 'Coverage & provenance']) {
  check(statsHtml.includes(marker), `Stats page missing production marker: ${marker}`);
}

const sitemap = await fetchText('/sitemap.xml');
check(sitemap.includes(`<loc>${origin}/compare/</loc>`), 'Sitemap missing canonical Compare route');
check(!sitemap.includes('marketplace='), 'Sitemap unexpectedly contains Compare query variants');

if (failures.length) {
  console.error(`MAG Phase 5 production verification failed with ${failures.length} error(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`MAG Phase 5 production verification passed at ${origin}`);
console.log(`Exact commit: ${expectedCommit}`);
console.log(`Counts: ${version.record_counts?.marketplaces} marketplaces / ${version.record_counts?.events} events / ${version.record_counts?.evidence} evidence`);

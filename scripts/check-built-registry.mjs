import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadCanonicalRegistry, REVIEW_STATES } from './registry-public-lib.mjs';

const registry = loadCanonicalRegistry();
const counts = {
  marketplaces: registry.marketplaces.length,
  events: registry.events.length,
  evidence: registry.evidence.length
};
const errors = [];
const read = (path) => readFileSync(path, 'utf8');
const readJson = (path) => JSON.parse(read(path));
const assert = (condition, message) => { if (!condition) errors.push(message); };

const walk = (root) => readdirSync(root).flatMap((name) => {
  const path = join(root, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const version = readJson('dist/version.json');
const manifest = readJson('dist/data/manifest.json');
const publicMarketplaces = readJson('dist/data/marketplaces.json');
const publicEvents = readJson('dist/data/events.json');
const publicEvidence = readJson('dist/data/evidence.json');
const publicStats = readJson('dist/data/stats.json');

for (const [key, expected] of Object.entries(counts)) {
  assert(version.record_counts?.[key] === expected, `version.json ${key} mismatch`);
  assert(manifest.record_counts?.[key] === expected, `manifest.json ${key} mismatch`);
}
assert(version.canonical_only === true, 'version.json canonical_only must be true');
assert(manifest.canonical_only === true, 'manifest.json canonical_only must be true');
assert(publicMarketplaces.canonical_only === true, 'marketplaces JSON canonical_only must be true');
assert(publicEvents.canonical_only === true, 'events JSON canonical_only must be true');
assert(publicEvidence.canonical_only === true, 'evidence JSON canonical_only must be true');
assert(publicMarketplaces.record_count === counts.marketplaces, 'public marketplace record_count mismatch');
assert(publicEvents.record_count === counts.events, 'public event record_count mismatch');
assert(publicEvidence.record_count === counts.evidence, 'public evidence record_count mismatch');
assert(publicStats.kpis?.total_marketplaces === counts.marketplaces, 'public stats marketplace count mismatch');
assert(publicStats.kpis?.total_events === counts.events, 'public stats event count mismatch');
assert(publicStats.kpis?.total_evidence === counts.evidence, 'public stats evidence count mismatch');

const ids = (records) => records.map((record) => record.id).sort();
assert(JSON.stringify(ids(publicMarketplaces.records)) === JSON.stringify(ids(registry.marketplaces)), 'public marketplace identities differ from canonical');
assert(JSON.stringify(ids(publicEvents.records)) === JSON.stringify(ids(registry.events)), 'public event identities differ from canonical');
assert(JSON.stringify(ids(publicEvidence.records)) === JSON.stringify(ids(registry.evidence)), 'public evidence identities differ from canonical');

const allowedReviewStates = new Set(Object.keys(REVIEW_STATES));
for (const record of publicMarketplaces.records) {
  assert(allowedReviewStates.has(record.review_status), `${record.id} has unsupported public review_status ${record.review_status}`);
  assert(Array.isArray(record.record_quality_flags), `${record.id} must expose record_quality_flags`);
}

const statusTotal = Object.values(publicStats.breakdowns?.by_status ?? {}).reduce((sum, value) => sum + Number(value), 0);
assert(statusTotal === counts.marketplaces, 'exclusive status breakdown does not sum to marketplace total');
const sideTotal = Number(publicStats.kpis.active_side_total ?? 0) + Number(publicStats.kpis.faded_side_total ?? 0) + Number(publicStats.kpis.unknown_total ?? 0);
assert(sideTotal === counts.marketplaces, 'active/faded/unknown side partition does not sum to marketplace total');

const home = read('dist/index.html');
const encyclopedia = read('dist/encyclopedia/index.html');
const stats = read('dist/stats/index.html');
const flexible = (value) => new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'), 'i');
assert(flexible(`<strong>${counts.marketplaces}</strong><small>Marketplaces</small>`).test(home), 'home marketplace count is not canonical');
assert(flexible(`<strong>${counts.events}</strong><small>Events</small>`).test(home), 'home event count is not canonical');
assert(flexible(`<strong>${counts.evidence}</strong><small>Evidence</small>`).test(home), 'home evidence count is not canonical');
assert(new RegExp(`<strong[^>]*data-result-count[^>]*>${counts.marketplaces}</strong>`, 'i').test(encyclopedia), 'encyclopedia result count is not canonical');
assert(new RegExp(`Generated from\\s*${counts.marketplaces} marketplaces,\\s*${counts.events} events,\\s*and ${counts.evidence} evidence`, 'i').test(stats), 'stats source summary is not canonical');

const htmlFiles = walk('dist').filter((path) => path.endsWith('.html'));
const stalePhrases = [
  /\b355 marketplaces\b/i,
  /\b395 marketplaces\b/i,
  /\b200 marketplaces\b/i,
  /\b202 events\b/i,
  /\b406 evidence(?: notes)?\b/i,
  /\bReviewed share\b/i
];
for (const path of htmlFiles) {
  const html = read(path);
  for (const phrase of stalePhrases) assert(!phrase.test(html), `${path} contains stale or ambiguous public wording: ${phrase}`);
  assert(/<link rel="canonical" href="https:\/\/mag\.badjoke-lab\.com\//.test(html), `${path} missing canonical URL`);
  assert(/href="\/version\.json"/.test(html), `${path} missing version discovery link`);
  assert(/href="\/data\/manifest\.json"/.test(html), `${path} missing manifest discovery link`);
  assert(/application\/ld\+json/.test(html), `${path} missing JSON-LD`);
  assert(/property="og:title"/.test(html) && /property="og:description"/.test(html), `${path} missing OGP metadata`);
}

const sitemap = read('dist/sitemap.xml');
const marketplaceUrls = [...sitemap.matchAll(/<loc>https:\/\/mag\.badjoke-lab\.com\/encyclopedia\/([^/]+)\/<\/loc>/g)].map((match) => match[1]);
assert(marketplaceUrls.length === counts.marketplaces, `sitemap marketplace URL count ${marketplaceUrls.length} != ${counts.marketplaces}`);
assert(new Set(marketplaceUrls).size === counts.marketplaces, 'sitemap contains duplicate marketplace URLs');
for (const record of registry.marketplaces) assert(marketplaceUrls.includes(record.slug), `sitemap missing marketplace ${record.slug}`);

const robots = read('dist/robots.txt');
assert(robots.includes('Sitemap: https://mag.badjoke-lab.com/sitemap.xml'), 'robots.txt sitemap is missing or incorrect');
assert(read('dist/llms.txt').includes(`Marketplaces: ${counts.marketplaces}`), 'llms.txt marketplace count mismatch');
assert(read('dist/ai.txt').includes(`Marketplaces: ${counts.marketplaces}`), 'ai.txt marketplace count mismatch');

if (errors.length) {
  console.error(`Built registry consistency check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Built registry consistency passed: ${counts.marketplaces} marketplaces, ${counts.events} events, ${counts.evidence} evidence`);

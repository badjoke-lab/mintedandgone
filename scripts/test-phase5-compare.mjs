import { readFileSync } from 'node:fs';
import { loadCanonicalRegistry } from './registry-public-lib.mjs';

const registry = loadCanonicalRegistry();
const fail = (message) => { throw new Error(message); };
const slugs = new Set(registry.marketplaces.map((record) => record.slug));
for (const slug of ['hic-et-nunc', 'teia']) {
  if (!slugs.has(slug)) fail(`Compare representative record missing: ${slug}`);
}

const compare = readFileSync('src/pages/compare.astro', 'utf8');
const header = readFileSync('src/components/SiteHeader.astro', 'utf8');
const sitemap = readFileSync('scripts/generate-sitemap-v2.ts', 'utf8');

for (const marker of [
  'Choose 2–4 marketplaces',
  "params.getAll('marketplace')",
  "params.get('differences') === 'only'",
  "next.append('marketplace', slug)",
  'Show differences only',
  'what_remains',
  'where_users_or_assets_went',
  'high_reliability_evidence_count',
  'archived_evidence_count',
  'Evidence counts describe registry provenance depth, not marketplace safety or quality'
]) {
  if (!compare.includes(marker)) fail(`Compare contract missing marker: ${marker}`);
}

if (!header.includes('href="/compare/"')) fail('Main navigation does not expose /compare/');
if (!sitemap.includes("'/compare/'")) fail('Sitemap does not include the canonical Compare base route');
if (sitemap.includes('marketplace=')) fail('Sitemap must not enumerate Compare query variants');

console.log(`MAG Phase 5 Compare contract passed for ${registry.marketplaces.length} canonical marketplaces`);

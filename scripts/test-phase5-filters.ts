import { readFileSync } from 'node:fs';
import type { Marketplace } from '../src/lib/schema';
import { buildSearchText, filterMarketplaces, getFilterOptions } from '../src/lib/filters';
import { readCanonicalSeries } from './registry-public-lib.mjs';

const records = readCanonicalSeries('marketplaces') as Marketplace[];
const fail = (message: string): never => { throw new Error(message); };
const hasSlug = (items: Marketplace[], slug: string) => items.some((item) => item.slug === slug);

const hicEtNunc = records.find((record) => record.slug === 'hic-et-nunc') ?? fail('Representative hic-et-nunc record is missing');
const gameStop = records.find((record) => record.slug === 'gamestop-nft') ?? fail('Representative gamestop-nft record is missing');

if (!hasSlug(filterMarketplaces(records, { closureReason: ['community_fork'] }), 'hic-et-nunc')) {
  fail('closureReason filter does not retain hic-et-nunc');
}
if (!hasSlug(filterMarketplaces(records, { launchYear: ['2021'] }), 'hic-et-nunc')) {
  fail('launchYear filter does not retain hic-et-nunc');
}
if (!hasSlug(filterMarketplaces(records, { endYear: ['2024'] }), 'gamestop-nft')) {
  fail('endYear filter does not retain gamestop-nft');
}
if (!buildSearchText(hicEtNunc).includes('teia')) {
  fail('search text does not include canonical successor linkage');
}
if (gameStop.end_year !== 2024) {
  fail('representative GameStop end-year fixture changed unexpectedly');
}

const options = getFilterOptions(records);
if (options.closureReasons.includes('not_applicable')) {
  fail('not_applicable closure reason must not be exposed as a lifecycle facet');
}
if (!options.launchYears.includes('2021') || !options.endYears.includes('2024')) {
  fail('year filter options do not reflect canonical representative records');
}

const pageSource = readFileSync('src/pages/encyclopedia/index.astro', 'utf8');
const cardSource = readFileSync('src/components/EncyclopediaCard.astro', 'utf8');
for (const marker of ['closure_reason', 'launch_year', 'end_year', 'lifecycle', 'evidence', 'history.replaceState', 'filterSummary.replaceChildren']) {
  if (!pageSource.includes(marker)) fail(`encyclopedia lifecycle filter contract missing marker: ${marker}`);
}
for (const marker of ['data-closure', 'data-launch-year', 'data-end-year', 'data-lifecycle', 'data-evidence-flags']) {
  if (!cardSource.includes(marker)) fail(`encyclopedia card filter metadata missing marker: ${marker}`);
}

console.log(`MAG Phase 5 lifecycle filter contract passed for ${records.length} canonical marketplaces`);

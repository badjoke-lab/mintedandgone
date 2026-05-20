import statsJson from '../../data/stats.json';
import type { Marketplace, Event, Evidence, Stats } from './schema';
import { isFadedSide } from './format';

const marketplaceModules = import.meta.glob('../../data/marketplaces*.json', { eager: true, import: 'default' });
const eventModules = import.meta.glob('../../data/events*.json', { eager: true, import: 'default' });
const evidenceModules = import.meta.glob('../../data/evidence*.json', { eager: true, import: 'default' });

function flattenJsonModules<T>(modules: Record<string, unknown>): T[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([, value]) => value as T[]);
}

const marketplaces = flattenJsonModules<Marketplace>(marketplaceModules);
const events = flattenJsonModules<Event>(eventModules);
const evidence = flattenJsonModules<Evidence>(evidenceModules);

export function getMarketplaces() { return [...marketplaces].sort((a,b) => a.canonical_name.localeCompare(b.canonical_name)); }
export function getStats() { return statsJson as Stats; }
export function getMarketplaceBySlug(slug: string) { return marketplaces.find((m) => m.slug === slug); }
export function getEventsForMarketplace(id: string) { return events.filter((e) => e.marketplace_id === id).sort((a,b) => (a.sort_order ?? 99) - (b.sort_order ?? 99) || a.event_date.localeCompare(b.event_date)); }
export function getEvidenceForMarketplace(id: string) { return evidence.filter((e) => e.marketplace_id === id); }
export function getRelatedMarketplaces(record: Marketplace) {
  return marketplaces.filter((m) => m.id !== record.id && (m.category === record.category || m.chain_scope.some((c) => record.chain_scope.includes(c)))).slice(0,3);
}
export function getFeaturedMarketplaces() {
  const slugs = ['x2y2','hic-et-nunc','opensea','kraken-nft'];
  return slugs.map(getMarketplaceBySlug).filter(Boolean) as Marketplace[];
}
export function getRecentlyGoneMarketplaces() {
  return marketplaces.filter((m) => isFadedSide(m.status)).sort((a,b) => (b.end_year ?? 0) - (a.end_year ?? 0)).slice(0,4);
}

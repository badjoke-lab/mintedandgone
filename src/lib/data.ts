import marketplacesJson from '../../data/marketplaces.json';
import marketplacesBatch02Json from '../../data/marketplaces-batch-02.json';
import eventsJson from '../../data/events.json';
import eventsBatch02Json from '../../data/events-batch-02.json';
import evidenceJson from '../../data/evidence.json';
import lgArtLabEvidenceJson from '../../data/evidence-lg-art-lab.json';
import evidenceBatch02Json from '../../data/evidence-batch-02.json';
import statsJson from '../../data/stats.json';
import type { Marketplace, Event, Evidence, Stats } from './schema';
import { isFadedSide } from './format';

const marketplaces = [...(marketplacesJson as Marketplace[]), ...(marketplacesBatch02Json as Marketplace[])];
const events = [...(eventsJson as Event[]), ...(eventsBatch02Json as Event[])];
const evidence = [...(evidenceJson as Evidence[]), ...(lgArtLabEvidenceJson as Evidence[]), ...(evidenceBatch02Json as Evidence[])];

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

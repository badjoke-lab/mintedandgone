import type { Marketplace } from './schema';

type Filters = { search?: string; status?: string[]; category?: string[]; chain?: string[] };
export function buildSearchText(record: Marketplace) {
  return [record.canonical_name, record.slug, record.summary, record.category, record.marketplace_scope, ...record.chain_scope, ...(record.aliases ?? [])].join(' ').toLowerCase();
}
export function filterMarketplaces(records: Marketplace[], filters: Filters) {
  return records.filter((r) => {
    const q = filters.search?.trim().toLowerCase();
    return (!q || buildSearchText(r).includes(q))
      && (!filters.status?.length || filters.status.includes(r.status))
      && (!filters.category?.length || filters.category.includes(r.category))
      && (!filters.chain?.length || r.chain_scope.some((c) => filters.chain!.includes(c)));
  });
}
export function sortMarketplaces(records: Marketplace[], sort = 'name') {
  return [...records].sort((a,b) => sort === 'end_year' ? (b.end_year ?? 0) - (a.end_year ?? 0) : a.canonical_name.localeCompare(b.canonical_name));
}
export function getFilterOptions(records: Marketplace[]) {
  const uniq = (items: string[]) => [...new Set(items)].sort();
  return { statuses: uniq(records.map(r=>r.status)), categories: uniq(records.map(r=>r.category)), chains: uniq(records.flatMap(r=>r.chain_scope)) };
}

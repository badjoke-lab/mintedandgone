import type { Marketplace } from './schema';

type Filters = {
  search?: string;
  status?: string[];
  category?: string[];
  chain?: string[];
  closureReason?: string[];
  launchYear?: string[];
  endYear?: string[];
};

export function buildSearchText(record: Marketplace) {
  return [
    record.canonical_name,
    record.slug,
    record.summary,
    record.category,
    record.marketplace_scope,
    ...record.chain_scope,
    ...(record.aliases ?? []),
    record.closure_reason,
    record.what_is_gone,
    record.what_remains,
    record.where_users_or_assets_went,
    record.successor_marketplace,
    record.predecessor_marketplace,
    ...(record.record_quality_flags ?? [])
  ].filter(Boolean).join(' ').toLowerCase();
}

export function filterMarketplaces(records: Marketplace[], filters: Filters) {
  return records.filter((record) => {
    const q = filters.search?.trim().toLowerCase();
    const launchYear = record.launch_year ? String(record.launch_year) : 'unknown';
    const endYear = record.end_year ? String(record.end_year) : 'unknown';
    const closureReason = record.closure_reason || 'unknown';

    return (!q || buildSearchText(record).includes(q))
      && (!filters.status?.length || filters.status.includes(record.status))
      && (!filters.category?.length || filters.category.includes(record.category))
      && (!filters.chain?.length || record.chain_scope.some((chain) => filters.chain!.includes(chain)))
      && (!filters.closureReason?.length || filters.closureReason.includes(closureReason))
      && (!filters.launchYear?.length || filters.launchYear.includes(launchYear))
      && (!filters.endYear?.length || filters.endYear.includes(endYear));
  });
}

export function sortMarketplaces(records: Marketplace[], sort = 'name') {
  return [...records].sort((a, b) => sort === 'end_year'
    ? (b.end_year ?? 0) - (a.end_year ?? 0)
    : a.canonical_name.localeCompare(b.canonical_name));
}

export function getFilterOptions(records: Marketplace[]) {
  const uniq = (items: string[]) => [...new Set(items)].sort();
  const years = (items: Array<number | null | undefined>) => uniq(items.filter((value): value is number => Number.isInteger(value)).map(String)).sort((a, b) => Number(b) - Number(a));

  return {
    statuses: uniq(records.map((record) => record.status)),
    categories: uniq(records.map((record) => record.category)),
    chains: uniq(records.flatMap((record) => record.chain_scope)),
    closureReasons: uniq(records.map((record) => record.closure_reason || 'unknown')).filter((value) => value !== 'not_applicable'),
    launchYears: years(records.map((record) => record.launch_year)),
    endYears: years(records.map((record) => record.end_year))
  };
}

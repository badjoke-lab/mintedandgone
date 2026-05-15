import type { Marketplace } from './schema';

export function formatLabel(value?: string | null) {
  if (!value) return 'Unknown';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}
export const formatStatus = formatLabel;
export const formatChain = formatLabel;
export const formatCategory = formatLabel;
export const formatScope = formatLabel;
export function formatYearRange(record: Marketplace) {
  const start = record.launch_year ?? record.launch_date ?? 'Unknown';
  const end = record.end_year ?? (['active','limited'].includes(record.status) ? 'Present' : 'Unknown');
  return `${start}–${end}`;
}
export function formatDatePrecision(date?: string | null, precision?: string) {
  if (!date) return 'Unknown';
  if (precision === 'year') return String(date).slice(0, 4);
  if (precision === 'month') return String(date).slice(0, 7);
  return date;
}
export function isTransitioned(status: string) { return ['acquired','merged','rebranded'].includes(status); }
export function isClosedSide(status: string) { return ['dead', 'acquired', 'merged', 'rebranded'].includes(status); }
export function isFadedSide(status: string) { return ['inactive','dead','acquired','merged','rebranded'].includes(status); }
export function percent(value: number) { return `${Math.round(value * 100)}%`; }

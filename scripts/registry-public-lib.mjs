import { readdirSync, readFileSync } from 'node:fs';

export const SCHEMA_VERSION = '1.0.0';
export const REVIEW_STATES = {
  reviewed_staging: {
    label: 'Source-reviewed draft',
    canonical_public: true,
    public_quality_complete: false,
    meaning: 'The record has source review sufficient for canonical publication as a draft. Open review flags may remain. This is not final public-quality certification.'
  },
  public_quality_reviewed: {
    label: 'Public-quality reviewed',
    canonical_public: true,
    public_quality_complete: true,
    meaning: 'The record has passed the stricter public-quality review criteria and has no unresolved blocking review work.'
  }
};

const INTERNAL_FILE_MARKERS = ['candidate', 'staging', 'monitoring', 'manifest', 'stats', 'history'];

export function isCanonicalSeriesFile(name, prefix) {
  if (!name.startsWith(prefix) || !name.endsWith('.json')) return false;
  const normalized = name.toLowerCase();
  return !INTERNAL_FILE_MARKERS.some((marker) => normalized.includes(marker));
}

export function readCanonicalSeries(prefix) {
  return readdirSync('data')
    .filter((name) => isCanonicalSeriesFile(name, prefix))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .flatMap((name) => JSON.parse(readFileSync(`data/${name}`, 'utf8')));
}

export function countBy(items, getValue) {
  return items.reduce((acc, item) => {
    const raw = getValue(item);
    const values = Array.isArray(raw) ? raw : [raw ?? 'unknown'];
    for (const value of values) {
      const key = value || 'unknown';
      acc[key] = (acc[key] ?? 0) + 1;
    }
    return acc;
  }, {});
}

export function loadCanonicalRegistry() {
  const marketplaces = readCanonicalSeries('marketplaces');
  const events = readCanonicalSeries('events');
  const evidence = readCanonicalSeries('evidence');

  const invalidReviewStates = marketplaces
    .filter((record) => !Object.hasOwn(REVIEW_STATES, record.review_status))
    .map((record) => `${record.id}:${record.review_status}`);

  if (invalidReviewStates.length) {
    throw new Error(`Canonical records use unsupported review_status values: ${invalidReviewStates.join(', ')}`);
  }

  return { marketplaces, events, evidence };
}

function groupByMarketplace(items) {
  const grouped = new Map();
  for (const item of items) {
    const group = grouped.get(item.marketplace_id) ?? [];
    group.push(item);
    grouped.set(item.marketplace_id, group);
  }
  return grouped;
}

export function buildStats({ marketplaces, events, evidence }, generatedAt) {
  const byStatus = countBy(marketplaces, (record) => record.status);
  const exact = (status) => byStatus[status] ?? 0;
  const fadedStatuses = new Set(['inactive', 'dead', 'acquired', 'merged', 'rebranded']);
  const activeSideTotal = exact('active') + exact('limited');
  const fadedSideTotal = exact('inactive') + exact('dead') + exact('acquired') + exact('merged') + exact('rebranded');
  const unknownTotal = exact('unknown');
  const transitionedTotal = exact('acquired') + exact('merged') + exact('rebranded');
  const archiveCount = marketplaces.filter((record) => Boolean(record.archived_url)).length;
  const highCount = marketplaces.filter((record) => record.confidence === 'high').length;
  const sourceReviewedDraftTotal = marketplaces.filter((record) => record.review_status === 'reviewed_staging').length;
  const publicQualityReviewedTotal = marketplaces.filter((record) => record.review_status === 'public_quality_reviewed').length;
  const recordsWithOpenFlags = marketplaces.filter((record) => (record.record_quality_flags ?? []).length > 0).length;
  const statusPartitionTotal = activeSideTotal + fadedSideTotal + unknownTotal;

  if (statusPartitionTotal !== marketplaces.length) {
    throw new Error(`Status-side partition mismatch: ${statusPartitionTotal} != ${marketplaces.length}`);
  }

  const evidenceByMarketplace = groupByMarketplace(evidence);
  const eventsByMarketplace = groupByMarketplace(events);
  const fadedRecords = marketplaces.filter((record) => fadedStatuses.has(record.status));
  const migrationMarketplaceIds = new Set(events.filter((event) => event.event_type === 'asset_migration_announced').map((event) => event.marketplace_id));
  const successorCount = marketplaces.filter((record) => Boolean(record.successor_marketplace)).length;
  const predecessorCount = marketplaces.filter((record) => Boolean(record.predecessor_marketplace)).length;
  const fadedWithOutcomeLink = fadedRecords.filter((record) => Boolean(record.successor_marketplace) || migrationMarketplaceIds.has(record.id)).length;

  const lifespanEligible = marketplaces.filter((record) => Number.isInteger(record.launch_year) && Number.isInteger(record.end_year) && record.end_year >= record.launch_year);
  const lifespanBuckets = countBy(lifespanEligible, (record) => {
    const years = record.end_year - record.launch_year;
    if (years === 0) return 'same_year';
    if (years <= 2) return '1_2_years';
    if (years <= 5) return '3_5_years';
    if (years <= 10) return '6_10_years';
    return '11_plus_years';
  });

  const recordsWithHighReliabilityEvidence = marketplaces.filter((record) => (evidenceByMarketplace.get(record.id) ?? []).some((item) => item.reliability === 'high')).length;
  const recordsWithArchivedEvidence = marketplaces.filter((record) => (evidenceByMarketplace.get(record.id) ?? []).some((item) => Boolean(item.archived_url))).length;

  return {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    canonical_only: true,
    source: {
      marketplaces_count: marketplaces.length,
      events_count: events.length,
      evidence_count: evidence.length,
      note: 'Generated from canonical marketplace, event, and evidence JSON only. Candidate, monitoring, and internal review files are excluded.'
    },
    definitions: {
      status_partition: 'Each marketplace has exactly one status. The status breakdown sums to total marketplaces.',
      active_side: 'active + limited',
      faded_side: 'inactive + dead + acquired + merged + rebranded',
      unknown_side: 'unknown',
      transitioned: 'acquired + merged + rebranded; this is a subset of faded-side, not an additional population.',
      multi_value_breakdowns: ['by_chain', 'platform_roles'],
      review_state_field: 'review_status',
      review_states: REVIEW_STATES,
      lifespan: 'Computed only when both canonical launch_year and end_year are recorded and end_year is not earlier than launch_year.',
      lifecycle_outcome_link: 'For faded-side records only: canonical successor_marketplace or a canonical asset_migration_announced event. Absence means not recorded, not proof that no transition occurred.',
      provenance_coverage: 'Evidence coverage is descriptive registry provenance depth and is not a marketplace safety or quality score.'
    },
    kpis: {
      total_marketplaces: marketplaces.length,
      total_events: events.length,
      total_evidence: evidence.length,
      active_total: exact('active'),
      limited_total: exact('limited'),
      inactive_total: exact('inactive'),
      dead_total: exact('dead'),
      transitioned_total: transitionedTotal,
      active_side_total: activeSideTotal,
      faded_side_total: fadedSideTotal,
      faded_total: fadedSideTotal,
      unknown_total: unknownTotal,
      archive_coverage: marketplaces.length ? archiveCount / marketplaces.length : 0,
      high_confidence_share: marketplaces.length ? highCount / marketplaces.length : 0,
      source_reviewed_draft_total: sourceReviewedDraftTotal,
      source_reviewed_draft_share: marketplaces.length ? sourceReviewedDraftTotal / marketplaces.length : 0,
      public_quality_reviewed_total: publicQualityReviewedTotal,
      public_quality_reviewed_share: marketplaces.length ? publicQualityReviewedTotal / marketplaces.length : 0,
      records_with_open_flags: recordsWithOpenFlags,
      open_flag_share: marketplaces.length ? recordsWithOpenFlags / marketplaces.length : 0
    },
    breakdowns: {
      by_status: byStatus,
      by_category: countBy(marketplaces, (record) => record.category),
      by_marketplace_scope: countBy(marketplaces, (record) => record.marketplace_scope),
      by_chain: countBy(marketplaces, (record) => record.chain_scope),
      by_confidence: countBy(marketplaces, (record) => record.confidence),
      by_review_status: countBy(marketplaces, (record) => record.review_status),
      by_closure_reason_faded_side: countBy(fadedRecords, (record) => record.closure_reason || 'unknown')
    },
    lifecycle: {
      faded_side_population: fadedRecords.length,
      successor_recorded: successorCount,
      predecessor_recorded: predecessorCount,
      migration_event_recorded: migrationMarketplaceIds.size,
      faded_with_successor_or_migration: {
        count: fadedWithOutcomeLink,
        total: fadedRecords.length,
        share: fadedRecords.length ? fadedWithOutcomeLink / fadedRecords.length : 0
      },
      lifespan: {
        eligible_count: lifespanEligible.length,
        total_marketplaces: marketplaces.length,
        coverage_share: marketplaces.length ? lifespanEligible.length / marketplaces.length : 0,
        buckets: lifespanBuckets
      }
    },
    coverage: {
      archive_coverage: {
        count: archiveCount,
        total: marketplaces.length,
        share: marketplaces.length ? archiveCount / marketplaces.length : 0
      },
      high_reliability_evidence: {
        count: recordsWithHighReliabilityEvidence,
        total: marketplaces.length,
        share: marketplaces.length ? recordsWithHighReliabilityEvidence / marketplaces.length : 0
      },
      archived_evidence: {
        count: recordsWithArchivedEvidence,
        total: marketplaces.length,
        share: marketplaces.length ? recordsWithArchivedEvidence / marketplaces.length : 0
      }
    },
    quality: {
      record_quality_flags: countBy(marketplaces.flatMap((record) => record.record_quality_flags ?? []), (value) => value),
      evidence_depth: countBy(marketplaces, (record) => {
        const count = (evidenceByMarketplace.get(record.id) ?? []).length;
        return count === 0 ? 'zero' : count === 1 ? 'one' : 'multiple';
      }),
      lifecycle_event_depth: countBy(marketplaces, (record) => {
        const count = (eventsByMarketplace.get(record.id) ?? []).length;
        return count === 0 ? 'zero' : count === 1 ? 'one' : 'multiple';
      })
    },
    distributions: {
      launch_year: countBy(marketplaces, (record) => record.launch_year ? String(record.launch_year) : 'unknown'),
      end_year: countBy(marketplaces, (record) => record.end_year ? String(record.end_year) : 'unknown')
    },
    completeness: {
      what_remains_present: {
        count: marketplaces.filter((record) => Boolean(record.what_remains)).length,
        total: marketplaces.length
      }
    }
  };
}

export function publicRecordEnvelope(recordType, records, generatedAt) {
  return {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    canonical_only: true,
    record_type: recordType,
    record_count: records.length,
    records
  };
}

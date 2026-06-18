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

const canonicalPattern = (prefix) => new RegExp(`^${prefix}(?:-batch-\\d+)?\\.json$`);

export function readCanonicalSeries(prefix) {
  const pattern = canonicalPattern(prefix);
  return readdirSync('data')
    .filter((name) => pattern.test(name))
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

export function buildStats({ marketplaces, events, evidence }, generatedAt) {
  const byStatus = countBy(marketplaces, (record) => record.status);
  const exact = (status) => byStatus[status] ?? 0;
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
      review_states: REVIEW_STATES
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
      by_review_status: countBy(marketplaces, (record) => record.review_status)
    },
    coverage: {
      archive_coverage: {
        count: archiveCount,
        total: marketplaces.length,
        share: marketplaces.length ? archiveCount / marketplaces.length : 0
      }
    },
    quality: {
      record_quality_flags: countBy(marketplaces.flatMap((record) => record.record_quality_flags ?? []), (value) => value),
      evidence_depth: countBy(marketplaces, (record) => {
        const count = evidence.filter((item) => item.marketplace_id === record.id).length;
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

function duplicateValues(records, field) {
  const seen = new Set();
  const duplicates = new Set();
  for (const record of records) {
    const value = record?.[field];
    if (!value) continue;
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function ageInDays(value, now) {
  if (!value) return Infinity;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return Infinity;
  return Math.floor((now.getTime() - parsed.getTime()) / 86_400_000);
}

export function runRecordQuality(data, options = {}) {
  const now = options.now || new Date();
  const staleDays = options.staleDays || 120;
  const findings = [];
  const add = (severity, category, title, details, marketplaceId = null, extra = {}) => findings.push({
    severity,
    category,
    title,
    details,
    marketplace_id: marketplaceId,
    ...extra
  });

  const tokenizedIds = new Set(data.tokenized.map((record) => record.id));
  const tokenizedSlugs = new Set(data.tokenized.map((record) => record.slug));
  const tokenizedEvents = data.events.filter((event) => tokenizedIds.has(event.marketplace_id));
  const tokenizedEvidence = data.evidence.filter((source) => tokenizedIds.has(source.marketplace_id));
  const tokenizedEventIds = new Set(tokenizedEvents.map((event) => event.id));
  const tokenizedEvidenceIds = new Set(tokenizedEvidence.map((source) => source.id));

  for (const value of duplicateValues(data.marketplaces, 'id').filter((value) => tokenizedIds.has(value))) {
    add('critical', 'duplicate_marketplace_id', `Duplicate marketplace ID ${value}`, 'A Tokenized Collectibles marketplace ID must be unique.', value);
  }
  for (const value of duplicateValues(data.marketplaces, 'slug').filter((value) => tokenizedSlugs.has(value))) {
    add('critical', 'duplicate_marketplace_slug', `Duplicate marketplace slug ${value}`, 'A Tokenized Collectibles marketplace slug must be unique.');
  }
  for (const value of duplicateValues(data.events, 'id').filter((value) => tokenizedEventIds.has(value))) {
    add('critical', 'duplicate_event_id', `Duplicate event ID ${value}`, 'A Tokenized Collectibles event ID must be unique.');
  }
  for (const value of duplicateValues(data.evidence, 'id').filter((value) => tokenizedEvidenceIds.has(value))) {
    add('critical', 'duplicate_evidence_id', `Duplicate evidence ID ${value}`, 'A Tokenized Collectibles evidence ID must be unique.');
  }

  const marketplaceById = new Map(data.marketplaces.map((record) => [record.id, record]));
  const eventById = new Map(data.events.map((event) => [event.id, event]));
  const eventsByMarketplace = new Map();
  const evidenceByMarketplace = new Map();
  const evidenceByEvent = new Map();

  for (const event of tokenizedEvents) {
    if (!marketplaceById.has(event.marketplace_id)) {
      add('critical', 'missing_marketplace_reference', `${event.id} references a missing marketplace`, event.marketplace_id, event.marketplace_id, { event_id: event.id });
    }
    if (!eventsByMarketplace.has(event.marketplace_id)) eventsByMarketplace.set(event.marketplace_id, []);
    eventsByMarketplace.get(event.marketplace_id).push(event);
  }

  for (const source of tokenizedEvidence) {
    if (!marketplaceById.has(source.marketplace_id)) {
      add('critical', 'missing_marketplace_reference', `${source.id} references a missing marketplace`, source.marketplace_id, source.marketplace_id, { evidence_id: source.id });
    }
    if (!evidenceByMarketplace.has(source.marketplace_id)) evidenceByMarketplace.set(source.marketplace_id, []);
    evidenceByMarketplace.get(source.marketplace_id).push(source);

    if (source.event_id) {
      const event = eventById.get(source.event_id);
      if (!event) {
        add('critical', 'missing_event_reference', `${source.id} references a missing event`, source.event_id, source.marketplace_id, { evidence_id: source.id, event_id: source.event_id });
      } else if (event.marketplace_id !== source.marketplace_id) {
        add('critical', 'event_marketplace_mismatch', `${source.id} does not match its event marketplace`, source.event_id, source.marketplace_id, { evidence_id: source.id, event_id: source.event_id });
      }
      if (!evidenceByEvent.has(source.event_id)) evidenceByEvent.set(source.event_id, []);
      evidenceByEvent.get(source.event_id).push(source);
    }
  }

  for (const event of tokenizedEvents) {
    if (!Number.isInteger(event.source_count)) continue;
    const linked = evidenceByEvent.get(event.id)?.length || 0;
    if (event.source_count !== linked) {
      add('medium', 'source_count_mismatch', `${event.id} source_count does not match linked evidence`, `${event.source_count} declared; ${linked} linked`, event.marketplace_id, { event_id: event.id });
    }
  }

  for (const record of data.tokenized) {
    const events = eventsByMarketplace.get(record.id) || [];
    const sources = evidenceByMarketplace.get(record.id) || [];
    const scopes = new Set(sources.map((source) => source.claim_scope));

    if (!events.length) add('high', 'missing_event', `${record.canonical_name} has no event`, 'At least one review or lifecycle event is required.', record.id);
    if (sources.length < 3) add('high', 'thin_evidence', `${record.canonical_name} has thin evidence`, `${sources.length} evidence records found.`, record.id);
    if (!record.official_url_original) add('high', 'missing_official_url', `${record.canonical_name} has no official URL`, 'An official URL is required for live monitoring.', record.id);
    if (!record.archived_url) add('medium', 'missing_archive_url', `${record.canonical_name} has no archive URL`, 'Historical archive coverage is missing.', record.id);
    if (!sources.some((source) => source.source_type === 'archive_capture' || source.archived_url)) add('medium', 'missing_archive_evidence', `${record.canonical_name} has no archive evidence`, 'No evidence record contains archive coverage.', record.id);

    const age = ageInDays(record.last_verified_at, now);
    if (age > staleDays) add('medium', 'stale_record', `${record.canonical_name} is stale`, `${age} days since ${record.last_verified_at || 'unknown'}.`, record.id);

    if (record.asset_backing === 'physical_1_to_1' && !scopes.has('physical_backing')) add('high', 'unsupported_backing_claim', `${record.canonical_name} lacks backing evidence`, 'physical_1_to_1 requires physical_backing evidence.', record.id);
    if (record.custody_model && record.custody_model !== 'unknown' && !scopes.has('custody')) add('high', 'unsupported_custody_claim', `${record.canonical_name} lacks custody evidence`, record.custody_model, record.id);
    if (['active', 'restricted', 'paused', 'ended'].includes(record.redemption_status) && !scopes.has('redemption')) add('high', 'unsupported_redemption_claim', `${record.canonical_name} lacks redemption evidence`, record.redemption_status, record.id);
    if (!['none', 'unknown', undefined].includes(record.randomized_sale_model) && !scopes.has('randomized_sale')) add('high', 'unsupported_randomized_sale_claim', `${record.canonical_name} lacks randomized-sale evidence`, record.randomized_sale_model, record.id);
    if (!['none', 'open_market_only', 'unknown', undefined].includes(record.buyback_model) && !scopes.has('buyback')) add('high', 'unsupported_buyback_claim', `${record.canonical_name} lacks buyback evidence`, record.buyback_model, record.id);

    for (const field of ['asset_backing', 'custody_model', 'redemption_status']) {
      if (!record[field] || record[field] === 'unknown' || record[field] === 'unclear') {
        add('low', 'unresolved_field', `${record.canonical_name} has unresolved ${field}`, String(record[field] || 'missing'), record.id, { field });
      }
    }
  }

  return {
    monitor: 'record-quality',
    status: findings.length ? 'findings' : 'ok',
    findings,
    summary: {
      scoped_marketplaces: data.tokenized.length,
      scoped_events: tokenizedEvents.length,
      scoped_evidence: tokenizedEvidence.length,
      findings: findings.length,
      critical: findings.filter((item) => item.severity === 'critical').length,
      high: findings.filter((item) => item.severity === 'high').length,
      medium: findings.filter((item) => item.severity === 'medium').length,
      low: findings.filter((item) => item.severity === 'low').length
    }
  };
}

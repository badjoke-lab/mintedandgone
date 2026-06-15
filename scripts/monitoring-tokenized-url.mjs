import { existsSync } from 'node:fs';
import { readJson } from './monitoring-tokenized-fs.mjs';

export function classifyHttpStatus(status) {
  if (status >= 200 && status < 400) return 'ok';
  if ([401, 403, 429].includes(status)) return 'reachable_restricted';
  if ([404, 410].includes(status)) return 'not_found';
  if (status >= 500) return 'server_error';
  return 'unexpected_status';
}

export function severityForUrlResult(result, metadata, failures) {
  if (result.status === 'not_found') {
    if (metadata.kind === 'official') return 'high';
    return failures >= 3 ? 'high' : 'medium';
  }
  if (['server_error', 'timeout', 'network_error'].includes(result.status)) {
    if (failures >= 3) return 'high';
    if (failures === 2) return 'medium';
    return 'low';
  }
  if (result.status === 'cross_domain_redirect') return 'low';
  return null;
}

function hostname(value) {
  try { return new URL(value).hostname.replace(/^www\./, ''); }
  catch { return null; }
}

export async function checkUrl(url, options = {}) {
  const timeoutMs = options.timeoutMs || 12_000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'MintedAndGoneMonitor/1.0 (+https://mag.badjoke-lab.com/)' }
    });
    const baseStatus = classifyHttpStatus(response.status);
    const originalHost = hostname(url);
    const finalHost = hostname(response.url);
    const status = baseStatus === 'ok' && originalHost && finalHost && originalHost !== finalHost
      ? 'cross_domain_redirect'
      : baseStatus;
    return { status, http_status: response.status, final_url: response.url };
  } catch (error) {
    if (error?.name === 'AbortError') return { status: 'timeout', error: 'request timed out' };
    return { status: 'network_error', error: String(error?.message || error) };
  } finally {
    clearTimeout(timeout);
  }
}

function loadPreviousState(statePath) {
  if (!statePath || !existsSync(statePath)) return { urls: {} };
  try { return readJson(statePath); }
  catch { return { urls: {} }; }
}

export async function runUrlHealth(data, options = {}) {
  const live = Boolean(options.live);
  const previous = loadPreviousState(options.statePath);
  const targets = new Map();
  const findings = [];
  const checks = [];
  const nextState = { schema_version: 1, checked_at: (options.now || new Date()).toISOString(), urls: {} };
  const tokenizedIds = new Set(data.tokenized.map((record) => record.id));

  for (const record of data.tokenized) {
    if (record.official_url_original) targets.set(record.official_url_original, { kind: 'official', marketplace_id: record.id, marketplace: record.canonical_name });
  }
  for (const source of data.evidence) {
    if (!tokenizedIds.has(source.marketplace_id) || !source.url) continue;
    const record = data.tokenized.find((item) => item.id === source.marketplace_id);
    targets.set(source.url, { kind: 'evidence', marketplace_id: source.marketplace_id, marketplace: record?.canonical_name || source.marketplace_id, evidence_id: source.id });
  }

  if (!live) {
    return {
      monitor: 'url-health',
      status: 'skipped',
      findings,
      checks,
      state: nextState,
      summary: { targets: targets.size, checked: 0, findings: 0, mode: 'offline' }
    };
  }

  for (const [url, metadata] of targets.entries()) {
    const result = await checkUrl(url, options);
    const failure = ['not_found', 'server_error', 'timeout', 'network_error'].includes(result.status);
    const previousFailures = previous.urls?.[url]?.consecutive_failures || 0;
    const consecutiveFailures = failure ? previousFailures + 1 : 0;
    const severity = severityForUrlResult(result, metadata, consecutiveFailures);
    const check = { url, ...metadata, ...result, consecutive_failures: consecutiveFailures };
    checks.push(check);
    nextState.urls[url] = { status: result.status, consecutive_failures: consecutiveFailures, checked_at: nextState.checked_at, final_url: result.final_url || null };

    if (severity) {
      findings.push({
        severity,
        category: `${metadata.kind}_url_${result.status}`,
        title: `${metadata.marketplace} ${metadata.kind} URL requires review`,
        details: `${url} — ${result.status}${result.http_status ? ` (${result.http_status})` : ''}; consecutive failures: ${consecutiveFailures}`,
        marketplace_id: metadata.marketplace_id,
        evidence_id: metadata.evidence_id || null,
        source_urls: [url]
      });
    }
  }

  return {
    monitor: 'url-health',
    status: findings.length ? 'findings' : 'ok',
    findings,
    checks,
    state: nextState,
    summary: { targets: targets.size, checked: checks.length, findings: findings.length, mode: 'live' }
  };
}

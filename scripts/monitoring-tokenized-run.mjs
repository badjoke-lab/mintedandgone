import path from 'node:path';
import { CATEGORY, DEFAULT_OUTPUT_ROOT } from './monitoring-tokenized-constants.mjs';
import { loadCanonicalData } from './monitoring-tokenized-load-data.mjs';
import { snapshotCanonical, assertCanonicalUnchanged } from './monitoring-tokenized-guard.mjs';
import { runMonitoringHealth } from './monitoring-tokenized-health.mjs';
import { runRecordQuality } from './monitoring-tokenized-quality.mjs';
import { runCandidateState } from './monitoring-tokenized-candidate-state.mjs';
import { runUrlHealth } from './monitoring-tokenized-url.mjs';
import { createRunId, writeMonitoringReport } from './monitoring-tokenized-report.mjs';
import { writeJson } from './monitoring-tokenized-fs.mjs';

const args = process.argv.slice(2);
const has = (name) => args.includes(name);
const value = (name) => args.find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
const publish = has('--publish');
const live = has('--live');
const forceReport = has('--force-report');
const outputRoot = value('--output-root') || DEFAULT_OUTPUT_ROOT;
const statePath = value('--url-state') || path.join(outputRoot, 'state', 'url-state.json');
const now = new Date();
const staleDays = Number(process.env.TOKENIZED_STALE_DAYS || 120);
const holdDays = Number(process.env.TOKENIZED_HOLD_DAYS || 90);
const timeoutMs = Number(process.env.TOKENIZED_URL_TIMEOUT_MS || 12_000);

const before = snapshotCanonical();
const data = loadCanonicalData();
const monitorResults = [
  runMonitoringHealth(data),
  runRecordQuality(data, { now, staleDays }),
  runCandidateState({ now, holdDays }),
  await runUrlHealth(data, { now, live, statePath, timeoutMs })
];
const after = snapshotCanonical();
assertCanonicalUnchanged(before, after);

const findings = monitorResults.flatMap((result) => result.findings.map((item, index) => ({
  finding_id: `${result.monitor}_${createRunId(now)}_${String(index + 1).padStart(3, '0')}`,
  monitor: result.monitor,
  ...item,
  detected_at: now.toISOString()
})));

const severity = Object.fromEntries(['critical', 'high', 'medium', 'low'].map((level) => [level, findings.filter((item) => item.severity === level).length]));
const tokenizedIds = new Set(data.tokenized.map((record) => record.id));
const urlMonitor = monitorResults.find((result) => result.monitor === 'url-health');

const report = {
  schema_version: 1,
  run_id: createRunId(now),
  checked_at: now.toISOString(),
  mode: live ? (publish ? 'live_publish' : 'live_dry_run') : (publish ? 'offline_publish' : 'offline_dry_run'),
  category: CATEGORY,
  canonical_files_modified: false,
  thresholds: { stale_days: staleDays, hold_days: holdDays, url_timeout_ms: timeoutMs },
  summary: {
    marketplaces: data.tokenized.length,
    events: data.events.filter((event) => tokenizedIds.has(event.marketplace_id)).length,
    evidence: data.evidence.filter((source) => tokenizedIds.has(source.marketplace_id)).length,
    url_targets: urlMonitor?.summary.targets || 0,
    url_checks: urlMonitor?.summary.checked || 0,
    findings: findings.length,
    ...severity
  },
  monitors: monitorResults,
  findings
};

if (live && publish && urlMonitor?.state) {
  writeJson(statePath, urlMonitor.state);
}

if (forceReport || (publish && findings.length)) {
  const written = writeMonitoringReport(report, { outputRoot });
  console.log(`Monitoring report written to ${written.dated}`);
} else {
  console.log('No report written. Use --force-report for a smoke artifact or --publish when findings exist.');
}

console.log(JSON.stringify(report.summary));

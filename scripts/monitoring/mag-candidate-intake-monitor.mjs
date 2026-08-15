import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const configPath = path.join(root, 'scripts/monitoring/candidate-intake-sources.json');
const args = new Set(process.argv.slice(2));
const validateOnly = args.has('--validate');
const outputRootArg = process.argv.find((arg) => arg.startsWith('--output-root='));
const outputRoot = outputRootArg?.split('=', 2)[1] || 'data-staging/monitoring/candidate-intake';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function loadConfig() {
  const rows = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!Array.isArray(rows) || rows.length === 0) fail('candidate monitoring config must be a non-empty array');
  const seen = new Set();
  for (const row of rows) {
    if (!/^mag_candidate_[0-9]{6}$/.test(row.candidate_id || '')) fail(`${row.candidate_id || 'unknown'}: invalid candidate_id`);
    if (seen.has(row.candidate_id)) fail(`${row.candidate_id}: duplicate candidate_id`);
    seen.add(row.candidate_id);
    if (typeof row.name !== 'string' || !row.name.trim()) fail(`${row.candidate_id}: name required`);
    let parsed;
    try {
      parsed = new URL(row.url);
    } catch {
      fail(`${row.candidate_id}: invalid URL`);
    }
    if (parsed.protocol !== 'https:') fail(`${row.candidate_id}: URL must use HTTPS`);
    if (!Array.isArray(row.allowed_hosts) || !row.allowed_hosts.includes(parsed.hostname)) fail(`${row.candidate_id}: configured host must be allowlisted`);
    if (row.status !== 'needs_research') fail(`${row.candidate_id}: only needs_research candidates belong in this monitor`);
    if (row.canonical_record !== false) fail(`${row.candidate_id}: canonical_record must remain false`);
    const scopes = new Set(row.monitor_for || []);
    for (const required of ['domain_availability', 'http_status', 'redirect_target']) {
      if (!scopes.has(required)) fail(`${row.candidate_id}: monitor_for missing ${required}`);
    }
  }
  return rows;
}

async function checkUrl(row) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(row.url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'MintedAndGoneCandidateMonitor/1.0' }
    });
    const finalUrl = response.url || row.url;
    const finalHost = new URL(finalUrl).hostname;
    return {
      candidate_id: row.candidate_id,
      name: row.name,
      configured_url: row.url,
      checked_at: new Date().toISOString(),
      ok: response.ok,
      http_status: response.status,
      final_url: finalUrl,
      final_host: finalHost,
      redirect_outside_allowlist: !row.allowed_hosts.includes(finalHost),
      error: null
    };
  } catch (error) {
    return {
      candidate_id: row.candidate_id,
      name: row.name,
      configured_url: row.url,
      checked_at: new Date().toISOString(),
      ok: false,
      http_status: null,
      final_url: null,
      final_host: null,
      redirect_outside_allowlist: false,
      error: error?.name === 'AbortError' ? 'timeout' : String(error?.message || error)
    };
  } finally {
    clearTimeout(timeout);
  }
}

function summaryMarkdown(runId, results) {
  const lines = [
    '# MAG Candidate Intake Monitoring',
    '',
    `- Run: \`${runId}\``,
    '- Canonical writes: 0',
    '- Public classification changes: 0',
    '- Review-only: true',
    '',
    '## Results',
    ''
  ];
  for (const result of results) {
    lines.push(`- **${result.name}** (${result.candidate_id}): ${result.ok ? 'reachable' : 'review needed'}${result.http_status ? ` — HTTP ${result.http_status}` : ''}`);
    if (result.final_url) lines.push(`  - final URL: ${result.final_url}`);
    if (result.redirect_outside_allowlist) lines.push('  - alert: redirect left the configured host allowlist');
    if (result.error) lines.push(`  - error: ${result.error}`);
  }
  lines.push('', 'Monitoring signals do not promote a candidate into canonical MAG data.', '');
  return lines.join('\n');
}

const rows = loadConfig();
if (validateOnly) {
  console.log(`MAG candidate monitoring config valid: ${rows.length} noncanonical candidate(s).`);
  process.exit(0);
}

const runId = process.env.MAG_CANDIDATE_MONITOR_RUN_ID || new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const runDir = path.join(root, outputRoot, runId);
fs.mkdirSync(runDir, { recursive: true });
const results = [];
for (const row of rows) results.push(await checkUrl(row));

const report = {
  schema_version: '1.0',
  run_id: runId,
  generated_at: new Date().toISOString(),
  canonical_write_allowed: false,
  public_output: false,
  candidate_count: rows.length,
  findings_requiring_review: results.filter((item) => !item.ok || item.redirect_outside_allowlist).length,
  results
};
fs.writeFileSync(path.join(runDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(runDir, 'summary.md'), summaryMarkdown(runId, results));
console.log(JSON.stringify({ run_id: runId, findings_requiring_review: report.findings_requiring_review }, null, 2));

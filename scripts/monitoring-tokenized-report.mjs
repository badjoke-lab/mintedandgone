import path from 'node:path';
import { DEFAULT_OUTPUT_ROOT } from './monitoring-tokenized-constants.mjs';
import { writeJson, writeText } from './monitoring-tokenized-fs.mjs';

export function createRunId(now = new Date()) {
  return now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function buildSummary(report) {
  const lines = [
    `# Tokenized Collectibles Monitoring — ${report.checked_at.slice(0, 10)}`,
    '',
    `- Run: ${report.run_id}`,
    `- Mode: ${report.mode}`,
    `- Marketplaces: ${report.summary.marketplaces}`,
    `- Events: ${report.summary.events}`,
    `- Evidence: ${report.summary.evidence}`,
    `- URL checks: ${report.summary.url_checks} / ${report.summary.url_targets}`,
    `- Findings: ${report.summary.findings}`,
    `- Critical: ${report.summary.critical} · High: ${report.summary.high} · Medium: ${report.summary.medium} · Low: ${report.summary.low}`,
    '',
    '## Monitor summary',
    ''
  ];

  for (const monitor of report.monitors) {
    lines.push(`- **${monitor.monitor}**: ${monitor.status} · ${monitor.summary.findings ?? 0} findings`);
  }

  lines.push('', '## Findings', '');
  if (!report.findings.length) lines.push('No findings.');
  for (const item of report.findings) {
    lines.push(`- **${item.severity.toUpperCase()}** [${item.monitor}] ${item.title} — ${item.details}`);
  }

  lines.push('', '## Safety', '', 'This monitoring run did not modify canonical marketplace, event, or evidence files.');
  return lines.join('\n');
}

export function writeMonitoringReport(report, options = {}) {
  const root = options.outputRoot || DEFAULT_OUTPUT_ROOT;
  const dated = path.join(root, report.checked_at.slice(0, 10));
  const latest = path.join(root, 'latest');
  const summary = buildSummary(report);
  const urlMonitor = report.monitors.find((monitor) => monitor.monitor === 'url-health');

  writeJson(path.join(dated, 'report.json'), report);
  writeText(path.join(dated, 'summary.md'), summary);
  writeJson(path.join(latest, 'report.json'), report);
  writeText(path.join(latest, 'summary.md'), summary);

  if (urlMonitor?.checks?.length) {
    writeJson(path.join(dated, 'url-checks.json'), urlMonitor.checks);
    writeJson(path.join(latest, 'url-checks.json'), urlMonitor.checks);
    writeJson(path.join(root, 'state', 'url-state.json'), urlMonitor.state);
  }

  return { dated, latest };
}

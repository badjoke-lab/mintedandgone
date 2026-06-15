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
    `- Findings: ${report.summary.findings}`,
    '',
    '## Findings',
    ''
  ];

  if (!report.findings.length) lines.push('No findings.');
  for (const item of report.findings) {
    lines.push(`- **${item.severity.toUpperCase()}** ${item.title} — ${item.details}`);
  }

  lines.push('', '## Safety', '', 'This monitoring run did not modify canonical marketplace, event, or evidence files.');
  return lines.join('\n');
}

export function writeMonitoringReport(report, options = {}) {
  const root = options.outputRoot || DEFAULT_OUTPUT_ROOT;
  const dated = path.join(root, report.checked_at.slice(0, 10));
  const latest = path.join(root, 'latest');
  const summary = buildSummary(report);

  writeJson(path.join(dated, 'report.json'), report);
  writeText(path.join(dated, 'summary.md'), summary);
  writeJson(path.join(latest, 'report.json'), report);
  writeText(path.join(latest, 'summary.md'), summary);

  return { dated, latest };
}

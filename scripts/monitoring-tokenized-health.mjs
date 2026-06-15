export function runMonitoringHealth(data) {
  const findings = [];

  if (!data.marketplaces.length) {
    findings.push({
      severity: 'critical',
      category: 'canonical_empty',
      title: 'No marketplace records were loaded',
      details: 'Monitoring cannot continue without canonical marketplace data.'
    });
  }

  if (!data.tokenized.length) {
    findings.push({
      severity: 'high',
      category: 'category_empty',
      title: 'No tokenized collectibles records were found',
      details: 'The category exists in the site but has no canonical records.'
    });
  }

  return {
    monitor: 'monitoring-health',
    status: findings.length ? 'findings' : 'ok',
    findings,
    summary: {
      marketplaces: data.marketplaces.length,
      events: data.events.length,
      evidence: data.evidence.length,
      tokenized_collectibles: data.tokenized.length,
      findings: findings.length
    }
  };
}

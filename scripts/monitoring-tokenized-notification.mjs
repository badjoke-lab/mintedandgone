export const BACKLOG_ONLY_CATEGORIES = new Set([
  'unresolved_field',
  'stale_hold_candidate'
]);

export function classifyNotificationFindings(findings) {
  const notificationFindings = [];
  const backlogFindings = [];

  for (const finding of findings) {
    if (finding.severity === 'low' && BACKLOG_ONLY_CATEGORIES.has(finding.category)) {
      backlogFindings.push(finding);
    } else {
      notificationFindings.push(finding);
    }
  }

  return {
    notificationFindings,
    backlogFindings,
    shouldNotify: notificationFindings.length > 0
  };
}

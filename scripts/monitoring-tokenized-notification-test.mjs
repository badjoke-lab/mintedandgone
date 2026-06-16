import assert from 'node:assert/strict';
import { classifyNotificationFindings } from './monitoring-tokenized-notification.mjs';

const backlogOnly = classifyNotificationFindings([
  { severity: 'low', category: 'unresolved_field' },
  { severity: 'low', category: 'stale_hold_candidate' }
]);
assert.equal(backlogOnly.shouldNotify, false);
assert.equal(backlogOnly.notificationFindings.length, 0);
assert.equal(backlogOnly.backlogFindings.length, 2);

const transientUrl = classifyNotificationFindings([
  { severity: 'low', category: 'evidence_url_network_error' },
  { severity: 'low', category: 'unresolved_field' }
]);
assert.equal(transientUrl.shouldNotify, true);
assert.equal(transientUrl.notificationFindings.length, 1);
assert.equal(transientUrl.backlogFindings.length, 1);

const mediumFinding = classifyNotificationFindings([
  { severity: 'medium', category: 'source_count_mismatch' }
]);
assert.equal(mediumFinding.shouldNotify, true);
assert.equal(mediumFinding.notificationFindings.length, 1);

console.log('Tokenized monitoring notification tests passed');

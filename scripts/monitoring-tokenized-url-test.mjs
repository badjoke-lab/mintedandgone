import assert from 'node:assert/strict';
import { classifyHttpStatus, severityForUrlResult } from './monitoring-tokenized-url.mjs';

assert.equal(classifyHttpStatus(200), 'ok');
assert.equal(classifyHttpStatus(302), 'ok');
assert.equal(classifyHttpStatus(403), 'reachable_restricted');
assert.equal(classifyHttpStatus(429), 'reachable_restricted');
assert.equal(classifyHttpStatus(404), 'not_found');
assert.equal(classifyHttpStatus(410), 'not_found');
assert.equal(classifyHttpStatus(503), 'server_error');

assert.equal(severityForUrlResult({ status: 'not_found' }, { kind: 'official' }, 1), 'high');
assert.equal(severityForUrlResult({ status: 'not_found' }, { kind: 'evidence' }, 1), 'medium');
assert.equal(severityForUrlResult({ status: 'timeout' }, { kind: 'official' }, 1), 'low');
assert.equal(severityForUrlResult({ status: 'timeout' }, { kind: 'official' }, 2), 'medium');
assert.equal(severityForUrlResult({ status: 'timeout' }, { kind: 'official' }, 3), 'high');
assert.equal(severityForUrlResult({ status: 'reachable_restricted' }, { kind: 'official' }, 5), null);

console.log('Tokenized URL monitor classification tests passed');

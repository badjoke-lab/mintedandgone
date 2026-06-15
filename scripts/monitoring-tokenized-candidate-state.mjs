import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { readJson } from './monitoring-tokenized-fs.mjs';

function collectCandidateStates(value, states) {
  if (Array.isArray(value)) {
    for (const item of value) collectCandidateStates(item, states);
    return;
  }
  if (!value || typeof value !== 'object') return;

  const id = value.candidate_id || value.candidate;
  if (typeof id === 'string' && id.startsWith('mag_rwa_candidate_')) {
    states.set(id, {
      action: value.action || value.decision || value.status || 'reviewed',
      marketplace_id: value.marketplace_id || value.marketplace || null
    });
  }

  for (const child of Object.values(value)) collectCandidateStates(child, states);
}

function ageInDays(value, now) {
  if (!value) return 0;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return 0;
  return Math.floor((now.getTime() - parsed.getTime()) / 86_400_000);
}

export function runCandidateState(options = {}) {
  const root = options.root || process.cwd();
  const now = options.now || new Date();
  const holdDays = options.holdDays || 90;
  const researchDir = path.join(root, 'research');
  const candidatePath = path.join(researchDir, 'tokenized-collectibles-candidates.json');
  const findings = [];

  if (!existsSync(candidatePath)) {
    return {
      monitor: 'candidate-state',
      status: 'findings',
      findings: [{ severity: 'high', category: 'candidate_ledger_missing', title: 'Tokenized candidate ledger is missing', details: candidatePath }],
      summary: { candidates: 0, resolved: 0, unresolved: 0, held: 0, findings: 1 }
    };
  }

  const ledger = readJson(candidatePath);
  const candidates = ledger.candidates || [];
  const states = new Map();

  for (const name of readdirSync(researchDir).filter((name) => name.endsWith('.json') && name !== 'tokenized-collectibles-candidates.json')) {
    if (!name.includes('tokenized')) continue;
    try {
      collectCandidateStates(readJson(path.join(researchDir, name)), states);
    } catch (error) {
      findings.push({ severity: 'high', category: 'candidate_state_parse_error', title: `Cannot parse ${name}`, details: String(error?.message || error) });
    }
  }

  let resolved = 0;
  let held = 0;
  const ledgerAge = ageInDays(ledger.generated_at, now);

  for (const candidate of candidates) {
    const state = states.get(candidate.candidate_id);
    if (!state) {
      findings.push({
        severity: 'medium',
        category: 'unresolved_candidate',
        title: `${candidate.canonical_name} has no recorded decision`,
        details: candidate.candidate_id,
        candidate_id: candidate.candidate_id
      });
      continue;
    }

    resolved += 1;
    if (String(state.action).includes('hold')) {
      held += 1;
      if (ledgerAge > holdDays) {
        findings.push({
          severity: 'low',
          category: 'stale_hold_candidate',
          title: `${candidate.canonical_name} has remained on hold`,
          details: `${ledgerAge} days since candidate ledger generation.`,
          candidate_id: candidate.candidate_id
        });
      }
    }
  }

  return {
    monitor: 'candidate-state',
    status: findings.length ? 'findings' : 'ok',
    findings,
    summary: {
      candidates: candidates.length,
      resolved,
      unresolved: candidates.length - resolved,
      held,
      findings: findings.length
    }
  };
}

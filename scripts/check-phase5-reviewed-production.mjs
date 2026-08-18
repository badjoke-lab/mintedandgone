import { execFileSync, spawnSync } from 'node:child_process';

const minimumCommit = process.argv[2];
const origin = (process.env.MAG_PRODUCTION_ORIGIN || 'https://mag.badjoke-lab.com').replace(/\/$/, '');
if (!minimumCommit) throw new Error('Minimum reviewed production commit is required');

const response = await fetch(`${origin}/version.json?phase5-reviewed=${Date.now()}`, { headers: { 'cache-control': 'no-cache' } });
if (!response.ok) throw new Error(`Production version fetch failed: HTTP ${response.status}`);
const version = await response.json();
const deployedCommit = version.build_commit;
if (!deployedCommit || !/^[0-9a-f]{40}$/i.test(deployedCommit)) throw new Error(`Invalid production build_commit: ${deployedCommit ?? 'null'}`);

const headCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const assertAncestor = (older, newer, message) => {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', older, newer], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${message}: ${older} !<= ${newer}`);
};

assertAncestor(minimumCommit, deployedCommit, 'Deployed production is older than the Phase 5 implementation floor');
assertAncestor(deployedCommit, headCommit, 'Deployed production is not a reviewed ancestor of current main');

const verify = spawnSync(process.execPath, ['scripts/check-phase5-production.mjs', deployedCommit], {
  stdio: 'inherit',
  env: {
    ...process.env,
    MAG_PRODUCTION_ORIGIN: origin,
    MAG_PRODUCTION_VERIFY_ATTEMPTS: '1',
    MAG_PRODUCTION_VERIFY_DELAY_MS: '0'
  }
});
if (verify.status !== 0) process.exit(verify.status ?? 1);

console.log(`Reviewed production floor verification passed.`);
console.log(`Minimum implementation commit: ${minimumCommit}`);
console.log(`Observed deployed commit: ${deployedCommit}`);
console.log(`Current reviewed main: ${headCommit}`);

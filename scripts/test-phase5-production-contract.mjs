import { readFileSync } from 'node:fs';

const verifier = readFileSync('scripts/check-phase5-production.mjs', 'utf8');
const workflow = readFileSync('.github/workflows/phase5-production-verification.yml', 'utf8');
const fail = (message) => { throw new Error(message); };

for (const marker of [
  "'/version.json'",
  'version.build_commit === expectedCommit',
  "'/data/marketplace/hic-et-nunc.json'",
  "'/data/marketplace/teia.json'",
  "'/data/marketplace/gamestop-nft.json'",
  "'/encyclopedia/'",
  "'/compare/'",
  "'/data/stats.json'",
  "'/stats/'",
  "'/sitemap.xml'"
]) {
  if (!verifier.includes(marker)) fail(`Production verifier missing marker: ${marker}`);
}

for (const marker of [
  'push:',
  'branches:',
  '- main',
  'workflow_dispatch:',
  'cancel-in-progress: true',
  'inputs.expected_commit || github.sha',
  'Checkout exact deployed commit',
  'check-phase5-production.mjs',
  'mag-phase5-production',
  'context.runId',
  'target_url: targetUrl',
  'phase5-production-verification.log',
  'actions/upload-artifact@v4'
]) {
  if (!workflow.includes(marker)) fail(`Production workflow missing marker: ${marker}`);
}

if (workflow.includes('workflow_run:')) fail('Production workflow must not duplicate verification through workflow_run');
if (verifier.includes('writeFile') || verifier.includes('createFile')) fail('Production verifier must remain read-only');
console.log('MAG Phase 5 production verification contract passed');

import { readFileSync } from 'node:fs';

const verifier = readFileSync('scripts/check-phase5-production.mjs', 'utf8');
const workflow = readFileSync('.github/workflows/phase5-production-verification.yml', 'utf8');
const deployWorkflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
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
  "'/sitemap.xml'",
  'normalizeHtmlForMarkers',
  '.replace(/&amp;/gi',
  'Successor & migration coverage',
  'Coverage & provenance'
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
for (const marker of [
  'group: pages',
  'cancel-in-progress: true',
  'statuses: write',
  'mag-pages-deploy',
  'Publish pending deploy status',
  'publish-deploy-status:',
  'BUILD_RESULT',
  'DEPLOY_RESULT',
  'target_url: targetUrl',
  'node-version: 24'
]) {
  if (!deployWorkflow.includes(marker)) fail(`Deploy workflow missing observability/runtime marker: ${marker}`);
}
const generateIndex = deployWorkflow.indexOf('name: Generate stats');
const validateIndex = deployWorkflow.indexOf('name: Validate data');
if (generateIndex < 0 || validateIndex < 0 || generateIndex > validateIndex) {
  fail('Deploy workflow must generate data/stats.json before validation');
}
if (verifier.includes('writeFile') || verifier.includes('createFile')) fail('Production verifier must remain read-only');
console.log('MAG Phase 5 production verification contract passed');

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
  'workflow_run:',
  'Deploy to GitHub Pages',
  'github.event.workflow_run.head_sha',
  'Checkout exact deployed commit',
  'check-phase5-production.mjs'
]) {
  if (!workflow.includes(marker)) fail(`Production workflow missing marker: ${marker}`);
}

if (verifier.includes('writeFile') || verifier.includes('createFile')) fail('Production verifier must remain read-only');
console.log('MAG Phase 5 production verification contract passed');

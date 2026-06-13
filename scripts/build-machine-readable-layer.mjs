import fs from 'node:fs';
import path from 'node:path';
import { collectMagData } from './lib/mag-machine-data.mjs';
import { COMMON, ORIGIN, ROUTES, SAFETY } from './lib/mag-machine-config.mjs';

const outDir = path.join(process.cwd(), 'public');
const { counts, breakdown, lastReviewedAt } = collectMagData();
const generatedAt = new Date().toISOString();
const mainRoutes = Object.values(ROUTES);
const build = {
  commit: process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'unknown',
  branch: process.env.CF_PAGES_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'main',
  generated_at: generatedAt,
  verification_marker: 'mag_machine_readable_layer_v1',
};

const version = {
  ...COMMON,
  site_name: 'Minted & Gone',
  release_channel: 'production',
  build,
  data: {
    data_schema_version: 'mag_marketplace_event_evidence_v1',
    generated_at: generatedAt,
    records_last_reviewed_at: lastReviewedAt,
    record_counts: counts,
    record_count_breakdown: breakdown,
  },
  routes: ROUTES,
};

const manifest = {
  ...COMMON,
  title: 'Minted & Gone',
  description: 'Evidence-backed historical registry of NFT marketplaces and their lifecycle changes.',
  data_model: {
    primary_record: 'nft_marketplace',
    supporting_records: ['marketplace_event', 'marketplace_evidence'],
  },
  public_files: {
    version: '/version.json', manifest: '/data/manifest.json', llms: '/llms.txt', ai: '/ai.txt',
  },
  main_routes: mainRoutes,
  record_counts: counts,
  record_count_breakdown: breakdown,
  data_safety: SAFETY,
  correction_links: {
    page: '/submit/', contact: '/contact/', github: 'https://github.com/badjoke-lab/mintedandgone/issues',
  },
  repository: { type: 'github', url: 'https://github.com/badjoke-lab/mintedandgone' },
  language: 'en',
  locales: ['en'],
  generated_at: generatedAt,
};

const llms = [
  '# Minted & Gone', '',
  'Evidence-backed historical registry of NFT marketplaces.', '',
  `Canonical site: ${ORIGIN}/`, '',
  'Machine-readable files:', '- /version.json', '- /data/manifest.json', '- /ai.txt', '',
  'Main routes:', ...mainRoutes.map((route) => `- ${route}`), '',
  'Build-time record counts:',
  `- Marketplaces: ${counts.primary_records}`,
  `- Events: ${counts.events}`,
  `- Evidence records: ${counts.evidence}`, '',
  'Use notes:',
  '- This is a historical registry, not a live marketplace ranking or trading dashboard.',
  '- Marketplace identity status may differ from surviving contracts, assets, frontends, or successor services.',
  '- Use methodology, event history, evidence, and archive links when interpreting records.',
  '- Records may be corrected or revised.', '',
].join('\n');

const ai = [
  'Minted & Gone', '',
  'Purpose: Historical registry of NFT marketplace lifecycles.',
  `Canonical origin: ${ORIGIN}`,
  'Version endpoint: /version.json',
  'Manifest endpoint: /data/manifest.json',
  'LLM guide: /llms.txt',
  `Marketplaces: ${counts.primary_records}`,
  `Events: ${counts.events}`,
  `Evidence records: ${counts.evidence}`, '',
  'Important routes:', ...mainRoutes, '',
  'Safety note: Public files use current registry data and exclude candidate backlog rows and operator-only working material.', '',
].join('\n');

function write(relativePath, value) {
  const file = path.join(outDir, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? `${value.trimEnd()}\n` : `${JSON.stringify(value, null, 2)}\n`);
}

write('version.json', version);
write('data/manifest.json', manifest);
write('llms.txt', llms);
write('ai.txt', ai);
console.log(`Built MAG public layer: ${counts.primary_records} marketplaces, ${counts.events} events, ${counts.evidence} evidence.`);

import fs from 'node:fs';
import path from 'node:path';

const targets = new Set(['courtyard', 'collector-crypt', 'phygitals', 'tradible']);
const dataDir = path.join(process.cwd(), 'data');

for (const filename of fs.readdirSync(dataDir).filter((name) => /^marketplaces.*\.json$/.test(name)).sort()) {
  const records = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
  if (!Array.isArray(records)) continue;
  for (const record of records) {
    if (targets.has(record.slug)) {
      console.log(JSON.stringify({
        file: filename,
        id: record.id,
        slug: record.slug,
        canonical_name: record.canonical_name,
        official_domain_original: record.official_domain_original
      }));
    }
  }
}

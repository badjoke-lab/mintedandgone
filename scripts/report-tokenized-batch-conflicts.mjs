import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const bySlug = new Map();

for (const filename of fs.readdirSync(dataDir).filter((name) => /^marketplaces.*\.json$/.test(name)).sort()) {
  const records = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
  if (!Array.isArray(records)) continue;
  for (const record of records) {
    if (!bySlug.has(record.slug)) bySlug.set(record.slug, []);
    bySlug.get(record.slug).push({
      file: filename,
      id: record.id,
      slug: record.slug,
      canonical_name: record.canonical_name,
      official_domain_original: record.official_domain_original
    });
  }
}

for (const [slug, records] of [...bySlug.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  if (records.length > 1) console.log(JSON.stringify({ slug, records }));
}

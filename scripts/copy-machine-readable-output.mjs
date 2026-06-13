import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
for (const relativePath of ['version.json', 'data/manifest.json', 'llms.txt', 'ai.txt', '_headers']) {
  const source = path.join(root, 'public', relativePath);
  if (!fs.existsSync(source)) throw new Error(`Missing generated public file: ${relativePath}`);
  const target = path.join(root, 'dist', relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}
console.log('Copied MAG machine-readable files into dist.');

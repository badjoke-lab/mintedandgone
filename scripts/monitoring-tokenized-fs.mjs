import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

export function writeText(filePath, value) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, value.endsWith('\n') ? value : value + '\n');
}

export function listJsonFilesByPrefixes(dir, prefixes) {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json') && prefixes.some((prefix) => name.startsWith(prefix)))
    .sort()
    .map((name) => path.join(dir, name));
}

export function hashFile(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

export function fingerprintFiles(files, root) {
  return Object.fromEntries(files.map((file) => [path.relative(root, file), hashFile(file)]));
}

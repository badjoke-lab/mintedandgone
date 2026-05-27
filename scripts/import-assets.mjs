import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function fail(message) {
  throw new Error(message);
}

async function loadManifest(manifestPath) {
  const raw = await readFile(manifestPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed.entries)) {
    fail('Manifest must include an entries array.');
  }

  return parsed;
}

function ensureAllowedExtension(filename, entryId) {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    fail(`Entry "${entryId}" has unsupported extension "${ext}". Allowed: .png, .jpg, .jpeg, .webp.`);
  }
}

async function replaceInFile(filePath, replaceText, withText, entryId) {
  const original = await readFile(filePath, 'utf8');
  if (!original.includes(replaceText)) {
    fail(`Wire replacement failed for entry "${entryId}": target text not found in ${filePath}.`);
  }

  const next = original.replace(replaceText, withText);
  await writeFile(filePath, next, 'utf8');
}

async function main() {
  const cwd = process.cwd();
  const manifestPath = path.resolve(cwd, 'assets-manifest.json');
  const manifest = await loadManifest(manifestPath);

  const inputRoot = path.resolve(cwd, manifest.inputRoot ?? 'input-assets');
  const outputRoot = path.resolve(cwd, manifest.outputRoot ?? '.');
  const reportPath = path.resolve(cwd, manifest.reportPath ?? 'data-staging/asset-import-report.json');

  const report = {
    version: manifest.version ?? null,
    generatedAt: new Date().toISOString(),
    copied: [],
    skipped: [],
    wired: []
  };

  for (const entry of manifest.entries) {
    const { id, source, output, required = true } = entry;

    if (!id || !source || !output) {
      fail('Each manifest entry must include id, source, and output.');
    }

    ensureAllowedExtension(source, id);
    ensureAllowedExtension(output, id);

    const sourcePath = path.resolve(inputRoot, source);
    const outputPath = path.resolve(outputRoot, output);

    let sourceBuffer;
    try {
      sourceBuffer = await readFile(sourcePath);
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        if (required) {
          fail(`Required source file missing for entry "${id}": ${sourcePath}`);
        }

        report.skipped.push({
          id,
          reason: 'missing-source',
          source: sourcePath
        });
        continue;
      }
      throw error;
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, sourceBuffer);
    report.copied.push({ id, source: sourcePath, output: outputPath });

    const wires = Array.isArray(entry.wire) ? entry.wire : [];
    for (const wire of wires) {
      const wirePath = path.resolve(cwd, wire.path);
      await replaceInFile(wirePath, wire.replace, wire.with, id);
      report.wired.push({ id, path: wirePath });
    }
  }

  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
}

main().catch((error) => {
  console.error(`[import-assets] ${error.message}`);
  process.exitCode = 1;
});

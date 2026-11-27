import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ensureDir,
  formatBytes,
  logDept,
  logOk,
  RELEASE_DIR,
  REPO_ROOT,
  resolveEsbuild,
  VERSION
} from '../lib/logger.mjs';
import { generateExtensionIcons } from './generate-icons.mjs';

export async function buildExtension() {
  const extDir = path.join(REPO_ROOT, 'extension');
  const distDir = path.join(extDir, 'dist');

  logDept('Dept 4: Extension', 'Generating brand icons & bundling Manifest V3 scripts...');
  const iconsSrc = generateExtensionIcons();

  fs.rmSync(distDir, { recursive: true, force: true });
  ensureDir(distDir);
  ensureDir(path.join(distDir, 'icons'));

  const esbuild = await resolveEsbuild();
  const sharedBuildOpts = {
    bundle: true,
    minify: true,
    target: ['chrome114'],
    format: 'iife',
    logLevel: 'silent'
  };

  await esbuild.build({
    ...sharedBuildOpts,
    entryPoints: [path.join(extDir, 'src', 'background', 'service-worker.ts')],
    outfile: path.join(distDir, 'background.js')
  });

  await esbuild.build({
    ...sharedBuildOpts,
    entryPoints: [path.join(extDir, 'src', 'content', 'index.ts')],
    outfile: path.join(distDir, 'content.js')
  });

  await esbuild.build({
    ...sharedBuildOpts,
    entryPoints: [path.join(extDir, 'src', 'popup', 'popup.ts')],
    outfile: path.join(distDir, 'popup.js')
  });

  fs.copyFileSync(path.join(extDir, 'manifest.json'), path.join(distDir, 'manifest.json'));
  fs.copyFileSync(path.join(extDir, 'src', 'popup', 'popup.html'), path.join(distDir, 'popup.html'));
  fs.copyFileSync(path.join(extDir, 'src', 'popup', 'popup.css'), path.join(distDir, 'popup.css'));
  fs.cpSync(iconsSrc, path.join(distDir, 'icons'), { recursive: true });

  ensureDir(RELEASE_DIR);
  const zipPath = path.join(RELEASE_DIR, `rizzboard-extension-v${VERSION}.zip`);
  fs.rmSync(zipPath, { force: true });

  // Portable cross-platform deterministic ZIP creation via Python 3 standard library
  const pyZipScript = `
import os, sys, zipfile
src, dst = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, _, files in os.walk(src):
        for f in sorted(files):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, src)
            zf.write(full, rel)
`;
  execFileSync('python3', ['-c', pyZipScript, distDir, zipPath], { stdio: 'inherit' });

  const stats = fs.statSync(zipPath);
  logOk('Dept 4: Extension', `Packaged ${path.basename(zipPath)} (${formatBytes(stats.size)})`);
  return zipPath;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildExtension();
}

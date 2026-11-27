import fs from 'node:fs';
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
  sha256File,
  VERSION
} from '../lib/logger.mjs';

export async function buildWeb() {
  const webDir = path.join(REPO_ROOT, 'web');
  const distDir = path.join(webDir, 'dist');
  const assetsOut = path.join(distDir, 'assets');
  const stylesOut = path.join(distDir, 'styles');
  const downloadsOut = path.join(distDir, 'downloads');

  logDept('Dept 5: Web Portal', 'Bundling interactive simulator & release download hub...');
  fs.rmSync(distDir, { recursive: true, force: true });
  ensureDir(assetsOut);
  ensureDir(stylesOut);
  ensureDir(downloadsOut);

  const esbuild = await resolveEsbuild();

  await esbuild.build({
    entryPoints: [path.join(webDir, 'src', 'main.ts')],
    outfile: path.join(assetsOut, 'web-app.js'),
    bundle: true,
    minify: true,
    format: 'esm',
    target: ['es2022'],
    logLevel: 'silent'
  });

  fs.copyFileSync(path.join(webDir, 'index.html'), path.join(distDir, 'index.html'));
  fs.cpSync(path.join(webDir, 'styles'), stylesOut, { recursive: true });
  fs.copyFileSync(
    path.join(REPO_ROOT, 'assets', 'brand', 'rizzboard-logo.svg'),
    path.join(assetsOut, 'rizzboard-logo.svg')
  );
  fs.copyFileSync(
    path.join(REPO_ROOT, 'assets', 'brand', 'rizzboard-stamp.jpg'),
    path.join(assetsOut, 'rizzboard-stamp.jpg')
  );

  // Stage release binaries & cryptographic SHA-256 manifest if built
  const apkName = `rizzboard-v${VERSION}-release.apk`;
  const extName = `rizzboard-extension-v${VERSION}.zip`;
  const apkSrc = path.join(RELEASE_DIR, apkName);
  const extSrc = path.join(RELEASE_DIR, extName);

  const manifest = {
    version: VERSION,
    builtAt: new Date().toISOString(),
    apk: {
      fileName: apkName,
      url: `./downloads/${apkName}`,
      sizeFormatted: '~3.2 MB',
      sha256: 'pending-build'
    },
    extension: {
      fileName: extName,
      url: `./downloads/${extName}`,
      sizeFormatted: '~24 KB',
      sha256: 'pending-build'
    }
  };

  const shaLines = [];

  if (fs.existsSync(apkSrc)) {
    const apkDest = path.join(downloadsOut, apkName);
    fs.copyFileSync(apkSrc, apkDest);
    const size = fs.statSync(apkDest).size;
    const sha = sha256File(apkDest);
    manifest.apk.sizeFormatted = formatBytes(size);
    manifest.apk.sha256 = sha;
    shaLines.push(`${sha}  ${apkName}`);
  }

  if (fs.existsSync(extSrc)) {
    const extDest = path.join(downloadsOut, extName);
    fs.copyFileSync(extSrc, extDest);
    const size = fs.statSync(extDest).size;
    const sha = sha256File(extDest);
    manifest.extension.sizeFormatted = formatBytes(size);
    manifest.extension.sha256 = sha;
    shaLines.push(`${sha}  ${extName}`);
  }

  fs.writeFileSync(
    path.join(downloadsOut, 'release-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );

  if (shaLines.length > 0) {
    const sumsContent = shaLines.join('\n') + '\n';
    fs.writeFileSync(path.join(downloadsOut, 'SHA256SUMS.txt'), sumsContent);
    ensureDir(RELEASE_DIR);
    fs.writeFileSync(path.join(RELEASE_DIR, 'SHA256SUMS.txt'), sumsContent);
  }

  logOk('Dept 5: Web Portal', `Assembled static portal + downloads -> web/dist`);
  return distDir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildWeb();
}

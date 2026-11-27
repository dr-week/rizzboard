import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  formatBytes,
  logDept,
  logOk,
  RELEASE_DIR,
  REPO_ROOT,
  sha256File,
  VERSION
} from '../lib/logger.mjs';
import { buildUi } from '../build/build-ui.mjs';
import { buildExtension } from '../build/build-extension.mjs';
import { buildApk } from '../build/build-apk.mjs';
import { buildWeb } from '../build/build-web.mjs';

const start = Date.now();

logDept('Dept 1: Core', 'Executing unit & regression test suite...');
execSync('node --experimental-strip-types core/tests/run-all.ts', {
  cwd: REPO_ROOT,
  stdio: 'inherit'
});

buildUi();
const zipPath = await buildExtension();
const apkPath = buildApk({ skipUiSync: true });
const webDist = await buildWeb();

const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);
console.log('\n======================================================================');
logOk('Monorepo Verified', `All 7 departments built & verified in ${elapsedSec}s`);
console.log('----------------------------------------------------------------------');
console.log(`  Release APK   : ${path.relative(REPO_ROOT, apkPath)} (${formatBytes(fs.statSync(apkPath).size)})`);
console.log(`  APK SHA-256   : ${sha256File(apkPath)}`);
console.log(`  Extension ZIP : ${path.relative(REPO_ROOT, zipPath)} (${formatBytes(fs.statSync(zipPath).size)})`);
console.log(`  Ext SHA-256   : ${sha256File(zipPath)}`);
console.log(`  Web Portal    : ${path.relative(REPO_ROOT, webDist)}/index.html`);
console.log(`  Checksums     : ${path.relative(REPO_ROOT, path.join(RELEASE_DIR, 'SHA256SUMS.txt'))}`);
console.log('======================================================================\n');

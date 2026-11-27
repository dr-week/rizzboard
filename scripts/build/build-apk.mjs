import { execFileSync, execSync } from 'node:child_process';
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
  VERSION
} from '../lib/logger.mjs';
import { buildUi } from './build-ui.mjs';

function ensureSigningKeystore(androidDir) {
  const envPath = process.env.RIZZ_KEYSTORE_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;

  const keystoreDir = path.join(androidDir, 'keystore');
  ensureDir(keystoreDir);
  const jksPath = path.join(keystoreDir, 'rizzboard-release.jks');
  if (fs.existsSync(jksPath)) return jksPath;

  logDept('Dept 2: Android', 'Generating V1/V2/V3 release signing keystore via keytool...');
  execFileSync(
    'keytool',
    [
      '-genkeypair',
      '-v',
      '-keystore',
      jksPath,
      '-alias',
      process.env.RIZZ_KEY_ALIAS || 'rizzboard',
      '-keyalg',
      'RSA',
      '-keysize',
      '2048',
      '-validity',
      '10000',
      '-storepass',
      process.env.RIZZ_KEYSTORE_PASSWORD || 'rizzboard2026',
      '-keypass',
      process.env.RIZZ_KEY_PASSWORD || 'rizzboard2026',
      '-dname',
      'CN=RizzBoard, OU=Edge AI Division, O=Danger.Labs, L=San Francisco, ST=CA, C=US'
    ],
    { stdio: 'pipe' }
  );
  return jksPath;
}

export function buildApk({ skipUiSync = false } = {}) {
  if (!skipUiSync) {
    buildUi();
  }

  const androidDir = path.join(REPO_ROOT, 'android');
  ensureSigningKeystore(androidDir);

  logDept('Dept 2: Android', 'Assembling R8-shrunk, signed Release APK...');
  const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  execSync(`${gradlew} assembleRelease`, { cwd: androidDir, stdio: 'inherit' });

  const builtApk = path.join(
    androidDir,
    'app',
    'build',
    'outputs',
    'apk',
    'release',
    'app-release.apk'
  );
  if (!fs.existsSync(builtApk)) {
    throw new Error(`Expected signed release APK not found at ${builtApk}`);
  }

  ensureDir(RELEASE_DIR);
  const outApk = path.join(RELEASE_DIR, `rizzboard-v${VERSION}-release.apk`);
  fs.copyFileSync(builtApk, outApk);

  const stats = fs.statSync(outApk);
  logOk('Dept 2: Android', `Built signed ${path.basename(outApk)} (${formatBytes(stats.size)})`);
  return outApk;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildApk();
}

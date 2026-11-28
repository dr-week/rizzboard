import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDir, logDept, logOk, REPO_ROOT } from '../lib/logger.mjs';

export function buildUi() {
  const uiDir = path.join(REPO_ROOT, 'ui');
  const androidAssetsUi = path.join(REPO_ROOT, 'android', 'app', 'src', 'main', 'assets', 'ui');

  logDept('Dept 3: Zuari UI', 'Installing dependencies & building reactive IME bundle...');
  execSync('pnpm install', { cwd: uiDir, stdio: 'inherit' });
  execSync('pnpm build', { cwd: uiDir, stdio: 'inherit' });

  logDept('Dept 3: Zuari UI', 'Syncing compiled bundle into Android IME assets...');
  fs.rmSync(androidAssetsUi, { recursive: true, force: true });
  ensureDir(androidAssetsUi);
  fs.cpSync(path.join(uiDir, 'dist'), androidAssetsUi, { recursive: true });

  logOk('Dept 3: Zuari UI', `Synced dist -> android/app/src/main/assets/ui`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildUi();
}

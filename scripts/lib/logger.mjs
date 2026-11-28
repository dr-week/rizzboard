import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../..');
const gradleText = fs.readFileSync(path.join(REPO_ROOT, 'android/app/build.gradle.kts'), 'utf8');
export const VERSION = gradleText.match(/versionName\s*=\s*"([^"]+)"/)?.[1] || '1.2.1';
export const RELEASE_DIR = path.join(REPO_ROOT, 'releases', `v${VERSION}`);

export function logDept(dept, message) {
  console.log(`\x1b[36m[${dept}]\x1b[0m ${message}`);
}

export function logOk(dept, message) {
  console.log(`\x1b[32m✓ [${dept}]\x1b[0m ${message}`);
}

export function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export async function resolveEsbuild() {
  const { createRequire } = await import('node:module');
  const uiReq = createRequire(path.join(REPO_ROOT, 'ui', 'package.json'));
  try {
    return uiReq('esbuild');
  } catch {
    const viteReq = createRequire(uiReq.resolve('vite/package.json'));
    return viteReq('esbuild');
  }
}

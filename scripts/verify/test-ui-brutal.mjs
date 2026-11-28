import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { REPO_ROOT, RELEASE_DIR, VERSION } from '../lib/logger.mjs';

function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${msg}`);
}

const uiAssets = path.join(REPO_ROOT, 'android/app/src/main/assets/ui');
const uiIndex = fs.readFileSync(path.join(uiAssets, 'index.html'), 'utf8');
assert(uiIndex.includes('<div id="app"></div>'), 'Android UI index.html has #app mount');

const jsFiles = fs.readdirSync(path.join(uiAssets, 'assets')).filter(f => f.endsWith('.js'));
assert(jsFiles.length > 0, 'Compiled UI JS bundle exists');
const jsContent = fs.readFileSync(path.join(uiAssets, 'assets', jsFiles[0]), 'utf8');
assert(jsContent.includes('key-btn space'), 'Spacebar (.key-btn space) is present in compiled UI bundle');
assert(!jsContent.includes('[object Object]'), 'No [object Object] literal in compiled UI bundle');

const webIndex = fs.readFileSync(path.join(REPO_ROOT, 'web/dist/index.html'), 'utf8');
assert(webIndex.includes('rizzboard-stamp.jpg'), 'Website uses rizzboard-stamp.jpg');
assert(!webIndex.includes('rizzboard-logo.svg'), 'Website does not use old rizzboard-logo.svg');
assert(webIndex.includes(VERSION), `Website displays live version ${VERSION}`);

const apkPath = path.join(RELEASE_DIR, `rizzboard-v${VERSION}-release.apk`);
assert(fs.existsSync(apkPath), `Signed APK exists at releases/v${VERSION}/`);
assert(fs.statSync(apkPath).size > 1_000_000, 'Signed APK size > 1 MB');
execSync(`jarsigner -verify "${apkPath}"`, { stdio: 'ignore' });
console.log('✓ PASS: APK signature verified via jarsigner');

console.log('\n🔥 Brutal UI/UX & APK verification passed 100%!');

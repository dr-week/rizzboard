import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { logDept, logOk, RELEASE_DIR, VERSION } from '../lib/logger.mjs';

const dryRun = process.argv.includes('--dry-run');
const tag = `v${VERSION}`;

const apkFile = path.join(RELEASE_DIR, `rizzboard-v${VERSION}-release.apk`);
const extFile = path.join(RELEASE_DIR, `rizzboard-extension-v${VERSION}.zip`);
const sumsFile = path.join(RELEASE_DIR, 'SHA256SUMS.txt');

for (const f of [apkFile, extFile, sumsFile]) {
  if (!fs.existsSync(f)) {
    throw new Error(`Missing release artifact: ${f}. Run "pnpm build:all" first.`);
  }
}

const releaseNotes = `## RizzBoard ${tag} — 5-Tier Hybrid Context Engine & Web Wingman

### Highlights
- **5-Tier Hybrid Context Ingestion (\`FLAG_SECURE\` & Snapchat Ready):** Scoped Storage \`ScreenshotObserver\`, RAM-only \`RizzNotificationListener\`, Self-Commit-Filtered \`ClipboardVault\`, On-Demand \`RizzAccessibilityService\`, and In-Keyboard \`StealthContextBar\`.
- **Signed Universal Android Release APK:** R8-shrunk V1/V2/V3 signed package supporting Android 8.0–15 (API 26–35) with on-device Google ML Kit Text Recognition v2.
- **Chromium Manifest V3 Web Extension:** Isolated Shadow DOM chat wingman + toolbar micro-app for WhatsApp Web, Instagram Direct, Telegram Web, Tinder, Bumble, Discord & X.

### Cryptographic Checksums (\`SHA-256\`)
\`\`\`
${fs.readFileSync(sumsFile, 'utf8').trim()}
\`\`\`
`;

if (dryRun) {
  logDept('Release Dry-Run', `Prepared GitHub Release ${tag} with 3 verified assets:`);
  console.log(releaseNotes);
  process.exit(0);
}

logDept('Release', `Publishing GitHub Release ${tag} via gh CLI...`);
execFileSync(
  'gh',
  [
    'release',
    'create',
    tag,
    apkFile,
    extFile,
    sumsFile,
    '-R',
    'dr-week/rizzboard',
    '--title',
    `RizzBoard ${tag} — Hybrid Android APK & Web Extension`,
    '--notes',
    releaseNotes
  ],
  { stdio: 'inherit' }
);
logOk('Release', `Published ${tag} on GitHub Releases!`);

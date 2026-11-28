import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

const msg = process.argv.slice(2).join(' ').trim() || 'chore(ship): verify, build & deploy latest release';

run('node scripts/docs/index-docs.mjs');
run('node scripts/verify/verify-all.mjs');

const status = execSync('git status --porcelain').toString().trim();
if (status) {
  run('git add -A');
  run(`git commit -m "${msg.replace(/"/g, '\\"')}"`);
} else {
  console.log('\n✓ Working tree clean, pushing existing commits...');
}

run('git push origin main');

// Sync web/dist directly to gh-pages so website & OTA manifest are always live immediately
const tmpDir = '/tmp/rizzboard-gh-pages';
fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });
fs.cpSync(path.resolve('web/dist'), tmpDir, { recursive: true });
fs.writeFileSync(path.join(tmpDir, '.nojekyll'), '');
const remoteUrl = execSync('git remote get-url origin').toString().trim();
execSync(
  `git init -q && git checkout -b gh-pages && git add -A && git commit -qm "docs(portal): auto-deploy latest build" && git push -f ${remoteUrl} gh-pages:gh-pages`,
  { cwd: tmpDir, stdio: 'inherit' }
);
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log('\n✅ Shipped to main & deployed live to https://dr-week.github.io/rizzboard/');

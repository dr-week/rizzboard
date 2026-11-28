import { execSync } from 'node:child_process';

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

const msg = process.argv.slice(2).join(' ').trim() || 'chore(ship): verify, build & deploy latest release';

run('node scripts/verify/verify-all.mjs');

const status = execSync('git status --porcelain').toString().trim();
if (status) {
  run('git add -A');
  run(`git commit -m "${msg.replace(/"/g, '\\"')}"`);
} else {
  console.log('\n✓ Working tree clean, pushing existing commits...');
}

run('git push origin main');
console.log('\n✅ Shipped! GitHub Actions will auto-deploy the latest APK & web portal to https://dr-week.github.io/rizzboard/');

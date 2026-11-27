# Dept 06 · DevOps, Build Scripts & CI/CD Automations (`scripts/`, `.github/`)

## CLI Automation Commands (Root `package.json`)

| Command | Script | Action |
| :--- | :--- | :--- |
| `pnpm test` | `core/tests/run-all.ts` | Runs Core Engine unit & hybrid context tests |
| `pnpm build:ui` | `scripts/build/build-ui.mjs` | Builds Zuari UI & syncs `android/app/src/main/assets/ui/` |
| `pnpm build:extension` | `scripts/build/build-extension.mjs` | Generates PNG icons, bundles MV3 scripts & zips release archive |
| `pnpm build:apk` | `scripts/build/build-apk.mjs` | Ensures signing keystore, runs R8 `assembleRelease` & stages signed APK |
| `pnpm build:web` | `scripts/build/build-web.mjs` | Builds `web/dist/` + stages APK, Extension ZIP, `SHA256SUMS.txt` & manifest |
| `pnpm verify` | `scripts/verify/verify-all.mjs` | Executes all 7 departments end-to-end and prints cryptographic checksums |
| `pnpm serve:web` | `scripts/serve-web.mjs` | Serves `web/dist/` locally on port `4173` |
| `pnpm release:github` | `scripts/release/cut-release.mjs` | Publishes signed APK, Extension ZIP & `SHA256SUMS.txt` to GitHub Releases |

## GitHub Actions Workflows (`.github/workflows/`)
- `ci.yml` — Runs `node scripts/verify/verify-all.mjs` on every push and pull request and uploads verified release artifacts.
- `release.yml` — Triggered on `v*.*.*` git tags; publishes signed APK, Extension `.zip`, and `SHA256SUMS.txt` via `gh release create`.
- `deploy-pages.yml` — Automatically builds and deploys `web/dist` (including direct APK & Extension downloads) to GitHub Pages.

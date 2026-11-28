# RizzBoard Dictionary, Local Database & Google Drive Sync Plan

## 1. Local Offline Database (Device Storage)
- **Structured Folders (`filesDir/rizzboard-db/`):**
  - `dictionary/personal-words.json` — Learned English & Roman Konkani words + frequencies.
  - `dictionary/snippets.json` — Custom text-expander shortcuts (`omw`, `@@`, etc.).
  - `context/clipboard-pinned.json` — Pinned clipboard items.
  - `ota-ui/` — Cached OTA WebView UI bundle.

## 2. Optional Google Drive Backup & Sync
- **Folder Structure on Google Drive:**
  - `RizzBoard_Backup/`
    - `personal-words.json`
    - `snippets.json`
    - `settings.json` (theme, height, one-handed mode)
- **Sync Flow:**
  1. Sign in with Google (`GoogleSignIn` / Drive `appDataFolder` or `drive.file` scope).
  2. Export/merge local JSON files with `RizzBoard_Backup/` on Wi-Fi or 1-tap **Sync Now** in `SettingsActivity.kt`.

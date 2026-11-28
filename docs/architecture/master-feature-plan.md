# RizzBoard Master Feature & Architecture Plan

## Phase 1: Core Typing & iOS/Gboard Parity
| Feature | Target File(s) | Status |
| :--- | :--- | :--- |
| **Double-Tap Spacebar → `. `** | `ui/src/main.ts` | Planned |
| **Slide-from-`123` Quick Symbol** | `ui/src/components/grid/QwertyGrid.ts` | Planned |
| **Keycap Pop-up Preview Bubble** | `ui/src/components/grid/QwertyGrid.ts`, `keyboard.css` | Planned |
| **`RECORD_AUDIO` Runtime Prompt** | `android/.../SettingsActivity.kt` | Planned |

## Phase 2: Rizz Talks & Productivity
| Feature | Target File(s) | Status |
| :--- | :--- | :--- |
| **Rizz Talks (`🗣️`) Topic Decks** | `core/vault/rizz-talks.ts`, `ui/src/components/panels/TalksPanel.ts` | Planned |
| **Text Expander / Quick Snippets** | `core/engine/predictive.ts`, `ui/src/main.ts` | Planned |
| **Incognito / Private Mode (`🕵️`)** | `ui/src/main.ts`, `ClipboardVault.kt` | Planned |

## Phase 3: Advanced Input & Media
| Feature | Target File(s) | Status |
| :--- | :--- | :--- |
| **Glide / Swipe-to-Type** | `ui/src/components/grid/QwertyGrid.ts`, `predictive.ts` | Planned |
| **GIF / Sticker Search Panel** | `ui/src/components/panels/GifPanel.ts` | Planned |
| **Multilingual Layouts (Hinglish, ES, FR)** | `ui/src/components/grid/QwertyGrid.ts` | Planned |

## Phase 4: Release & Distribution Automation
| Feature | Target File(s) | Status |
| :--- | :--- | :--- |
| **Dynamic Version in Build Scripts** | `scripts/build/build-apk.mjs`, `build-extension.mjs` | Planned |
| **Sync `gh-pages` & Publish `v1.2.2`** | `.github/workflows/release.yml`, `gh-pages` | Planned |

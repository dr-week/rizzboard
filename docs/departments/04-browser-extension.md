# Dept 04 · Chromium Manifest V3 Browser Extension (`extension/`)

## Overview
`extension/` brings RizzBoard's intelligence core (`core/`) to desktop and mobile-web browsers (Chrome, Brave, Edge, Arc, Opera) for WhatsApp Web, Instagram Direct, Telegram Web, Tinder, Bumble, Discord, and X DMs.

## Micro-Module Layout
- `manifest.json` — Manifest V3 definition (`storage`, `contextMenus`, `activeTab`, and `Alt+R` command shortcut).
- `src/background/service-worker.ts` — Registers right-click selection context menu (`⚡ RizzBoard: Suggest Replies`) and routes `Alt+R` keyboard commands.
- `src/content/`
  - `adapters/site-adapters.ts` — Domain-specific bubble & composer selectors extracting `ScreenBlock[]` coordinates from live web chat threads.
  - `extractor/selection-watcher.ts` — Pops a quick `⚡ Rizz Reply` chip near highlighted text on any chat page.
  - `injector/text-committer.ts` — Commits replies safely into `<textarea>`, `<input>`, and React/Lexical/Slate `[contenteditable="true"]` editors.
  - `widget/floating-wingman.ts` & `shadow-styles.ts` — Isolated Shadow DOM Wingman HUD with `Next Move` (`Smooth` / `Tease` / `Bold`) and `Roast Draft` tabs.
- `src/popup/` — Standalone toolbar micro-app (`popup.html`, `popup.css`, `popup.ts`) with Reply Generator, Roast Test, searchable Offline Vault, and HUD visibility switch.

## Build & Load Unpacked
Run `pnpm build:extension` to generate `extension/dist/` and `releases/v1.1.0/rizzboard-extension-v1.1.0.zip`. Load `extension/dist/` via `chrome://extensions` -> **Developer mode** -> **Load unpacked**.

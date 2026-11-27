# Dept 03 · Zuari Zero-VDOM Keyboard UI (`ui/`)

## Overview
`ui/` renders the reactive keyboard interface in `< 13 KB` gzipped using **Zuari (`@zuari/*`)**—an ultra-lightweight TC39 Signals + DOM Parts runtime with zero Virtual-DOM diffing overhead.

## Micro-Module Layout
- `src/components/`
  - `ribbon/ActionRibbon.ts` — Surfaces live 5-tier context alert pills, `👁️ Scan Screen`, `💬 Tell Rizz` Stealth Mode, Roast, Clipboard, and Emoji triggers.
  - `ribbon/StealthContextBar.ts` — Isolates keystrokes inside RizzBoard so users can type context prompts without inserting text into the host chat input.
  - `grid/QwertyGrid.ts` & `grid/SuggestionStrip.ts` — Sub-millisecond tactile key grid and live Trie autocomplete strip.
  - `panels/` — `NextMovePanel.ts` (`Smooth` / `Tease` / `Bold` cards), `RoastPanel.ts`, `ClipboardPanel.ts`, and `EmojiPanel.ts`.
- `src/services/`
  - `bridge-service.ts` — Typed wrapper around `window.Android` and `@zuari/kotlin` callbacks.
  - `dom-helper.ts` — Atomic DOM subtree materialization for `ChildNodePart`.
- `src/styles/` — Modular Vanilla CSS (`tokens.css`, `ribbon.css`, `grid.css`, `panels.css`, `keyboard.css`).
- `src/vendor/zuari/` — Self-contained Zuari fallback runtime resolved automatically by `vite.config.ts` in CI/cloud environments when an external `fast-framework` checkout is absent.

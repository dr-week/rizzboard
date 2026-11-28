# RizzBoard Development Rules & Design Guidelines

## 1. Code Modularity Rules
- **100-LOC Limit:** Any file exceeding ~100 lines of code should be split into focused sub-modules inside a dedicated subfolder (e.g., `services/bridge/`, `state/`, `components/grid/keymaps.ts`, `components/panels/emoji/`).
- **Zero-VDOM (`@zuari/dom`) Rule:** Never interpolate an `html` template object directly inside `${...}` (it renders `[object Object]`). Always wrap sub-templates in `mountTemplate(...)` or inline them directly.

## 2. UI/UX & Design Rules
- **SVG Icons Only:** Never use emojis as toolbar or settings icons. Use Material-style SVG icons from `ui/src/services/icons.ts`.
- **60fps Micro-Animations:** Keep transitions under `160ms` using GPU-accelerated `transform` and `opacity` (`keyboard.css`).
- **Themes & Ergonomics:** Support `slate`, `amoled`, and `light` themes, `one-handed` dock (`left`/`right`/`off`), and `height` presets (`compact`/`normal`/`tall`) persisted in `localStorage`.

## 3. Automation Scripts
- **`pnpm docs:index`** (`scripts/docs/index-docs.mjs`): Auto-generates `docs/INDEX.md` from all markdown files in `docs/`.
- **`pnpm ship "<msg>"`** (`scripts/release/ship.mjs`): Runs `docs:index` → `verify-all.mjs` (Core tests, UI, Extension, signed APK, Web Portal + OTA manifest) → commits → pushes to `main` → auto-deploys to GitHub Pages.

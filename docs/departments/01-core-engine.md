# Dept 01 · Core Intelligence Engine (`core/`)

## Overview
`core/` contains 100% platform-agnostic, zero-dependency TypeScript algorithms shared across the Android Zuari IME (`ui/`), the Chromium Manifest V3 Browser Extension (`extension/`), and the Interactive Web Simulator (`web/`).

## Micro-Module Layout
- `index.ts` — Barrel export exposing all engines, datasets, and context primitives.
- `context/`
  - `types.ts` — Defines `ContextSource`, `ScreenBlock`, `ConversationContext`, and `ContextResolution`.
  - `app-registry.ts` — Resolves Android package IDs (`com.snapchat.android`) and web domains (`web.whatsapp.com`) into concise UI badges.
  - `noise-filter.ts` — Prevents self-commit clipboard loops and strips standalone URLs and numeric 2FA OTP codes.
  - `router.ts` — `HybridContextRouter` normalizing screen coordinate blocks and raw text across all 5 capture tiers.
- `engine/`
  - `predictive.ts` — Sub-0.5ms Prefix Trie + Bigram Markov next-word predictor.
  - `rizz-engine.ts` — Synthesizes `Smooth`, `Tease`, and `Bold` responses in `< 5ms`.
  - `roast-engine.ts` — Scores drafts (`1–10`) for ghosting probability and suggests 1-tap upgrades.
- `ocr/bubble-segmentation.ts` — Clusters `{ text, x, y, width, screenWidth }` blocks into left (partner) vs. right (self) messages.
- `vault/` — Curated offline conversation lines (`curated-lines.ts`) and categorized emojis (`emoji-data.ts`).
- `tests/run-all.ts` — Automated assertion suite executed via `pnpm test`.

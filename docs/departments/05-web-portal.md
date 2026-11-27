# Dept 05 · Showcase Website & Download Portal (`web/`)

## Overview
`web/` is the flagship static product portal featuring an interactive in-browser RizzBoard IME + Web Extension simulator, architectural documentation, and direct verified binary downloads (`rizzboard-v1.1.0-release.apk`, `rizzboard-extension-v1.1.0.zip`, `SHA256SUMS.txt`).

## Micro-Module Layout
- `index.html` — Semantic HTML5 showcase with SEO metadata, live simulator mount, 5-Tier Hybrid Matrix, Extension install steps, benchmark tables, and Download Hub.
- `styles/` — Modular Vanilla CSS (`tokens.css`, `base.css`, `hero.css`, `simulator.css`, `sections.css`) in Danger.Labs' crimson-and-ivory tactile keycap design language.
- `src/simulator.ts` — Interactive multi-scenario chat & keyboard simulator importing `core/index.ts` directly.
- `src/downloads.ts` — Hydrates live file sizes, download links, and 1-click `SHA-256` hash copy buttons from `downloads/release-manifest.json`.

## Build & Local Preview
```bash
pnpm build:web
pnpm serve:web
```
Serves `web/dist/` on `http://localhost:4173` with proper `application/vnd.android.package-archive` and `Content-Disposition: attachment` headers.

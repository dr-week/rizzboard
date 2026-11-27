<div align="center">

<img src="./assets/brand/rizzboard-stamp.jpg" alt="RizzBoard Logo by Danger.Labs" width="220" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />

# RizzBoard v1.1.0

**Enterprise-Grade, Sub-Millisecond AI Android Keyboard, 5-Tier Hybrid Context Engine & Manifest V3 Web Chat Extension**

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](#)
[![Android](https://img.shields.io/badge/Android-8.0%2B%20(API%2026--35)-blue?style=flat-square)](#)
[![Browser Extension](https://img.shields.io/badge/Extension-Chromium%20Manifest%20V3-crimson?style=flat-square)](#)
[![Runtime](https://img.shields.io/badge/Runtime-Zuari%20Signals%20%7C%20Zero--VDOM-orange?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-Apache%202.0-lightgrey?style=flat-square)](#)

*Engineered by **Danger.Labs** (Autonomous Systems & Edge AI Division)*

</div>

---

## Executive Summary

**RizzBoard** is a multi-platform conversational intelligence suite engineered around a sub-4ms Android Input Method Service (IME) and a companion Chromium Manifest V3 Web Chat Extension.

Conventional AI keyboards fail on privacy-hardened or ephemeral messaging surfaces (`WindowManager.LayoutParams.FLAG_SECURE` on Telegram Secret Chats, Signal, and Hinge private modes, or screenshot-notifying chats like Snapchat and Instagram Vanish Mode). RizzBoard solves this via a **5-Tier Hybrid Context Ingestion System**, pairing native Android system observers with **Zuari (`@zuari/*`)**, a Virtual-DOM-free reactive UI runtime powered by TC39 Signals.

---

## 5-Tier Hybrid Context Pipeline (`FLAG_SECURE` & Snapchat Ready)

| Tier | Capture Module | Mechanism | Target Apps |
| :--- | :--- | :--- | :--- |
| **01** | `ScreenshotObserver` | Android 10–15 Scoped Storage (`RELATIVE_PATH` + `IS_PENDING == 0`) + ML Kit OCR v2 | Standard Chat Apps |
| **02** | `RizzNotificationListener` | Ephemeral RAM-only `MessagingStyle` ring buffer (`30-min TTL`, zero disk writes) | Snapchat, Signal, Telegram, Hinge |
| **03** | `ClipboardVault` | Self-commit-filtered focus hook ignoring URLs, 2FA OTPs & own replies | Copy-Enabled Chats |
| **04** | `RizzAccessibilityService` | Strictly on-demand (`👁️ Scan Screen`) coordinate bubble extractor (zero passive hooks) | Screenshot-Restricted Views |
| **05** | `StealthContextBar` | Isolates `QwertyGrid` keystrokes inside the IME without touching the host chat box | Snaps, Voice Notes & Photo Prompts |

---

## Seven-Department Micro-Modular Architecture

```
rizzboard/
├── package.json                        # Root monorepo scripts (test, build:*, verify, serve:web, release:*)
├── core/                               # [DEPT 01] Platform-Agnostic Intelligence Core
│   ├── index.ts                        # Shared barrel consumed by IME UI, Extension & Web Simulator
│   ├── ai/prompts.ts                   # Persona prompt builders & RizzResponse schema
│   ├── context/                        # Micro-modular Hybrid Context Engine (types, app-registry, noise-filter, router)
│   ├── engine/                         # Prefix Trie + Bigram Markov, RizzEngine & RoastEngine
│   ├── ocr/bubble-segmentation.ts      # Screen coordinate clustering & sender alignment
│   ├── vault/                          # Curated offline lines & Unicode 15.1 emoji datasets
│   └── tests/run-all.ts                # Automated unit & regression test suite
│
├── android/                            # [DEPT 02] Native Android IME & Signed Release APK
│   └── app/src/main/java/com/rizzboard/
│       ├── bridge/RizzNativeBridge.kt  # Bidirectional window.Android FFI
│       ├── keyboard/RizzInputMethodService.kt
│       ├── service/
│       │   ├── store/ContextMemoryStore.kt
│       │   ├── screenshot/ScreenshotObserver.kt
│       │   ├── notification/RizzNotificationListener.kt
│       │   ├── clipboard/ClipboardVault.kt
│       │   └── accessibility/RizzAccessibilityService.kt
│       └── settings/SettingsActivity.kt # Onboarding, runtime permissions & Prominent Disclosure
│
├── ui/                                 # [DEPT 03] Zuari Zero-VDOM Reactive Keyboard UI
│   └── src/
│       ├── components/{ribbon,grid,panels}/
│       ├── services/{bridge-service,dom-helper}.ts
│       ├── styles/{tokens,ribbon,grid,panels,keyboard}.css
│       └── vendor/zuari/               # Standalone Zuari CI fallback runtime
│
├── extension/                          # [DEPT 04] Manifest V3 Web Chat Extension (Chrome/Brave/Edge/Arc)
│   ├── manifest.json
│   └── src/
│       ├── background/service-worker.ts
│       ├── content/{adapters,extractor,injector,widget}/
│       └── popup/{popup.html,popup.css,popup.ts}
│
├── web/                                # [DEPT 05] Product Showcase, Live Simulator & APK Download Portal
│   ├── index.html
│   ├── styles/{tokens,base,hero,simulator,sections}.css
│   └── src/{simulator,downloads,main}.ts
│
├── scripts/                            # [DEPT 06] DevOps, Build, Verification & Release Automations
│   ├── lib/logger.mjs
│   ├── build/{generate-icons,build-ui,build-extension,build-apk,build-web}.mjs
│   ├── verify/verify-all.mjs
│   ├── release/cut-release.mjs
│   └── serve-web.mjs
│
├── .github/workflows/                  # Automated CI, Tagged GitHub Releases & GitHub Pages Deployment
│   ├── ci.yml
│   ├── release.yml
│   └── deploy-pages.yml
│
└── docs/                               # [DEPT 07] Engineering Manuals & System Specifications
    ├── README.md
    ├── departments/01..06-*.md
    ├── architecture/system-architecture.md
    ├── setup/prerequisites.md
    └── specs/system-spec.md
```

---

## Quickstart & Build Automations

### 1. Full Monorepo Verification & Release Build (1 Command)
Runs the Core test suite, compiles the Zuari IME UI, bundles & zips the Manifest V3 Browser Extension, builds the R8-shrunk V1/V2/V3 Signed Release APK, and assembles the Web Download Portal with `SHA256SUMS.txt`:

```bash
pnpm verify
```

Generated release artifacts are output to `releases/v1.1.0/`:
- `releases/v1.1.0/rizzboard-v1.1.0-release.apk` — Universal Signed Android Release APK
- `releases/v1.1.0/rizzboard-extension-v1.1.0.zip` — Chromium Manifest V3 Web Extension
- `releases/v1.1.0/SHA256SUMS.txt` — Cryptographic `SHA-256` checksums

### 2. Department-Specific Commands
```bash
pnpm test              # Dept 01: Run Core Engine unit tests
pnpm build:ui          # Dept 03: Build Zuari UI & sync into Android assets
pnpm build:extension   # Dept 04: Bundle MV3 Web Extension & .zip archive
pnpm build:apk         # Dept 02: Build R8-optimized Signed Release APK
pnpm build:web         # Dept 05: Assemble Web Showcase & Download Portal
pnpm serve:web         # Dept 05: Launch local portal at http://localhost:4173
pnpm release:github    # Dept 06: Publish GitHub Release via gh CLI
```

### 3. Install on Android & Chromium Browsers
- **Android APK:** Install `releases/v1.1.0/rizzboard-v1.1.0-release.apk` directly on device or via `adb install -r releases/v1.1.0/rizzboard-v1.1.0-release.apk`, then open **RizzBoard** to enable the keyboard and Stealth Notification Listener.
- **Browser Extension:** Unzip `releases/v1.1.0/rizzboard-extension-v1.1.0.zip` (or use `extension/dist/`), open `chrome://extensions`, enable **Developer mode**, and click **Load unpacked**. Press `Alt+R` inside WhatsApp Web, Instagram Direct, Telegram Web, Tinder, Bumble, or Discord.

---

## Documentation Index

Detailed engineering guides are maintained in [`docs/README.md`](./docs/README.md):
- [Dept 01 · Core Intelligence Engine](./docs/departments/01-core-engine.md)
- [Dept 02 · Android Native IME & Hybrid Services](./docs/departments/02-android-ime.md)
- [Dept 03 · Zuari Zero-VDOM Keyboard UI](./docs/departments/03-zuari-ui.md)
- [Dept 04 · Chromium Manifest V3 Browser Extension](./docs/departments/04-browser-extension.md)
- [Dept 05 · Showcase Website & Download Portal](./docs/departments/05-web-portal.md)
- [Dept 06 · DevOps, Build Scripts & CI/CD Automations](./docs/departments/06-devops-automations.md)

---

## License

Copyright &copy; 2026 Danger.Labs. Distributed under the Apache License, Version 2.0.

## 🌐 Live Site & Downloads

- **Website:** https://dr-week.github.io/rizzboard/
- **Latest release (APK + extension):** https://github.com/dr-week/rizzboard/releases/tag/v1.1.0
- **Direct APK:** https://dr-week.github.io/rizzboard/downloads/rizzboard-v1.1.0-release.apk

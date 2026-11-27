# Dept 02 · Android Native IME & Hybrid Services (`android/`)

## Overview
`android/` implements the native Android `InputMethodService` (`API 26–35`), Google ML Kit Text Recognition v2 integration, onboarding permissions, and the native 5-Tier Hybrid Context services.

## Micro-Subpackage Layout (`com.rizzboard.*`)
- `keyboard/RizzInputMethodService.kt` — Hosts the hardware-accelerated WebView, tracks focused host package (`onStartInputView`), and runs ML Kit OCR v2.
- `bridge/RizzNativeBridge.kt` — Exposes `@JavascriptInterface` (`window.Android`) methods for text insertion, haptics, OCR, and live bubble scanning.
- `service/`
  - `store/ContextMemoryStore.kt` — Thread-safe, RAM-only ring buffer (`30-min TTL`, zero disk persistence) with self-commit filtering.
  - `screenshot/ScreenshotObserver.kt` — Android 10–15 Scoped Storage observer tracking `RELATIVE_PATH` and waiting for `IS_PENDING == 0`.
  - `notification/RizzNotificationListener.kt` — Extracts incoming `MessagingStyle` chat texts on `FLAG_SECURE` and Snapchat without triggering screenshot alerts.
  - `clipboard/ClipboardVault.kt` — Hooks copy events while the IME holds focus.
  - `accessibility/RizzAccessibilityService.kt` — Strictly on-demand window scanner (`canRetrieveWindowContent="true"`, zero passive background event hooks).
- `settings/SettingsActivity.kt` — Native dark-themed setup dashboard handling IME activation, runtime media permissions, notification listener access, and Play-Store-compliant Prominent Disclosure.

## Signed Release Build
`android/app/build.gradle.kts` enables R8 code & resource shrinking (`isMinifyEnabled = true`, `isShrinkResources = true`) with V1/V2/V3 APK signatures configured via `RIZZ_KEYSTORE_*` environment variables or automated local keystore generation (`scripts/build/build-apk.mjs`).

# RizzBoard Codebase Audit & Improvement Plan

## 1. Identified Mistakes & Gaps

| # | Area | Finding | Fix Plan |
| :--- | :--- | :--- | :--- |
| 1 | **Release Packaging (`scripts/build/`)** | Build scripts still output to `releases/v1.1.0/rizzboard-v1.1.0-release.apk` even though `android/app/build.gradle.kts` is at `1.2.1` (`versionCode 4`). | Read `versionName` dynamically from `build.gradle.kts` or root `package.json` so release folders and filenames match the tag. |
| 2 | **Online AI Wiring (`ui/src/main.ts`)** | `RizzEngine.generateOnlineSuggestions()` (Pollinations.ai) is implemented in `core/engine/rizz-engine.ts`, but `ui/src/main.ts` only calls synchronous `contextRouter.resolveSuggestions()`. | Add async `resolveOnlineSuggestions()` in `HybridContextRouter` and update `NextMovePanel` with a loading shimmer + instant offline fallback. |
| 3 | **Voice Dictation Fallback (`RizzInputMethodService.kt`)** | `🎙️` switches to Google Voice Typing IME or falls back to `showInputMethodPicker()`. Devices without Google Voice Typing don't get in-app dictation. | Add an in-app Android `SpeechRecognizer` fallback with auto-punctuation. |
| 4 | **Glide / Swipe-to-Type (`QwertyGrid.ts`)** | Tap, long-press, cursor scrub, and swipe-left/up gestures work, but continuous swipe-to-type is not yet implemented. | Add a translucent SVG/Canvas finger-trail overlay on `QwertyGrid` matched against `PredictiveEngine`. |

---

## 2. Recommended Next Steps
1. **Sync Release Script Versioning** (`scripts/build/build-apk.mjs`, `build-extension.mjs`).
2. **Wire Async Online AI** into `NextMovePanel.ts`.
3. **Add In-App `SpeechRecognizer`** for universal voice dictation.

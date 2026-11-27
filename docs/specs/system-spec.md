# RizzBoard Technical Specification

## 1. System Overview
RizzBoard is a production-grade, zero-latency Android Input Method Service (IME) powered by the **Zuari (`@zuari/*`) reactive framework**, a **5-Tier Hybrid Context Ingestion System** (working across standard, `FLAG_SECURE`, and screenshot-notifying apps), local on-device ML Kit OCR, and a dual-tier AI conversational engine.

## 2. Hard Requirements & Latency Budget
- **Keypress to character insertion:** < 16ms (60 FPS minimum threshold).
- **Recent screenshot detection:** < 100ms from finalized Scoped Storage write (`IS_PENDING == 0`).
- **Stealth notification & clipboard context surfacing:** < 10ms from `onStartInputView()` via ephemeral `ContextMemoryStore`.
- **On-Demand Accessibility bubble scan:** < 15ms coordinate extraction directly into `segmentChatBubbles()`.
- **On-Device OCR & Bubble Extraction:** < 80ms–250ms using Google ML Kit Text Recognition v2.
- **Offline banter & wordplay lookup:** < 5ms via in-memory indexed vault & heuristic vibe synthesizer.

## 3. Communication Protocol (Android IME <-> Zuari WebView)
- **Android -> Zuari (Native to JS):**
  - Android calls `window.__zuariKotlinDispatcher(eventName, payloadJson)`.
  - Events:
    - `screenshotDetected`: `{ uri, timestamp, appPackage? }`
    - `contextDetected`: `{ source: "notification" | "clipboard", text, senderName?, appPackage?, timestamp }`
    - `clipboardAdded`: `{ text }`
    - `appContextChanged`: `{ packageName }`
- **Zuari -> Android (JS to Native):**
  - Uses `window.Android` JavaScriptInterface exposed by `RizzNativeBridge.kt`.
  - Methods:
    - `commitText(text: String)`: Inserts text via `InputConnection.commitText()` and records self-commit filter signature.
    - `deleteBackward()`: Sends `KeyEvent.KEYCODE_DEL`.
    - `sendEnter()`: Sends editor action (`IME_ACTION_SEND` or `KeyEvent.KEYCODE_ENTER`).
    - `triggerHaptic(type: String)`: Triggers system haptic feedback (`light`, `click`, `heavy`).
    - `requestScreenshotAnalysis(uri: String)`: Runs ML Kit OCR v2 and returns `{ status, blocks, appPackage }`.
    - `requestScreenScan()`: Runs on-demand `RizzAccessibilityService` scan returning `{ status: "ok" | "restricted" | "not_enabled", blocks }`.
    - `getActiveContext()`: Fetches buffered notification/clipboard context for the focused package.
    - `getCapabilitiesStatus()`: Returns `{ mediaPermission, notificationAccess, accessibilityEnabled }`.
    - `openSystemSetting(target: String)`: Deep-links to `notifications`, `accessibility`, or `SettingsActivity`.
    - `hideKeyboard()`: Calls `requestHideSelf(0)`.

# RizzBoard Technical Specification

## 1. System Overview
RizzBoard is a production-grade, zero-latency Android Input Method Service (IME) powered by the **Zuari (`@zuari/*`) reactive framework**, local on-device OCR, and a dual-tier AI conversational engine (On-Device MediaPipe/Gemma + Cloud Gemini 2.0 Flash).

## 2. Hard Requirements & Latency Budget
- **Keypress to character insertion:** < 16ms (60 FPS minimum threshold).
- **Recent screenshot detection:** < 100ms from disk write event via `MediaStore.Images.Media.EXTERNAL_CONTENT_URI`.
- **On-Device OCR & Bubble Extraction:** < 80ms using Google ML Kit Text Recognition v2.
- **Offline banter & wordplay lookup:** < 5ms via in-memory indexed Trie/Vector vault.
- **Online multimodal next-move generation:** < 500ms time-to-first-token using Server-Sent Events (SSE).

## 3. Communication Protocol (Android IME <-> Zuari WebView)
- **Android -> Zuari (Native to JS):**
  - Android calls `window.__zuariKotlinDispatcher(eventName, payloadJson)`.
  - Used for: `screenshotDetected`, `appContextChanged`, `themeChanged`, `batteryState`.
- **Zuari -> Android (JS to Native):**
  - Uses `window.Android` JavaScriptInterface exposed by `RizzNativeBridge.kt`.
  - Methods:
    - `commitText(text: String)`: Inserts text at the current cursor via `InputConnection.commitText()`.
    - `deleteBackward()`: Sends `KeyEvent.KEYCODE_DEL`.
    - `sendEnter()`: Sends editor action (`IME_ACTION_SEND` or `IME_ACTION_DONE`).
    - `triggerHaptic(type: String)`: Triggers system haptic feedback.
    - `requestScreenshotAnalysis(uri: String)`: Triggers ML Kit OCR and returns text blocks.
    - `hideKeyboard()`: Calls `requestHideSelf(0)`.

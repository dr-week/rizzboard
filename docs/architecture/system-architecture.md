# Architecture & Microfolder Layout

## Folder Hierarchy

```
rizzboard/
├── docs/                      # Precise technical documentation
│   ├── architecture/          # Data flow & sequence diagrams
│   ├── setup/                 # Prerequisites, Android SDK & keys
│   └── specs/                 # Latency budgets & functional specs
├── core/                      # Engine business logic & algorithms
│   ├── ai/                    # Prompt strategies, persona rules, fallback chains
│   ├── ocr/                   # Chat bubble segmentation & sender detection
│   ├── engine/                # Hybrid context router, RizzEngine, RoastEngine, Predictive Trie
│   └── vault/                 # Curated offline wordplay, pickup lines, openers
├── android/                   # Native Android InputMethodService & Hybrid Capture Host
│   ├── app/
│   │   └── src/main/
│   │       ├── java/com/rizzboard/
│   │       │   ├── bridge/    # RizzNativeBridge (JS <-> Kotlin interface)
│   │       │   ├── keyboard/  # RizzInputMethodService (IME + ML Kit OCR + package focus)
│   │       │   ├── service/   # ScreenshotObserver, RizzNotificationListener, ClipboardVault,
│   │       │   │              # RizzAccessibilityService, ContextMemoryStore
│   │       │   └── settings/  # SettingsActivity (Onboarding, permissions & disclosures)
│   │       └── res/           # Keyboard & accessibility XML metadata
├── ui/                        # Ultra-fast Zuari reactive keyboard interface
│   ├── src/
│   │   ├── components/        # ActionRibbon, StealthContextBar, NextMovePanel, QwertyGrid, Modals
│   │   ├── services/          # Native bridge client & DOM materialization helpers
│   │   └── styles/            # Minimal design tokens & theme
```

## 5-Tier Hybrid Context Pipeline (`FLAG_SECURE` & Snapchat Compatible)

1. **Tier 1 — Scoped Storage Screenshot Hook (`ScreenshotObserver`):**
   Monitors `MediaStore` (`RELATIVE_PATH` + `IS_PENDING == 0`) -> `__zuariKotlinDispatcher("screenshotDetected", json)` -> `requestScreenshotAnalysis()` runs Google ML Kit Text Recognition v2 -> [`segmentChatBubbles()`](file:///home/antigravity/dr-week/rizzboard/core/ocr/bubble-segmentation.ts) extracts partner vs. user bubbles.
2. **Tier 2 — Stealth Notification Listener (`RizzNotificationListener`):**
   Silently buffers incoming `MessagingStyle` chat texts in ephemeral RAM (`ContextMemoryStore`, 30-min TTL, zero disk writes) keyed by package (`com.snapchat.android`, `org.telegram.messenger`, `co.hinge.app`). Auto-surfaces when the IME opens in that app.
3. **Tier 3 — Self-Commit-Filtered Clipboard (`ClipboardVault`):**
   Long-pressing any chat message -> **Copy** dispatches `contextDetected` (`source: "clipboard"`) while ignoring RizzBoard's own committed replies, URLs, and numeric 2FA codes.
4. **Tier 4 — On-Demand Accessibility Bubble Scanner (`RizzAccessibilityService`):**
   Zero background event hooks. Triggered strictly when the user taps **`👁️ Scan Screen`**, extracting visible non-editable `AccessibilityNodeInfo` bounds directly into `segmentChatBubbles()` without screenshots or Snapchat alerts.
5. **Tier 5 — In-Keyboard Stealth Context Mode (`StealthContextBar`):**
   Universal fallback when screenshots, copy, notifications, and screen scanning are all blocked (e.g., Hinge photo prompts, Snapchat snaps, voice notes). Isolates `QwertyGrid` keystrokes inside RizzBoard without typing into the host chat input until the user taps a `Smooth`, `Tease`, or `Bold` reply.

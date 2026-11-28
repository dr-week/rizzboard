# RizzBoard Keyboard Improvement Roadmap & Architecture

## 1. Completed Milestones (v1.2.0)

### Core Typing & Gboard Parity
- **Native `InputConnection` Bridge (`RizzNativeBridge.kt`):**
  - `setComposingText`, `finishComposingText`, `moveCursor`, `getCursorCapsMode`, `performEditAction` (`selectAll`, `copy`, `cut`, `paste`), and `sendDpad`.
- **Autocorrect & Personal Dictionary (`core/engine/predictive.ts`):**
  - 150+ common words, bigrams, contraction/typo auto-replacement (`teh` → `the`, `dont` → `don't`, `im` → `I'm`), Levenshtein edit-distance-1 fuzzy matching, and word learning.
- **Gestures & Touch Ergonomics (`ui/src/components/grid/QwertyGrid.ts`):**
  - **Shift / Caps Lock** (`⇧` → `⬆` → `⇪`), **Numbers (`123`)** and **Symbols (`=\<`)** layers.
  - **Long-press symbols** on QWERTY (`q`–`p` → `1`–`0`, `a`–`m` → `@ # $ % & - + ( ) * " ' : ; ! ?`).
  - **Hold-to-repeat Backspace (`⌫`)** and **Spacebar cursor scrubbing**.
- **Panels & Micro-Animations:**
  - **Emoji Panel (`EmojiPanel.ts`):** 7 categories (250+ emojis), live keyword search, and `🕒` Recent Emojis.
  - **Clipboard Panel (`ClipboardPanel.ts`):** Pin/Unpin (`📌`/`📍`), Delete (`✕`), and Clear All.
  - **Text Editing Panel (`TextEditPanel.ts`):** Cursor D-pad (`◀ ▲ ▼ ▶`) + `Select All`, `Copy`, `Cut`, `Paste`.
  - **Help & Gestures Guide (`HelpPanel.ts`):** Accessible via `❓` with minimal 60fps animations (`keyboard.css`).
- **Voice & Intelligence:**
  - **Google Voice Typing (`🎙️ Mic`)** & **Keyboard Switcher (`🌐`)**.
  - **Automatic Chat Scanning** on focus (`appContextChanged`) + **Free Pollinations.ai** online reply generation with offline intent/topic fallback (`core/engine/rizz-engine.ts`).

---

## 2. Next Planned Improvements (v1.3.0+)

| Priority | Feature | Description |
| :--- | :--- | :--- |
| **P1** | **Theme Switcher & Height Presets** | `Midnight Slate`, `AMOLED Black`, and `Soft Light` themes + `Compact / Normal / Tall` height presets persisted in `localStorage`. |
| **P1** | **Optional Number Row** | Toggleable `1–0` row above `QWERTY` for 1-tap number entry. |
| **P2** | **Swipe-Left Word Delete & Swipe-Up Rizz** | Swipe left on `⌫` to delete a whole word; swipe up on `space` to open Next-Move Rizz. |
| **P2** | **One-Handed Mode** | Left/Right dock toggle (~82% width) for comfortable thumb typing. |
| **P3** | **Glide / Swipe-to-Type** | Translucent finger-trail SVG/Canvas overlay on `QwertyGrid` matched against `PredictiveEngine`. |
| **P3** | **In-App `SpeechRecognizer` Dictation** | Direct on-device voice-to-text with auto-punctuation inside RizzBoard. |

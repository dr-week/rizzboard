# RizzBoard — Gboard Parity & Voice Typing Architecture Plan

## 1. Voice Typing (`🎙️`)
- **Primary:** Android `SpeechRecognizer` (`startInAppDictation()` in `RizzInputMethodService.kt`) for direct in-keyboard dictation.
- **Fallback:** Switches to Google Voice Typing IME (`switchToVoiceInput()`) or opens the system IME picker (`showKeyboardPicker()`).
- **Next Step:** Add a `RECORD_AUDIO` runtime permission prompt in `SettingsActivity.kt` + a visual listening pulse on the Mic button.

## 2. Gboard UX & Layout Structure
- **Tier 1 (Top Toolbar):** Clean SVG icons only (`icons.ts`) — Mic, Scan, Tell Rizz, Roast, Clipboard, Emoji, Talks, Settings (`⚙`), Globe.
- **Tier 2 (Suggestion Strip):** 3-slot predictive/autocorrect bar (`SuggestionStrip.ts`).
- **Tier 3 (Keyboard Grid):**
  - Row 1–3: `QWERTY` with Shift/Caps (`⇧`/`⬆`/`⇪`), long-press `1–0`/symbols, hold-to-repeat `⌫`, swipe-left `⌫` word delete.
  - Row 4: `123` | `😏` | `,` | `space` (with cursor scrubbing & swipe-up Rizz) | `.` | `Send`.

## 3. Offline Data & Seeds
- **Dictionary & Autocorrect (`core/engine/predictive.ts`):** In-memory Prefix Trie, Bigram next-word predictor, contraction/typo map, Levenshtein edit-distance-1 fuzzy match, and `localStorage` personal dictionary.
- **Offline Rizz & Emojis (`core/vault/`):** `curated-lines.ts` (intent/topic-matched replies) + `emoji-data.ts` (7 categories, 250+ emojis) + `TalksPanel.ts` (4 conversation decks).

## 4. Phased Development Plan
| Phase | Focus | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | **Voice & Permissions** | `RECORD_AUDIO` runtime prompt in `SettingsActivity.kt` + listening indicator. |
| **Phase 2** | **Code Modularity (<100 LOC)** | Split `ui/src/main.ts` into `state/` and `handlers/`, split `QwertyGrid.ts` into `key-buttons.ts`. |
| **Phase 3** | **Gboard Polish** | Keycap pop-up preview bubble, double-spacebar → `. `, center-bold autocorrect slot. |
| **Phase 4** | **Glide & Snippets** | SVG finger-trail swipe-to-type + custom text expander shortcuts (`@@` → email). |

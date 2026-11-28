# iPhone (iOS) Keyboard Features & Gestures Plan for RizzBoard

## 1. Signature iOS Keyboard Features to Port
- **QuickPath / Swipe-to-Type:** Continuous finger-trail across keys with word prediction.
- **Reachability / One-Handed Dock:** Left/Right compact dock *(already implemented via `🤚`)*.
- **Spacebar Trackpad Mode:** Long-press or slide on Spacebar to move the cursor smoothly *(already implemented via `space` drag)*.
- **Slide-from-`123` Quick Symbol:** Hold `123`, slide to a number/symbol, and release to type it and snap back to `ABC` automatically.
- **Double-Tap Spacebar → Period (`. `):** Quick sentence ending with auto-capitalization.
- **Hold-to-Pop Accents:** Long-press vowels (`a, e, i, o, u`) for accented variants (`á, à, â, ä, é, è, ê, etc.`).
- **Haptic & Audio Key Ticks:** Crisp iOS-style `Tock` feedback on keycap press *(haptics already implemented via `triggerHaptic`)*.
- **QuickType Prediction Bar:** 3-slot predictive bar with bolded autocorrect preview and 1-tap replacement.

---

## 2. Implementation Phases
1. **Phase 1 (Quick Symbol & Double-Space):** Add `123` slide-and-release snap-back + double-space `. ` in `QwertyGrid.ts` & `main.ts`.
2. **Phase 2 (Accents Popup):** Add vowel accent popups on long-press.
3. **Phase 3 (QuickPath Swipe-to-Type):** Add SVG finger-trail overlay + `PredictiveEngine` path matching.

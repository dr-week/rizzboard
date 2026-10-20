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
│   ├── engine/                # Response scoring, vibe classifier
│   └── vault/                 # Curated offline wordplay, pickup lines, openers
├── android/                   # Native Android InputMethodService
│   ├── app/
│   │   └── src/main/
│   │       ├── java/com/rizzboard/
│   │       │   ├── bridge/    # RizzNativeBridge (JS <-> Kotlin interface)
│   │       │   ├── keyboard/  # RizzInputMethodService (Android IME lifecycle)
│   │       │   └── service/   # ScreenshotObserver (MediaStore content observer)
│   │       └── res/           # Keyboard metadata & input method XML definitions
├── ui/                        # Ultra-fast Zuari reactive keyboard interface
│   ├── src/
│   │   ├── components/        # Action bar, suggestions carousel, QWERTY grid
│   │   ├── services/          # Bridge client, prompt stream, vault search
│   │   └── styles/            # Minimal design tokens & theme
```

## Data Flow Pipeline

1. **User Types:**
   Key tap -> Zuari Signal -> `RizzNativeBridge.commitText()` -> `InputConnection.commitText()`.
2. **User Takes Screenshot:**
   `ScreenshotObserver` detects URI -> `__zuariKotlinDispatcher("screenshotDetected", json)` -> Zuari reactive banner shows `[Analyze Next Move]`.
3. **Analyze Action:**
   User taps suggestion -> `requestScreenshotAnalysis()` -> ML Kit parses text bubbles -> Zuari `@zuari/ai` streams 3 vibes (`Smooth`, `Tease`, `Bold`) -> User taps one -> Instantly inserted into chat input.

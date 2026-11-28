# RizzBoard Control Center (`SettingsActivity.kt`) & Future Updates Plan

## 1. Current Control Center Features
1. **Enable & Switch Keyboard** (`ACTION_INPUT_METHOD_SETTINGS` + `showInputMethodPicker()`).
2. **Media / Screenshot Access** (`READ_MEDIA_IMAGES`).
3. **Stealth Notification Listener** (`ACTION_NOTIFICATION_LISTENER_SETTINGS`).
4. **On-Demand Accessibility Scanner** (`ACTION_ACCESSIBILITY_SETTINGS`).
5. **In-App Updates (OTA + APK)** (`OtaUiUpdater.checkForUpdatesAsync` + direct APK download).

## 2. Planned Control Center Additions (`v1.3.0+`)
- **Live Keyboard Test Box:** An embedded `EditText` inside `SettingsActivity.kt` so users can test typing, themes, voice, and autocorrect immediately without leaving the app.
- **Theme Gallery:** Visual theme selector (*Material You Dark*, *AMOLED Black*, *Soft Light*, *Neon Rizz*, *Ocean Blue*) synced with `localStorage` / `SharedPreferences`.
- **Personal Dictionary & Snippets Manager:** View, add, or delete learned Roman Konkani/English words and custom text-expander shortcuts (`omw`, `@@`, etc.).
- **OTA Status & Diagnostics:** Display current bundled UI version, cached OTA version, and 1-tap cache reset.

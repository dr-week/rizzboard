# Prerequisites & Environment Setup

## Required Toolchain
1. **Node.js:** v20+ (Verified: v24.15.0 installed).
2. **Package Manager:** `pnpm` (Verified: v12.3.4 installed).
3. **Android SDK:**
   - Platform Tools / `adb` (Location: `C:\Software\Android\Sdk\platform-tools`).
   - Android API Level: 34 (Android 14) or 35 (Android 15).
   - Build Tools: 34.0.0+.
4. **Java Development Kit (JDK):**
   - JDK 21 (Location: `C:\Software\Java\Temurin-21\jdk-21.0.12.1+1`).
   - Set environment variable: `JAVA_HOME=C:\Software\Java\Temurin-21\jdk-21.0.12.1+1`.

## Android System Permissions
The native IME requires the following permissions declared in `AndroidManifest.xml`:
- `android.permission.READ_MEDIA_IMAGES` (Android 13+): For detecting screenshot file changes.
- `android.permission.READ_EXTERNAL_STORAGE` (Max SDK 32): Backward compatibility for screenshots.
- `android.permission.VIBRATE`: For keyboard haptic feedback.
- `android.permission.INTERNET`: For streaming cloud Gemini 2.0 Flash completions.

## API Credentials
Create a `.env` file inside `ui/` or configure via Android BuildConfig:
```properties
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

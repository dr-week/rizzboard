# Preserve JavaScript <-> Kotlin FFI methods invoked by Zuari WebView
-keepattributes JavascriptInterface
-keepattributes *Annotation*
-keepclassmembers class com.rizzboard.bridge.RizzNativeBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.rizzboard.bridge.RizzNativeBridge { *; }

# Keep Android Services & Settings Activity entrypoints
-keep class com.rizzboard.keyboard.RizzInputMethodService { *; }
-keep class com.rizzboard.service.** { *; }
-keep class com.rizzboard.settings.SettingsActivity { *; }

# ML Kit / Play Services Vision safeguard rules
-dontwarn com.google.mlkit.**
-dontwarn com.google.android.gms.**
-keep class com.google.mlkit.** { *; }

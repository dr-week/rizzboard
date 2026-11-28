package com.rizzboard.keyboard

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.inputmethodservice.InputMethodService
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.provider.Settings
import android.view.View
import android.view.inputmethod.EditorInfo
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.core.content.ContextCompat
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.rizzboard.bridge.RizzNativeBridge
import com.rizzboard.service.accessibility.RizzAccessibilityService
import com.rizzboard.service.clipboard.ClipboardVault
import com.rizzboard.service.notification.RizzNotificationListener
import com.rizzboard.service.screenshot.ScreenshotObserver
import com.rizzboard.service.store.ContextMemoryStore
import com.rizzboard.settings.SettingsActivity
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class RizzInputMethodService : InputMethodService() {

    val mainHandler = Handler(Looper.getMainLooper())
    private var webView: WebView? = null
    private var screenshotObserver: ScreenshotObserver? = null
    private var clipboardVault: ClipboardVault? = null

    @Volatile
    var activeHostPackage: String? = null
        private set

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreateInputView(): View {
        val wv = WebView(this)
        webView = wv

        @Suppress("DEPRECATION")
        wv.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        // Attach native bridge
        wv.addJavascriptInterface(RizzNativeBridge(this), "Android")

        // Load optimized local Zuari build
        wv.loadUrl("file:///android_asset/ui/index.html")

        setupHybridObservers()
        return wv
    }

    override fun onStartInputView(editorInfo: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(editorInfo, restarting)
        val pkg = editorInfo?.packageName
        activeHostPackage = pkg

        if (!pkg.isNullOrBlank()) {
            val appPayload = JSONObject().apply {
                put("packageName", pkg)
            }
            dispatchToZuari("appContextChanged", appPayload.toString())
        }

        // Check freshly copied bubble while IME holds input focus
        clipboardVault?.inspectCurrentClipWhenFocused(pkg)

        // Surface any buffered notification or clipboard context for this chat app
        ContextMemoryStore.peekLatestForPackage(pkg)?.let { captured ->
            dispatchToZuari("contextDetected", captured.toJson().toString())
        }
    }

    private fun setupHybridObservers() {
        // 1. MediaStore Screenshot Observer (Android 8–15)
        if (screenshotObserver == null) {
            screenshotObserver = ScreenshotObserver(this) { uri, timestamp ->
                val payload = JSONObject().apply {
                    put("uri", uri.toString())
                    put("timestamp", timestamp)
                    if (!activeHostPackage.isNullOrBlank()) {
                        put("appPackage", activeHostPackage)
                    }
                }
                dispatchToZuari("screenshotDetected", payload.toString())
            }

            contentResolver.registerContentObserver(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                true,
                screenshotObserver!!
            )
        }

        // 2. Clipboard Vault Observer
        if (clipboardVault == null) {
            clipboardVault = ClipboardVault(this).also { vault ->
                vault.init(
                    activePackageProvider = { activeHostPackage },
                    onClipAdded = { text ->
                        val clipPayload = JSONObject().apply { put("text", text) }
                        dispatchToZuari("clipboardAdded", clipPayload.toString())
                    }
                )
            }
        }

        // 3. Real-time ContextMemoryStore Listener (Notifications + Clipboard)
        ContextMemoryStore.listener = { captured ->
            val currentPkg = activeHostPackage
            if (captured.source == "clipboard" ||
                currentPkg == null ||
                captured.appPackage == null ||
                captured.appPackage == currentPkg
            ) {
                dispatchToZuari("contextDetected", captured.toJson().toString())
            }
        }
    }

    fun dispatchToZuari(event: String, payloadJson: String) {
        mainHandler.post {
            val script =
                "window.__zuariKotlinDispatcher && window.__zuariKotlinDispatcher('$event', $payloadJson);"
            webView?.evaluateJavascript(script, null)
        }
    }

    /**
     * Runs on-device Google ML Kit Text Recognition v2 on the screenshot URI.
     * Invoked on Android's background JavaBridge thread, returning segmented coordinate blocks.
     */
    fun performOCRAnalysis(uriString: String): String {
        val response = JSONObject()
        val blocks = JSONArray()
        val screenWidth = resources.displayMetrics.widthPixels.coerceAtLeast(1080)

        try {
            val uri = Uri.parse(uriString)
            val image = InputImage.fromFilePath(this, uri)
            val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            val visionText = Tasks.await(recognizer.process(image), 1800L, TimeUnit.MILLISECONDS)

            val imageWidth = image.width.takeIf { it > 0 } ?: screenWidth
            for (block in visionText.textBlocks) {
                val box = block.boundingBox ?: continue
                val clean = block.text.trim()
                if (clean.isEmpty()) continue
                blocks.put(JSONObject().apply {
                    put("text", clean)
                    put("x", box.left)
                    put("y", box.top)
                    put("width", box.width())
                    put("screenWidth", imageWidth)
                })
            }
            recognizer.close()
            response.put("status", if (blocks.length() > 0) "ok" else "empty")
        } catch (e: Exception) {
            response.put("status", "error")
            response.put("error", e.message ?: "OCR unavailable")
        }

        response.put("blocks", blocks)
        if (!activeHostPackage.isNullOrBlank()) {
            response.put("appPackage", activeHostPackage)
        }
        return response.toString()
    }

    /**
     * Performs an on-demand Accessibility window scan for FLAG_SECURE or Snapchat chats
     * where screenshots cannot or should not be taken.
     */
    fun performAccessibilityScan(): String {
        val service = RizzAccessibilityService.instance
        if (service == null) {
            return JSONObject().apply {
                put("status", "not_enabled")
                put("blocks", JSONArray())
            }.toString()
        }
        return service.captureVisibleChatBlocks().toString()
    }

    fun getActiveBufferedContextJson(): String {
        val captured = ContextMemoryStore.peekLatestForPackage(activeHostPackage)
            ?: return JSONObject().apply { put("status", "none") }.toString()
        return captured.toJson().apply { put("status", "ok") }.toString()
    }

    fun getCapabilitiesStatusJson(): String {
        val hasMediaPermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.READ_MEDIA_IMAGES
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.READ_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED
        }

        return JSONObject().apply {
            put("mediaPermission", hasMediaPermission)
            put("notificationAccess", RizzNotificationListener.isEnabled(this@RizzInputMethodService))
            put("accessibilityEnabled", RizzAccessibilityService.isEnabled(this@RizzInputMethodService))
            if (!activeHostPackage.isNullOrBlank()) {
                put("activePackage", activeHostPackage)
            }
        }.toString()
    }

    fun launchSystemSetting(target: String) {
        val intent = when (target) {
            "notifications" -> Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
            "accessibility" -> Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            else -> Intent(this, SettingsActivity::class.java)
        }.apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            startActivity(intent)
        } catch (_: Exception) {
            val fallback = Intent(this, SettingsActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(fallback)
        }
    }

    fun switchToVoiceInput() {
        mainHandler.post {
            val imm = getSystemService(INPUT_METHOD_SERVICE) as? android.view.inputmethod.InputMethodManager
                ?: return@post
            val voiceIme = imm.enabledInputMethodList.firstOrNull { imi ->
                val id = imi.id.lowercase()
                val pkg = imi.packageName.lowercase()
                id.contains("voice") ||
                    pkg.contains("googlequicksearchbox") ||
                    pkg.contains("speech") ||
                    imi.serviceName.lowercase().contains("voice")
            }
            if (voiceIme != null) {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        switchInputMethod(voiceIme.id)
                    } else {
                        @Suppress("DEPRECATION")
                        val token = window?.window?.attributes?.token
                        @Suppress("DEPRECATION")
                        imm.setInputMethod(token, voiceIme.id)
                    }
                    return@post
                } catch (_: Exception) {
                    // Fall through to system IME picker
                }
            }
            imm.showInputMethodPicker()
        }
    }

    fun showKeyboardPicker() {
        mainHandler.post {
            val imm = getSystemService(INPUT_METHOD_SERVICE) as? android.view.inputmethod.InputMethodManager
            imm?.showInputMethodPicker()
        }
    }

    override fun onDestroy() {
        ContextMemoryStore.listener = null
        screenshotObserver?.let { contentResolver.unregisterContentObserver(it) }
        clipboardVault?.dispose()
        webView?.destroy()
        super.onDestroy()
    }
}

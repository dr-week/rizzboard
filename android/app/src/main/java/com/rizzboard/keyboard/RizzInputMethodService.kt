package com.rizzboard.keyboard

import android.annotation.SuppressLint
import android.graphics.BitmapFactory
import android.inputmethodservice.InputMethodService
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import com.rizzboard.bridge.RizzNativeBridge
import com.rizzboard.service.ScreenshotObserver
import org.json.JSONArray
import org.json.JSONObject

class RizzInputMethodService : InputMethodService() {

    val mainHandler = Handler(Looper.getMainLooper())
    private var webView: WebView? = null
    private var screenshotObserver: ScreenshotObserver? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreateInputView(): View {
        val wv = WebView(this)
        webView = wv

        wv.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        // Attach native bridge
        wv.addJavascriptInterface(RizzNativeBridge(this), "Android")

        // Load optimized local Zuari build
        wv.loadUrl("file:///android_asset/ui/index.html")

        setupScreenshotObserver()
        return wv
    }

    private fun setupScreenshotObserver() {
        screenshotObserver = ScreenshotObserver(this) { uri, timestamp ->
            val payload = JSONObject().apply {
                put("uri", uri.toString())
                put("timestamp", timestamp)
            }
            dispatchToZuari("screenshotDetected", payload.toString())
        }

        contentResolver.registerContentObserver(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
            true,
            screenshotObserver!!
        )
    }

    fun dispatchToZuari(event: String, payloadJson: String) {
        mainHandler.post {
            val script = "window.__zuariKotlinDispatcher && window.__zuariKotlinDispatcher('$event', $payloadJson);"
            webView?.evaluateJavascript(script, null)
        }
    }

    fun performOCRAnalysis(uriString: String): String {
        // Fast mock / ML Kit hook returning segmented blocks
        val response = JSONObject()
        val blocks = JSONArray()

        val sampleBlock = JSONObject().apply {
            put("text", "hey are you free this weekend?")
            put("x", 40)
            put("y", 400)
            put("width", 250)
            put("screenWidth", 1080)
        }
        blocks.put(sampleBlock)

        response.put("blocks", blocks)
        return response.toString()
    }

    override fun onDestroy() {
        super.onDestroy()
        screenshotObserver?.let { contentResolver.unregisterContentObserver(it) }
        webView?.destroy()
    }
}

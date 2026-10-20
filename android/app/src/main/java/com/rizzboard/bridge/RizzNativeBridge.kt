package com.rizzboard.bridge

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.os.Build
import android.view.KeyEvent
import android.view.inputmethod.EditorInfo
import android.webkit.JavascriptInterface
import com.rizzboard.keyboard.RizzInputMethodService
import org.json.JSONObject

/**
 * JavaScript interface exposed to the Zuari web runtime via window.Android.
 * Thread-safe execution of keyboard input actions and hardware haptics.
 */
class RizzNativeBridge(private val service: RizzInputMethodService) {

    private val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val manager = service.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
        manager?.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        service.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }

    @JavascriptInterface
    fun commitText(text: String) {
        service.mainHandler.post {
            service.currentInputConnection?.commitText(text, 1)
        }
    }

    @JavascriptInterface
    fun deleteBackward() {
        service.mainHandler.post {
            service.currentInputConnection?.sendKeyEvent(
                KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_DEL)
            )
            service.currentInputConnection?.sendKeyEvent(
                KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DEL)
            )
        }
    }

    @JavascriptInterface
    fun sendEnter() {
        service.mainHandler.post {
            val ic = service.currentInputConnection ?: return@post
            val options = service.currentInputEditorInfo?.imeOptions ?: 0
            val action = options and EditorInfo.IME_MASK_ACTION
            if (action != EditorInfo.IME_ACTION_NONE && action != EditorInfo.IME_ACTION_UNSPECIFIED) {
                ic.performEditorAction(action)
            } else {
                ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER))
                ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER))
            }
        }
    }

    @JavascriptInterface
    fun triggerHaptic(type: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val effect = when (type) {
                "light" -> VibrationEffect.createPredefined(VibrationEffect.EFFECT_TICK)
                "heavy" -> VibrationEffect.createPredefined(VibrationEffect.EFFECT_HEAVY_CLICK)
                else -> VibrationEffect.createPredefined(VibrationEffect.EFFECT_CLICK)
            }
            vibrator?.vibrate(effect)
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(20)
        }
    }

    @JavascriptInterface
    fun requestScreenshotAnalysis(uri: String): String {
        return service.performOCRAnalysis(uri)
    }

    @JavascriptInterface
    fun hideKeyboard() {
        service.mainHandler.post {
            service.requestHideSelf(0)
        }
    }
}

package com.rizzboard.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.ComponentName
import android.content.Context
import android.graphics.Rect
import android.provider.Settings
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.view.accessibility.AccessibilityWindowInfo
import org.json.JSONArray
import org.json.JSONObject

/**
 * Strictly on-demand Accessibility window reader.
 * Zero background event hooks: executes ONLY when the user explicitly taps "Scan Screen".
 */
class RizzAccessibilityService : AccessibilityService() {

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Intentionally empty: zero passive background scraping.
    }

    override fun onInterrupt() {
        // No-op
    }

    override fun onDestroy() {
        if (instance === this) {
            instance = null
        }
        super.onDestroy()
    }

    fun captureVisibleChatBlocks(): JSONObject {
        val response = JSONObject()
        val blocks = JSONArray()
        val screenWidth = resources.displayMetrics.widthPixels.coerceAtLeast(720)

        val candidateRoots = mutableListOf<AccessibilityNodeInfo>()
        try {
            for (window in windows) {
                if (window.type == AccessibilityWindowInfo.TYPE_INPUT_METHOD ||
                    window.type == AccessibilityWindowInfo.TYPE_SYSTEM
                ) {
                    continue
                }
                window.root?.let { root ->
                    if (root.packageName?.toString() != packageName) {
                        candidateRoots.add(root)
                    }
                }
            }
        } catch (_: Exception) {
            // Fallback to rootInActiveWindow
        }

        if (candidateRoots.isEmpty()) {
            rootInActiveWindow?.let { root ->
                if (root.packageName?.toString() != packageName) {
                    candidateRoots.add(root)
                }
            }
        }

        if (candidateRoots.isEmpty()) {
            response.put("status", "restricted")
            response.put("blocks", blocks)
            return response
        }

        var hostPkg: String? = null
        for (root in candidateRoots) {
            if (hostPkg == null) {
                hostPkg = root.packageName?.toString()
            }
            collectTextNodes(root, screenWidth, blocks, depth = 0)
        }

        response.put("status", if (blocks.length() == 0) "restricted" else "ok")
        if (!hostPkg.isNullOrBlank()) {
            response.put("appPackage", hostPkg)
        }
        response.put("blocks", blocks)
        return response
    }

    private fun collectTextNodes(
        node: AccessibilityNodeInfo?,
        screenWidth: Int,
        out: JSONArray,
        depth: Int
    ) {
        if (node == null || depth > 40 || out.length() >= 80) return
        if (!node.isVisibleToUser || node.isEditable) return

        val rawText = node.text?.toString()?.trim()
        if (!rawText.isNullOrEmpty() && rawText.length in 1..400) {
            val rect = Rect()
            node.getBoundsInScreen(rect)
            if (rect.width() > 20 && rect.height() > 14 && rect.top >= 0) {
                out.put(JSONObject().apply {
                    put("text", rawText)
                    put("x", rect.left)
                    put("y", rect.top)
                    put("width", rect.width())
                    put("screenWidth", screenWidth)
                })
            }
        }

        val count = node.childCount
        for (i in 0 until count) {
            collectTextNodes(node.getChild(i), screenWidth, out, depth + 1)
        }
    }

    companion object {
        @Volatile
        var instance: RizzAccessibilityService? = null
            private set

        fun isEnabled(context: Context): Boolean {
            if (instance != null) return true
            val enabledServices = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            ) ?: return false
            val target = ComponentName(context, RizzAccessibilityService::class.java).flattenToString()
            return enabledServices.split(":").any { it.equals(target, ignoreCase = true) }
        }
    }
}

package com.rizzboard.service.clipboard

import android.content.ClipboardManager
import android.content.Context
import com.rizzboard.service.store.ContextMemoryStore
import org.json.JSONArray

class ClipboardVault(private val context: Context) {

    private val clipboardManager =
        context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    private val maxItems = 10
    private val history = mutableListOf<String>()
    private var clipListener: ClipboardManager.OnPrimaryClipChangedListener? = null

    fun init(
        activePackageProvider: () -> String?,
        onClipAdded: (item: String) -> Unit
    ) {
        dispose()
        val listener = ClipboardManager.OnPrimaryClipChangedListener {
            try {
                val clip = clipboardManager.primaryClip
                if (clip != null && clip.itemCount > 0) {
                    val text = clip.getItemAt(0).coerceToText(context)?.toString()?.trim().orEmpty()
                    if (text.isNotEmpty() && !ContextMemoryStore.isSelfCommitted(text)) {
                        if (!history.contains(text)) {
                            history.add(0, text)
                            if (history.size > maxItems) {
                                history.removeAt(history.lastIndex)
                            }
                        }
                        ContextMemoryStore.pushClipboard(text, activePackageProvider())
                        onClipAdded(text)
                    }
                }
            } catch (_: SecurityException) {
                // Restricted when IME does not hold input focus
            }
        }
        clipListener = listener
        clipboardManager.addPrimaryClipChangedListener(listener)
    }

    fun inspectCurrentClipWhenFocused(activePackage: String?) {
        try {
            val clip = clipboardManager.primaryClip ?: return
            if (clip.itemCount == 0) return
            val clipTimestamp = clip.description?.timestamp ?: 0L
            if (clipTimestamp > 0L && (System.currentTimeMillis() - clipTimestamp) > 90_000L) {
                return
            }
            val text = clip.getItemAt(0).coerceToText(context)?.toString()?.trim().orEmpty()
            if (text.isNotEmpty() && !ContextMemoryStore.isSelfCommitted(text)) {
                ContextMemoryStore.pushClipboard(text, activePackage)
            }
        } catch (_: Exception) {
            // Ignore when clipboard is unavailable
        }
    }

    fun getHistoryJson(): String {
        val arr = JSONArray()
        for (item in history) {
            arr.put(item)
        }
        return arr.toString()
    }

    fun dispose() {
        clipListener?.let {
            clipboardManager.removePrimaryClipChangedListener(it)
            clipListener = null
        }
    }
}

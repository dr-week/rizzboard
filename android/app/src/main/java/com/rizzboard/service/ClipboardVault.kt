package com.rizzboard.service

import android.content.ClipboardManager
import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class ClipboardVault(private val context: Context) {

    private val clipboardManager = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    private val maxItems = 10
    private val history = mutableListOf<String>()

    fun init(onClipAdded: (item: String) -> Unit) {
        clipboardManager.addPrimaryClipChangedListener {
            val clip = clipboardManager.primaryClip
            if (clip != null && clip.itemCount > 0) {
                val text = clip.getItemAt(0).coerceToText(context)?.toString()?.trim() ?: ""
                if (text.isNotEmpty() && !history.contains(text)) {
                    history.add(0, text)
                    if (history.size > maxItems) {
                        history.removeAt(history.lastIndex)
                    }
                    onClipAdded(text)
                }
            }
        }
    }

    fun getHistoryJson(): String {
        val arr = JSONArray()
        for (item in history) {
            arr.put(item)
        }
        return arr.toString()
    }
}

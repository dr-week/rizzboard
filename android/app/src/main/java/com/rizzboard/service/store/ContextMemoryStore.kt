package com.rizzboard.service.store

import org.json.JSONObject
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentLinkedDeque

/**
 * Ephemeral, RAM-only conversation context store (never persisted to disk).
 * Buffers recent incoming chat notifications and clipboard captures per host package
 * so FLAG_SECURE and screenshot-notifying apps work seamlessly when the IME opens.
 */
object ContextMemoryStore {

    data class CapturedContext(
        val source: String,
        val text: String,
        val senderName: String? = null,
        val appPackage: String? = null,
        val uri: String? = null,
        val timestamp: Long = System.currentTimeMillis()
    ) {
        fun toJson(): JSONObject = JSONObject().apply {
            put("source", source)
            put("text", text)
            if (!senderName.isNullOrBlank()) put("senderName", senderName)
            if (!appPackage.isNullOrBlank()) put("appPackage", appPackage)
            if (!uri.isNullOrBlank()) put("uri", uri)
            put("timestamp", timestamp)
        }
    }

    private const val MAX_PER_PACKAGE = 5
    private const val TTL_MS = 30 * 60 * 1000L

    private val byPackage = ConcurrentHashMap<String, ConcurrentLinkedDeque<CapturedContext>>()
    private val recentSelfCommits = ConcurrentLinkedDeque<String>()

    @Volatile
    private var latestGlobalClip: CapturedContext? = null

    @Volatile
    var listener: ((CapturedContext) -> Unit)? = null

    fun recordSelfCommit(text: String) {
        val norm = normalize(text)
        if (norm.length < 4) return
        recentSelfCommits.addFirst(norm)
        while (recentSelfCommits.size > 20) {
            recentSelfCommits.pollLast()
        }
    }

    fun isSelfCommitted(text: String): Boolean {
        val norm = normalize(text)
        return norm.isNotEmpty() && recentSelfCommits.contains(norm)
    }

    fun pushNotification(appPackage: String, senderName: String?, messageText: String) {
        val cleaned = messageText.trim()
        if (cleaned.isEmpty() || isSelfCommitted(cleaned)) return

        val entry = CapturedContext(
            source = "notification",
            text = cleaned,
            senderName = senderName?.trim(),
            appPackage = appPackage
        )

        val deque = byPackage.getOrPut(appPackage) { ConcurrentLinkedDeque() }
        if (deque.peekFirst()?.text == cleaned) return

        deque.addFirst(entry)
        while (deque.size > MAX_PER_PACKAGE) {
            deque.pollLast()
        }

        listener?.invoke(entry)
    }

    fun pushClipboard(text: String, activePackage: String?) {
        val cleaned = text.trim()
        if (cleaned.isEmpty() || isSelfCommitted(cleaned)) return
        if (cleaned.matches(Regex("^https?://\\S+$", RegexOption.IGNORE_CASE))) return
        if (cleaned.matches(Regex("^\\d{4,8}$"))) return

        if (latestGlobalClip?.text == cleaned) return

        val entry = CapturedContext(
            source = "clipboard",
            text = cleaned,
            appPackage = activePackage
        )
        latestGlobalClip = entry
        listener?.invoke(entry)
    }

    fun peekLatestForPackage(appPackage: String?): CapturedContext? {
        val now = System.currentTimeMillis()
        if (!appPackage.isNullOrBlank()) {
            val deque = byPackage[appPackage]
            while (deque != null && deque.isNotEmpty()) {
                val head = deque.peekFirst() ?: break
                if (now - head.timestamp > TTL_MS) {
                    deque.pollFirst()
                } else {
                    return head
                }
            }
        }

        val clip = latestGlobalClip
        if (clip != null && now - clip.timestamp <= 2 * 60 * 1000L) {
            return clip
        }
        return null
    }

    private fun normalize(text: String): String =
        text.lowercase().replace(Regex("\\s+"), " ").trim()
}

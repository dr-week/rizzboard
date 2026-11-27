package com.rizzboard.service.notification

import android.app.Notification
import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.rizzboard.service.store.ContextMemoryStore

/**
 * Stealth incoming-message listener for FLAG_SECURE apps and screenshot-notifying apps.
 */
class RizzNotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (sbn == null) return
        val pkg = sbn.packageName ?: return
        if (pkg == packageName || pkg == "android" || pkg == "com.android.systemui") return

        val notification = sbn.notification ?: return
        val flags = notification.flags
        if ((flags and Notification.FLAG_ONGOING_EVENT) != 0) return
        if ((flags and Notification.FLAG_GROUP_SUMMARY) != 0) return

        val extras = notification.extras ?: return
        val extracted = extractLatestMessage(extras) ?: return

        ContextMemoryStore.pushNotification(
            appPackage = pkg,
            senderName = extracted.first,
            messageText = extracted.second
        )
    }

    private fun extractLatestMessage(extras: Bundle): Pair<String?, String>? {
        val fallbackTitle = extras.getCharSequence(Notification.EXTRA_CONVERSATION_TITLE)?.toString()
            ?: extras.getCharSequence(Notification.EXTRA_TITLE)?.toString()

        val rawMessages = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            extras.getParcelableArray(Notification.EXTRA_MESSAGES, Bundle::class.java)
        } else {
            @Suppress("DEPRECATION")
            extras.getParcelableArray(Notification.EXTRA_MESSAGES)
        }

        if (!rawMessages.isNullOrEmpty()) {
            val lastBundle = rawMessages.lastOrNull() as? Bundle
            if (lastBundle != null) {
                val msgText = lastBundle.getCharSequence("text")?.toString()?.trim()
                val sender = lastBundle.getCharSequence("sender")?.toString()?.trim()
                    ?: fallbackTitle
                if (!msgText.isNullOrEmpty()) {
                    return Pair(sender, msgText)
                }
            }
        }

        val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()?.trim()
        val normalText = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim()
        val body = if (!bigText.isNullOrEmpty()) bigText else normalText

        if (body.isNullOrEmpty()) return null
        return Pair(fallbackTitle, body)
    }

    companion object {
        fun isEnabled(context: Context): Boolean {
            val flat = Settings.Secure.getString(
                context.contentResolver,
                "enabled_notification_listeners"
            ) ?: return false
            val target = ComponentName(context, RizzNotificationListener::class.java).flattenToString()
            return flat.split(":").any { it == target }
        }
    }
}

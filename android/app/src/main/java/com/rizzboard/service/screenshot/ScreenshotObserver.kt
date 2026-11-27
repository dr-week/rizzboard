package com.rizzboard.service.screenshot

import android.content.Context
import android.database.ContentObserver
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore

/**
 * High-performance ContentObserver monitoring MediaStore for freshly captured screenshots.
 * Supports Android 10–15 Scoped Storage (RELATIVE_PATH + IS_PENDING flush completion).
 */
class ScreenshotObserver(
    private val context: Context,
    private val onScreenshotDetected: (uri: Uri, timestamp: Long) -> Unit
) : ContentObserver(Handler(Looper.getMainLooper())) {

    private val handler = Handler(Looper.getMainLooper())
    private var lastHandledUriString: String? = null
    private var lastHandledTimestampMs: Long = 0L

    override fun onChange(selfChange: Boolean, uri: Uri?) {
        super.onChange(selfChange, uri)
        val targetUri = uri ?: MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        inspectMediaUri(targetUri, attempt = 0)
    }

    private fun inspectMediaUri(uri: Uri, attempt: Int) {
        val projection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            arrayOf(
                MediaStore.Images.Media._ID,
                MediaStore.Images.Media.DISPLAY_NAME,
                MediaStore.Images.Media.DATE_ADDED,
                MediaStore.Images.Media.RELATIVE_PATH,
                MediaStore.Images.Media.IS_PENDING
            )
        } else {
            @Suppress("DEPRECATION")
            arrayOf(
                MediaStore.Images.Media._ID,
                MediaStore.Images.Media.DISPLAY_NAME,
                MediaStore.Images.Media.DATE_ADDED,
                MediaStore.Images.Media.DATA
            )
        }

        try {
            context.contentResolver.query(
                uri,
                projection,
                null,
                null,
                "${MediaStore.Images.Media.DATE_ADDED} DESC"
            )?.use { cursor ->
                if (!cursor.moveToFirst()) return

                val idIdx = cursor.getColumnIndex(MediaStore.Images.Media._ID)
                val nameIdx = cursor.getColumnIndex(MediaStore.Images.Media.DISPLAY_NAME)
                val dateIdx = cursor.getColumnIndex(MediaStore.Images.Media.DATE_ADDED)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val pendingIdx = cursor.getColumnIndex(MediaStore.Images.Media.IS_PENDING)
                    val isPending = if (pendingIdx != -1) cursor.getInt(pendingIdx) == 1 else false
                    if (isPending && attempt < 4) {
                        handler.postDelayed({ inspectMediaUri(uri, attempt + 1) }, 220L)
                        return
                    }
                }

                val fileName = if (nameIdx != -1) cursor.getString(nameIdx).orEmpty() else ""
                val dateAddedSec = if (dateIdx != -1) cursor.getLong(dateIdx) else 0L

                val folderPath = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val relIdx = cursor.getColumnIndex(MediaStore.Images.Media.RELATIVE_PATH)
                    if (relIdx != -1) cursor.getString(relIdx).orEmpty() else ""
                } else {
                    @Suppress("DEPRECATION")
                    val dataIdx = cursor.getColumnIndex(MediaStore.Images.Media.DATA)
                    if (dataIdx != -1) cursor.getString(dataIdx).orEmpty() else ""
                }

                val lowerName = fileName.lowercase()
                val lowerPath = folderPath.lowercase()
                val isScreenshot = lowerPath.contains("screenshot") ||
                        lowerName.contains("screenshot") ||
                        lowerName.startsWith("scr_") ||
                        lowerPath.contains("screen_capture")

                if (!isScreenshot) return

                val nowSec = System.currentTimeMillis() / 1000L
                if (dateAddedSec > 0L && (nowSec - dateAddedSec) > 15L) return

                val resolvedUri = if (idIdx != -1 && uri == MediaStore.Images.Media.EXTERNAL_CONTENT_URI) {
                    Uri.withAppendedPath(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                        cursor.getLong(idIdx).toString()
                    )
                } else {
                    uri
                }

                val nowMs = System.currentTimeMillis()
                val resolvedStr = resolvedUri.toString()
                if (resolvedStr == lastHandledUriString || (nowMs - lastHandledTimestampMs) < 600L) {
                    return
                }

                lastHandledUriString = resolvedStr
                lastHandledTimestampMs = nowMs
                onScreenshotDetected(resolvedUri, dateAddedSec)
            }
        } catch (_: SecurityException) {
            // Runtime media permission managed via SettingsActivity
        } catch (_: Exception) {
            // Safeguard against transient ContentProvider exceptions
        }
    }
}

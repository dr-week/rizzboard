package com.rizzboard.service

import android.content.Context
import android.database.ContentObserver
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import org.json.JSONObject

/**
 * High-performance ContentObserver monitoring MediaStore for freshly captured screenshots.
 * Dispatches an event to the keyboard in < 100ms without polling.
 */
class ScreenshotObserver(
    private val context: Context,
    private val onScreenshotDetected: (uri: Uri, timestamp: Long) -> Unit
) : ContentObserver(Handler(Looper.getMainLooper())) {

    private var lastHandledUri: Uri? = null

    override fun onChange(selfChange: Boolean, uri: Uri?) {
        super.onChange(selfChange, uri)
        if (uri == null) return

        // Verify if the newly written item is an image in the Screenshots folder
        val projection = arrayOf(
            MediaStore.Images.Media._ID,
            MediaStore.Images.Media.DISPLAY_NAME,
            MediaStore.Images.Media.DATE_ADDED,
            MediaStore.Images.Media.DATA
        )

        try {
            context.contentResolver.query(
                uri,
                projection,
                null,
                null,
                "${MediaStore.Images.Media.DATE_ADDED} DESC"
            )?.use { cursor ->
                if (cursor.moveToFirst()) {
                    val nameIndex = cursor.getColumnIndex(MediaStore.Images.Media.DISPLAY_NAME)
                    val dataIndex = cursor.getColumnIndex(MediaStore.Images.Media.DATA)
                    val dateIndex = cursor.getColumnIndex(MediaStore.Images.Media.DATE_ADDED)

                    val fileName = if (nameIndex != -1) cursor.getString(nameIndex) ?: "" else ""
                    val filePath = if (dataIndex != -1) cursor.getString(dataIndex) ?: "" else ""
                    val dateAdded = if (dateIndex != -1) cursor.getLong(dateIndex) else 0L

                    val isScreenshot = fileName.lowercase().contains("screenshot") ||
                            filePath.lowercase().contains("screenshots")

                    if (isScreenshot && uri != lastHandledUri) {
                        lastHandledUri = uri
                        onScreenshotDetected(uri, dateAdded)
                    }
                }
            }
        } catch (_: SecurityException) {
            // Permission not yet granted by user
        }
    }
}

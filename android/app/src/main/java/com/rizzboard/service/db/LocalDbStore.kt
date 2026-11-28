package com.rizzboard.service.db

import android.content.Context
import java.io.File

/**
 * Structured offline database store under filesDir/rizzboard-db/.
 * Organizes learned words, custom snippets, and pinned clipboard items
 * into clean JSON files ready for Google Drive backup/sync.
 */
object LocalDbStore {

    private fun dbDir(context: Context, subFolder: String): File {
        return File(context.filesDir, "rizzboard-db/$subFolder").apply {
            if (!exists()) mkdirs()
        }
    }

    fun writeJson(context: Context, subFolder: String, fileName: String, jsonContent: String) {
        val target = File(dbDir(context, subFolder), fileName)
        target.writeText(jsonContent)
    }

    fun readJson(context: Context, subFolder: String, fileName: String): String? {
        val target = File(dbDir(context, subFolder), fileName)
        return if (target.exists()) target.readText() else null
    }
}

package com.rizzboard.service.ota

import android.content.Context
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

/**
 * Over-The-Air (OTA) WebView UI updater.
 * Checks GitHub Pages for newer UI bundles and caches them in filesDir/ota-ui/
 * so keyboard UI, autocorrect, emojis, themes, and AI logic update without APK reinstalls.
 */
object OtaUiUpdater {

    private const val MANIFEST_URL = "https://dr-week.github.io/rizzboard/ota/ui-manifest.json"
    private const val PREFS_NAME = "rizzboard_ota"
    private const val KEY_UI_VERSION = "ui_version"
    private val executor = Executors.newSingleThreadExecutor()

    fun getUiEntryUrl(context: Context): String {
        val otaIndex = File(context.filesDir, "ota-ui/index.html")
        return if (otaIndex.exists() && otaIndex.length() > 100) {
            "file://${otaIndex.absolutePath}"
        } else {
            "file:///android_asset/ui/index.html"
        }
    }

    fun checkForUpdatesAsync(context: Context) {
        val appContext = context.applicationContext
        executor.execute {
            try {
                val manifestRaw = fetchText(MANIFEST_URL) ?: return@execute
                val manifest = JSONObject(manifestRaw)
                val remoteVersion = manifest.optString("version", "")
                if (remoteVersion.isBlank()) return@execute

                val prefs = appContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                val localVersion = prefs.getString(KEY_UI_VERSION, "") ?: ""
                if (remoteVersion == localVersion) return@execute

                val baseUrl = manifest.optString("baseUrl", "https://dr-week.github.io/rizzboard/ota/")
                val files = manifest.optJSONArray("files") ?: return@execute

                val stagingDir = File(appContext.filesDir, "ota-ui-staging")
                if (stagingDir.exists()) stagingDir.deleteRecursively()
                stagingDir.mkdirs()

                for (i in 0 until files.length()) {
                    val relPath = files.getString(i).trimStart('/')
                    val target = File(stagingDir, relPath)
                    target.parentFile?.mkdirs()
                    if (!downloadFile("$baseUrl$relPath", target)) {
                        stagingDir.deleteRecursively()
                        return@execute
                    }
                }

                val liveDir = File(appContext.filesDir, "ota-ui")
                if (liveDir.exists()) liveDir.deleteRecursively()
                if (stagingDir.renameTo(liveDir)) {
                    prefs.edit().putString(KEY_UI_VERSION, remoteVersion).apply()
                }
            } catch (_: Exception) {
                // Silent fallback to bundled assets
            }
        }
    }

    private fun fetchText(urlStr: String): String? {
        val conn = (URL(urlStr).openConnection() as HttpURLConnection).apply {
            connectTimeout = 4000
            readTimeout = 4000
            requestMethod = "GET"
        }
        return try {
            if (conn.responseCode == 200) {
                conn.inputStream.bufferedReader().use { it.readText() }
            } else null
        } finally {
            conn.disconnect()
        }
    }

    private fun downloadFile(urlStr: String, dest: File): Boolean {
        val conn = (URL(urlStr).openConnection() as HttpURLConnection).apply {
            connectTimeout = 6000
            readTimeout = 6000
            requestMethod = "GET"
        }
        return try {
            if (conn.responseCode != 200) return false
            conn.inputStream.use { input ->
                dest.outputStream().use { output ->
                    input.copyTo(output)
                }
            }
            true
        } finally {
            conn.disconnect()
        }
    }
}

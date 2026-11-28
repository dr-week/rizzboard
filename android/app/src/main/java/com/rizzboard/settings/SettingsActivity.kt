package com.rizzboard.settings

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.rizzboard.service.accessibility.RizzAccessibilityService
import com.rizzboard.service.notification.RizzNotificationListener

/**
 * Onboarding & Hybrid Context Control Center.
 * Enables IME activation, runtime MediaStore permissions, Stealth Notification Listener,
 * and Play-Store-compliant Prominent Disclosure for on-demand Accessibility scanning.
 */
class SettingsActivity : AppCompatActivity() {

    private lateinit var imeStatusBadge: TextView
    private lateinit var mediaStatusBadge: TextView
    private lateinit var notifStatusBadge: TextView
    private lateinit var a11yStatusBadge: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        @Suppress("DEPRECATION")
        run {
            window.statusBarColor = Color.parseColor("#121214")
            window.navigationBarColor = Color.parseColor("#121214")
        }

        val scroll = ScrollView(this).apply {
            setBackgroundColor(Color.parseColor("#121214"))
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            val pad = dp(20)
            setPadding(pad, dp(32), pad, pad)
        }

        val title = TextView(this).apply {
            text = "RizzBoard Hybrid Setup"
            setTextColor(Color.parseColor("#F0F0F5"))
            textSize = 24f
            typeface = Typeface.DEFAULT_BOLD
        }
        val subtitle = TextView(this).apply {
            text = "5-tier conversation intelligence — works even on FLAG_SECURE & Snapchat."
            setTextColor(Color.parseColor("#8E8E9A"))
            textSize = 14f
            setPadding(0, dp(6), 0, dp(20))
        }
        container.addView(title)
        container.addView(subtitle)

        // Card 1: Enable & Switch Keyboard
        imeStatusBadge = createBadge()
        container.addView(
            createFeatureCard(
                heading = "1. Activate RizzBoard Keyboard",
                description = "Enable RizzBoard in system keyboards, then select it as your active input method.",
                badge = imeStatusBadge,
                primaryButtonText = "Enable in Settings",
                onPrimaryClick = {
                    startActivity(Intent(Settings.ACTION_INPUT_METHOD_SETTINGS))
                },
                secondaryButtonText = "Switch Keyboard",
                onSecondaryClick = {
                    val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                    imm.showInputMethodPicker()
                }
            )
        )

        // Card 2: Screenshot Observer Permission
        mediaStatusBadge = createBadge()
        container.addView(
            createFeatureCard(
                heading = "2. Instant Screenshot Detection",
                description = "Detects chat screenshots in <100ms for apps that allow screen capture.",
                badge = mediaStatusBadge,
                primaryButtonText = "Grant Media Access",
                onPrimaryClick = { requestMediaPermission() }
            )
        )

        // Card 3: Stealth Notification Listener (FLAG_SECURE & Snapchat)
        notifStatusBadge = createBadge()
        container.addView(
            createFeatureCard(
                heading = "3. Stealth Notification Listener (Recommended)",
                description = "Captures incoming messages on Snapchat, Telegram Secret Chats, Signal & Hinge in ephemeral RAM — zero screenshots or alerts.",
                badge = notifStatusBadge,
                primaryButtonText = "Configure Notification Access",
                onPrimaryClick = {
                    startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
                }
            )
        )

        // Card 4: On-Demand Accessibility Screen Scan
        a11yStatusBadge = createBadge()
        container.addView(
            createFeatureCard(
                heading = "4. On-Demand Screen Bubble Scanner (Optional)",
                description = "Reads visible chat bubbles only when you tap 'Scan Screen' on the keyboard — no screenshots required.",
                badge = a11yStatusBadge,
                primaryButtonText = "Review & Enable Scanner",
                onPrimaryClick = { showAccessibilityDisclosureDialog() }
            )
        )

        // Card 5: In-App Updates (OTA UI + Latest APK)
        val updateBadge = createBadge().apply {
            text = "OTA READY"
            setTextColor(android.graphics.Color.parseColor("#38BDF8"))
        }
        container.addView(
            createFeatureCard(
                heading = "5. In-App Updates (OTA + APK)",
                description = "Pull the latest keyboard UI, autocorrect & AI updates over-the-air, or download the newest signed APK.",
                badge = updateBadge,
                primaryButtonText = "Check OTA UI Update",
                onPrimaryClick = {
                    com.rizzboard.service.ota.OtaUiUpdater.checkForUpdatesAsync(this)
                    android.widget.Toast.makeText(
                        this,
                        "Checking for OTA UI updates...",
                        android.widget.Toast.LENGTH_SHORT
                    ).show()
                },
                secondaryButtonText = "Download Latest APK",
                onSecondaryClick = {
                    startActivity(
                        Intent(
                            Intent.ACTION_VIEW,
                            android.net.Uri.parse("https://dr-week.github.io/rizzboard/")
                        )
                    )
                }
            )
        )

        // Card 6: Live Keyboard Test Box
        val testBox = android.widget.EditText(this).apply {
            hint = "Tap here to test RizzBoard (typing, spacebar, voice, Konkani)..."
            setHintTextColor(android.graphics.Color.parseColor("#64748B"))
            setTextColor(android.graphics.Color.WHITE)
            setBackgroundColor(android.graphics.Color.parseColor("#0F172A"))
            setPadding(32, 28, 32, 28)
            textSize = 14f
        }
        container.addView(testBox)

        scroll.addView(container)
        setContentView(scroll)
    }

    override fun onResume() {
        super.onResume()
        refreshStatuses()
    }

    private fun refreshStatuses() {
        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        val imeEnabled = imm.enabledInputMethodList.any { it.packageName == packageName }
        updateBadge(imeStatusBadge, imeEnabled, if (imeEnabled) "Enabled" else "Required")

        val hasMedia = hasScreenshotPermission()
        updateBadge(mediaStatusBadge, hasMedia, if (hasMedia) "Granted" else "Off")

        val hasNotif = RizzNotificationListener.isEnabled(this)
        updateBadge(notifStatusBadge, hasNotif, if (hasNotif) "Active" else "Off")

        val hasA11y = RizzAccessibilityService.isEnabled(this)
        updateBadge(a11yStatusBadge, hasA11y, if (hasA11y) "Active" else "Optional")
    }

    private fun hasScreenshotPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.READ_MEDIA_IMAGES
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.READ_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED
        }
    }

    private fun requestMediaPermission() {
        val perms = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            arrayOf(
                Manifest.permission.READ_MEDIA_IMAGES,
                Manifest.permission.READ_MEDIA_VISUAL_USER_SELECTED
            )
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            arrayOf(Manifest.permission.READ_MEDIA_IMAGES)
        } else {
            arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE)
        }
        ActivityCompat.requestPermissions(this, perms, 1001)
    }

    private fun showAccessibilityDisclosureDialog() {
        AlertDialog.Builder(this)
            .setTitle("Prominent Disclosure: Screen Bubble Scanner")
            .setMessage(
                "RizzBoard uses the Android AccessibilityService API strictly on-demand when you tap " +
                    "\"Scan Screen\" on the keyboard.\n\n" +
                    "• Reads visible chat text & bubble coordinates to suggest replies on apps that block screenshots.\n" +
                    "• Never monitors keystrokes, passwords, or background activity.\n" +
                    "• Processed transiently in memory and never stored to disk or sold."
            )
            .setPositiveButton("Agree & Open Settings") { _, _ ->
                startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun createBadge(): TextView {
        return TextView(this).apply {
            textSize = 12f
            typeface = Typeface.DEFAULT_BOLD
            setPadding(dp(10), dp(4), dp(10), dp(4))
        }
    }

    private fun updateBadge(badge: TextView, active: Boolean, label: String) {
        badge.text = label
        val bg = GradientDrawable().apply {
            cornerRadius = dp(12).toFloat()
            setColor(if (active) Color.parseColor("#1E3A2F") else Color.parseColor("#2A2A32"))
            setStroke(dp(1), if (active) Color.parseColor("#34D399") else Color.parseColor("#FF4B72"))
        }
        badge.background = bg
        badge.setTextColor(if (active) Color.parseColor("#6EE7B7") else Color.parseColor("#FF85A1"))
    }

    private fun createFeatureCard(
        heading: String,
        description: String,
        badge: TextView,
        primaryButtonText: String,
        onPrimaryClick: () -> Unit,
        secondaryButtonText: String? = null,
        onSecondaryClick: (() -> Unit)? = null
    ): LinearLayout {
        val cardBg = GradientDrawable().apply {
            cornerRadius = dp(14).toFloat()
            setColor(Color.parseColor("#1E1E24"))
            setStroke(dp(1), Color.parseColor("#32323E"))
        }

        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = cardBg
            val pad = dp(16)
            setPadding(pad, pad, pad, pad)
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(14)
            }

            val headerRow = LinearLayout(this@SettingsActivity).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
            }

            val titleView = TextView(this@SettingsActivity).apply {
                text = heading
                setTextColor(Color.parseColor("#F0F0F5"))
                textSize = 16f
                typeface = Typeface.DEFAULT_BOLD
                layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
            }

            headerRow.addView(titleView)
            headerRow.addView(badge)
            addView(headerRow)

            val descView = TextView(this@SettingsActivity).apply {
                text = description
                setTextColor(Color.parseColor("#8E8E9A"))
                textSize = 13f
                setPadding(0, dp(8), 0, dp(12))
            }
            addView(descView)

            val btnRow = LinearLayout(this@SettingsActivity).apply {
                orientation = LinearLayout.HORIZONTAL
            }

            btnRow.addView(createActionButton(primaryButtonText, primary = true, onPrimaryClick))
            if (secondaryButtonText != null && onSecondaryClick != null) {
                val secondaryBtn = createActionButton(secondaryButtonText, primary = false, onSecondaryClick)
                (secondaryBtn.layoutParams as LinearLayout.LayoutParams).leftMargin = dp(10)
                btnRow.addView(secondaryBtn)
            }
            addView(btnRow)
        }
    }

    private fun createActionButton(label: String, primary: Boolean, onClick: () -> Unit): Button {
        val bg = GradientDrawable().apply {
            cornerRadius = dp(10).toFloat()
            setColor(if (primary) Color.parseColor("#FF4B72") else Color.parseColor("#2A2A32"))
        }
        return Button(this).apply {
            text = label
            isAllCaps = false
            textSize = 13f
            setTextColor(Color.WHITE)
            background = bg
            setPadding(dp(14), dp(8), dp(14), dp(8))
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setOnClickListener { onClick() }
        }
    }

    private fun dp(value: Int): Int =
        (value * resources.displayMetrics.density).toInt()
}

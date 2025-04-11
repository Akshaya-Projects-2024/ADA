package com.ada

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ContentResolver
import android.media.AudioAttributes
import android.media.AudioManager  // Add this import
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.net.toUri
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate


class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "ada"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onStart() {
        super.onStart()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val att = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM) // Changed back to ALARM for maximum volume
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setFlags(AudioAttributes.FLAG_AUDIBILITY_ENFORCED)
                .build()

            // Set both notification and alarm volumes to maximum
            val audioManager = getSystemService(AUDIO_SERVICE) as AudioManager
            audioManager.setStreamVolume(
                AudioManager.STREAM_NOTIFICATION,
                audioManager.getStreamMaxVolume(AudioManager.STREAM_NOTIFICATION),
                0
            )
            audioManager.setStreamVolume(
                AudioManager.STREAM_ALARM,
                audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM),
                0
            )

            val channelTypes = listOf(
                "meal", "walking", "running", "training",
                "vaccination", "potty", "custom", "medication","defaultnotification"
            )

            val manager = getSystemService(NotificationManager::class.java)
            
            channelTypes.forEach { type ->
                NotificationChannel(type, "ADA", NotificationManager.IMPORTANCE_MAX).apply {
                    setShowBadge(true)
                    description = ""
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 400, 300, 400)
                    lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                    setImportance(NotificationManager.IMPORTANCE_MAX)
                    enableLights(true)
                    setBypassDnd(true)
                    setVolumeControlStream(AudioManager.STREAM_ALARM) // Use ALARM stream
                    setSound(
                        (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/$type").toUri(),
                        att
                    )
                    manager.createNotificationChannel(this)
                }
            }
        }
    }
}

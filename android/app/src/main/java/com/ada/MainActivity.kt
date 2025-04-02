package com.ada

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ContentResolver
import android.media.AudioAttributes
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
            // MEAL
            val mealChannel = NotificationChannel(
                "meal", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            mealChannel.setShowBadge(true)
            mealChannel.description = ""
            val att = AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build()
            mealChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/meal").toUri(),
                att
            )
            mealChannel.enableVibration(true)
            mealChannel.vibrationPattern = longArrayOf(400, 400)
            mealChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // WALKING
            val walkingChannel = NotificationChannel(
                "walking", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            walkingChannel.setShowBadge(true)
            walkingChannel.description = ""
            walkingChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/walking").toUri(),
                att
            )
            walkingChannel.enableVibration(true)
            walkingChannel.vibrationPattern = longArrayOf(400, 400)
            walkingChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // RUNNING
            val runningChannel = NotificationChannel(
                "running", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            runningChannel.setShowBadge(true)
            runningChannel.description = ""
            runningChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/running").toUri(),
                att
            )
            runningChannel.enableVibration(true)
            runningChannel.vibrationPattern = longArrayOf(400, 400)
            runningChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // TRAINING
            val trainingChannel = NotificationChannel(
                "training", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            trainingChannel.setShowBadge(true)
            trainingChannel.description = ""
            trainingChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/training").toUri(),
                att
            )
            trainingChannel.enableVibration(true)
            trainingChannel.vibrationPattern = longArrayOf(400, 400)
            trainingChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // VACCINATION
            val vaccinationChannel = NotificationChannel(
                "vaccination", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            vaccinationChannel.setShowBadge(true)
            vaccinationChannel.description = ""
            vaccinationChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/vaccination").toUri(),
                att
            )
            vaccinationChannel.enableVibration(true)
            vaccinationChannel.vibrationPattern = longArrayOf(400, 400)
            vaccinationChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // POTTY
            val pottyChannel = NotificationChannel(
                "potty", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            pottyChannel.setShowBadge(true)
            pottyChannel.description = ""
            pottyChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/potty").toUri(),
                att
            )
            pottyChannel.enableVibration(true)
            pottyChannel.vibrationPattern = longArrayOf(400, 400)
            pottyChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // OTHERS
            val customChannel = NotificationChannel(
                "custom", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            customChannel.setShowBadge(true)
            customChannel.description = ""
            customChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/custom").toUri(),
                att
            )
            customChannel.enableVibration(true)
            customChannel.vibrationPattern = longArrayOf(400, 400)
            customChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC

            // MEDICATION
            val medicationChannel = NotificationChannel(
                "medication", "ADA", NotificationManager.IMPORTANCE_HIGH
            )
            medicationChannel.setShowBadge(true)
            medicationChannel.description = ""
            medicationChannel.setSound(
                (ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/medication").toUri(),
                att
            )
            medicationChannel.enableVibration(true)
            medicationChannel.vibrationPattern = longArrayOf(400, 400)
            medicationChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC


            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(mealChannel)
            manager.createNotificationChannel(walkingChannel)
            manager.createNotificationChannel(runningChannel)
            manager.createNotificationChannel(trainingChannel)
            manager.createNotificationChannel(vaccinationChannel)
            manager.createNotificationChannel(pottyChannel)
            manager.createNotificationChannel(customChannel)
            manager.createNotificationChannel(medicationChannel)
        }
    }
}

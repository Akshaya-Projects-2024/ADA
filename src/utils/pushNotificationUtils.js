import messaging from "@react-native-firebase/messaging";
import PushNotification, { Importance } from "react-native-push-notification";
import { config } from "../constants/config";

const getNotificationToken = async () => {
  try {
    let enabled = await messaging().hasPermission();
    if (!enabled) {
      enabled = await messaging().requestPermission();
    }
    const fcmToken = await messaging().getToken();
    return fcmToken;
  } catch (error) {
    return;
  }
};

const deleteFcmToken = async () => {
  try {
    await messaging().deleteToken();
  } catch (error) {
    return;
  }
};

const createNotificationChannel = () => {
  return new Promise(async (res) => {
    PushNotification.channelExists(config.notificationChannelId, (exists) => {
      if (exists) {
        res(true);
      } else {
        PushNotification.createChannel(
          {
            channelId: config.notificationChannelId, // (required)
            channelName: "ADA", // (required)
            channelDescription: "", // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          (created) => {
            if (created) {
              res(true);
            }
          } // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
      res(false);
    });
  });
};

const showNotification = ({ notification, data }) => {
  PushNotification.localNotification({
    channelId: notification?.android?.channelId,
    id: 100,
    autoCancel: true,
    largeIcon: "ic_launcher",
    smallIcon: "ic_launcher",
    bigText: notification?.body ?? "",
    subText: notification?.title ?? "",
    vibrate: true,
    vibration: 1000,
    priority: "high",
    importance: "high",
    data: data,
    title: notification?.title ?? "Notification!",
    message: notification?.body ?? "Notification Received.",
    bigPictureUrl:
      notification?.imageUrl || notification?.android?.imageUrl || "",
    userInfo: data ?? {},
    soundName: notification?.android?.sound, // Update this to match your sound file
    priority: "max",
    importance: "max",
  });
};

export {
  deleteFcmToken,
  getNotificationToken,
  createNotificationChannel,
  showNotification,
};

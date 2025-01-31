/**
 * @format
 */
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import { showNotification } from "./src/utils/pushNotificationUtils";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  if (remoteMessage && remoteMessage?.data) {
    showNotification(remoteMessage);
  }
});

AppRegistry.registerComponent(appName, () => App);

import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, PushNotificationIOS } from "react-native";
import { useEffect } from "react";
import {
  navigate,
  navigateToServiceProvider,
} from "../navigations/rootNavigationRef";
import { showLocalNotification } from "./pushNotificationUtils";
import { useNavigation } from "@react-navigation/native";
import { getLoggedInMoodule } from "./userUtils";
import { LoginModules } from "../constants/enums";
const NotificationConfig = () => {
  const navigation = useNavigation();
  useEffect(() => {
    initializeNotifications();
  }, []);

  const registerAppWithFCM = async () => {
    if (Platform.OS == "ios") {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      await messaging().setAutoInitEnabled(true);
    }
  };

  const registerEvents = async () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {});
    messaging().onMessage(handleForegroundMessage);
    messaging().getInitialNotification().then(handleInitialNotification);
    messaging().onNotificationOpenedApp(handleNotificationOpen);
  };

  const configureNotification = () => {
    return {
      onRegister: function (token) {},
      onNotification: (notification) => {
        if (!notification.data) return;
        const notificationData =
          Platform.OS === "ios" ? notification.data.item : notification.data;

        handleNotification(notificationData);

        if (Platform.OS === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    };
  };

  const initializeNotifications = async () => {
    try {
      await registerAppWithFCM();
      PushNotification.configure(configureNotification());
      registerEvents();
    } catch (error) {
      console.error("Notification initialization error:", error);
    }
  };

  const handleNotification = async (notification) => {
    console.log("foreground", notification);
    if (!notification) return;
    handleNavigation(notification.data);
  };

  const handleForegroundMessage = async (remoteMessage) => {
    showLocalNotification(remoteMessage);
  };

  const handleInitialNotification = async (remoteMessage) => {
    console.log("killed",remoteMessage);
    if (remoteMessage) {
      handleNavigation(remoteMessage.data);
    }
  };

  const handleNotificationOpen = (remoteMessage) => {
    console.log("background");
    handleNavigation(remoteMessage.data);
  };

  const executePostFrame = (callback) => setTimeout(() => callback(), 2000);

  const handleNavigation = async (data) => {
    const loggedInModule = await getLoggedInMoodule();
    const isServiceProvider = loggedInModule === LoginModules.provider;
    const mainRoute = isServiceProvider ? "providerAccount" : "parentAccount";

    if (!data?.value) return;

    switch (data?.value) {
      case "home":
        executePostFrame(() => navigation.navigate("MyProfile"));
        break;
      case "myBookings":
        executePostFrame(() => navigation.navigate("myBookings"));
        break;
      case "petAdoption":
        executePostFrame(() => navigation.navigate("petAdoption"));
        break;
      case "Activity":
        executePostFrame(() => navigation.navigate("actvityTrackerDashboard"));
        break;
      case "lostpet":
      case "medical":
      case "rescue":
        executePostFrame(() => navigation.navigate("alertList"));
        break;
      case "subscription":
        executePostFrame(() =>
          navigation.navigate("paymentsSubscription", { route: "myprofile" })
        );
      default:
        break;
    }
  };

  return <></>;
};

export default NotificationConfig;

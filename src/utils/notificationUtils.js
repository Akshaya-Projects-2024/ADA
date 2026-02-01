import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { Platform, PushNotificationIOS } from "react-native";
import { useEffect } from "react";
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
    handleNavigation(notification);
  };

  const handleForegroundMessage = async (remoteMessage) => {
    showLocalNotification(remoteMessage);
  };

  const handleInitialNotification = async (remoteMessage) => {
    console.log("killed", remoteMessage);
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
    console.log("notification", data);
    const notificationDetails = JSON.parse(data?.data);
    console.log("notificationDetails", data);
    if (!data?.value) return;
    // const params = {
    //   id: item?.id,
    //   userid: await decryptService("userId")
    // };
    // readNotification(params);

    switch (data?.value) {
      case "home":
        executePostFrame(() => navigation.navigate("MyProfile"));
        break;
      case "myBookings":
        executePostFrame(() =>
          navigation.navigate("myBookings", {
            route: mainRoute,
          })
        );
        break;
      case "petAdoption":
        executePostFrame(() =>
          navigation.navigate("auth", {
            screen: "adoptionDetail",
            params: {
              id: data.data.id,
            },
          })
        );
        break;
      case "Activity":
        executePostFrame(() =>
          isServiceProvider
            ? navigation.reset({
                index: 1,
                routes: [
                  { name: "petParentAppStack" },
                  {
                    name: "actvityTrackerDashboard",
                    params: {
                      petId: notificationDetails?.PetId,
                    },
                  },
                ],
              })
            : navigation.navigate("actvityTrackerDashboard", {
                petId: notificationDetails?.PetId,
              })
        );
        break;
      case "rescue":
        executePostFrame(() =>
          props.navigation?.navigate("resuceAlertDetail", {
            id: item.data.id,
          })
        );
        break;
      case "lostpet":
        executePostFrame(() =>
          props.navigation?.navigate("lostAlertDetail", {
            id: item.data.id,
          })
        );
        break;
      case "medical":
        executePostFrame(() =>
          props.navigation?.navigate("medicalAlertDetail", {
            id: item.data.id,
          })
        );
        break;
      case "subscription":
        executePostFrame(() =>
          navigation.navigate("paymentsSubscription", { route: "myprofile" })
        );
        break;
      default:
        break;
    }
  };

  return <></>;
};

export default NotificationConfig;

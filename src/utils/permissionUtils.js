import { Platform } from "react-native";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

const requestLocationPermission = () => {
  return new Promise(async (res) => {
    try {
      const permission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      const granted = await request(permission, {
        title: "Location",
        message: "We require permission to access your location",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      });
      if (granted === RESULTS.GRANTED) {
        res(true);
      } else {
        res(false);
      }
    } catch (err) {
      res(false);
    }
  });
};

const requestNotificationPermission = () => {
  return new Promise(async (res) => {
    try {
      if (Platform.Version >= 33) {
        const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
        const granted = await request(permission, {
          title: "Notification",
          message: "We require permission to push notification",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        });
        if (granted === RESULTS.GRANTED) {
          res(true);
        } else {
          res(false);
        }
      } else {
        res(true);
      }
    } catch (err) {
      res(false);
    }
  });
};
export { requestLocationPermission, requestNotificationPermission };

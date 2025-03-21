import Geolocation from "@react-native-community/geolocation";
import { openSettings } from "react-native-permissions";
import { Alert } from "react-native";
import { requestLocationPermission } from "./permissionUtils";

const getCurrentLocation = () => {
  return new Promise(async (res) => {
    try {
      const locationPermission = await requestLocationPermission();
      if (locationPermission) {
        Geolocation.getCurrentPosition(
          (info) => {
            res(info);
          },
          (err) => {
            res(false);
          },
          // { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
        );
      } else {
        Alert.alert(
          "Permission Required",
          "Location permission is required to access your location.",
          [
            {
              text: "Cancel",
              onPress: () => {
                res(false);
              },
            },
            {
              text: "Open Settings",
              onPress: () => {
                res(false);
                openSettings();
              },
            },
          ]
        );
      }
    } catch (err) {
      res(false);
    }
  });
};

export { getCurrentLocation };

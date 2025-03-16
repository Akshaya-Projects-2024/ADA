import Geolocation from "@react-native-community/geolocation";
import { requestLocationPermission } from "./permissionUtils";
import { openSettings } from "react-native-permissions";
import { Alert } from "react-native";

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
          }
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

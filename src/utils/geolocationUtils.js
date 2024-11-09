import Geolocation from "@react-native-community/geolocation";
import { requestLocationPermission } from "./permissionUtils";

const getCurrentLocation = () => {
  return new Promise(async (res) => {
    try {
      const locationPermission = await requestLocationPermission();
      if (locationPermission) {
        Geolocation.getCurrentPosition((info) => res(info));
      } else {
        throw new Error("Location permission denied");
      }
    } catch (err) {
      res(false);
    }
  });
};

export { getCurrentLocation };

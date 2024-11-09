import { PermissionsAndroid } from "react-native";

const requestLocationPermission = () => {
  return new Promise(async (res) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location",
          message: "We require permission to access your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        res(true);
      } else {
        throw new Error("Location permission denied");
      }
    } catch (err) {
      res(false);
    }
  });
};
export { requestLocationPermission };

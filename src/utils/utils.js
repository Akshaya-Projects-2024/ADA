import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import Strings from "../constants/strings";

const showToast = (type, message) => {
  Toast.show({
    type: type,
    text1: message,
  });
};

const showAlert = (
  title,
  message,
  onOkPressed = () => {},
  onCancelPressed = () => {},
  showCancel = false
) => {
  Alert.alert(title, message, [
    showCancel
      ? {
          text: "Cancel",
          onPress: onCancelPressed,
          style: "cancel",
        }
      : {},
    { text: "OK", onPress: onOkPressed },
  ]);
};

const showPaymentAlert = (okPressed, onCancel = () => {}) => {
  showAlert(Strings.attention, Strings.paymentError, okPressed, onCancel, true);
};

const validObject = (obj) => {
  return !!obj && typeof obj === "object" && Object.keys(obj)?.length > 0;
};

const validArray = (arr) => {
  return (
    !!arr && typeof arr === "object" && Array.isArray(arr) && arr?.length > 0
  );
};

const formatServiceArray = (array) => {
  const newArray = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    newArray.push({ id: element?.code, label: element?.service });
  }
  if (validArray(newArray)) {
    return newArray;
  }
  return [];
};

const formatServiceExperience = (years) => {
  return years ? [{ id: years, label: `${years} Years` }] : [];
};

export {
  showToast,
  validObject,
  validArray,
  formatServiceArray,
  formatServiceExperience,
  showAlert,
  showPaymentAlert,
};

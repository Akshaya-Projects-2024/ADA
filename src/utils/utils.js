import Toast from "react-native-toast-message";

const showToast = (type, message) => {
  Toast.show({
    type: type,
    text1: message,
  });
};
export { showToast };

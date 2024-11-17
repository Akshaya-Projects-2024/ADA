import Toast from "react-native-toast-message";

const showToast = (type, message) => {
  Toast.show({
    type: type,
    text1: message,
  });
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
};

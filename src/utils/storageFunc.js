import * as AsyncStorage from '@react-native-async-storage/async-storage';

export const encryptService = async (key, value) => {
  await AsyncStorage.default.setItem(key, JSON.stringify(value));
};

export const decryptService = async (key) => {
  const data = await AsyncStorage.default.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return false;
    }
  } else {
    return '';
  }
};

export const clearStorage = async () => {
  await AsyncStorage.default
    .getAllKeys()
    .then(AsyncStorage.default.multiRemove);
};

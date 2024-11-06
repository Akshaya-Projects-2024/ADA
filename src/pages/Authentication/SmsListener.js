import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';

export const requestSmsPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return false;
};

export const startSmsListener = (setOtp) => {
  SmsListener.addListener(message => {
    console.log("ess",message)
    const otpMatch = message.body.match(/\b\d{6}\b/);
    console.log("ess",otpMatch)
    if (otpMatch) {
      setOtp(otpMatch);
    }
  });
};

export const removeSmsListener = () => {
  SmsListener.removeAllListeners();
};

import React from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {
  check,
  checkMultiple,
  openSettings,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {moderateScale} from 'react-native-size-matters';
import ClipboardPaste from '../assets/svg/clipboardPaste.svg';
import {THEMES} from '../assets/theme/themes';
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const UploadImageModal = props => {
  const {isVisible, onClose, handleSelectedImage, mediaType} = props;
  const options = {
    width: 1000,
    height: 1000,
    cropping: true,
    includeBase64: true,
    useFrontCamera: false,
    freeStyleCropEnabled: true,
    mediaType:'photo',
    showCropGuidelines: false,
    showCropFrame: false,
    compressImageMaxWidth: 500,
    compressImageMaxHeight: 500,
  };

  const checkCameraPermission = async () => {
    const permissionGrant = Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    });
    checkMultiple([permissionGrant]).then(status => {
      if (
        status[permissionGrant] == RESULTS.UNAVAILABLE ||
        status[permissionGrant] == RESULTS.DENIED
      ) {
        requestMultiple([permissionGrant]).then(() => {
          selectFromCamera();
        });
      } else if (status[permissionGrant] == RESULTS.BLOCKED) {
        if (Platform.OS == 'ios') {
          Alert.alert(
            '',
            'Allow camera and gallery permission',
            [
              {
                text: "Don't Allow",
              },
              {text: 'Allow', style: 'cancel', onPress: () => openSettings()},
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            //   "StoriBoard",
            '',
            'Allow camera and gallery permission',
            [
              {
                text: "Don't Allow",
              },
              {
                text: 'Allow',
                style: 'cancel',
                onPress: () => openSettings(),
              },
            ],
            {cancelable: false},
          );
        }
        return false;
      } else {
        selectFromCamera();
      }
    });
  };

  const checkGalleryPermission = async () => {
    const permissionGallery = Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    });
    checkMultiple([permissionGallery]).then(status => {
      if (
        status[permissionGallery] == RESULTS.UNAVAILABLE ||
        status[permissionGallery] == RESULTS.DENIED
      ) {
        requestMultiple([permissionGallery]).then(() => {
          selectFromGallery();
        });
      } else if (status[permissionGallery] == RESULTS.BLOCKED) {
        if (Platform.OS == 'ios') {
          Alert.alert(
            '',
            'Allow camera and gallery permission',
            [
              {
                text: "Don't Allow",
              },
              {text: 'Allow', style: 'cancel', onPress: () => openSettings()},
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            //   "StoriBoard",
            '',
            'Allow camera and gallery permission',
            [
              {
                text: "Don't Allow",
              },
              {
                text: 'Allow',
                style: 'cancel',
                onPress: () => openSettings(),
              },
            ],
            {cancelable: false},
          );
        }
        return false;
      } else {
        selectFromGallery();
      }
    });
  };

  const selectFromCamera = () => {
    selectImageFromCamera();
  };

  const selectFromGallery = () => {
    selectImageFromGallery();
  };

  const selectImageFromCamera = async () => {
    try {
      ImagePicker.openCamera(options).then(response => {
        const {path, mime, data} = response;
        const obj = {
          uri: path,
          fileData: data,
          fileName: 'image.png',
          type: mime,
        };
        onClose();
        handleSelectedImage(obj);
      });
    } catch (err) {}
  };

  const selectImageFromGallery = async () => {
    ImagePicker.openPicker(options).then(response => {
      const {path, mime, data} = response;
      const obj = {
        uri: path,
        fileData: data,
        fileName: 'image.png',
        type: mime,
      };
      onClose();
      handleSelectedImage(obj);
    });
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={() => onClose(false)}
      style={{margin: 0, flex: 1, justifyContent: 'flex-end'}}>
      <View
        style={{
          elevation: 5,
          borderTopWidth: 1,
          borderTopColor: 'transparent',
          width: '100%',
          margin: 0,
          borderTopLeftRadius: 12,
          backgroundColor: '#fff',
          shadowColor: '#000',
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{
            paddingTop: moderateScale(30),
            fontSize: moderateScale(12),
            textAlign: 'center',
            fontFamily: THEMES.fontFamily.medium,
            color: THEMES.colors.black,
          }}>
          Please upload photo
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: moderateScale(40),
          }}>
          <TouchableOpacity
            style={{
              width: '50%',
              alignItems: 'center',
              borderRightWidth: 0.3,
              justifyContent: 'center',
              borderRightColor: '#C7C7C7',
            }}
            onPress={() => checkCameraPermission()}>
            <Feather name="camera" size={25} color={"#000"}/>
            <Text
              style={{
                padding: 0,
                fontFamily: THEMES.fontFamily.medium,
                color: THEMES.colors.black,
                fontSize: moderateScale(12),
                paddingTop: moderateScale(10),
              }}>
              Open Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '50%',
              alignItems: 'center',
              borderRightWidth: 0.3,
              justifyContent: 'center',
              borderRightColor: '#C7C7C7',
            }}
            onPress={() => checkGalleryPermission()}>
               <MaterialIcons name="photo" size={25} color={"#000"}/>
            <Text
              style={{
                padding: 0,
                fontFamily: THEMES.fontFamily.medium,
                color: THEMES.colors.black,
                fontSize: moderateScale(12),
                paddingTop: moderateScale(10),
              }}>
              Open Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UploadImageModal;

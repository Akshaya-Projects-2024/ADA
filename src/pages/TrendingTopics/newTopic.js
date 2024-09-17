import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../utils/strings";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import UploadImageModal from "../../components/UploadImageModal";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import Button from "../../components/Button";

const NewTopic = () => {
  const [visible, setVisible] = useState(false);
  const [photo, setPhoto] = useState();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        showBack
        title={Strings.newTopic}
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />
      <View style={styles.mainView}>
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <InputField
            label={Strings.subject}
            placeholderText={Strings.pleaseEnterSubject}
          />
          <>
            <View style={styles.logoBoxView}>
              {photo ? (
                <>
                  <Text
                    style={[styles.emptyText, { margin: moderateScale(10) }]}
                  >
                    {Strings.uploadCoverImg}
                  </Text>
                  <View style={styles.row}>
                    <View style={styles.logoImgView}>
                      <Image
                        style={styles.logoImg}
                        resizeMode="contain"
                        source={getBase64Obj(
                          photo?.filepath ?? photo?.fileData
                        )}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setPhoto();
                        }}
                        style={styles.crossView}
                      >
                        <CrossCircle
                          stroke={THEMES.colors.black}
                          style={styles.crossImg}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      disabled={photo ? true : false}
                      onPress={() => setVisible(true)}
                      style={{
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font14,
                        color: photo
                          ? THEMES.colors.silver
                          : THEMES.colors.cyan,
                      }}
                    >
                      {Strings.browse}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.emptyView}>
                  <View>
                    <Text style={styles.emptyText}>
                      {Strings.uploadCoverImg}
                    </Text>
                    <Text
                      style={[
                        styles.emptyText,
                        {
                          paddingTop: moderateScale(5),
                          fontSize: THEMES.fonts.font12,
                          color: THEMES.colors.silver,
                        },
                      ]}
                    >
                      {Strings.selectImg}
                    </Text>
                  </View>

                  <Text
                    onPress={() => setVisible(true)}
                    style={Strings.browseText}
                  >
                    {Strings.browse}
                  </Text>
                </View>
              )}
            </View>
          </>
          <View style={{ paddingTop: moderateScale(16) }}>
            <InputField
              label={Strings.writeBlog}
              placeholderText={Strings.writeHere}
              multiline
            />
          </View>
        </ScrollView>
        <UploadImageModal
          isVisible={visible}
          onClose={() => setVisible(false)}
          handleSelectedImage={(image) => setPhoto(image)}
        />
      </View>
      {!isKeyboardVisible && (
        <View style={styles.submitButton}>
          <Button title={Strings.submit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  contentView: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(25),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(15),
  },
  mainView: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(25),
  },
  logoBoxView: {
    marginTop: moderateScale(16),
    borderWidth: 1,
    borderColor: THEMES.colors.iron,
    borderRadius: 8,
    backgroundColor: THEMES.colors.white,
  },
  logoImgView: {
    width: 60,
    height: 60,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    marginBottom: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEMES.colors.darkGrey,
  },
  crossView: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    left: 5,
    bottom: 5,
  },
  crossImg: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  emptyView: {
    width: "100%",
    padding: moderateScale(10),
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyText: {
    color: THEMES.colors.darkGrey,
    fontSize: THEMES.fonts.font10,
    fontFamily: THEMES.fontFamily.medium,
  },
  submitButton: {
    marginHorizontal: moderateScale(27),
    marginBottom: moderateScale(22),
  },
  browseText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.cyan,
  },
});

export default NewTopic;

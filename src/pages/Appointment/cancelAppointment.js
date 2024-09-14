import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, Keyboard } from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const CancelAppointment = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
        title={Strings.cancelAppointment}
        showBack
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />

      <View style={styles.mainView}>
        <InputField
          label={""}
          placeholderText={Strings.writeAMessage}
          multiline={true}
        />
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button
              title={Strings.cancelAppointment}
              bgColor={THEMES.colors.crimsonRed}
            />
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  mainView: {
    flex: 1,
    paddingTop: moderateScale(50),
    paddingHorizontal: moderateScale(27),
  },
  submitButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    marginBottom: moderateScale(20),
  },
});

export default CancelAppointment;

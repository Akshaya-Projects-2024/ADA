import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { showToast } from "../../utils/utils";
import { cancelAppointment } from "../../redux-store/actions/auth";
import { contextValue } from "../../components/Loader";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const CancelAppointment = ({ navigation, route }) => {
  const selectedItem = route?.params?.selectedItem;
  const requestedby = route?.params?.requestedby ?? "provider";
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [reason, setReason] = useState("");

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

  const onCancel = async () => {
    try {
      contextValue?.setLoader(true);
      if (!reason) {
        throw new Error("Please provide valid reason");
      } else {
        const params = {
          appointment_id: selectedItem?.appointment_id,
          parent_id: selectedItem?.parentdetails?.userid,
          provider_id: selectedItem?.provider_id,
          notes: reason,
          requestedby,
          modifiedName:
            requestedby === "provider"
              ? selectedItem?.providername
              : selectedItem?.parentdetails?.name,
        };
        const res = await cancelAppointment(params);
        if (res?.status === 200) {
          navigation.goBack();
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            value={reason}
            onChange={setReason}
          />
          {!isKeyboardVisible && (
            <View style={styles.submitButton}>
              <Button
                onPress={onCancel}
                title={Strings.cancelAppointment}
                bgColor={THEMES.colors.crimsonRed}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
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
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: THEMES.colors.cyan,
    borderWidth: 1,
  },
});

export default CancelAppointment;

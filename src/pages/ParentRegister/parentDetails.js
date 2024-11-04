import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import Strings from "../../constants/strings";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import ModalDropdown from "../../components/ModalDropdown";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Stepper from "../../components/Stepper";
import Icon from "react-native-vector-icons/MaterialIcons";
import User from "../../assets/svg/user.svg";
import Pencil from "../../assets/svg/pencil.svg";
import Location from "../../assets/svg/location.svg";

const ParentDetails = (props) => {
  const route = props?.route?.params?.route;
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
      <Header title={"Parent details"} showBack bgColor="transparent" />
      {route !== "parentAccount" && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#B8B8B8",
            borderBottomColor: "#B8B8B8",
            borderBottomWidth: 1,
            backgroundColor: "#fff",
          }}
        >
          <Stepper currentStep={1} totalSteps={2} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ alignSelf: "center", paddingTop: moderateScale(32) }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#ddd",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User />
            </View>
            {/* Edit Icon */}
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                backgroundColor: "#00ACC1",
                borderRadius: 20,
                padding: 5,
              }}
            >
              <Pencil />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: "center",
              paddingTop: moderateScale(32),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"Parent Name*"}
              placeholderText={"Enter parent name"}
            />
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={"About Parent*"}
                placeholderText={"Enter description"}
                multiline
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={"Mobile number*"}
                placeholderText={"Enter mobile number"}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={"Email ID*"}
                placeholderText={"Enter email id"}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={"Address"}
                placeholderText={"Enter your address"}
                multiline
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={"Address"}
                placeholderText={"Enter your address"}
                multiline
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.location}
                placeholderText={Strings.enterLocation}
                rightIcon={<Location stroke={THEMES.colors.darkGrey} />}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={"ZIP/Postal code"}
                placeholderText={"Enter zip or postal code"}
              />
            </View>
            <View
              style={{
                paddingTop: moderateScale(16),
                paddingBottom: moderateScale(24),
              }}
            >
              <Button
                title="Next"
                onPress={() => props.navigation.navigate("petDetail")}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  submitButton: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(22),
  },
});

export default ParentDetails;

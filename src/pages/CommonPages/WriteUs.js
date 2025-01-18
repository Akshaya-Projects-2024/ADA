import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import Back from "../../assets/svg/back.svg";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import Whatsup from "../../assets/svg/whatsup.svg";
import Mail from "../../assets/svg/mail.svg";
import ClipBoard from "../../assets/svg/clipboardPen.svg";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

const WriteUs = (props) => {
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={"Write to us"}
        showBack
        bgColor="transparent"
        fontColor="#000"
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: moderateScale(27),
          paddingTop: moderateScale(20),
        }}
      >
        <Text
          style={{
            fontFamily: THEMES.fontFamily.medium,
            color: "#707070",
            fontSize: THEMES.fonts.font14,
            lineHeight: moderateScale(20),
          }}
        >
          Kindy let us know of any enquiries you might have. We’ll try to solve
          them as soon as possible.
        </Text>
        <View style={{ paddingTop: moderateScale(18) }}>
          <InputField
            label={"Enquiry Description*"}
            placeholderText={"Enter description"}
            multiline
          />
        </View>
        <View style={{ paddingTop: moderateScale(18) }}>
          <InputField
            label={"Contact Information*"}
            placeholderText={"Enter number"}
            maxLength={10}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={{ padding: moderateScale(20) }}>
        <Button title="Submit"></Button>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default WriteUs;

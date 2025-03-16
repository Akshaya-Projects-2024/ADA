import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert
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
import { SafeAreaView } from "react-native-safe-area-context";
import { getContactDetails } from "../../redux-store/actions/commonApis";

const ContactPage = (props) => {
  const [mobileNo, setMobileNo] = useState()

  useEffect(() => {
    getContactApi();
  }, []);

  const getContactApi = async () => {
    let res = await getContactDetails();
    if (Boolean(res)) {
      setMobileNo(res?.mobilenumber)
    }
  };

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${`+91${mobileNo}`}&text=${encodeURIComponent("Hello, how can I help you?")}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("WhatsApp is not installed on your device.");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={"Contact Us"}
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
          We’d love to hear from you! Whether you have a suggestion on our
          improvement, a complain to discuss or an issue to solve, reach out to
          us!
        </Text>
        <View
          style={{
            paddingTop: moderateScale(13),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={()=>openWhatsApp()}
            style={{
              width: "45%",
              height: 150,
              borderWidth: 2,
              borderColor: "#AAA",
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: "#32D851",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Whatsup />
            </View>
            <Text
              style={{
                color: "#000",
                fontSize: THEMES.fonts.font14,
                fontFamily: THEMES.fontFamily.semiBold,
                paddingHorizontal: moderateScale(15),
                paddingTop: moderateScale(10),
              }}
            >
              Chat with us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("writeUs")}
            style={{
              width: "45%",
              height: 150,
              borderWidth: 2,
              borderColor: "#AAA",
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: "#FF6437",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mail />
            </View>
            <Text
              style={{
                color: "#000",
                fontSize: THEMES.fonts.font14,
                fontFamily: THEMES.fontFamily.semiBold,
                paddingHorizontal: moderateScale(15),
                paddingTop: moderateScale(10),
              }}
            >
              Write to us
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingTop: moderateScale(13) }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("feedback")}
            style={{
              width: "100%",
              height: 90,
              borderWidth: 2,
              borderColor: "#AAA",
              borderRadius: 15,
              backgroundColor: "#fff",
              paddingHorizontal: moderateScale(20),
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                backgroundColor: "#00BBC8",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClipBoard />
            </View>
            <Text
              style={{
                color: "#000",
                fontSize: THEMES.fonts.font14,
                fontFamily: THEMES.fontFamily.semiBold,
                paddingHorizontal: moderateScale(15),
              }}
            >
              Feedback
            </Text>
          </TouchableOpacity>
        </View>
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
});

export default ContactPage;

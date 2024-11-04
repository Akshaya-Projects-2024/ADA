import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Checked from "../../assets/svg/checked.svg";
import UnChecked from "../../assets/svg/unchecked.svg";

import { moderateScale } from "react-native-size-matters";
import Button from "../../components/Button";

const EmergencyAlert = (props) => {
  const [agree, setAgree] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title="Create Emergency Alert" fontColor="#000" showBack />
      <ScrollView style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
        <View
          style={{
            flex: 1,
            paddingTop: moderateScale(30),
            paddingHorizontal: moderateScale(20),
          }}
        >
          <Text
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font12,
              color: THEMES.colors.black,
            }}
          >
            Select alert type
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: moderateScale(11),
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => props.navigation.navigate("medicalHelp")}
            >
              <Image
                resizeMode="contain"
                style={{ width: 90, height: 90, borderRadius: 10 }}
                source={require("../../assets/images/rescue.png")}
              />
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font12,
                  color: THEMES.colors.black,
                  paddingTop: moderateScale(5),
                }}
              >
                Rescue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => props.navigation.navigate("lostPetAlert")}
            >
              <Image
                resizeMode="contain"
                source={require("../../assets/images/lost.png")}
              />
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font12,
                  color: THEMES.colors.black,
                  paddingTop: moderateScale(5),
                }}
              >
                Lost pet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => props.navigation.navigate("medicalHelp")}
            >
              <Image
                resizeMode="contain"
                source={require("../../assets/images/medical.png")}
              />
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font12,
                  color: THEMES.colors.black,
                  paddingTop: moderateScale(5),
                }}
              >
                Medical
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingTop: moderateScale(30) }}>
            <Text
              style={{
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font12,
                color: THEMES.colors.black,
              }}
            >
              For whom we are creating alert
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: moderateScale(20),
            }}
          >
            <View
              style={{
                alignItems: "center",
                width: "50%",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: 90, height: 90, borderRadius: 10 }}
                source={require("../../assets/images/rescue.png")}
              />
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font12,
                  color: THEMES.colors.black,
                  paddingTop: moderateScale(5),
                  textAlign: "center",
                }}
              >
                Create Alert for rockey
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("otherPet")}
              style={{
                alignItems: "center",
                width: "50%",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: 90, height: 90, borderRadius: 10 }}
                source={require("../../assets/images/rescue.png")}
              />
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font12,
                  color: THEMES.colors.black,
                  paddingTop: moderateScale(5),
                  width: "80%",
                  textAlign: "center",
                }}
              >
                Other pet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          bottom: 0,
          paddingVertical: 10,
          backgroundColor: THEMES.colors.bgColor,
          paddingHorizontal: moderateScale(30),
        }}
      >
        <View
          style={{
            paddingTop: moderateScale(16),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UnChecked />
          <Text
            style={{
              paddingLeft: moderateScale(8),
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font12,
              color: THEMES.colors.black,
            }}
          >
            Agree terms and conditions
          </Text>
          {/* <CheckBox
            checkedImage={<Checked />}
            unCheckedImage={<UnChecked />}
            onClick={() => setAgree(!agree)}
            isChecked={agree}
            style={{ flex: 1 }}
            rightTextStyle={{
              color: THEMES.colors.black,
              fontSize: THEMES.fonts.font12,
              fontFamily: THEMES.fontFamily.semiBold,
            }}
            rightText={"Agree terms and conditions"}
          /> */}
        </View>
        <View style={{ paddingVertical: moderateScale(20) }}>
          <Button title="Submit"></Button>
        </View>
      </View>
    </View>
  );
};

export default EmergencyAlert;

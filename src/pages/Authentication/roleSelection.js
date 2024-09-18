import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Header from "../../components/Header";
import Tick from "../../assets/svg/check-circle.svg";
import Button from "../../components/Button";
import Strings from "../../utils/strings";

const RoleSelection = (props) => {
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title={""} showBack bgColor="transparent" />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: moderateScale(127),
        }}
      >
        <Text
          style={{
            color: THEMES.colors.black,
            fontFamily: THEMES.fontFamily.bold,
            fontSize: THEMES.fonts.font20,
            textAlign: "center",
            paddingHorizontal: moderateScale(45),
          }}
        >
          🐾 Selection of Roles 🐾
        </Text>
        <Text
          style={{
            color: THEMES.colors.black,
            fontFamily: THEMES.fontFamily.regular,
            fontSize: THEMES.fonts.font16,
            textAlign: "center",
            paddingTop: moderateScale(25),
            paddingHorizontal: moderateScale(45),
          }}
        >
          Choose your role and
        </Text>
        <Text
          style={{
            color: THEMES.colors.black,
            fontFamily: THEMES.fontFamily.regular,
            fontSize: THEMES.fonts.font16,
            textAlign: "center",
            paddingTop: moderateScale(2),
            paddingHorizontal: moderateScale(45),
          }}
        >
          start your adventure!
        </Text>
        <View
          style={{
            paddingTop: moderateScale(45),
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => setSelected("parent")}
          >
            <Image
              style={{
                width: 112,
                height: 112,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#CFD3D4",
              }}
              source={require("../../assets/images/profileImg.png")}
            />
            {selected == "parent" && (
              <>
                <View
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: 10,
                    backgroundColor: "#0b7e5a",
                    opacity: 0.7,
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <View
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: 10,
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tick />
                </View>
              </>
            )}

            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.medium,
                fontSize: THEMES.fonts.font12,
                textAlign: "center",
                paddingTop: moderateScale(20),
              }}
            >
              Pet Parent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected("service")}
            style={{ marginLeft: moderateScale(43), alignItems: "center" }}
          >
            <Image
              style={{
                width: 112,
                height: 112,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#CFD3D4",
              }}
              source={require("../../assets/images/profileImg.png")}
            />

            {selected == "service" && (
              <>
                <View
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: 10,
                    backgroundColor: "#0b7e5a",
                    opacity: 0.7,
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <View
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: 10,
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tick />
                </View>
              </>
            )}

            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.medium,
                fontSize: THEMES.fonts.font12,
                textAlign: "center",
                paddingTop: moderateScale(20),
              }}
            >
              Pet Service Provider
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ bottom: 0, paddingHorizontal: moderateScale(24), position:'absolute', bottom:0, width:'100%' }}>
        <Button
          onPress={() => props.navigation.navigate("home")}
          title={Strings.submit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.white,
  },
});

export default RoleSelection;

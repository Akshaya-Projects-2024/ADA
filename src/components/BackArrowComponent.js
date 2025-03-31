import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { goBack } from "../navigations/rootNavigationRef";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";

const BackArrowComponent = () => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: "white",
          width: moderateScale(30),
          height: moderateScale(30),
          borderRadius: moderateScale(30) / 2,
          alignItems: "center",
          justifyContent: "center",
          elevation: 20,
          position: "absolute",
          top: moderateScale(15),
          left: moderateScale(15),
          zIndex: 1000,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          paddingRight: 3,
        },
      ]}
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 50,
        right: 50,
      }}
      onPress={goBack}
    >
      <MaterialIcon
        name="keyboard-arrow-left"
        size={moderateScale(24)}
        color={THEMES.colors.black}
      />
    </TouchableOpacity>
  );
};

export default BackArrowComponent;

const styles = StyleSheet.create({});

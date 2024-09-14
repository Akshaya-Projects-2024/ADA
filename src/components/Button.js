import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";

const Button = (props) => {
  const { title, onlyBorder, onPress, bgColor } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btnStyle,
        {
          backgroundColor: bgColor
            ? bgColor
            : onlyBorder
            ? THEMES.colors.white
            : THEMES.colors.cyan,
          borderColor: onlyBorder ? THEMES.colors.cyan : null,
          borderWidth: onlyBorder ? 1.5 : 0,
        },
      ]}
    >
      <Text
        style={[
          styles.textStyle,
          {
            color: onlyBorder ? THEMES.colors.cyan : THEMES.colors.white,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    borderBottomLeftRadius: moderateScale(0),
    alignItems: "center",
  },
  textStyle: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.bold,
    lineHeight: moderateScale(24),
  },
});

export default Button;

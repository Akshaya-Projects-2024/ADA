import { StyleSheet, Text } from "react-native";
import React, { useMemo } from "react";
import { ms } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";
import LinearGradient from "react-native-linear-gradient";

const backgroundColor = [
  ["rgba(254, 208, 252, 0.4)", "rgba(250, 208, 200, 0.4)"],
  ["#F8D7E3", "#ACEBE9"],
  ["#f8dfef", "#ffc0c3"],
  ["#FFE7CD", "#FCB9A2"],
  ["rgba(254, 208, 252, 0.4)", "rgba(250, 208, 200, 0.4)"],
  ["rgba(246, 191, 233, 0.4)", "rgba(162, 140, 209, 0.4)"],
  ["#f8dfef", "#FBC7BD"],
  ["rgba(255, 229, 204, 0.4)", "rgba(161, 234, 154, 0.4)"],
  ["#FFE5CC", "#A1EA9A"],
  ["#E8F6EF", "#FFD3B6"],
  ["#FFDFD3", "#96E6B3"],
  ["#FFE2E2", "#B5EAD7"],
  ["#C7CEEA", "#FFDAC1"],
  ["#E2F0CB", "#FFCAD4"],
  ["#F0EFEB", "#B7E4C7"],
  ["#D4E4BC", "#FEC8D8"],
  ["#DBCDF0", "#F2C6DE"],
  ["#E7BEE3", "#C9E4DE"],
  ["#F1C0E8", "#CFBAF0"],
  ["#A3C4F3", "#F1C0E8"],
];

const ProfileInitial = ({ name, style = {}, textStyle = {} }) => {
  // Optimize initial generation and color selection using useMemo
  const { initials, gradientColors } = useMemo(() => {
    const nameArr = name?.split(" ") || [];
    const initial = nameArr.map((item) => item?.[0] || "").slice(0, 2);
    return {
      initials: initial.join(""),
      gradientColors: backgroundColor[Math.floor(Math.random() * backgroundColor.length)]
    };
  }, [name]);

  // Move styles to StyleSheet
  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.gradient, style]}
    >
      <Text style={[styles.text, textStyle]}>
        {initials}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: ms(55),
    height: ms(55),
    borderRadius: ms(27.5),
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: ms(16),
    color: THEMES.colors.black,
  }
});

export default React.memo(ProfileInitial);

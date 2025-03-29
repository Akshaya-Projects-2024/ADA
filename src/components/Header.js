import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { THEMES } from "../assets/theme/themes";
import Back from "../assets/svg/back.svg";
import ArrowLeft from "../assets/svg/arrowLeft.svg";
import Filter from "../assets/svg/listFilter.svg";
import Search from "../assets/svg/search.svg";
import { goBack } from "../navigations/rootNavigationRef";
import { moderateScale } from "react-native-size-matters";

const Header = (props) => {
  const {
    showBack,
    title,
    showFullArrow,
    showFilter,
    showSearch,
    fontColor,
    bgColor,
    customIcon,
    right,
    onBackPress,
    arrowColor,
    noBack,
  } = props;
  const isRightPanelPresent = showFilter || showSearch || right;
  const widthStyle = isRightPanelPresent ? { width: "20%" } : {};
  return (
    <View
      style={[
        styles.headerContent,
        {
          backgroundColor: bgColor ? bgColor : THEMES.colors.bgColor,
        },
      ]}
    >
      {noBack ? (
        <TouchableOpacity style={widthStyle}></TouchableOpacity>
      ) : customIcon ? (
        <View style={widthStyle}>{customIcon}</View>
      ) : (
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          onPress={() => (onBackPress ? onBackPress() : goBack())}
          style={widthStyle}
        >
          {showBack ? (
            <Back stroke={arrowColor ? arrowColor : "#000"} />
          ) : showFullArrow ? (
            <ArrowLeft stroke={arrowColor ? arrowColor : "#000"} />
          ) : (
            customIcon
          )}
        </TouchableOpacity>
      )}

      <View
        style={{
          width: isRightPanelPresent ? "60%" : "80%",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            styles.title,
            {
              color: fontColor ? fontColor : THEMES.colors.bottomBarGreen,
              alignSelf: "center",
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={[widthStyle, {alignItems:'flex-end'}]}>
        {showFilter ? <Filter /> : showSearch ? <Search /> : null}
        {right}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(15),
  },
  title: {
    fontSize: moderateScale(THEMES.fonts.font16),
    fontFamily: THEMES.fontFamily.bold,
  },
});

export default Header;

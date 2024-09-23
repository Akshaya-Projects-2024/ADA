import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
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
    onSearchPress,
  } = props;
  return (
    <View
      style={[
        styles.headerContent,
        {
          backgroundColor: bgColor ? bgColor : THEMES.colors.bgColor,
        },
      ]}
    >
      <TouchableOpacity
        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
        onPress={() => goBack()}
      >
        {showBack ? <Back /> : showFullArrow ? <ArrowLeft /> : customIcon}
      </TouchableOpacity>
      <View>
        <Text
          style={[
            styles.title,
            {
              color: fontColor ? fontColor : THEMES.colors.bottomBarGreen,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <View>
        {showFilter ? (
          <Filter />
        ) : showSearch ? (
          <Pressable onPress={onSearchPress}>
            <Search />
          </Pressable>
        ) : null}
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

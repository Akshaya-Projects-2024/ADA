import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Filter from "../../assets/svg/listFilter.svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";
import Header from "../../components/Header";
import FilterModal from "../../components/FilterModal";
import { moderateScale } from "react-native-size-matters";

const Chat = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.appointments} showBack bgColor="transparent" />
      <Text>hello</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  mainView: {
    flex: 1,
    paddingTop: moderateScale(30),
    paddingHorizontal: moderateScale(20),
  },
  flatlistView: {
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: moderateScale(10),
    paddingVertical: moderateScale(2),
  },
  flatlistContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
  },
  flatListRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatListImgView: {
    width: 55,
    height: 55,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  filterModalItem: { color: "black" },
  flatListNameRow: {
    flexDirection: "row",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: THEMES.fonts.font14,
    lineHeight: 24,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font10,
    color: "#323232",
    fontFamily: THEMES.fontFamily.regular,
  },
  visitTypeText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  statusConfmText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  statusCancleText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  statusText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.bold,
  },
  filterOption: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    backgroundColor: THEMES.colors.white,
  },
  selectedFilterOption: {
    backgroundColor: "#d3d3d3",
  },
  filterOptionText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular
  },
  selectedFilterText: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
  },
});

export default Chat;

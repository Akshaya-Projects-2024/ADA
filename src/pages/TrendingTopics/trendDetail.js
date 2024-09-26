import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale, s } from "react-native-size-matters";
import Back from "../../assets/svg/back.svg";
import Share from "../../assets/svg/share.svg";
import Button from "../../components/Button";

const TrendDetail = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imgStyle}>
          <Image
            style={styles.imgStyle}
            source={require("../../assets/images/trend.png")}
          />
        </View>
        <View style={styles.headerView}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            onPress={() => props.navigation.goBack()}
          >
            <Back stroke="#000"/>
          </TouchableOpacity>

          <Share />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.timeText}>8 min read</Text>
          <View style={{ paddingTop: moderateScale(4) }}>
            <Text style={styles.titleText}>
              How Long You Should Be Walking Your Dog Based on Their Breed
            </Text>
          </View>
          <View style={styles.profileView}>
            <View style={styles.profile}>
              <Image
                style={styles.profile}
                source={require("../../assets/images/profileImg.png")}
              />
            </View>
            <Text style={styles.profileName}>Sai Joshi , 10th June 2024</Text>
          </View>
          <View style={{ paddingTop: moderateScale(20) }}>
            <Text style={styles.descriptionText}>
              Taking your dog on daily walks keeps them healthy in many
              different ways. It decreases stress, strengthens their bones and
              muscles, and helps against cardiovascular disease too. But while
              you strive to keep your dog healthy, one mistake you want to avoid
              is taking it on walks that are too long and will make your pet
              excessively tired.
            </Text>
            <Text style={styles.descriptionText}>
              Dr. Kelly Diehl, a small animal internal medicine specialist and
              senior director of science and communication at the Morris Animal
              Foundation, told Newsweek that the length of your dog's walk
              depends on its age, breed as well as on the environmental
              conditions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  imgStyle: {
    width: "100%",
    height:  Dimensions.get('window').height * 0.3,
  },
  headerView: {
    position: "absolute",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  contentView: {
    paddingTop: moderateScale(10),
    paddingHorizontal: moderateScale(19),
  },
  timeText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  titleText: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
  },
  profileView: {
    paddingTop: moderateScale(22),
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
  },
  profileName: {
    paddingLeft: moderateScale(15),
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.darkGrey,
    fontSize: THEMES.fonts.font12,
  },
  descriptionText: {
    fontFamily: THEMES.fontFamily.regular,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    lineHeight: 27,

  },
});

export default TrendDetail;

import React, { memo } from "react";
import { View, Text, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProfileDummy from "../../../assets/svg/user.svg";
import { THEMES } from "../../../assets/theme/themes";
import { styles } from "./styles";
import HeartAnimation from "../../../components/HeartAnimation";
import { moderateScale } from "react-native-size-matters";

export const BondingSection = ({ logindetails, petImage,bound }) => (
  <View style={styles.bondingContainer}>
    <View style={styles.bondingImagesContainer}>
      <View
        style={{
          width: moderateScale(60),
          height: moderateScale(60),
          borderWidth: 1,
          borderRadius: moderateScale(30),
          backgroundColor: THEMES.colors.lightGrey,
          justifyContent: "center",
          alignItems: "center",
          borderColor: "transparent",
        }}
      >
        {logindetails?.parentphoto ? (
          <Image
            style={styles.profileImage}
            resizeMode="contain"
            source={{ uri: logindetails?.parentphoto }}
          />
        ) : (
          <ProfileDummy />
        )}
      </View>
      <View style={styles.bondingDivider}>
        <HeartAnimation percentage={bound} />
      </View>
      <View
        style={{
          width: moderateScale(60),
          height: moderateScale(60),
          borderWidth: 1,
          borderRadius: moderateScale(30),
          backgroundColor: THEMES.colors.lightGrey,
          justifyContent: "center",
          alignItems: "center",
          borderColor: "transparent",
        }}
      >
        {petImage ? (
          <Image
            style={styles.profileImage}
            resizeMode="contain"
            source={{ uri: petImage }}
          />
        ) : (
          <ProfileDummy />
        )}
      </View>
    </View>
    <View style={styles.bondingTextContainer}>
      <Text style={styles.bondingText}>Your bond with your pet</Text>
      <MaterialIcons
        name="info-outline"
        size={20}
        color={THEMES.colors.black}
      />
    </View>
  </View>
);

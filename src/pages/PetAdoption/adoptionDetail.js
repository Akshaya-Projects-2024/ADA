import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import Back from "../../assets/svg/back.svg";

const AdoptionDetail = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/dogBackground.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <TouchableOpacity
            style={{paddingTop: moderateScale(18), paddingHorizontal:moderateScale(18)}}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          onPress={() => props.navigation.goBack()}
        >
          <Back />
        </TouchableOpacity>
        <View style={styles.contentView}>
          <ScrollView
            style={{ flex: 1 }}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                paddingVertical: moderateScale(5),
                paddingBottom: moderateScale(30),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: THEMES.fontFamily.bold,
                    width: "65%",
                    fontSize: THEMES.fonts.font16,
                    color: THEMES.colors.black,
                  }}
                >
                  German Shepherd
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: THEMES.fontFamily.medium,
                    width: "30%",
                    fontSize: THEMES.fonts.font14,
                    textAlign: "right",
                    color: THEMES.colors.black,
                  }}
                >
                  Gurgaon
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: moderateScale(32),
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    borderColor: "transparent",
                    backgroundColor: "#fee6e4",
                    paddingVertical: moderateScale(16),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.medium,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingHorizontal: moderateScale(23),
                    }}
                  >
                    Dog
                  </Text>
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.bold,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingTop: moderateScale(3),
                      paddingHorizontal: moderateScale(21),
                    }}
                  >
                    Type
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    borderColor: "transparent",
                    backgroundColor: "#efeaec",
                    paddingVertical: moderateScale(16),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.medium,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingHorizontal: moderateScale(14),
                    }}
                  >
                    1 Y 8 M
                  </Text>
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.bold,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingTop: moderateScale(3),
                      paddingHorizontal: moderateScale(23),
                    }}
                  >
                    Age
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    borderColor: "transparent",
                    backgroundColor: "#fdf4d7",
                    paddingVertical: moderateScale(16),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.medium,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingHorizontal: moderateScale(21),
                    }}
                  >
                    Male
                  </Text>
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.bold,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingTop: moderateScale(3),
                      paddingHorizontal: moderateScale(14),
                    }}
                  >
                    Gender
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    borderColor: "transparent",
                    backgroundColor: "#fcd7d4",
                    paddingVertical: moderateScale(16),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.medium,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingHorizontal: moderateScale(21),
                    }}
                  >
                    50kg
                  </Text>
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.bold,
                      fontSize: THEMES.fonts.font10,
                      color: THEMES.colors.black,
                      textAlign: "center",
                      paddingTop: moderateScale(3),
                      paddingHorizontal: moderateScale(14),
                    }}
                  >
                    Weight
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={{
                    color: THEMES.colors.darkGrey,
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font12,
                  }}
                >
                  About Pet:
                </Text>
                <Text
                  style={{
                    color: THEMES.colors.black,
                    fontFamily: THEMES.fontFamily.medium,
                    fontSize: THEMES.fonts.font12,
                    paddingTop: moderateScale(5),
                  }}
                >
                  A 5 month old German Shepherd named Lisa. Loves to cuddle and
                  play with tennis balls. Highly energetic and great with kids!
                  Looking for a lovely parent to match her spirit.
                </Text>
                <Text
                  style={{
                    color: THEMES.colors.darkGrey,
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font12,
                    paddingTop: moderateScale(32),
                  }}
                >
                  Reason for Adoption
                </Text>
                <Text
                  style={{
                    color: THEMES.colors.black,
                    fontFamily: THEMES.fontFamily.regular,
                    fontSize: THEMES.fonts.font12,
                    paddingTop: moderateScale(5),
                  }}
                >
                  The current parents are moving out of country and can not take
                  her along with them.
                </Text>
                <View
                  style={{
                    marginTop: moderateScale(32),
                    padding: moderateScale(14),
                    backgroundColor: THEMES.colors.white,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    shadowColor: THEMES.colors.lightGrey,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5,
                    overflow: "hidden",
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 51,
                      height: 51,
                      borderRadius: 51 / 2,
                      borderWidth: 1,
                      borderColor: "transparent",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/dogImg.png")}
                      style={{
                        width: 51,
                        height: 51,
                        borderRadius: 51 / 2,
                        borderWidth: 1,
                        borderColor: "transparent",
                      }}
                    />
                  </View>
                  <View style={{ width: "80%", marginLeft: moderateScale(11) }}>
                    <Text
                      style={{
                        color: THEMES.colors.darkGrey,
                        fontFamily: THEMES.fontFamily.medium,
                        fontSize: THEMES.fonts.font10,
                      }}
                    >
                      Pet parent details
                    </Text>
                    <Text
                      style={{
                        color: THEMES.colors.black,
                        fontFamily: THEMES.fontFamily.bold,
                        fontSize: THEMES.fonts.font14,
                        paddingTop: moderateScale(2),
                      }}
                    >
                      Mr. Mickey Hawkins
                    </Text>
                    <Text
                      style={{
                        color: THEMES.colors.blue,
                        fontFamily: THEMES.fontFamily.regular,
                        fontSize: THEMES.fonts.font12,
                        paddingTop: moderateScale(2),
                      }}
                    >
                      987654321
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  imgBackground: {
    flex: 1,
    
    height: 288,
  },    
  contentView: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
    alignSelf: "flex-end",
    paddingHorizontal: moderateScale(17),
    width: "100%",
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    flex: 1,
    marginTop: moderateScale(200),
    paddingTop: moderateScale(38),
  },
});
export default AdoptionDetail;

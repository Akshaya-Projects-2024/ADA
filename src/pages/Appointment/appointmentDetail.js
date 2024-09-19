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
import Msg from "../../assets/svg/msgSquareText.svg";
import Call from "../../assets/svg/phoneCall.svg";
import RightArrow from "../../assets/svg/arrowRight.svg";


const AppointmentDetail = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/dogBackground.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <TouchableOpacity
          style={{
            paddingTop: moderateScale(18),
            paddingHorizontal: moderateScale(15),
          }}
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
                backgroundColor: THEMES.colors.bgColor,
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
                    width: "50%",
                    fontSize: THEMES.fonts.font16,
                    color: THEMES.colors.black,
                  }}
                >
                  Rockey
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: THEMES.fontFamily.regular,
                    width: "50%",
                    fontSize: THEMES.fonts.font14,
                    textAlign: "right",
                    color: THEMES.colors.darkGrey,
                  }}
                >
                  German Shepard
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
                    lineHeight: moderateScale(18),
                  }}
                >
                  Hi ,I am Rocky. I likes to chew cucumber, Mutter and cuddles
                  from my dad. I am mischievous but very friendly dog. 
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: moderateScale(24),
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: THEMES.colors.darkGrey,
                      fontFamily: THEMES.fontFamily.medium,
                      fontSize: THEMES.fonts.font12,
                      paddingRight:moderateScale(8)
                    }}
                  >
                    Medical documents
                  </Text>
                  <RightArrow stroke="#000"/>
                </View>

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
                      numberOfLines={2}
                      style={{
                        color: THEMES.colors.black,
                        fontFamily: THEMES.fontFamily.bold,
                        fontSize: THEMES.fonts.font14,
                        paddingTop: moderateScale(3),
                      }}
                    >
                      Mr. Mickey Hawkins - Mumbai
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingTop: moderateScale(5),
                      }}
                    >
                      <Text
                        style={{
                          color: THEMES.colors.darkGrey,
                          fontFamily: THEMES.fontFamily.regular,
                          fontSize: THEMES.fonts.font12,
                        }}
                      >
                        987654321
                      </Text>
                      <View style={{ marginLeft: moderateScale(20) }}>
                        <Msg />
                      </View>

                      <View style={{ marginLeft: moderateScale(20) }}>
                        <Call />
                      </View>
                    </View>
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
export default AppointmentDetail;

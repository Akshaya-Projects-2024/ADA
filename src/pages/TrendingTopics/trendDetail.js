import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale, s } from "react-native-size-matters";
import Back from "../../assets/svg/back.svg";
import ShareImg from "../../assets/svg/share.svg";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import ProfileDummy from "../../assets/svg/user.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { shareTopicApi } from "../../redux-store/actions/topics";
import { contextValue } from "../../components/Loader";
import { decryptService } from "../../utils/storageFunc";
import { showToast } from "../../utils/utils";
import Share from "react-native-share";

const TrendDetail = (props) => {
  const { width } = useWindowDimensions();
  const data = props.route.params.selectedData;
  const { providerProfile, profileData } = useSelector(
    ({ commonReducer }) => commonReducer
  );
  const [shareImg, setShareImg] = useState();

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      contextValue?.setLoader(true);
      let obj = {
        id: data?.id,
        userId: await decryptService("userId"),
      };
      let response = await shareTopicApi(obj);
      if (response?.status_code === 200) {
        setShareImg(response?.data);
      } else {
        showToast("error", "No Image available");
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };

  const shareImageBase64 = async () => {
    if (shareImg) {
      const shareData = {
        title: "Share",
        message: `${data?.subject}`,
        url: `data:application/pdf;base64,${shareImg}`, // Base64 encoded image
      };
      await Share.open(shareData);
    }
  };

  const calculateReadTime = (content) => {
    const words = content?.trim()?.split(/\s+/).length; // Count words
    const readingSpeed = 200; // Words per minute
    const minutes = Math.ceil(words / readingSpeed); // Calculate minutes
    return `${minutes} min read`;
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("DD MMMM YYYY");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
      <View style={styles.container}>
        <View style={styles.imgStyle}>
          <Image
            style={styles.imgStyle}
            source={{ uri: data?.cover || data?.Cover }}
          />
        </View>
        <View style={styles.headerView}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            onPress={() => props.navigation.goBack()}
            style={{
              backgroundColor: "#fff",
              width: moderateScale(30),
              height: moderateScale(30),
              borderRadius: moderateScale(30) / 2,
              alignItems:'center',
              justifyContent:'center'
            }}
          >
            <Back />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => shareImageBase64()}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            style={{
              backgroundColor: "#fff",
              width: moderateScale(30),
              height: moderateScale(30),
              borderRadius: moderateScale(30) / 2,
              alignItems:'center',
              justifyContent:'center'
            }}
          >
            <ShareImg />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentView}>
            <Text style={styles.timeText}>
              {calculateReadTime(data?.blog || data?.Blog)}
            </Text>
            <View style={{ paddingTop: moderateScale(4) }}>
              <Text style={styles.titleText}>{data?.subject}</Text>
            </View>
            <View style={styles.profileView}>
              <View style={styles.profile}>
                {Boolean(data?.authorImage) ? (
                  <Image
                    resizeMode="contain"
                    style={styles.profile}
                    source={{
                      uri: data?.authorImage,
                    }}
                  />
                ) : (
                  <View
                    style={[
                      styles.profile,
                      {
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <ProfileDummy width={25} />
                  </View>
                )}
              </View>
              <Text style={styles.profileName}>
                {data?.author || data?.Author} ,{" "}
                {formatDate(data?.createdon || data?.Createdon)}
              </Text>
            </View>
            <View style={{ paddingTop: moderateScale(10) }}>
              <RenderHTML
                contentWidth={width}
                source={{ html: data?.blog || data?.Blog }}
                baseStyle={styles.descriptionText}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  imgStyle: {
    width: "100%",
    height: Dimensions.get("window").height * 0.3,
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
    paddingTop: moderateScale(15),
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

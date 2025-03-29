import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import { moderateScale, ms } from "react-native-size-matters";
import Search from "../../assets/svg/search.svg";
import Plus from "../../assets/svg/plus.svg";
import DropDown from "../../components/DropDown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { decryptService } from "../../utils/storageFunc";
import { getMyTopics } from "../../redux-store/actions/topics";
import { useIsFocused } from "@react-navigation/native";
import { getBase64Obj } from "../../utils/documentUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { findDifferenceByDays } from "../../utils/utils";
import { contextValue } from "../../components/Loader";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import { LoginModules } from "../../constants/enums";
import { useSelector } from "react-redux";

const TrendingTopics = (props) => {
  const { colors, fontFamily, fonts } = THEMES;
  const isFocused = useIsFocused();
  const [trendingTopics, setTrendingTopics] = useState();
  const [topicList, setTopicList] = useState([]);
  const { loggedInModule } = useSelector((state) => state?.register);

  useEffect(() => {
    if (isFocused) {
      initData();
    }
  }, [isFocused]);

  const initData = async () => {
    contextValue?.setLoader(true);
    let obj = {
      userId: await decryptService("userId"),
      searchtype: "topics",
      keyword: "",
    };
    let res = await getMyTopics(obj);
    if (res?.data?.data) {
      let dataArray = res?.data?.data?.SearchResult;
      if (dataArray?.length) {
        const firstFiveObjects = dataArray?.slice(0, 5);
        setTrendingTopics(firstFiveObjects);
        if (dataArray?.length > 5) {
          setTopicList(dataArray);
        }
      }
    }
    contextValue?.setLoader(false);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableButtonWithPermission
        customMsgForRegistration={
          "Registered and Subscribed to enjoy all the exciting features of ADA app."
        }
        onPress={() =>
          props.navigation.navigate("trendDetail", { selectedData: item })
        }
        style={{ flexDirection: "column" }}
      >
        <View
          style={[
            styles.card,
            { marginLeft: index === 0 ? 0 : moderateScale(20) },
          ]}
        >
          <Image
            source={{ uri: item.cover }}
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.3,
            }}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            width: 145,
            marginLeft: index === 0 ? 0 : moderateScale(20),
            borderColor: "#ddd",
            borderBottomEndRadius: 8,
            borderBottomStartRadius: 8,
            borderTopWidth: 0,
            backgroundColor: THEMES.colors.white,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              color: THEMES.colors.black,
              fontSize: THEMES.fonts.font12,
              paddingHorizontal: moderateScale(10),
              paddingVertical: moderateScale(8),
            }}
          >
            {item?.subject}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              color: THEMES.colors.darkGrey,
              fontSize: THEMES.fonts.font12,
              paddingHorizontal: moderateScale(10),
              paddingTop: moderateScale(3),
              paddingBottom: moderateScale(5),
            }}
          >
            {item?.author}
          </Text>
        </View>
      </TouchableButtonWithPermission>
    );
  };

  const renderDataItem = ({ item, onPress }) => {
    return (
      <TouchableButtonWithPermission
        customMsgForRegistration={
          "Registered and Subscribed to enjoy all the exciting features of ADA app."
        }
        onPress={() =>
          props.navigation.navigate("trendDetail", { selectedData: item })
        }
        style={styles.topicsCard}
      >
        <Image
          height={ms(48)}
          width={ms(48)}
          style={styles.coverImage}
          source={getBase64Obj(item?.cover)}
        />
        <View style={styles.contentContainer}>
          <Text numberOfLines={2} style={styles.titleStyle}>
            {item?.subject}
          </Text>
          <View style={styles.authorContainer}>
            <Text style={styles.authorStyle}>{item?.author}</Text>
            <Text style={styles.dateStyle}>
              {`${findDifferenceByDays(item?.createdon)}` > 50
                ? "Few days ago"
                : `${findDifferenceByDays(item?.createdon)}d`}
            </Text>
          </View>
        </View>
      </TouchableButtonWithPermission>
    );
  };

  // const renderDataItem = ({ item, index }) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() =>
  //         props.navigation.navigate("trendDetail", { selectedData: item })
  //       }
  //       style={{
  //         borderWidth: 1,
  //         borderColor: "#ddd",
  //         shadowColor: THEMES.colors.lightGrey,
  //         shadowOffset: { width: 0, height: 2 },
  //         shadowOpacity: 0.8,
  //         shadowRadius: 2,
  //         elevation: 5,
  //         overflow: "hidden",
  //         borderRadius: 12,
  //         marginBottom: moderateScale(10),
  //         backgroundColor: THEMES.colors.white,
  //         paddingVertical: moderateScale(13),
  //         paddingHorizontal: moderateScale(15),
  //         flexDirection: "row",
  //         alignItems: "center",
  //         backgroundColor:'red',
  //         flex:1
  //       }}
  //     >
  //       <View
  //         style={{
  //           width: 48,
  //           height: 48,
  //           borderRadius: 48 / 2,
  //           borderWidth: 1,
  //           borderColor: "transparent",
  //         }}
  //       >
  //         <Image
  //           source={{ uri: item.cover }}
  //           style={{
  //             width: 48,
  //             height: 48,
  //             borderRadius: 48 / 2,
  //             borderWidth: 1,
  //             borderColor: "transparent",
  //           }}
  //         />
  //       </View>
  //       <View style={{ marginHorizontal: moderateScale(15) }}>
  //         <Text
  //           style={{
  //             color: THEMES.colors.black,
  //             fontFamily: THEMES.fontFamily.semiBold,
  //             fontSize: THEMES.fonts.font14,
  //             lineHeight: 24,
  //           }}
  //         >
  //           {item.subject}
  //         </Text>
  //         <View style={{ width: "100%" }}>
  //           <Text
  //             style={{
  //               color: THEMES.colors.darkGrey,
  //               fontFamily: THEMES.fontFamily.regular,
  //               fontSize: THEMES.fonts.font14,
  //             }}
  //           >
  //             {item.author}
  //           </Text>

  //           {/* <Text
  //             style={{
  //               color: THEMES.colors.darkGrey,
  //               fontFamily: THEMES.fontFamily.regular,
  //               fontSize: THEMES.fonts.font14,
  //             }}
  //           >
  //             1d
  //           </Text> */}
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const EmptyContentView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "#000",
            fontSize: moderateScale(16),
            fontWeight: 500,
          }}
        >
          Oops! No Trending Topics available.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={Strings.trendingTopics}
          bgColor="transparent"
          fontColor={"#fda208"}
          noBack
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: moderateScale(20),
              paddingTop: moderateScale(13),
            }}
          >
            <View
              style={{
                width:
                  loggedInModule === LoginModules.provider ? "87%" : "100%",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("auth", {
                    screen: "search",
                  })
                }
                style={{
                  padding: moderateScale(8),
                  borderRadius: 25,
                  borderWidth: 1.5,
                  backgroundColor: "#f5f5f5",
                  borderColor: "#bebebd",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Search />
                <Text
                  style={{
                    paddingLeft: moderateScale(8),
                    fontSize: THEMES.fonts.font12,
                    color: THEMES.colors.darkGrey,
                  }}
                >
                  Search
                </Text>
              </TouchableOpacity>
            </View>

            {loggedInModule === LoginModules.provider && (
              <TouchableButtonWithPermission
                customMsgForRegistration={
                  "Complete your Registration and Subscribe to the app to create new topics."
                }
                onPress={() =>
                  props.navigation.navigate("auth", {
                    screen: "newTopic",
                  })
                }
                style={{
                  backgroundColor: THEMES.colors.cyan,
                  padding: moderateScale(11),
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: moderateScale(8),
                  borderBottomLeftRadius: moderateScale(0),
                }}
              >
                <Plus stroke={"#fff"} />
              </TouchableButtonWithPermission>
            )}
          </View>

          {topicList?.length || trendingTopics?.length ? (
            <ScrollView
              style={{ flex: 1 }}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  paddingTop: moderateScale(13),
                  paddingHorizontal: moderateScale(20),
                }}
              >
                {topicList?.length > 5 && (
                  <View style={{ paddingTop: moderateScale(15) }}>
                    <Text
                      style={{
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font14,
                        color: THEMES.colors.black,
                      }}
                    >
                      Find Out What’s Trending
                    </Text>
                  </View>
                )}

                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={trendingTopics}
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  style={{ paddingTop: moderateScale(15) }}
                />
                {topicList?.length > 5 && (
                  <>
                    <View
                      style={{
                        paddingTop: moderateScale(20),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "65%",
                          paddingBottom: moderateScale(20),
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: THEMES.fontFamily.semiBold,
                            fontSize: THEMES.fonts.font14,
                            color: THEMES.colors.black,
                          }}
                        >
                          Explore More Topis
                        </Text>
                      </View>

                      {/* <View style={{ width: "35%" }}>
                      <DropDown
                        width={130}
                        dropdownData={[
                          { label: "Most Recent", value: "1" },
                          { label: "Most Relevant", value: "2" },
                          { label: "Filter by Service", value: "3" },
                        ]}
                      />
                    </View> */}
                    </View>

                    <View>
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={topicList}
                        bounces={false}
                        renderItem={renderDataItem}
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          ) : (
            EmptyContentView()
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  card: {
    width: 145, // Adjust width based on requirement
    borderRadius: 10,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    backgroundColor: THEMES.colors.white,
    overflow: "hidden", // This makes sure the image fits within the rounded corners
    elevation: 5, // For shadow in Android
    shadowColor: "#ddd", // For shadow in iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    height: moderateScale(130),
    borderWidth: 1,
    borderColor: "#ddd",
    // Spacing between cards
  },
  image: {
    width: "100%", // Adjust height as needed
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  author: {
    fontSize: 14,
    color: "#323232",
    marginTop: 5,
  },
  topicsCard: {
    backgroundColor: THEMES.colors.white,
    borderRadius: ms(12),
    borderWidth: ms(1),
    borderColor: THEMES.colors.searchBorderColor,
    flexDirection: "row",
    padding: ms(10),
    marginVertical: ms(5),
  },
  coverImage: { borderRadius: ms(24) },
  contentContainer: { flex: 1, marginLeft: ms(15) },
  titleStyle: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontWeight: "600",
  },
  authorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop:ms(5)
  },
  authorStyle: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.topicAuthorText,
  },
  dateStyle: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.dateColor,
    fontWeight: "500",
  },
});

export default TrendingTopics;

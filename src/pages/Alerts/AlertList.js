import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { decryptService } from "../../utils/storageFunc";
import { getAlertListApi } from "../../redux-store/actions/alerts";
import { moderateScale } from "react-native-size-matters";
import { contextValue } from "../../components/Loader";
import { validArray } from "../../utils/utils";
import { useIsFocused } from "@react-navigation/native";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import Plus from "../../assets/svg/plus.svg";
import ProfileDummy from "../../assets/svg/user.svg";
import { navigate } from "../../navigations/rootNavigationRef";

const AlertList = (props) => {
  const [alertData, setAlertData] = useState([]);
  const dataFetched = useRef(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      initData();
    }
  }, [isFocused]);

  const initData = async () => {
    try {
      contextValue?.setLoader(true);
      const obj = {
        userId: await decryptService("userId"),
        id: "",
      };
      let res = await getAlertListApi(obj);
      if (res?.length) {
        if (validArray(res)) {
          dataFetched.current = true;
          setAlertData(res);
        } else {
          setAlertData([]);
        }
      } else {
        setAlertData([]);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };

  const EmptyContentView = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#000",
            fontSize: moderateScale(16),
            fontWeight: 500,
          }}
        >
          Oops! No Alerts available.
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const profilePhoto = item?.petdetails?.documents?.find(
      (doc) => doc.documenttype == "profilePhoto"
    );
    return (
      <TouchableButtonWithPermission
        onPress={() => {
          if (item?.requesttype == "lostpet") {
            navigate("lostAlertDetail", {
              selectedData: item,
            });
          } else if (item?.requesttype == "rescue") {
            navigate("resuceAlertDetail", {
              selectedData: item,
            });
          }else if (item?.requesttype == "medical") {
            navigate("medicalAlertDetail", {
              selectedData: item,
            });
          }
        }}
        customMsgForRegistration={
          "Registered and Subscribed to enjoy all the exciting features of ADA app."
        }
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          shadowColor: THEMES.colors.lightGrey,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
          overflow: "hidden",
          borderRadius: 12,
          marginBottom: moderateScale(10),
          backgroundColor: THEMES.colors.white,
          paddingVertical: moderateScale(10),
          paddingHorizontal: moderateScale(15),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {item?.isownpet ? (
          profilePhoto?.url ? (
            <Image
              resizeMode="contain"
              style={{ width: 48, height: 48, borderRadius: 48 / 2 }}
              source={{
                uri: profilePhoto?.url,
              }}
            />
          ) : (
            <View
              style={{
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 48 / 2,
              }}
            >
              <ProfileDummy width={30} />
            </View>
          )
        ) : (
          <View
            style={{
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 48 / 2,
            }}
          >
            <ProfileDummy width={30} />
          </View>
        )}

        {/* {Boolean(item?.documents?.[0]?.url) ? (
          <Image
            resizeMode="contain"
            style={{ width: 48, height: 48, borderRadius: 48 / 2 }}
            source={{
              uri:  item?.isownpet == 1 ? profilePhoto?.url  : item?.documents?.[0]?.url,
            }}
          />
        ) : (
        
        )} */}
        <View style={{ marginHorizontal: moderateScale(15), width: "80%" }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font14,
              color: THEMES.colors.black,
            }}
          >
            {item.name ? item.name : "Unknown pet"}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.regular,
              paddingTop: moderateScale(3),
              fontSize: THEMES.fonts.font12,
              color: THEMES.colors.black,
              textTransform: "capitalize",
            }}
          >
            {item.requesttype} Alert
          </Text>
        </View>
      </TouchableButtonWithPermission>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          noBack
          title={"Alert"}
          bgColor="transparent"
          fontColor={"#0091EA"}
          right={
            <TouchableButtonWithPermission
              customMsgForRegistration={
                "Registered and Subscribed to enjoy all the exciting features of ADA app."
              }
              onPress={() =>
                props.navigation.navigate("auth", {
                  screen: "emergencyAlert",
                })
              }
              style={{
                marginLeft: moderateScale(13),
                backgroundColor: THEMES.colors.white,
                padding: moderateScale(8),
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#0091EA",
                borderWidth: 1,
                borderRadius: moderateScale(8),
                borderBottomLeftRadius: moderateScale(0),
              }}
            >
              <Plus stroke={"#0091EA"} />
            </TouchableButtonWithPermission>
          }
        />
        <View
          style={{
            marginTop: moderateScale(10),
            marginHorizontal: moderateScale(16),
            flex: 1,
          }}
        >
          <FlatList
            data={alertData}
            showsVerticalScrollIndicator={false}
            bounces={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={dataFetched.current == true ? null :EmptyContentView}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default AlertList;

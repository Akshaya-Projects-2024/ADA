import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Filter from "../../assets/svg/funnel.svg";
import Search from "../../assets/svg/search.svg";
import Cross from "../../assets/svg/closeSquare.svg";
import Star from "../../assets/svg/yellowStar.svg";
import { moderateScale } from "react-native-size-matters";
import { decryptService } from "../../utils/storageFunc";
import { getProviderByService } from "../../redux-store/actions/auth";
import { showToast, validArray } from "../../utils/utils";
import { getBase64Obj } from "../../utils/documentUtils";
import { contextValue } from "../../components/Loader";
import EmptyView from "../../components/EmptyView";
import ProviderFallback from "../../assets/svg/ProviderFallback";
import { SafeAreaView } from "react-native-safe-area-context";
import Bookmark from "../../assets/svg/bookmark.svg";
import { useIsFocused } from "@react-navigation/native";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import { getAppointmentHistoryApi } from "../../redux-store/actions/commonApis";
import { useSelector } from "react-redux";

const ServiceListReviews = ({ navigation, route }) => {
  const selectedService = route?.params?.selectedService;
  const isSearch = route?.params?.isSearch;
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data after filtering
  const isFocused = useIsFocused();
  const { loggedInModule, guestUser, logindetails } = useSelector(
    (state) => state?.register
  );

  useEffect(() => {
    initData();
  }, [isFocused]);

  const initData = async (text) => {
    contextValue?.setLoader(true);
    try {
      const userId = await decryptService("userId");
      const params = {
        userid: userId,
        usertype: loggedInModule,
      };
      const response = await getAppointmentHistoryApi(params);
      if (response?.status === 200) {
        console.log("le", response?.data?.data?.length);
        const output = response?.data?.data;
        setData(output);
        setFilteredData(output);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error);
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 2) {
      initData(text);
    } else {
      setFilteredData([]);
    }
  };

  const renderItem = ({ item }) => {
    const foundService = item?.profile?.sessionRateDetails?.find(
      (it) => it?.servicecode === selectedService?.code
    );
    return (
      <TouchableButtonWithPermission
        customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
        customMsgForPayment="Please  subscribe to get best services for your lovely pets."
        onPress={() =>
          navigation.navigate("parentReviews", { selectedItem: item })
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
          backgroundColor: "#fff",
          marginHorizontal: moderateScale(13),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: moderateScale(12),
            paddingHorizontal: moderateScale(12),
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "70%" }}
          >
            {item?.providerPhoto ? (
              <View
                style={{ width: moderateScale(55), height: moderateScale(55) }}
              >
                <View
                  style={{
                    width: moderateScale(55),
                    height: moderateScale(55),
                    borderRadius: moderateScale(55) / 2,
                    position: "absolute",
                    top: 0,
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fffff",
                  }}
                >
                  <Image
                    style={{
                      width: moderateScale(55),
                      height: moderateScale(55),
                      borderRadius: moderateScale(55) / 2,
                    }}
                    source={getBase64Obj(item?.providerPhoto)}
                  />
                </View>
              </View>
            ) : (
              <ProviderFallback
                width={moderateScale(55)}
                height={moderateScale(55)}
              />
            )}
            <View style={{ paddingLeft: moderateScale(12) }}>
              <Text
                numberOfLines={1}
                style={{
                  color: "#000",
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font14,
                }}
              >
                {item?.providername}
              </Text>
            </View>
          </View>
        </View>
      </TouchableButtonWithPermission>
    );
  };

  const EmptyContentView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "#000",
            fontSize: moderateScale(16),
            marginHorizontal: moderateScale(50),
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {searchText && searchText.length < 3
            ? ""
            : `Oops! No ${
                selectedService?.service ?? "Services"
              } available currently`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
        <StatusBar backgroundColor={THEMES.colors.white} />
        <Header
          title={"Reviews"}
          fontColor="#EC559C"
          showBack
          bgColor="transparent"
        />
        <>
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              paddingTop: moderateScale(10),
              marginBottom: moderateScale(20),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderColor: "#bebebd",
                borderRadius: 25,
                borderWidth: 1.5,
                backgroundColor: "#f5f5f5",
                paddingHorizontal: 10, // Spacing around the text and icons
                height: 45,
              }}
            >
              <Search />
              <TextInput
                value={searchText}
                onChangeText={handleSearch}
                placeholder="Search"
                style={{
                  flex: 1, // Allow input to take full width except for icons
                  fontSize: THEMES.fonts.font12, // Adjust font size to match the design
                  color: "#000",
                  paddingHorizontal: moderateScale(10),
                }}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Cross style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            bounces={false}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={EmptyContentView}
          />
        </>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: THEMES.colors.cyan,
    borderWidth: 1,
  },
});

export default ServiceListReviews;

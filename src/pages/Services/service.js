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

const Data = [
  {
    id: 1,
    name: "Dr. Shreeram Laghu",
    type: "Services Provided  | 12 Years exp",
    rating: 2.4,
  },
  {
    id: 2,
    name: "Dr. Shreeram Laghu",
    type: "Services Provided  | 12 Years exp",
    rating: 4.4,
  },
  {
    id: 3,
    name: "Dr. Shreeram Laghu",
    type: "Services Provided  | 12 Years exp",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Dr. Shreeram Laghu",
    type: "Services Provided  | 12 Years exp",
    rating: 1.4,
  },
];

const Service = ({ navigation, route }) => {
  const selectedService = route?.params?.selectedService;
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const userId = await decryptService("userId");
      const params = {
        userid: userId,
        servicecode: selectedService?.code,
      };
      const response = await getProviderByService(params);
      if (response?.status === 200) {
        const output = response?.data?.data;
        if (validArray(output)) {
          setData(output);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error);
      setLoading(false);
      showToast("error", error?.message);
    }
  };

  const renderItem = ({ item }) => {
    const foundService = item?.profile?.sessionRateDetails?.find(
      (it) => it?.servicecode === selectedService?.code
    );
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("serviceDetail", { selectedProvider: item })
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
            <View style={{ width: 55, height: 55 }}>
              <View
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 55 / 2,
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
                    width: 55,
                    height: 55,
                    borderRadius: 55 / 2,
                  }}
                  source={getBase64Obj(item?.photo)}
                />
                {/* <Image
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55 / 2,
                  }}
                  source={require("../../assets/images/profileImg.png")}
                /> */}
              </View>
            </View>
            <View style={{ paddingLeft: moderateScale(12) }}>
              <Text
                numberOfLines={1}
                style={{
                  color: "#000",
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font14,
                }}
              >
                {item?.profile?.providerBusiness?.name}
              </Text>
              <Text
                style={{
                  color: THEMES.colors.darkGrey,
                  fontFamily: THEMES.fontFamily.medium,
                  fontSize: THEMES.fonts.font10,
                  paddingTop: moderateScale(3),
                  maxWidth: moderateScale(275),
                }}
              >
                {`${selectedService?.service} | ${item?.profile?.providerBusiness?.experience} Years exp`}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: moderateScale(3),
                }}
              >
                <Star />
                <Text
                  style={{
                    color: "#000",
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font12,
                    paddingHorizontal: moderateScale(5),
                  }}
                >
                  {item?.profile?.providerRating?.rating}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ width: "25%", alignItems: "flex-end" }}>
            <Text
              numberOfLines={1}
              style={{
                color: "#000",
                fontFamily: THEMES.fontFamily.medium,
                fontSize: THEMES.fonts.font14,
              }}
            >
              {`₹ ${
                foundService?.sessioncharges || foundService?.monthcharges || 0
              }`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header
        title={selectedService?.service}
        fontColor="#EC559C"
        showBack
        bgColor="transparent"
        right={<Filter onPress={() => navigation.navigate("emergencyAlert")} />}
      />
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
            backgroundColor: "#F2F2F2",
            borderRadius: 25, // Rounded input
            borderWidth: 1, // To add a border like in the image
            borderColor: "#D9D9D9", // Border color to match the design
            paddingHorizontal: 10, // Spacing around the text and icons
            height: 45,
          }}
        >
          <Search />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search"
            style={{
              flex: 1, // Allow input to take full width except for icons
              fontSize: THEMES.fonts.font14, // Adjust font size to match the design
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
        {/* <TouchableOpacity
          style={{
            padding: moderateScale(8),
            borderRadius: 25,
            borderWidth: 1,
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
              width: "85%",
            }}
          >
            Search
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <Cross style={{ width: 20, height: 20 }} />
          </View>
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={renderItem}
      />
      {loading && (
        <View style={styles.loadingView}>
          <View style={styles.loadingBox}>
            <ActivityIndicator color={THEMES.colors.white} />
          </View>
        </View>
      )}
    </View>
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

export default Service;

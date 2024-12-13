import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import { moderateScale } from "react-native-size-matters";
import Search from "../../assets/svg/search.svg";
import Plus from "../../assets/svg/plus.svg";
import { getAdoption } from "../../redux-store/actions/auth";
import { showToast, validArray } from "../../utils/utils";
import { decryptService } from "../../utils/storageFunc";
import { useIsFocused } from "@react-navigation/native";



const PetAdoption = (props) => {
  const { colors, fontFamily, fonts } = THEMES;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [petCategories, setPetCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      initData();
    }
  }, [isFocused]);

  const initData = async () => {
    setLoading(true);
    try {
      const userId = await decryptService("userId");
      const params = {
        process: "getAll",
        createdby: userId,
      };
      const response = await getAdoption(params);
      if (response?.status === 200) {
        const output = response?.data?.data;
        if (validArray(output)) {
          setData(output);
          const result = new Set(
            output.map((adoptionData) => adoptionData.category)
          );
          setPetCategories(Array.from(result));
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error);
      setLoading(false);
      showToast("error", error?.message);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("auth", {
            screen: "adoptionDetail",
          })
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
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 48 / 2,
            borderWidth: 1,
            borderColor: "transparent",
          }}
        >
          <Image
            source={require("../../assets/images/dogImg.png")}
            style={{
              width: 48,
              height: 48,
              borderRadius: 48 / 2,
              borderWidth: 1,
              borderColor: "transparent",
            }}
          />
        </View>
        <View style={{ marginHorizontal: moderateScale(15), width: "80%" }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font14,
              color: THEMES.colors.black,
            }}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.regular,
              paddingTop: moderateScale(3),
              fontSize: THEMES.fonts.font12,
              color: THEMES.colors.black,
            }}
          >
            {item.breed} | {item.location}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        showBack
        title={Strings.petAdoption}
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />
      <View style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "85%" }}>
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

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("auth", {
                screen: "addAdoption",
              })
            }
            style={{
              backgroundColor: THEMES.colors.white,
              padding: moderateScale(11),
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#EC559C",
              borderWidth: 1,
              borderRadius: moderateScale(8),
              borderBottomLeftRadius: moderateScale(0),
            }}
          >
            <Plus stroke={"#EC559C"} />
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: moderateScale(20),
          }}
        >
          <View style={{ width: "100%" }}>
            <View
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
            </View>
          </View>
        </View> */}
        <View
          style={{ paddingVertical: moderateScale(28), flexDirection: "row" }}
        >
          <ScrollView
            horizontal={true}
            style={{ flex: 1 }}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {petCategories.map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    setFilterCategory(item);
                  }}
                  style={{
                    paddingHorizontal: moderateScale(15),
                    marginLeft: index === 0 ? 0 : moderateScale(10),
                    paddingVertical: moderateScale(8),
                    borderWidth: 1,
                    borderColor:
                      filterCategory === item
                        ? THEMES.colors.adoptionPink
                        : THEMES.colors.silver,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.semiBold,
                      color:
                        filterCategory === item
                          ? THEMES.colors.adoptionPink
                          : THEMES.colors.black,
                      fontSize: THEMES.fonts.font12,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            bounces={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
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
    backgroundColor: THEMES.colors.bgColor,
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

export default PetAdoption;

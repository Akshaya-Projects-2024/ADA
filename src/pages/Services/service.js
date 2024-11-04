import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Filter from "../../assets/svg/funnel.svg";
import Search from "../../assets/svg/search.svg";
import Cross from "../../assets/svg/closeSquare.svg";
import Star from "../../assets/svg/yellowStar.svg";
import { moderateScale } from "react-native-size-matters";

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

const Service = (props) => {
  const [searchText, setSearchText] = useState("");

  const renderItem = () => {
    return (
      <TouchableOpacity
      onPress={()=>props.navigation.navigate('serviceDetail')}
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
                  source={require("../../assets/images/profileImg.png")}
                />
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
                Dr. Shreeram Laghu
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: THEMES.colors.darkGrey,
                  fontFamily: THEMES.fontFamily.medium,
                  fontSize: THEMES.fonts.font10,
                  paddingTop: moderateScale(3),
                }}
              >
                Services Provided | 12 Years exp
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: moderateScale(3),
                }}
              >
                <Star></Star>
                <Text
                  style={{
                    color: "#000",
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font12,
                    paddingHorizontal: moderateScale(5),
                  }}
                >
                  4.3
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
              ₹ 1000
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
        title={"Services"}
        fontColor="#EC559C"
        showBack
        bgColor="transparent"
        right={<Filter onPress={()=>props.navigation.navigate('emergencyAlert')}/>}
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
        data={Data}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
});

export default Service;

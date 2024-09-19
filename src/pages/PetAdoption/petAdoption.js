import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../utils/strings";
import { moderateScale } from "react-native-size-matters";
import Search from "../../assets/svg/search.svg";

const petData = ["Dogs", "Cats", "Birds", "Hamsters", "Others"];

const Data = [
  {
    id: 1,
    name: "Dog",
    description: "German Shepherd | Gurgaon",
  },
  {
    id: 2,
    name: "Dog",
    description: "Dachshund | Delhi",
  },

  {
    id: 3,
    name: "Cat",
    description: "British Shorthair | Lucknow",
  },
  {
    id: 4,
    name: "Dog",
    description: "Labrador Retriever | Gurgaon",
  },
  {
    id: 5,
    name: "Bird",
    description: "Macaw | Dehradun",
  },
  {
    id: 6,
    name: "Dog",
    description: "German Shepherd | Gurgaon",
  },
  {
    id: 7,
    name: "Dog",
    description: "Dachshund | Delhi",
  },

  {
    id: 8,
    name: "Cat",
    description: "British Shorthair | Lucknow",
  },
  {
    id: 9,
    name: "Dog",
    description: "Labrador Retriever | Gurgaon",
  },
  {
    id: 10,
    name: "Bird",
    description: "Macaw | Dehradun",
  },
];

const PetAdoption = (props) => {
  const { colors, fontFamily, fonts } = THEMES;

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
      onPress={() => props.navigation.navigate("adoptionDetail")}
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
            {item.description}
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
        </View>
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
            {petData.map((item, index) => {
              return (
                <View
                  style={{
                    paddingHorizontal: moderateScale(15),
                    marginLeft: index === 0 ? 0 : moderateScale(10),
                    paddingVertical: moderateScale(8),
                    borderWidth: 1,
                    borderColor: THEMES.colors.silver,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: THEMES.fontFamily.medium,
                      color: THEMES.colors.black,
                      fontSize: THEMES.fonts.font12,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Data}
            bounces={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
});

export default PetAdoption;

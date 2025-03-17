import React, { useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { moderateScale, ms } from "react-native-size-matters";
import Strings from "../../constants/strings";
import { THEMES } from "../../assets/theme/themes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";
import { encryptService } from "../../utils/storageFunc";
import { vh, vw } from "../../utils/dimensions";
import PaginationDots from "react-native-pagination-dots";
import SharedPreferences from "react-native-shared-preferences";

const Intro1 = ({ func }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container2, { width: width }]}>
      <Text onPress={func} style={styles.skip}>
        {Strings.skip}
      </Text>
      <Image source={require("../../assets/images/intro_heart_1.png")} />
      <Text style={styles.labelStyle}>{Images[0].label}</Text>
      {Images[0].label2 ? (
        <Text style={styles.label2Style}>{Images[0].label2}</Text>
      ) : null}
      <Text style={styles.descStyle}>{Images[0].desc}</Text>
      <Image style={styles.image1} source={Images[0].url} />
    </View>
  );
};

const Intro2 = ({ func }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container2, { width: width }]}>
      <Text onPress={func} style={styles.skip}>
        {Strings.skip}
      </Text>
      <Image source={require("../../assets/images/intro_heart_1.png")} />
      <Text style={styles.labelStyle}>{Images[1].label}</Text>
      {Images[1].label2 ? (
        <Text style={styles.label2Style}>{Images[1].label2}</Text>
      ) : null}
      <Text style={styles.descStyle}>{Images[1].desc}</Text>
      <Image style={[styles.image1, { top: vh(350) }]} source={Images[1].url} />
    </View>
  );
};

const Intro3 = ({ func }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container2, { width: width }]}>
      <Text onPress={func} style={styles.skip}>
        {Strings.next}
      </Text>
      <Image source={require("../../assets/images/intro_heart_1.png")} />
      <Text style={styles.labelStyle}>{Images[2].label}</Text>
      {Images[2].label2 ? (
        <Text style={styles.label2Style}>{Images[2].label2}</Text>
      ) : null}
      <Text style={styles.descStyle}>{Images[2].desc}</Text>
      <Image style={[styles.image3, { width: width }]} source={Images[2].url} />
    </View>
  );
};

const Images = [
  {
    url: require("../../assets/images/intro_1.png"),
    bgColor: THEMES.colors.cyan,
    label: Strings.welcome,
    desc: Strings.introDes1,
    Component: Intro1,
  },
  {
    url: require("../../assets/images/intro_2.png"),
    bgColor: THEMES.colors.outrageousPink,
    label: Strings.experienced,
    label2: Strings.introText2,
    desc: Strings.introDes2,
    Component: Intro2,
  },
  {
    url: require("../../assets/images/intro_3.png"),
    bgColor: THEMES.colors.outrageousOrange,
    label: Strings.allInOne,
    label2: Strings.introText3,
    desc: Strings.introDes3,
    Component: Intro3,
  },
];

const IntroScreens = (props) => {
  const func = props?.route?.params?.func;

  const renderImages = ({ item }) => {
    const { Component } = item;
    return (
      <Component
        func={async () => {
          func();
          // await encryptService("firstBootCompleted", true);
          SharedPreferences.setItem("firstBootCompleted", JSON.stringify(true));
        }}
      />
    );
  };

  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: Images[currentIndex].bgColor,
          paddingTop: ms(top),
        },
      ]}
    >
      <StatusBar backgroundColor="transparent" translucent />
      <Carousel
        data={Images}
        renderItem={renderImages}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={(index) => setCurrentIndex(index)} // Track active slide index
      />
      <View style={styles.paginationContainer}>
        <PaginationDots
          length={Images?.length} // Total steps
          activeIndex={currentIndex} // Current index
          activeColor="white"
          inactiveColor="#ddd"
          size={8} // Adjust dot size
        />
      </View>
    </View>
  );
};

export default IntroScreens;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skip: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.white,
    position: "absolute",
    right: ms(30),
    top: vh(25),
  },
  container: { flexGrow: 1 },
  container2: { flex: 1 },
  labelStyle: {
    fontFamily: THEMES.fontFamily.meow,
    fontSize: THEMES.fonts.font45,
    color: THEMES.colors.white,
    textAlign: "center",
    marginHorizontal: moderateScale(10),
  },
  label2Style: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font18,
    color: THEMES.colors.white,
    textAlign: "center",
    marginHorizontal: ms(45),
    marginBottom: ms(10),
  },
  descStyle: {
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.white,
    textAlign: "center",
    marginHorizontal: ms(45),
    lineHeight: ms(24),
  },
  image1: { position: "absolute", bottom: 0, right: 0 },
  image3: { position: "absolute", bottom: 0, left: 0, top: 350 },
  paginationContainer: {
    position: "absolute",
    bottom: 70,
    alignSelf: "flex-start",
    flexDirection: "row",
    marginHorizontal: vw(20),
  },
});

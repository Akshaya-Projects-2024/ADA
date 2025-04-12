import React, { useMemo, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { moderateScale, ms } from "react-native-size-matters";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { THEMES } from "../assets/theme/themes";
import ClientReviewPieChart from "./ClientReviewPieChart";
import TouchableButtonWithPermission from "./TouchableButtonWithPermission";
import { navigate } from "../navigations/rootNavigationRef";

const RATINGS = [5, 4, 3, 2, 1];

const ratingKey = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
};
const RATING_COLORS = {
  5: "#FDD835",
  4: "#F4511E52",
  3: "#6DAE43",
  2: "#00BBC8",
  1: "#AB47BC",
};

const RatingBar = React.memo(({ rating, percentage = 80 }) => {
  const animatedWidth = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingText}>
        {rating} <FontAwesome name="star" color={RATING_COLORS[rating]} />
      </Text>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: RATING_COLORS[rating],
            },
          ]}
        />
      </View>
    </View>
  );
});

const ClientReviewPanel = ({ providerRating }) => {
  const total = providerRating?.totalratingcount || 0;
  const renderRatingBars = useMemo(
    () =>
      RATINGS.map((rating) => (
        <RatingBar
          key={rating}
          rating={rating}
          percentage={
            (providerRating?.providerRatingCount?.[ratingKey[rating]] / total) *
            100
          }
        />
      )),
    [providerRating]
  );

  return (
    <View>
      <View>
        <Text style={styles.headerText}>Client Reviews</Text>
      </View>
      <TouchableButtonWithPermission
        customMsgForRegistration={
          "Registered and Subscribed to enjoy all the exciting features of ADA app."
        }
        activeOpacity={1}
        onPress={() => navigate("clientReview")}
        style={styles.chartContainer}
      >
        <View style={styles.leftSection}>
          <ClientReviewPieChart providerRating={providerRating} />
        </View>
        <View style={{ width: "5%", marginTop: ms(30) }}>
          <View
            style={{ width: 1, height: ms(58), backgroundColor: "#D9D9D9" }}
          ></View>
        </View>
        <View style={styles.rightSection}>{renderRatingBars}</View>
      </TouchableButtonWithPermission>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: ms(16),
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
    paddingTop: ms(10),
    paddingLeft: ms(10),
  },
  chartContainer: {
    borderWidth: 1,
    paddingRight: moderateScale(10),
    borderRadius: moderateScale(16),
    backgroundColor: "#fff",
    borderColor: "#ddd",
    shadowColor: THEMES.colors.lightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    marginTop: moderateScale(10),
    height: moderateScale(166),
    flexDirection: "row",
    paddingVertical: ms(20),
    alignItems: "flex-start",
  },
  leftSection: {
    width: "40%",
  },
  rightSection: {
    width: "55%",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ms(8),
  },
  ratingText: {
    color: "rgba(0, 0, 0, 0.56)",
  },
  progressBackground: {
    width: "80%",
    height: ms(8),
    backgroundColor: "rgb(233, 229, 229)",
    borderRadius: ms(8),
    marginLeft: ms(10),
  },
  progressFill: {
    width: "80%",
    height: "100%",
    borderRadius: ms(8),
  },
});

export default ClientReviewPanel;

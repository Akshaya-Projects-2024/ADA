import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";

const ClientReviewPieChart = ({ providerRating }) => {
  const widthAndHeight = useMemo(() => moderateScale(107), []);

  const series = useMemo(
    () =>
      providerRating?.totalratingcount > 0
        ? [
            {
              value: providerRating?.providerRatingCount?.five,
              color: "#FDD835",
            },
            {
              value: providerRating?.providerRatingCount?.four,
              color: "#F4511E52",
            },
            {
              value: providerRating?.providerRatingCount?.three,
              color: "#6DAE43",
            },
            {
              value: providerRating?.providerRatingCount?.two,
              color: "#00BBC8",
            },
            {
              value: providerRating?.providerRatingCount?.one,
              color: "#AB47BC",
            },
          ]
        : [{ value: 1, color: "#D9D9D9" }],
    [providerRating]
  );

  return (
    <View style={styles.wrapper}>
      <PieChart widthAndHeight={widthAndHeight} series={series} cover={0.88} />
      <View style={styles.contentContainer}>
        <Text style={styles.ratingText}>{providerRating?.rating || 0}</Text>
        <Text style={styles.reviewText}>
          {providerRating?.totalratingcount || 0} Reviews
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    position: "absolute",
    justifyContent: "center",
  },
  ratingText: {
    fontSize: moderateScale(20),
    fontFamily: THEMES.fontFamily.bold,
    color: "#000",
    textAlign: "center",
    letterSpacing: -0.32,
  },
  reviewText: {
    fontSize: moderateScale(12),
    fontFamily: THEMES.fontFamily.medium,
    color: "#00000047",
    marginTop: 5,
  },
});

export default ClientReviewPieChart;

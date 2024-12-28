import { StyleSheet, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { ms } from "react-native-size-matters";

const EmptyView = () => {
  return (
    <View style={styles.flex}>
      <LottieView
        autoPlay
        loop={true}
        source={require("../assets/gif/no_data.json")}
        style={{ width: ms(275), height: ms(275) }}
      />
    </View>
  );
};

export default EmptyView;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

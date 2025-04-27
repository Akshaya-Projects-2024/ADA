import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";

const NoInternetScreen = ({ onRetry }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ImageBackground
        source={require("../../assets/images/noInternet.jpeg")}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <View
          style={{
            alignItems: "center",
            position: "absolute",
            bottom: 20,
            width: "100%",
          }}
        >
          <TouchableOpacity style={styles.button} onPress={onRetry}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#721c24",
  },
  subText: {
    fontSize: moderateScale(14),
    color: "#721c24",
    marginBottom: 20,
  },
  errorText: {
    fontSize: moderateScale(16),
    color: "#721c24",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: moderateScale(5),
  },
  button: {
    backgroundColor: THEMES.colors.cyan,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NoInternetScreen;

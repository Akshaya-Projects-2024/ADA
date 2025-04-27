import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";

const ServerError = ({ onRetry }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ImageBackground
        source={require("../../assets/images/serverdown.jpeg")}
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
  errorText: {
    fontSize: 18,
    color: "#721c24",
    marginBottom: 20,
    textAlign: "center",
    marginTop: moderateScale(20),
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

export default ServerError;

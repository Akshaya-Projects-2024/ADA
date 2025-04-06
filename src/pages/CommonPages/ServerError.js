import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";

const ServerError = ({ onRetry }) => {
  return (
    <LinearGradient
      colors={[THEMES.colors.iceBerg, "#e8f1ea", THEMES.colors.panache]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Image
          style={{ width: 220, height: 150, borderRadius: 10 }}
          source={require("../../assets/gif/serverDownn.gif")}
        />
        <Text style={styles.errorText}>Oops! Server is down (502 Error)</Text>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
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

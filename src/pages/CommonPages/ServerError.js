import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ServerError = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Oops! Server is down (502 Error)</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8d7da",
  },
  errorText: {
    fontSize: 18,
    color: "#721c24",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#dc3545",
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

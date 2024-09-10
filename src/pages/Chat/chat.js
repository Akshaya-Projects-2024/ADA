import React, { useState, useEffect } from "react";
import { View, Text, StatusBar, StyleSheet, Keyboard } from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";
import Header from "../../components/Header";

const Chat = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.appointments} showBack bgColor="transparent" showFilter/>
      <View style={{ flex: 1 }}>
        <Text>hello</Text>
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

export default Chat;

import React, { useCallback, useMemo, useState } from "react";

import Lottie from "lottie-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ms } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";
const ModalLoader = ({ loading }) => {
  return (
    <View style={styles.flex}>
      {loading ? (
        <Pressable style={styles.backdropContainerRoot}>
          <Lottie
            autoPlay
            loop={true}
            source={require("../assets/gif/loader.json")}
            style={{ width: ms(80), height: ms(80) }}
          />
          <Image
            style={styles.iconStyle}
            source={require("../assets/images/roundIcon.png")}
          />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backdropContainerRoot: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
  iconStyle: { width: ms(60), height: ms(60), position: "absolute" },
});
export default ModalLoader;

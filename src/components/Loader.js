import React, { useCallback, useMemo, useState } from "react";

import Lottie from "lottie-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ms } from "react-native-size-matters";
let contextValue;
const Loader = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const setLoader = useCallback((status) => {
    setLoading(status);
  }, []);

  contextValue = useMemo(() => {
    return { loading, setLoader };
  }, [setLoader, loading]);

  return (
    <View style={styles.flex}>
      {loading ? (
        <Pressable
          onPress={() => {
            setLoader(false);
          }}
          style={styles.backdropContainerRoot}
        >
          <Lottie
            autoPlay
            loop={true}
            source={require("../assets/gif/loader.json")}
            style={{ width: ms(100), height: ms(100) }}
          />
          <Image
            style={{ width: ms(75), height: ms(75), position: "absolute" }}
            source={require("../assets/images/roundIcon.png")}
          />
        </Pressable>
      ) : null}
      {children}
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
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
});
export { contextValue };
export default Loader;
